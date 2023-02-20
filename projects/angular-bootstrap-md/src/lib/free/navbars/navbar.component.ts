import { NavbarService } from './navbar.service';
import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Inject,
  NgZone,
  OnDestroy,
  EventEmitter,
  Output,
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { LinksComponent } from './links.component';
import { DOCUMENT } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import {
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  NumberInput,
} from '@angular/cdk/coercion';

@Component({
  selector: 'mdb-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['./navbars-module.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements AfterViewInit, OnInit, AfterContentChecked, OnDestroy {
  @Input() iconBackground: string | string[];
  @Input() SideClass: string;

  @Input()
  get containerInside(): boolean {
    return this._containerInside;
  }
  set containerInside(value: BooleanInput) {
    this._containerInside = coerceBooleanProperty(value);
  }
  private _containerInside = true;

  @Input() collapseId = 'navbarCollapse';

  @Input()
  get scrollSensitivity(): number {
    return this._scrollSensitivity;
  }
  set scrollSensitivity(value: NumberInput) {
    this._scrollSensitivity = coerceNumberProperty(value);
  }
  private _scrollSensitivity = 120;

  @Input()
  get scrollableNavbar(): boolean {
    return this._scrollableNavbar;
  }
  set scrollableNavbar(value: BooleanInput) {
    this._scrollableNavbar = coerceBooleanProperty(value);
  }
  private _scrollableNavbar = false;

  @Output() shown: EventEmitter<any> = new EventEmitter();
  @Output() hidden: EventEmitter<any> = new EventEmitter();

  private _destroy$: Subject<void> = new Subject();

  navbarLinkClicks: any;
  isShown = false;

  public doubleNav: boolean;
  public height: number;
  public duration = 350; // ms

  public collapse = true;
  public showClass = false;
  public collapsing = false;

  private _itemsLength = 0;

  ariaExpanded = false;

  @ViewChild('navbar', { static: true }) el: ElementRef;
  @ViewChild('mobile') mobile: ElementRef;
  @ViewChild('nav', { static: true }) navbar: ElementRef;
  @ViewChild('container', { static: true }) container: ElementRef;
  @ViewChild('toggler') toggler: ElementRef;
  @ContentChild(LinksComponent) links: LinksComponent;

  constructor(
    public renderer: Renderer2,
    private _navbarService: NavbarService,
    private _cdRef: ChangeDetectorRef,
    private _ngZone: NgZone,
    @Inject(DOCUMENT) private _document: any
  ) {
    this._navbarService
      .getNavbarLinkClicks()
      .pipe(takeUntil(this._destroy$))
      .subscribe((navbarLinkClicks) => {
        this.closeNavbarOnClick(navbarLinkClicks);
      });
  }

  closeNavbarOnClick(navbarLinkClicks: any) {
    this.navbarLinkClicks = navbarLinkClicks;
    if (this.showClass) {
      this.hide();
    }
  }

  addTogglerIconClasses() {
    if (this.iconBackground) {
      if (Array.isArray(this.iconBackground)) {
        this.iconBackground.forEach((iconClass) => {
          this.renderer.addClass(this.toggler.nativeElement, iconClass);
        });
      } else {
        this.renderer.addClass(this.toggler.nativeElement, this.iconBackground);
      }
    }
  }

  private _listenToScroll() {
    this._ngZone.runOutsideAngular(() => {
      fromEvent(this._document, 'scroll')
        .pipe(takeUntil(this._destroy$))
        .subscribe(() => {
          if (window.pageYOffset > this.scrollSensitivity) {
            this.renderer.addClass(this.navbar.nativeElement, 'top-nav-collapse');
          } else {
            this.renderer.removeClass(this.navbar.nativeElement, 'top-nav-collapse');
          }
        });
    });
  }

  ngOnInit() {
    const isDoubleNav = this.SideClass.split(' ');
    this.doubleNav = isDoubleNav.indexOf('double-nav') !== -1;
  }

  ngAfterViewInit() {
    if (!this.containerInside) {
      const childrens = Array.from(this.container.nativeElement.children);
      childrens.forEach((child) => {
        this.renderer.appendChild(this.navbar.nativeElement, child);
        this.container.nativeElement.remove();
      });
    }
    if (this.el.nativeElement.children.length === 0) {
      this.el.nativeElement.remove();
    }
    this.addTogglerIconClasses();
    if (this.scrollableNavbar) {
      this.renderer.addClass(this.el.nativeElement, 'collapsed-navbar-scroll');
    }

    if (this.navbar.nativeElement.classList.contains('scrolling-navbar')) {
      this._listenToScroll();
    }
  }

  toggle() {
    if (!this.collapsing) {
      if (this.isShown) {
        this.hide();
      } else {
        this.show();
      }
    }
  }

  show() {
    this.isShown = true;
    this.collapse = false;
    this.collapsing = true;
    this.ariaExpanded = true;

    setTimeout(() => {
      this.height = this.el.nativeElement.scrollHeight;
      this.renderer.setStyle(this.el.nativeElement, 'height', this.height + 'px');
    }, 0);

    setTimeout(() => {
      this.collapsing = false;
      this.collapse = true;
      this.showClass = true;
      this.shown.emit();
    }, this.duration);

    this._cdRef.markForCheck();
  }

  hide() {
    if (this.isShown) {
      this.isShown = false;
      this.collapse = false;
      this.showClass = false;
      this.collapsing = true;
      this.ariaExpanded = false;
      setTimeout(() => {
        this.renderer.setStyle(this.el.nativeElement, 'height', '0px');
      }, 0);

      setTimeout(() => {
        this.collapsing = false;
        this.collapse = true;
        this.hidden.emit();
      }, this.duration);
    }

    this._cdRef.markForCheck();
  }

  get displayStyle() {
    if (!this.containerInside) {
      return 'flex';
    } else {
      return '';
    }
  }

  @HostListener('window:resize', ['$event']) onResize(event: any) {
    let breakpoint = 0;

    if (this.SideClass.includes('navbar-expand-xl')) {
      breakpoint = 1200;
    } else if (this.SideClass.includes('navbar-expand-lg')) {
      breakpoint = 992;
    } else if (this.SideClass.includes('navbar-expand-md')) {
      breakpoint = 768;
    } else if (this.SideClass.includes('navbar-expand-sm')) {
      breakpoint = 576;
    } else {
      breakpoint = event.target.innerWidth + 1;
    }

    if (event.target.innerWidth < breakpoint) {
      if (!this.isShown) {
        this.collapse = false;
        this.renderer.setStyle(this.el.nativeElement, 'height', '0px');
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
        setTimeout(() => {
          this.height = this.el.nativeElement.scrollHeight;
          this.collapse = true;
          this.renderer.setStyle(this.el.nativeElement, 'opacity', '');
          this._cdRef.markForCheck();
        }, 4);
      }
    } else {
      this.collapsing = false;
      this.isShown = false;
      this.showClass = false;
      this.collapse = true;
      this.ariaExpanded = false;
      this.renderer.setStyle(this.el.nativeElement, 'height', '');
    }
  }

  ngAfterContentChecked() {
    if (this.el.nativeElement.firstElementChild && this.isShown) {
      if (
        this._itemsLength !==
        this.el.nativeElement.firstElementChild.firstElementChild.children.length
      ) {
        this.height = this.el.nativeElement.firstElementChild.firstElementChild.clientHeight;
        this.renderer.setStyle(this.el.nativeElement, 'height', this.height + 'px');
      }

      this._itemsLength = this.el.nativeElement.firstElementChild.firstElementChild.children.length;
    }
    this._cdRef.markForCheck();
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
