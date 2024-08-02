import { Component } from '@angular/core';
import { ToastService } from '../../../../../core/services/toast.service';
import { HttpService } from '../../../../../core/services/http.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { BarangForm } from '../../components/barang-form/barang-form';
import { HttpFormattedErrorResponse } from '../../../../../../types/http';
import { PageTitleComponent } from '../../../../../shared/components/page-title/page-title.component';
import { BarangFormComponent } from '../../components/barang-form/barang-form.component';

@Component({
  selector: 'app-barang-create',
  standalone: true,
  imports: [PageTitleComponent, BarangFormComponent],
  templateUrl: './barang-create.component.html',
  styleUrl: './barang-create.component.scss',
})
export class BarangCreateComponent {
  isSubmitting: boolean = false;
  barangForm: BarangForm = new BarangForm();

  constructor(
    private _httpService: HttpService,
    private _toastService: ToastService,
    private _location: Location,
    private _router: Router,
  ) {}

  submit() {
    this.barangForm.markAllAsTouched();

    if (this.barangForm.invalid || this.barangForm.disabled || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.barangForm.disable();
    this._httpService
      .post('web/barang', this.barangForm.value)
      .subscribe({
        next: (res: any) => {
          this._toastService.success(res.message, 'Success');
          this._router.navigateByUrl('/application/barang');
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message, 'Failed');
          }
        },
      })
      .add(() => {
        this.barangForm.enable();
        this.isSubmitting = false;
      });
  }

  back() {
    this._location.back();
  }
}
