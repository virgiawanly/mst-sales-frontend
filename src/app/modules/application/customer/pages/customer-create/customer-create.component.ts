import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpFormattedErrorResponse } from '../../../../../../types/http';
import { HttpService } from '../../../../../core/services/http.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { PageTitleComponent } from '../../../../../shared/components/page-title/page-title.component';
import { CustomerForm } from '../../components/customer-form/customer-form';
import { CustomerFormComponent } from '../../components/customer-form/customer-form.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-customer-create',
  standalone: true,
  imports: [PageTitleComponent, CustomerFormComponent, CommonModule, TranslateModule],
  templateUrl: './customer-create.component.html',
  styleUrl: './customer-create.component.scss',
})
export class CustomerCreateComponent {
  isSubmitting: boolean = false;
  customerForm: CustomerForm = new CustomerForm();

  constructor(
    private _httpService: HttpService,
    private _toastService: ToastService,
    private _location: Location,
    private _router: Router,
    private _translateService: TranslateService,
  ) {}

  submit() {
    this.customerForm.markAllAsTouched();

    if (this.customerForm.invalid || this.customerForm.disabled || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.customerForm.disable();
    this._httpService
      .post('web/customer', this.customerForm.value)
      .subscribe({
        next: (res: any) => {
          this._toastService.success(res.message, this._translateService.instant('success'));
          this._router.navigateByUrl('/application/customer');
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message, this._translateService.instant('failed-to-load-data'));
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
