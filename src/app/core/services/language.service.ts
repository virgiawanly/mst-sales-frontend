import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  public languages: string[] = ['en', 'id'];

  constructor(
    public translate: TranslateService,
    private cookieService: CookieService,
  ) {
    // Add languges to translate service
    this.translate.addLangs(this.languages);

    // Set default language
    let browserLang: any;
    if (this.cookieService.check('lang')) {
      browserLang = this.cookieService.get('lang');
    } else {
      browserLang = translate.getBrowserLang();
    }

    // Set used language for translate service
    translate.use(browserLang.match(/en|id/) ? browserLang : 'en');
  }

  /**
   * Set app language.
   *
   * @param lang
   * @return void
   */
  public setLanguage(lang: any) {
    this.translate.use(lang);
    this.cookieService.set('lang', lang);
  }
}
