import { Component } from '@angular/core';
import { Sales } from '../../../../../../types/sales';
import { SalesDetailForm, SalesForm } from '../../components/sales-form/sales-form';
import { HttpService } from '../../../../../core/services/http.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpFormattedErrorResponse } from '../../../../../../types/http';
import { PageTitleComponent } from '../../../../../shared/components/page-title/page-title.component';
import { SalesFormComponent } from '../../components/sales-form/sales-form.component';
import moment from 'moment';

@Component({
  selector: 'app-sales-edit',
  standalone: true,
  imports: [PageTitleComponent, SalesFormComponent],
  templateUrl: './sales-edit.component.html',
  styleUrl: './sales-edit.component.scss',
})
export class SalesEditComponent {
  isSubmitting: boolean = false;
  isLoadingSales: boolean = false;
  sales: Sales | null = null;
  salesId: string | null = null;
  salesForm: SalesForm = new SalesForm();

  constructor(
    private _httpService: HttpService,
    private _toastService: ToastService,
    private _location: Location,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) {
    this.salesId = this._activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    if (this.salesId) {
      this.getSales();
    }
  }

  getSales() {
    this.isLoadingSales = true;
    this.salesForm.disable();
    this._httpService
      .get(`web/sales/${this.salesId}`)
      .subscribe({
        next: (res: any) => {
          const sales = res.data ?? null;
          if (sales) {
            this.sales = sales;
          }
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message, 'Failed to load data');
            this._router.navigateByUrl('/application/sales');
          }
        },
      })
      .add(() => {
        this.salesForm.enable();
        this.isLoadingSales = false;
      });
  }

  submit() {
    this.salesForm.markAllAsTouched();

    if (this.salesForm.invalid || this.salesForm.disabled || this.isSubmitting) {
      return;
    }

    const details = this.salesForm.get('details')?.value?.map((detail: SalesDetailForm) => {
      return {
        barang_id: detail.get('barang_id')?.value ?? '',
        qty: detail.get('qty')?.value ?? 0,
        diskon_pct: detail.get('diskon_pct')?.value ?? 0,
      };
    });

    if (details.length === 0) {
      this._toastService.error('Please add at least 1 detail item', 'Failed');
      return;
    }

    const payload = {
      tgl: this.salesForm.get('tgl')?.value ?? '',
      cust_id: this.salesForm.get('cust_id')?.value ?? '',
      ongkir: this.salesForm.get('ongkir')?.value ?? 0,
      diskon: this.salesForm.get('diskon')?.value ?? 0,
      details: details,
    };

    this.isSubmitting = true;
    this.salesForm.disable();
    this._httpService
      .post(`web/sales/${this.salesId}`, payload, {
        params: {
          _method: 'PUT',
        },
      })
      .subscribe({
        next: (res: any) => {
          this._toastService.success(res.message, 'Success');
          this._router.navigateByUrl('/application/sales');
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message, 'Failed');
          }
        },
      })
      .add(() => {
        this.salesForm.enable();
        this.isSubmitting = false;
      });
  }

  back() {
    this._location.back();
  }
}
