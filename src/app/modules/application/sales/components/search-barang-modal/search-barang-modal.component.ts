import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MDModalModule } from '../../../../../shared/components/modals';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Barang } from '../../../../../../types/barang';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { HttpService } from '../../../../../core/services/http.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { ModalService } from '../../../../../shared/components/modals/modal.service';
import { HttpFormattedErrorResponse } from '../../../../../../types/http';

@Component({
  selector: 'app-search-barang-modal',
  standalone: true,
  imports: [MDModalModule, LucideAngularModule, CommonModule, FormsModule],
  templateUrl: './search-barang-modal.component.html',
  styleUrl: './search-barang-modal.component.scss',
})
export class SearchBarangModalComponent {
  @Input({ required: true }) modalId?: string;
  @Input({ required: false }) selectedIds?: number[];
  @Output() selected: EventEmitter<Barang> = new EventEmitter<Barang>();

  @ViewChild('barangSearchInput', { static: false }) barangSearchInput: any;

  private _unsubscribeAll$: Subject<void> = new Subject<void>();
  private _barangSearchListener$: Subject<string> = new Subject();

  isLoadingBarangs: boolean = false;
  barangs: Barang[] = [];
  barangSearch: string = '';

  constructor(
    private _httpService: HttpService,
    private _toastService: ToastService,
    private _modalService: ModalService,
  ) {}

  ngOnInit() {
    this._barangSearchListener$.pipe(debounceTime(500), takeUntil(this._unsubscribeAll$)).subscribe((search) => {
      this.barangSearch = search;
      if (this.barangSearch.length) {
        this.getBarangs();
      } else {
        this.barangs = [];
      }
    });

    this._modalService
      .isOpenObservable(this.modalId!)
      .pipe(takeUntil(this._unsubscribeAll$))
      .subscribe((isOpen) => {
        if (isOpen) {
          setTimeout(() => {
            this.barangSearchInput.nativeElement.focus();
          });
        }
      });
  }

  ngOnDestroy() {
    this._unsubscribeAll$.next();
    this._unsubscribeAll$.complete();
  }

  getBarangs() {
    this.isLoadingBarangs = true;
    this._httpService
      .get('web/barang', {
        params: {
          size: 10,
          search: this.barangSearch ?? '',
          searchable_columns: 'kode,nama',
        },
      })
      .subscribe({
        next: (res: any) => {
          this.barangs = res.data.data;
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message);
          }
        },
      })
      .add(() => {
        setTimeout(() => {
          this.isLoadingBarangs = false;
        }, 100);
      });
  }

  onSearchBarangs(search: string) {
    this._barangSearchListener$.next(search);
  }

  getNameInitials(name?: string | null): string | null {
    if (name) {
      return name
        .split(' ')
        .map((name) => name.charAt(0))
        .slice(0, 2)
        .join('');
    } else {
      return null;
    }
  }

  selectBarang(barang: Barang) {
    this.selected.emit(barang);
    this.barangs = [];
    this.barangSearch = '';
    this._modalService.close(this.modalId!);
  }
}
