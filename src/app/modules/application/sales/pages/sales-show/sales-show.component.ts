import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LucideAngularModule } from 'lucide-angular';
import { PageTitleComponent } from '../../../../../shared/components/page-title/page-title.component';
import { HttpFormattedErrorResponse } from '../../../../../../types/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastService } from '../../../../../core/services/toast.service';
import { HttpService } from '../../../../../core/services/http.service';
import { Sales } from '../../../../../../types/sales';
import { MDModalModule } from '../../../../../shared/components/modals';

@Component({
  selector: 'app-sales-show',
  standalone: true,
  imports: [PageTitleComponent, CommonModule, TranslateModule, LucideAngularModule, RouterModule, MDModalModule],
  templateUrl: './sales-show.component.html',
  styleUrl: './sales-show.component.scss',
})
export class SalesShowComponent {
  isDeletingSales: boolean = false;
  isLoadingSales: boolean = false;
  sales: Sales | null = null;
  salesId: string | null = null;

  constructor(
    private _httpService: HttpService,
    private _toastService: ToastService,
    private _location: Location,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _translateService: TranslateService,
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
            this._toastService.error(error.message, this._translateService.instant('failed'));
            this._router.navigateByUrl('/application/sales');
          }
        },
      })
      .add(() => {
        this.isLoadingSales = false;
      });
  }

  back() {
    this._location.back();
  }

  deleteSales() {
    if (this.isDeletingSales || !this.sales) {
      return;
    }

    this.isDeletingSales = true;
    this._httpService
      .delete(`web/sales/${this.sales?.id}`)
      .subscribe({
        next: (res: any) => {
          this._toastService.success(res.message, this._translateService.instant('success'));
          this._router.navigateByUrl('/application/sales', { replaceUrl: true });
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message, this._translateService.instant('failed'));
          }
        },
      })
      .add(() => {
        this.isDeletingSales = false;
      });
  }
}
