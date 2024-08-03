import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpFormattedErrorResponse } from '../../../../../../types/http';
import { Sales } from '../../../../../../types/sales';
import { HttpService } from '../../../../../core/services/http.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { FlatpickrModule } from '../../../../../shared/components/flatpickr/flatpickr.module';
import { SalesDetailForm, SalesForm } from './sales-form';
import moment from 'moment';
import { LucideAngularModule } from 'lucide-angular';
import { MDModalModule } from '../../../../../shared/components/modals';
import { SearchCustomerModalComponent } from '../search-customer-modal/search-customer-modal.component';
import { SearchBarangModalComponent } from '../search-barang-modal/search-barang-modal.component';
import { Customer } from '../../../../../../types/customers';
import { Barang } from '../../../../../../types/barang';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sales-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FlatpickrModule,
    LucideAngularModule,
    MDModalModule,
    SearchCustomerModalComponent,
    SearchBarangModalComponent,
  ],
  templateUrl: './sales-form.component.html',
  styleUrl: './sales-form.component.scss',
})
export class SalesFormComponent implements OnInit {
  @Input({ required: true }) form: SalesForm = new SalesForm();
  @Input({ required: false }) sales?: Sales | null;
  @Output() formSubmit: EventEmitter<SalesForm> = new EventEmitter<SalesForm>();

  isLoadingSalesCode: boolean = false;
  salesCode: string | null = null;

  selectedCustomer: Customer | null = null;

  subtotal: number = 0;
  grandTotal: number = 0;

  constructor(
    private _httpService: HttpService,
    private _toastService: ToastService,
  ) {}

  ngOnInit() {
    if (!this.sales) {
      this.getSalesCode();
      this.form.patchValue({ tgl: moment().format('YYYY-MM-DD HH:mm') });
    } else {
      this.salesCode = this.sales.kode;
      this.form.patchValue({ tgl: this.sales.tgl });
    }
  }

  submit() {
    this.formSubmit.emit(this.form);
  }

  getSalesCode() {
    this.isLoadingSalesCode = true;
    this._httpService
      .get(`web/sales/code`)
      .subscribe({
        next: (res: any) => {
          this.salesCode = res.data;
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error('Failed to load sales code', 'Failed');
          }
        },
      })
      .add(() => {
        this.isLoadingSalesCode = false;
      });
  }

  onCustomerSelected(customer: Customer) {
    this.selectedCustomer = customer;
    this.form.patchValue({ cust_id: customer.id });
  }

  addDetailsBarang(barang: Barang) {
    // Find already selected item
    const selectedBarangForm = this.form.controls['details'].value.find((detail: any) => detail.get('barang_id')?.value === barang.id);

    if (!selectedBarangForm) {
      // Push new item
      this.form.controls['details'].value.push(new SalesDetailForm(barang));
    } else {
      // Add qty to selected item
      selectedBarangForm.get('qty')?.patchValue(selectedBarangForm.get('qty')?.value + 1, { emitEvent: true });
    }

    this.form.calculateSubtotal();
  }

  getSelectedBarangIds() {
    return this.form.controls['details'].value.map((detailForm: SalesDetailForm) => detailForm.get('barang_id')?.value);
  }

  removeDetailBarang(index: number) {
    this.form.controls['details'].value.splice(index, 1);
    this.form.calculateSubtotal();
  }
}
