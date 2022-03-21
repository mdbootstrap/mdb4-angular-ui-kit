import { Directive, ElementRef, Renderer2 } from '@angular/core';

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[fad], [duotone]' })
export class FadDirective {
  constructor(private _el: ElementRef, private _r: Renderer2) {
    this._r.addClass(this._el.nativeElement, 'fad');
  }
}
