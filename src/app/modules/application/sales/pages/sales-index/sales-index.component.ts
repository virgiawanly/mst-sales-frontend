import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { DatatableComponent, NgxDatatableModule, TableColumn } from '@siemens/ngx-datatable';
import { LucideAngularModule } from 'lucide-angular';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { HttpFormattedErrorResponse } from '../../../../../../types/http';
import { Pagination } from '../../../../../../types/pagination';
import { Sales } from '../../../../../../types/sales';
import { HttpService } from '../../../../../core/services/http.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { MnDropdownComponent } from '../../../../../shared/components/dropdown';
import { MDModalModule } from '../../../../../shared/components/modals';
import { PageTitleComponent } from '../../../../../shared/components/page-title/page-title.component';
import { NGXPagination } from '../../../../../shared/components/pagination';

@Component({
  selector: 'app-sales-index',
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
  ],
  templateUrl: './sales-index.component.html',
  styleUrl: './sales-index.component.scss',
})
export class SalesIndexComponent {
  private _unsubscribeAll$: Subject<void> = new Subject<void>();
  private _salesSearchListener$: Subject<string> = new Subject();

  @ViewChild('salesTable', { static: true }) salesTable: DatatableComponent | undefined;

  isDeletingSales: boolean = false;
  salesToDelete: Sales | null = null;

  isLoadingSales: boolean = false;
  sales: Sales[] = [];
  salesStatus: string = '';
  salesSearch: string = '';
  salesSortBy: string = 'created_at';
  salesSortOrder: string = 'desc';
  salesPagination: Pagination = {
    size: 10,
    totalItems: 0,
    totalPages: 0,
    page: 1,
  };

  columns: TableColumn[] = [
    { name: 'No', prop: 'id', width: 50, resizeable: true, sortable: true },
    { name: 'No Transaksi', prop: 'kode', width: 150, resizeable: true },
    { name: 'Tanggal', prop: 'tgl', width: 150, resizeable: true, sortable: true },
    { name: 'Nama Customer', prop: 'customer', width: 200, resizeable: true },
    { name: 'Jumlah Barang', prop: 'details_count', width: 120, resizeable: true, sortable: true },
    { name: 'Sub Total', prop: 'subtotal', width: 150, resizeable: true, sortable: true },
    { name: 'Diskon', prop: 'diskon', width: 150, resizeable: true, sortable: true },
    { name: 'Ongkir', prop: 'ongkir', width: 150, resizeable: true, sortable: true },
    { name: 'Total', prop: 'total_bayar', width: 150, resizeable: true, sortable: true },
    { name: 'Action', prop: 'actions', width: 150, resizeable: true, sortable: false },
  ];

  constructor(
    private _httpService: HttpService,
    private _toastService: ToastService,
  ) {}

  ngOnInit() {
    this.getSales();
    this._salesSearchListener$.pipe(debounceTime(500), takeUntil(this._unsubscribeAll$)).subscribe((search) => {
      this.salesSearch = search;
      this.getSales();
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll$.next();
    this._unsubscribeAll$.complete();
  }

  getSales() {
    this.isLoadingSales = true;
    this._httpService
      .get('web/sales', {
        params: {
          size: this.salesPagination.size,
          page: this.salesPagination.page,
          search: this.salesSearch ?? '',
          is_active: this.salesStatus ?? '',
          sort: this.salesSortBy,
          order: this.salesSortOrder,
        },
      })
      .subscribe({
        next: (res: any) => {
          this.sales = res.data.data;
          this.salesPagination.totalItems = res.data.total;
          this.salesPagination.page = res.data.current_page;
          this.salesPagination.totalPages = res.data.last_page;
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message);
          }
        },
      })
      .add(() => {
        this.isLoadingSales = false;
      });
  }

  setSalesToDelete(sales: Sales) {
    this.salesToDelete = sales;
  }

  deleteSales() {
    if (this.isDeletingSales || !this.salesToDelete) {
      return;
    }

    this.isDeletingSales = true;
    this._httpService
      .delete(`web/sales/${this.salesToDelete?.id}`, { headers: { 'Location-Id': 1 } })
      .subscribe({
        next: (res: any) => {
          this._toastService.success(res.message, 'Success');
          this.salesPagination.page = 1;
          this.getSales();
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message);
          }
        },
      })
      .add(() => {
        this.isDeletingSales = false;
      });
  }

  onPageNumberChange(pageNumber: any): void {
    this.salesPagination.page = pageNumber;
    this.getSales();
  }

  onSearchSales(search: string) {
    this.salesPagination.page = 1;
    this._salesSearchListener$.next(search);
  }

  onStatusChange(status: string) {
    this.salesPagination.page = 1;
    this.salesStatus = status;
    this.getSales();
  }

  onSort(event: any) {
    const sort = event.sorts ? event.sorts[0] : null;

    if (sort) {
      this.salesSortBy = sort.prop;
      this.salesSortOrder = sort.dir;
    } else {
      this.salesSortBy = '';
      this.salesSortOrder = 'asc';
    }

    this.getSales();
  }
}
