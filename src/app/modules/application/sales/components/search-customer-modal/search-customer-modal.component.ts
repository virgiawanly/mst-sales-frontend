import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { Customer } from '../../../../../../types/customers';
import { HttpFormattedErrorResponse } from '../../../../../../types/http';
import { HttpService } from '../../../../../core/services/http.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { MDModalModule } from '../../../../../shared/components/modals';
import { ModalService } from '../../../../../shared/components/modals/modal.service';

@Component({
  selector: 'app-search-customer-modal',
  standalone: true,
  imports: [MDModalModule, LucideAngularModule, CommonModule, FormsModule],
  templateUrl: './search-customer-modal.component.html',
  styleUrl: './search-customer-modal.component.scss',
})
export class SearchCustomerModalComponent implements OnInit, OnDestroy {
  @Input({ required: true }) modalId?: string;
  @Input({ required: false }) selectedId?: number;
  @Output() selected: EventEmitter<Customer> = new EventEmitter<Customer>();

  @ViewChild('customerSearchInput', { static: false }) customerSearchInput: any;

  private _unsubscribeAll$: Subject<void> = new Subject<void>();
  private _customerSearchListener$: Subject<string> = new Subject();

  isLoadingCustomers: boolean = false;
  customers: Customer[] = [];
  customerSearch: string = '';

  constructor(
    private _httpService: HttpService,
    private _toastService: ToastService,
    private _modalService: ModalService,
  ) {}

  ngOnInit() {
    this._customerSearchListener$.pipe(debounceTime(500), takeUntil(this._unsubscribeAll$)).subscribe((search) => {
      this.customerSearch = search;
      if (this.customerSearch.length) {
        this.getCustomers();
      } else {
        this.customers = [];
      }
    });

    this._modalService
      .isOpenObservable(this.modalId!)
      .pipe(takeUntil(this._unsubscribeAll$))
      .subscribe((isOpen) => {
        if (isOpen) {
          setTimeout(() => {
            this.customerSearchInput.nativeElement.focus();
          });
        }
      });
  }

  ngOnDestroy() {
    this._unsubscribeAll$.next();
    this._unsubscribeAll$.complete();
  }

  getCustomers() {
    this.isLoadingCustomers = true;
    this._httpService
      .get('web/customer', {
        params: {
          size: 10,
          search: this.customerSearch ?? '',
        },
      })
      .subscribe({
        next: (res: any) => {
          this.customers = res.data.data;
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message);
          }
        },
      })
      .add(() => {
        setTimeout(() => {
          this.isLoadingCustomers = false;
        }, 100);
      });
  }

  onSearchCustomers(search: string) {
    this._customerSearchListener$.next(search);
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

  selectCustomer(customer: Customer) {
    this.selected.emit(customer);
    this._modalService.close(this.modalId!);
  }
}
