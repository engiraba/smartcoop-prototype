import { Pipe, PipeTransform } from '@angular/core';
import { TranslatorService } from 'src/app/services/translator/translator.service';

@Pipe({
  name: 'translate',
})
export class TranslationPipe implements PipeTransform {
  constructor(private translator: TranslatorService) {}
  transform(text: string): string {
    return this.translator.translate(text) || text;
  }
}
