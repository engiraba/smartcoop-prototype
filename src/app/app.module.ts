import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// setting up locale
import { LOCALE_ID } from '@angular/core';
import localesFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
import { TranslatorService } from './services/translator/translator.service';

registerLocaleData(localesFr);
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: LOCALE_ID,
      deps: [TranslatorService],
      useFactory: (translator: any) => translator.getLanguage(),
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
