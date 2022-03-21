import {
  Directive,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  Renderer2,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  HostListener,
} from '@angular/core';
import { PopoverConfig } from './popover.config';
import { ComponentLoaderFactory } from '../utils/component-loader/component-loader.factory';
import { ComponentLoader } from '../utils/component-loader/component-loader.class';
import { PopoverContainerComponent } from './popover-container.component';
import { PositioningService } from '../utils/positioning/positioning.service';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

/**
 * A lightweight, extensible directive for fancy popover creation.
 */
@Directive({ selector: '[mdbPopover]', exportAs: 'bs-mdbPopover' })
export class PopoverDirective implements OnInit, OnDestroy {
  @Input() public containerClass: string;
  @Input() public bodyClass: string;
  @Input() public headerClass: string;
  /**
   * Content to be displayed as popover.
   */
  @Input() public mdbPopover: string | TemplateRef<any>;
  /**
   * Title of a popover.
   */
  @Input() public mdbPopoverHeader: string;
  @Input() public popoverTitle: string;
  /**
   * Placement of a popover. Accepts: "top", "bottom", "left", "right"
   */
  @Input() public placement: 'top' | 'bottom' | 'left' | 'right';
  /**
   * Specifies events that should trigger. Supports a space separated list of
   * event names.
   */
  @Input() public triggers: string;
  /**
   * A selector specifying the element the popover should be appended to.
   * Currently only supports "body".
   */
  @Input() public container: string;

  /**
   * Returns whether or not the popover is currently being shown
   */
  @Input()
  public get isOpen(): boolean {
    return this._popover.isShown;
  }

  public set isOpen(value: BooleanInput) {
    const isOpen = coerceBooleanProperty(value);

    if (isOpen) {
      this.show();
    } else {
      this.hide();
    }
  }

  @Input()
  get dynamicPosition(): boolean {
    return this._dynamicPosition;
  }
  set dynamicPosition(value: BooleanInput) {
    this._dynamicPosition = coerceBooleanProperty(value);
  }
  private _dynamicPosition = true;

  @Input()
  get outsideClick(): boolean {
    return this._outsideClick;
  }
  set outsideClick(value: BooleanInput) {
    this._outsideClick = coerceBooleanProperty(value);
  }
  private _outsideClick = false;

  @Input()
  get popoverDisabled(): boolean {
    return this._popoverDisabled;
  }
  set popoverDisabled(value: BooleanInput) {
    this._popoverDisabled = coerceBooleanProperty(value);
  }
  private _popoverDisabled = false;
  /**
   * Emits an event when the popover is shown
   */
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() public onShown: EventEmitter<any>;
  @Output() public shown: EventEmitter<any>;
  /**
   * Emits an event when the popover is hidden
   */
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() public onHidden: EventEmitter<any>;
  @Output() public hidden: EventEmitter<any>;

  private _popover: ComponentLoader<PopoverContainerComponent>;

  public constructor(
    _elementRef: ElementRef,
    _renderer: Renderer2,
    _viewContainerRef: ViewContainerRef,
    _config: PopoverConfig,
    cis: ComponentLoaderFactory,
    private _positionService: PositioningService
  ) {
    this._popover = cis
      .createLoader<PopoverContainerComponent>(_elementRef, _viewContainerRef, _renderer)
      .provide({ provide: PopoverConfig, useValue: _config });
    Object.assign(this, _config);
    this.onShown = this._popover.onShown;
    this.shown = this._popover.onShown;
    this.onHidden = this._popover.onHidden;
    this.hidden = this._popover.onHidden;
  }

  get hasContent(): boolean {
    if (typeof this.mdbPopover === 'string') {
      return this.mdbPopover.length > 0;
    }

    return true;
  }

  /**
   * Opens an element’s popover. This is considered a “manual” triggering of
   * the popover.
   */
  public show(): void | any {
    if (this._popover.isShown || this.popoverDisabled || !this.hasContent) {
      return;
    }

    this._positionService.setOptions({
      modifiers: {
        flip: {
          enabled: this.dynamicPosition,
        },
        preventOverflow: {
          enabled: this.dynamicPosition,
        },
      },
    });

    this._popover
      .attach(PopoverContainerComponent)
      .to(this.container)
      .position({ attachment: this.placement })
      .show({
        content: this.mdbPopover,
        placement: this.placement,
        title: this.mdbPopoverHeader || this.popoverTitle,
        containerClass: this.containerClass ? this.containerClass : '',
        bodyClass: this.bodyClass ? this.bodyClass : '',
        headerClass: this.headerClass ? this.headerClass : '',
      });
    this.isOpen = true;

    if (!this.dynamicPosition) {
      this._positionService.calcPosition();
      this._positionService.deletePositionElement(this._popover._componentRef.location);
    }
  }

  /**
   * Closes an element’s popover. This is considered a “manual” triggering of
   * the popover.
   */
  public hide(): void {
    if (this.isOpen) {
      this._popover.hide();
      this.isOpen = false;
    }
  }

  /**
   * Toggles an element’s popover. This is considered a “manual” triggering of
   * the popover.
   */
  public toggle(): void {
    if (this.isOpen) {
      return this.hide();
    }

    this.show();
  }

  @HostListener('click', ['$event']) onclick(event: any) {
    if (this.triggers.toString().includes('focus')) {
      event.stopPropagation();
      this.show();
    }
  }

  @HostListener('window:click') onblur() {
    if (this.triggers.toString().includes('focus') && this.isOpen) {
      this.hide();
    }
  }

  // fix(popover): popover with outsideClick='true' will now close after clicking in document on iPad Safari
  @HostListener('document:touchstart', ['$event']) onTouchStart(event: any) {
    if (this.outsideClick && !event.target.classList.contains('popover-body')) {
      this.hide();
    }
  }

  public ngOnInit(): any {
    this._popover.listen({
      triggers: this.triggers,
      outsideClick: this.outsideClick,
      show: () => this.show(),
    });
  }

  public dispose() {
    this._popover.dispose();
  }

  public ngOnDestroy(): any {
    this._popover.dispose();
  }
}
