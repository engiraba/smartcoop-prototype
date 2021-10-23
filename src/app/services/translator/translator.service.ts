import { Injectable } from '@angular/core';
import en from 'src/assets/locale/en.json';
import fr from 'src/assets/locale/fr.json';
type Language = 'en' | 'fr';

@Injectable({
  providedIn: 'root',
})
export class TranslatorService {
  translations: any = {
    en: { json: en, type: 'US' },
    fr: { json: fr, type: 'BE' },
  };
  defaultLanguage = localStorage.getItem('defaultLanguage') || 'en';

  constructor() {
    this.setLanguage(this.defaultLanguage);
  }

  setLanguage(language: Language | any) {
    localStorage.setItem('defaultLanguage', language);
  }

  getLanguage() {
    return (
      this.defaultLanguage +
      '-' +
      this.translations[this.defaultLanguage]['type']
    );
  }

  translate(text: string): string {
    return this.translations[this.defaultLanguage]['json'][text];
  }
}
