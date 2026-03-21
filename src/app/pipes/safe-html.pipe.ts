// safe-html.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

 transform(html: string): string {
  return this.sanitizer.sanitize(SecurityContext.HTML, html) || '';
}
}