import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable()
export class ApiLanguageInterceptor implements HttpInterceptor {
  constructor(private _cookieService: CookieService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get the logged user's token to be added to the headers
    const lang = this._cookieService.get('lang') ?? 'en';

    const headers = req.headers.append('X-Localization', lang);
    req = req.clone({ headers, withCredentials: false });

    return next.handle(req);
  }
}

export const apiLanguageInterceptorProviders = [{ provide: HTTP_INTERCEPTORS, useClass: ApiLanguageInterceptor, multi: true }];
