import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { DatatableComponent, NgxDatatableModule, TableColumn } from '@siemens/ngx-datatable';
import { LucideAngularModule } from 'lucide-angular';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { Customer } from '../../../../../../types/customers';
import { HttpFormattedErrorResponse } from '../../../../../../types/http';
import { Pagination } from '../../../../../../types/pagination';
import { HttpService } from '../../../../../core/services/http.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { MnDropdownComponent } from '../../../../../shared/components/dropdown';
import { MDModalModule } from '../../../../../shared/components/modals';
import { PageTitleComponent } from '../../../../../shared/components/page-title/page-title.component';
import { NGXPagination } from '../../../../../shared/components/pagination';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-customer-index',
  standalone: true,
  imports: [
    PageTitleComponent,
    NgxDatatableModule,
    LucideAngularModule,
    NGXPagination,
    MDModalModule,
    MnDropdownComponent,
    NgSelectModule,
    CommonModule,
    FormsModule,
    RouterLink,
    TranslateModule,
  ],
  templateUrl: './customer-index.component.html',
  styleUrl: './customer-index.component.scss',
})
export class CustomerIndexComponent {
  private _unsubscribeAll$: Subject<void> = new Subject<void>();
  private _customerSearchListener$: Subject<string> = new Subject();

  @ViewChild('customerTable', { static: true }) customerTable: DatatableComponent | undefined;

  isDeletingCustomer: boolean = false;
  customerToDelete: Customer | null = null;

  isLoadingCustomer: boolean = false;
  customer: Customer[] = [];
  customerStatus: string = '';
  customerSearch: string = '';
  customerSortBy: string = 'created_at';
  customerSortOrder: string = 'desc';
  customerPagination: Pagination = {
    size: 10,
    totalItems: 0,
    totalPages: 0,
    page: 1,
  };

  columns: TableColumn[] = [
    { name: 'customer-code', prop: 'kode', width: 150, resizeable: true },
    { name: 'customer-name', prop: 'nama', width: 200, resizeable: true },
    { name: 'phone', prop: 'telp', width: 150, resizeable: true },
    { name: 'options', prop: 'actions', width: 150, resizeable: true, sortable: false },
  ];

  constructor(
    private _httpService: HttpService,
    private _toastService: ToastService,
    private _translateService: TranslateService,
  ) {}

  ngOnInit() {
    this.getCustomer();
    this._customerSearchListener$.pipe(debounceTime(500), takeUntil(this._unsubscribeAll$)).subscribe((search) => {
      this.customerSearch = search;
      this.getCustomer();
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll$.next();
    this._unsubscribeAll$.complete();
  }

  getCustomer() {
    this.isLoadingCustomer = true;
    this._httpService
      .get('web/customer', {
        params: {
          size: this.customerPagination.size,
          page: this.customerPagination.page,
          search: this.customerSearch ?? '',
          is_active: this.customerStatus ?? '',
          sort: this.customerSortBy,
          order: this.customerSortOrder,
        },
      })
      .subscribe({
        next: (res: any) => {
          this.customer = res.data.data;
          this.customerPagination.totalItems = res.data.total;
          this.customerPagination.page = res.data.current_page;
          this.customerPagination.totalPages = res.data.last_page;
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message, this._translateService.instant('failed'));
          }
        },
      })
      .add(() => {
        this.isLoadingCustomer = false;
      });
  }

  setCustomerToDelete(customer: Customer) {
    this.customerToDelete = customer;
  }

  deleteCustomer() {
    if (this.isDeletingCustomer || !this.customerToDelete) {
      return;
    }

    this.isDeletingCustomer = true;
    this._httpService
      .delete(`web/customer/${this.customerToDelete?.id}`)
      .subscribe({
        next: (res: any) => {
          this._toastService.success(res.message, this._translateService.instant('success'));
          this.customerPagination.page = 1;
          this.getCustomer();
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message, this._translateService.instant('failed'));
          }
        },
      })
      .add(() => {
        this.isDeletingCustomer = false;
      });
  }

  onPageNumberChange(pageNumber: any): void {
    this.customerPagination.page = pageNumber;
    this.getCustomer();
  }

  onSearchCustomer(search: string) {
    this.customerPagination.page = 1;
    this._customerSearchListener$.next(search);
  }

  onStatusChange(status: string) {
    this.customerPagination.page = 1;
    this.customerStatus = status;
    this.getCustomer();
  }

  onSort(event: any) {
    const sort = event.sorts ? event.sorts[0] : null;

    if (sort) {
      this.customerSortBy = sort.prop;
      this.customerSortOrder = sort.dir;
    } else {
      this.customerSortBy = '';
      this.customerSortOrder = 'asc';
    }

    this.getCustomer();
  }
}
