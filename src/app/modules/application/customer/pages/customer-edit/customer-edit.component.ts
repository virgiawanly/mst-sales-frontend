import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../../../../../../types/customers';
import { HttpFormattedErrorResponse } from '../../../../../../types/http';
import { HttpService } from '../../../../../core/services/http.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { PageTitleComponent } from '../../../../../shared/components/page-title/page-title.component';
import { CustomerForm } from '../../components/customer-form/customer-form';
import { CustomerFormComponent } from '../../components/customer-form/customer-form.component';

@Component({
  selector: 'app-customer-edit',
  standalone: true,
  imports: [PageTitleComponent, CustomerFormComponent],
  templateUrl: './customer-edit.component.html',
  styleUrl: './customer-edit.component.scss',
})
export class CustomerEditComponent {
  isSubmitting: boolean = false;
  isLoadingCustomer: boolean = false;
  customer: Customer | null = null;
  customerId: string | null = null;
  customerForm: CustomerForm = new CustomerForm();

  constructor(
    private _httpService: HttpService,
    private _toastService: ToastService,
    private _location: Location,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) {
    this.customerId = this._activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    if (this.customerId) {
      this.getCustomer();
    }
  }

  getCustomer() {
    this.isLoadingCustomer = true;
    this.customerForm.disable();
    this._httpService
      .get(`web/customer/${this.customerId}`)
      .subscribe({
        next: (res: any) => {
          const customer = res.data ?? null;
          if (customer) {
            const formValue = {
              nama: customer.nama,
              kode: customer.kode,
              telp: customer.telp,
            };

            this.customer = customer;
            this.customerForm.patchValue(formValue);
          }
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message, 'Failed to load item');
            this._router.navigateByUrl('/application/customer');
          }
        },
      })
      .add(() => {
        this.customerForm.enable();
        this.isLoadingCustomer = false;
      });
  }

  submit() {
    this.customerForm.markAllAsTouched();

    if (this.customerForm.invalid || this.customerForm.disabled || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.customerForm.disable();
    this._httpService
      .post(`web/customer/${this.customerId}`, this.customerForm.value, {
        params: {
          _method: 'PUT',
        },
      })
      .subscribe({
        next: (res: any) => {
          this._toastService.success(res.message, 'Success');
          this._router.navigateByUrl('/application/customer');
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message, 'Failed');
          }
        },
      })
      .add(() => {
        this.customerForm.enable();
        this.isSubmitting = false;
      });
  }

  back() {
    this._location.back();
  }
}
