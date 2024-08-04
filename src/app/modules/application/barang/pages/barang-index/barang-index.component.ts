import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { DatatableComponent, NgxDatatableModule, TableColumn } from '@siemens/ngx-datatable';
import { LucideAngularModule } from 'lucide-angular';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { Barang } from '../../../../../../types/barang';
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
  selector: 'app-barang-index',
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
  templateUrl: './barang-index.component.html',
  styleUrl: './barang-index.component.scss',
})
export class BarangIndexComponent {
  private _unsubscribeAll$: Subject<void> = new Subject<void>();
  private _barangSearchListener$: Subject<string> = new Subject();

  @ViewChild('barangTable', { static: true }) barangTable: DatatableComponent | undefined;

  isDeletingBarang: boolean = false;
  barangToDelete: Barang | null = null;

  isLoadingBarang: boolean = false;
  barang: Barang[] = [];
  barangStatus: string = '';
  barangSearch: string = '';
  barangSortBy: string = 'created_at';
  barangSortOrder: string = 'desc';
  barangPagination: Pagination = {
    size: 10,
    totalItems: 0,
    totalPages: 0,
    page: 1,
  };

  columns: TableColumn[] = [
    { name: 'item-code', prop: 'kode', width: 150, resizeable: true },
    { name: 'item-name', prop: 'nama', width: 200, resizeable: true },
    { name: 'price', prop: 'harga', width: 150, resizeable: true },
    { name: 'options', prop: 'actions', width: 150, resizeable: true, sortable: false },
  ];

  constructor(
    private _httpService: HttpService,
    private _toastService: ToastService,
    private _translateService: TranslateService,
  ) {}

  ngOnInit() {
    this.getBarang();
    this._barangSearchListener$.pipe(debounceTime(500), takeUntil(this._unsubscribeAll$)).subscribe((search) => {
      this.barangSearch = search;
      this.getBarang();
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll$.next();
    this._unsubscribeAll$.complete();
  }

  getBarang() {
    this.isLoadingBarang = true;
    this._httpService
      .get('web/barang', {
        params: {
          size: this.barangPagination.size,
          page: this.barangPagination.page,
          search: this.barangSearch ?? '',
          is_active: this.barangStatus ?? '',
          sort: this.barangSortBy,
          order: this.barangSortOrder,
        },
      })
      .subscribe({
        next: (res: any) => {
          this.barang = res.data.data;
          this.barangPagination.totalItems = res.data.total;
          this.barangPagination.page = res.data.current_page;
          this.barangPagination.totalPages = res.data.last_page;
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message, this._translateService.instant('failed'));
          }
        },
      })
      .add(() => {
        this.isLoadingBarang = false;
      });
  }

  setBarangToDelete(barang: Barang) {
    this.barangToDelete = barang;
  }

  deleteBarang() {
    if (this.isDeletingBarang || !this.barangToDelete) {
      return;
    }

    this.isDeletingBarang = true;
    this._httpService
      .delete(`web/barang/${this.barangToDelete?.id}`)
      .subscribe({
        next: (res: any) => {
          this._toastService.success(res.message, this._translateService.instant('success'));
          this.barangPagination.page = 1;
          this.getBarang();
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message, this._translateService.instant('failed'));
          }
        },
      })
      .add(() => {
        this.isDeletingBarang = false;
      });
  }

  onPageNumberChange(pageNumber: any): void {
    this.barangPagination.page = pageNumber;
    this.getBarang();
  }

  onSearchBarang(search: string) {
    this.barangPagination.page = 1;
    this._barangSearchListener$.next(search);
  }

  onStatusChange(status: string) {
    this.barangPagination.page = 1;
    this.barangStatus = status;
    this.getBarang();
  }

  onSort(event: any) {
    const sort = event.sorts ? event.sorts[0] : null;

    if (sort) {
      this.barangSortBy = sort.prop;
      this.barangSortOrder = sort.dir;
    } else {
      this.barangSortBy = '';
      this.barangSortOrder = 'asc';
    }

    this.getBarang();
  }
}
