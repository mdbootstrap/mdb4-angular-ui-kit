import {
  Component,
  ElementRef,
  EmbeddedViewRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewContainerRef,
  ViewEncapsulation,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Subscription, Subject } from 'rxjs';

import { ComponentLoader } from '../utils/component-loader/component-loader.class';
import { ComponentLoaderFactory } from '../utils/component-loader/component-loader.factory';
import { BsDropdownConfig } from './dropdown.config';
import { BsDropdownState } from './dropdown.state';
import { BsComponentRef } from '../utils/component-loader/bs-component-ref.class';
import { BsDropdownMenuDirective } from './dropdown-menu.directive';
import { isBs3 } from '../utils/ng2-bootstrap-config';
import { takeUntil } from 'rxjs/operators';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[mdbDropdown],[dropdown]',
  exportAs: 'bs-dropdown',
  template: '<ng-content></ng-content>',
  styleUrls: ['dropdown-module.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [BsDropdownState],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class BsDropdownDirective implements OnInit, OnDestroy {
  /**
   * Placement of a popover. Accepts: "top", "bottom", "left", "right"
   */
  @Input() placement: string;
  /**
   * Specifies events that should trigger. Supports a space separated list of
   * event names.
   */
  @Input() triggers: string;
  /**
   * A selector specifying the element the popover should be appended to.
   * Currently only supports "body".
   */
  @Input() container: string;

  @Input()
  get dropup(): boolean {
    return this._dropup;
  }
  set dropup(value: BooleanInput) {
    this._dropup = coerceBooleanProperty(value);
  }
  private _dropup = false;

  @Input()
  get dropupDefault(): boolean {
    return this._dropupDefault;
  }
  set dropupDefault(value: BooleanInput) {
    this._dropupDefault = coerceBooleanProperty(value);
  }
  private _dropupDefault = false;

  @Input()
  get dynamicPosition(): boolean {
    return this._dynamicPosition;
  }
  set dynamicPosition(value: BooleanInput) {
    this._dynamicPosition = coerceBooleanProperty(value);
  }
  private _dynamicPosition = false;
  /**
   * This attribute indicates that the dropdown should be opened upwards
   */
  @HostBinding('class.dropup') public get isDropup() {
    if (this.dropup) {
      this._isDropupDefault = false;
      return this.dropup;
    } else if (this.dropupDefault) {
      this._isDropupDefault = true;
      return this.dropupDefault;
    } else if (this.dropupDefault && this.dropup) {
      this._isDropupDefault = false;
      return this.dropup;
    }
  }

  /**
   * Indicates that dropdown will be closed on item or document click,
   * and after pressing ESC
   */
  @Input() set autoClose(value: BooleanInput) {
    this._state.autoClose = coerceBooleanProperty(value);
  }

  get autoClose(): boolean {
    return this._state.autoClose;
  }

  /**
   * Disables dropdown toggle and hides dropdown menu if opened
   */
  @Input() set isDisabled(value: BooleanInput) {
    const isDisabled = coerceBooleanProperty(value);
    this._isDisabled = isDisabled;
    this._state.isDisabledChange.emit(isDisabled);
    if (isDisabled) {
      this.hide();
    }
  }

  get isDisabled(): boolean {
    return this._isDisabled;
  }

  /**
   * Returns whether or not the popover is currently being shown
   */
  @HostBinding('class.open')
  @HostBinding('class.show')
  @Input()
  get isOpen(): boolean {
    if (this._showInline) {
      return this._isInlineOpen;
    }
    return this._dropdown.isShown;
  }

  set isOpen(value: BooleanInput) {
    const isOpen = coerceBooleanProperty(value);

    if (isOpen) {
      this.show();
    } else {
      this.hide();
    }
  }

  /**
   * Emits an event when isOpen change
   */
  @Output() isOpenChange: EventEmitter<any>;

  /**
   * Emits an event when the popover is shown
   */
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onShown: EventEmitter<any>;
  @Output() shown: EventEmitter<any>;

  /**
   * Emits an event when the popover is hidden
   */
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onHidden: EventEmitter<any>;
  @Output() hidden: EventEmitter<any>;

  private _destroy$: Subject<void> = new Subject();

  get isBs4(): boolean {
    return !isBs3();
  }

  _isInlineOpen = false;
  _showInline: boolean;
  _inlinedMenu: EmbeddedViewRef<BsDropdownMenuDirective>;

  _isDisabled: boolean;
  _dropdown: ComponentLoader<BsDropdownContainerComponent>;
  _subscriptions: Subscription[] = [];
  _isInited = false;
  _isDropupDefault: boolean;

  constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer2,
    private _viewContainerRef: ViewContainerRef,
    private _cis: ComponentLoaderFactory,
    private _config: BsDropdownConfig,
    private _state: BsDropdownState,
    private cdRef: ChangeDetectorRef
  ) {
    // create dropdown component loader
    this._dropdown = this._cis
      .createLoader<BsDropdownContainerComponent>(
        this._elementRef,
        this._viewContainerRef,
        this._renderer
      )
      .provide({ provide: BsDropdownState, useValue: this._state });

    this.onShown = this._dropdown.onShown;
    this.shown = this._dropdown.shown;
    this.onHidden = this._dropdown.onHidden;
    this.hidden = this._dropdown.hidden;
    this.isOpenChange = this._state.isOpenChange;

    // set initial dropdown state from config
    this._state.autoClose = this._config.autoClose;
  }

  ngOnInit(): void {
    // fix: seems there are an issue with `routerLinkActive`
    // which result in duplicated call ngOnInit without call to ngOnDestroy
    // read more: https://github.com/valor-software/ngx-bootstrap/issues/1885
    if (this._isInited) {
      return;
    }
    this._isInited = true;

    this._showInline = !this.container;

    this._dropup = this.dropup;

    // attach DOM listeners
    this._dropdown.listen({
      triggers: this.triggers,
      show: () => this.show(),
    });

    // toggle visibility on toggle element click
    this._state.toggleClick
      .pipe(takeUntil(this._destroy$))
      .subscribe((value: boolean) => this.toggle(value));

    // hide dropdown if set disabled while opened
    this._state.isDisabledChange.pipe(takeUntil(this._destroy$)).subscribe((element: any) => {
      if (element === true) {
        this.hide();
      }
    });

    // attach dropdown menu inside of dropdown
    if (this._showInline) {
      this._state.dropdownMenu.then((dropdownMenu: BsComponentRef<BsDropdownMenuDirective>) => {
        this._inlinedMenu = dropdownMenu.viewContainer.createEmbeddedView(dropdownMenu.templateRef);
      });
    }

    this._state.isOpenChange.pipe(takeUntil(this._destroy$)).subscribe(() => {
      setTimeout(() => {
        const dropdownContainer = this._elementRef.nativeElement.querySelector('.dropdown-menu');
        const left = dropdownContainer.getBoundingClientRect().left;

        if (
          dropdownContainer.classList.contains('dropdown-menu-right') &&
          left <= dropdownContainer.clientWidth
        ) {
          if (left < 0) {
            this._renderer.setStyle(dropdownContainer, 'right', left + 'px');
          } else {
            this._renderer.setStyle(dropdownContainer, 'right', '0');
          }
        }
      }, 0);
    });
  }

  /**
   * Opens an element’s popover. This is considered a “manual” triggering of
   * the popover.
   */
  show(): void {
    if (this.isOpen || this.isDisabled) {
      return;
    }
    // material and dropup dropdown animation

    const button = this._elementRef.nativeElement.children[0];
    const container = this._elementRef.nativeElement.querySelector('.dropdown-menu');

    if (
      !container.parentNode.classList.contains('btn-group') &&
      !container.parentNode.classList.contains('dropdown') &&
      !this._isDropupDefault
    ) {
      container.parentNode.classList.add('dropdown');
    }
    if (this.dropup && !this._isDropupDefault) {
      container.parentNode.classList.add('dropup-material');
    }
    if (button.tagName !== 'BUTTON') {
      if (button.tagName === 'A') {
        container.classList.add('a-various-dropdown');
      } else {
        container.classList.add('various-dropdown');
      }
    } else {
      if (button.classList.contains('btn-sm')) {
        container.classList.add('small-dropdown');
      }
      if (button.classList.contains('btn-md')) {
        container.classList.add('medium-dropdown');
      }
      if (button.classList.contains('btn-lg')) {
        container.classList.add('large-dropdown');
      }
    }
    setTimeout(() => {
      container.classList.add('fadeInDropdown');

      if (this.dynamicPosition) {
        const bounding = container.getBoundingClientRect();
        const out: { top: boolean; bottom: boolean } = {
          top: bounding.top < 0,
          bottom: bounding.bottom > (window.innerHeight || document.documentElement.clientHeight),
        };

        if (this.dropup && out.top) {
          this.dropup = false;
        } else if (!this.dropup && out.bottom) {
          this.dropup = true;
        }
      }
    }, 0);

    if (this._showInline) {
      this._isInlineOpen = true;
      if (
        container.parentNode.classList.contains('dropdown') ||
        container.parentNode.classList.contains('dropup-material')
      ) {
        setTimeout(() => {
          this.onShown.emit(true);
          this.shown.emit(true);
        }, 560);
      } else {
        setTimeout(() => {
          this.onShown.emit(true);
          this.shown.emit(true);
        }, 0);
      }
      this._state.isOpenChange.emit(true);

      return;
    }
    this._state.dropdownMenu.then((dropdownMenu) => {
      // check direction in which dropdown should be opened
      const _dropup = this.dropup === true || this.dropupDefault === true;

      this._state.direction = _dropup ? 'up' : 'down';
      const _placement = this.placement || (_dropup ? 'top left' : 'bottom left');

      // show dropdown
      this._dropdown
        .attach(BsDropdownContainerComponent)
        .to(this.container)
        .position({ attachment: _placement })
        .show({
          content: dropdownMenu.templateRef,
          placement: _placement,
        });

      this._state.isOpenChange.emit(true);
    });
  }

  /**
   * Closes an element’s popover. This is considered a “manual” triggering of
   * the popover.
   */
  hide(): void {
    if (!this.isOpen) {
      return;
    }

    if (this.dropup !== this._dropup) {
      this.dropup = this._dropup;
    }

    const container = this._elementRef.nativeElement.querySelector('.dropdown-menu');

    container.classList.remove('fadeInDropdown');
    if (
      container.parentNode.classList.contains('dropdown') ||
      container.parentNode.classList.contains('dropup-material')
    ) {
      setTimeout(() => {
        if (this._showInline) {
          this._isInlineOpen = false;
          this.onHidden.emit(true);
          this.hidden.emit(true);
          this.cdRef.markForCheck();
        } else {
          this._dropdown.hide();
        }

        this._state.isOpenChange.emit(false);
      }, 560);
    } else {
      setTimeout(() => {
        if (this._showInline) {
          this._isInlineOpen = false;
          this.onHidden.emit(true);
          this.hidden.emit(true);
          this.cdRef.markForCheck();
        } else {
          this._dropdown.hide();
        }

        this._state.isOpenChange.emit(false);
      }, 0);
    }
  }

  /**
   * Toggles an element’s popover. This is considered a “manual” triggering of
   * the popover.
   */
  toggle(value?: boolean): void {
    if (this.isOpen || value === false) {
      return this.hide();
    }

    return this.show();
  }

  ngOnDestroy(): void {
    // clean up subscriptions and destroy dropdown
    this._destroy$.next();
    this._destroy$.complete();
    this._dropdown.dispose();
  }
}

@Component({
  selector: 'mdb-dropdown-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class.dropup]="direction === 'up'"
      [class.dropdown]="direction === 'down'"
      [class.show]="isOpen"
      [class.open]="isOpen"
    >
      <ng-content></ng-content>
    </div>
  `,
})
export class BsDropdownContainerComponent implements OnDestroy {
  isOpen = false;

  @HostBinding('style.display') display = 'block';
  @HostBinding('style.position') position = 'absolute';

  get direction(): 'down' | 'up' {
    return this._state.direction;
  }

  private _subscription: any;

  constructor(private _state: BsDropdownState) {
    this._subscription = _state.isOpenChange.subscribe((value: boolean) => {
      this.isOpen = value;
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
