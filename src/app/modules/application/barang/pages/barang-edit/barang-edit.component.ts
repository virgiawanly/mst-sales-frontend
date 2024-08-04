import { Component } from '@angular/core';
import { Barang } from '../../../../../../types/barang';
import { BarangForm } from '../../components/barang-form/barang-form';
import { HttpService } from '../../../../../core/services/http.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpFormattedErrorResponse } from '../../../../../../types/http';
import { PageTitleComponent } from '../../../../../shared/components/page-title/page-title.component';
import { BarangFormComponent } from '../../components/barang-form/barang-form.component';
import { CommonModule, Location } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-barang-edit',
  standalone: true,
  imports: [PageTitleComponent, BarangFormComponent, CommonModule, TranslateModule],
  templateUrl: './barang-edit.component.html',
  styleUrl: './barang-edit.component.scss',
})
export class BarangEditComponent {
  isSubmitting: boolean = false;
  isLoadingBarang: boolean = false;
  barang: Barang | null = null;
  barangId: string | null = null;
  barangForm: BarangForm = new BarangForm();

  constructor(
    private _httpService: HttpService,
    private _toastService: ToastService,
    private _location: Location,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _translateService: TranslateService,
  ) {
    this.barangId = this._activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    if (this.barangId) {
      this.getBarang();
    }
  }

  getBarang() {
    this.isLoadingBarang = true;
    this.barangForm.disable();
    this._httpService
      .get(`web/barang/${this.barangId}`)
      .subscribe({
        next: (res: any) => {
          const barang = res.data ?? null;
          if (barang) {
            const formValue = {
              nama: barang.nama,
              harga: barang.harga,
              kode: barang.kode,
            };

            this.barang = barang;
            this.barangForm.patchValue(formValue);
          }
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message, this._translateService.instant('failed'));
            this._router.navigateByUrl('/application/barang');
          }
        },
      })
      .add(() => {
        this.barangForm.enable();
        this.isLoadingBarang = false;
      });
  }

  submit() {
    this.barangForm.markAllAsTouched();

    if (this.barangForm.invalid || this.barangForm.disabled || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.barangForm.disable();
    this._httpService
      .post(`web/barang/${this.barangId}`, this.barangForm.value, {
        params: {
          _method: 'PUT',
        },
      })
      .subscribe({
        next: (res: any) => {
          this._toastService.success(res.message, this._translateService.instant('success'));
          this._router.navigateByUrl('/application/barang');
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message, this._translateService.instant('failed'));
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
