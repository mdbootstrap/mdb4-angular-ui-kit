import { NavbarService } from './navbar.service';
import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  QueryList,
  EventEmitter,
  Output,
  Renderer2,
} from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'links',
  template: `
    <ng-content></ng-content>
  `,
})
export class LinksComponent implements AfterContentInit {
  @ContentChildren(RouterLinkWithHref, { read: ElementRef, descendants: true })
  links: QueryList<ElementRef>;

  @Output() linkClick = new EventEmitter<any>();

  constructor(private _navbarService: NavbarService, private renderer: Renderer2) {}

  ngAfterContentInit() {
    setTimeout(() => {
      this.links.forEach((link: ElementRef<HTMLElement>) => {
        this.renderer.listen(link.nativeElement, 'click', () => {
          this._navbarService.setNavbarLinkClicks();
        });
      });
    }, 0);
  }
}
