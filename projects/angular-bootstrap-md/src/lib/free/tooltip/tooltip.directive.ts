import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { TooltipContainerComponent } from './tooltip.component';
import { TooltipConfig } from './tooltip.service';
import { ComponentLoaderFactory } from '../utils/component-loader/component-loader.factory';
import { ComponentLoader } from '../utils/component-loader/component-loader.class';
import { OnChange } from '../utils/decorators';
import { isPlatformBrowser } from '@angular/common';
import { PositioningService } from '../utils/positioning/positioning.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  NumberInput,
} from '@angular/cdk/coercion';

@Directive({
  selector: '[mdbTooltip]',
  exportAs: 'mdb-tooltip',
})
export class TooltipDirective implements OnInit, OnDestroy, OnChanges {
  /**
   * Content to be displayed as tooltip.
   */
  @OnChange()
  @Input()
  public mdbTooltip: string | TemplateRef<any>;
  /** Fired when tooltip content changes */
  @Output() public tooltipChange: EventEmitter<string | TemplateRef<any>> = new EventEmitter();

  /**
   * Placement of a tooltip. Accepts: "top", "bottom", "left", "right"
   */
  @Input() public placement: string;
  /**
   * Specifies events that should trigger. Supports a space separated list of
   * event names.
   */
  @Input() public triggers: string;
  /**
   * A selector specifying the element the tooltip should be appended to.
   * Currently only supports "body".
   */
  @Input() public container: string;

  /**
   * Returns whether or not the tooltip is currently being shown
   */
  @Input()
  public get isOpen(): boolean {
    return this._tooltip.isShown;
  }

  public set isOpen(value: BooleanInput) {
    const isOpen = coerceBooleanProperty(value);

    if (isOpen) {
      this.show();
    } else {
      this.hide();
    }
  }

  /**
   * Allows to disable tooltip
   */
  @Input()
  get tooltipDisabled(): boolean {
    return this._tooltipDisabled;
  }
  set tooltipDisabled(value: BooleanInput) {
    this._tooltipDisabled = coerceBooleanProperty(value);
  }
  private _tooltipDisabled = false;

  @Input()
  get dynamicPosition(): boolean {
    return this._dynamicPosition;
  }
  set dynamicPosition(value: BooleanInput) {
    this._dynamicPosition = coerceBooleanProperty(value);
  }
  private _dynamicPosition = true;

  /**
   * Emits an event when the tooltip is shown
   */
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() public onShown: EventEmitter<any>;
  @Output() public shown: EventEmitter<any>;
  /**
   * Emits an event when the tooltip is hidden
   */
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() public onHidden: EventEmitter<any>;
  @Output() public hidden: EventEmitter<any>;

  @Input()
  get delay(): number {
    return this._delay;
  }
  set delay(value: NumberInput) {
    this._delay = coerceNumberProperty(value);
  }
  private _delay = 0;

  @Input() public customHeight: string;

  @Input()
  get fadeDuration(): number {
    return this._fadeDuration;
  }
  set fadeDuration(value: NumberInput) {
    this._fadeDuration = coerceNumberProperty(value);
  }
  private _fadeDuration = 150;

  private _destroy$: Subject<void> = new Subject();

  protected _delayTimeoutId: any;

  private _tooltip: ComponentLoader<TooltipContainerComponent>;

  isBrowser: any = false;

  public constructor(
    _renderer: Renderer2,
    private _elementRef: ElementRef,
    private _positionService: PositioningService,
    _viewContainerRef: ViewContainerRef,
    cis: ComponentLoaderFactory,
    config: TooltipConfig,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this._tooltip = cis
      .createLoader<TooltipContainerComponent>(this._elementRef, _viewContainerRef, _renderer)
      .provide({ provide: TooltipConfig, useValue: config });

    Object.assign(this, config);
    this.onShown = this._tooltip.onShown;
    this.shown = this._tooltip.onShown;
    this.onHidden = this._tooltip.onHidden;
    this.hidden = this._tooltip.onHidden;
  }

  public ngOnInit(): void {
    this._tooltip.listen({
      triggers: this.triggers,
      show: () => this.show(),
    });

    this.tooltipChange.pipe(takeUntil(this._destroy$)).subscribe((value: any) => {
      if (!value) {
        this._tooltip.hide();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mdbTooltip'] && !changes['mdbTooltip'].isFirstChange()) {
      this.tooltipChange.emit(this.mdbTooltip);
    }
  }

  /**
   * Toggles an element’s tooltip. This is considered a “manual” triggering of
   * the tooltip.
   */
  public toggle(): void {
    if (this.isOpen) {
      return this.hide();
    }

    this.show();
  }

  /**
   * Opens an element’s tooltip. This is considered a “manual” triggering of
   * the tooltip.
   */
  public show(): void {
    if (this.isOpen || this.tooltipDisabled || !this.mdbTooltip) {
      return;
    }

    if (this._delayTimeoutId) {
      clearTimeout(this._delayTimeoutId);
      this._delayTimeoutId = undefined;
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

    const showTooltip = () => {
      this._tooltip
        .attach(TooltipContainerComponent)
        .to(this.container)
        .position({ attachment: this.placement })
        .show({
          content: this.mdbTooltip,
          placement: this.placement,
        });
    };

    this.showTooltip(showTooltip);
  }

  private showTooltip(fn: Function) {
    if (this.delay) {
      this._delayTimeoutId = setTimeout(() => {
        fn();
      }, this.delay);
    } else {
      fn();
    }
  }

  /**
   * Closes an element’s tooltip. This is considered a “manual” triggering of
   * the tooltip.
   */
  public hide(): void {
    if (this._delayTimeoutId) {
      clearTimeout(this._delayTimeoutId);
      this._delayTimeoutId = undefined;
    }

    if (!this._tooltip.isShown) {
      return;
    }

    this._tooltip.instance.classMap.in = false;
    setTimeout(() => {
      this._tooltip.hide();
    }, this.fadeDuration);
  }

  public dispose() {
    this._tooltip.dispose();
  }

  public ngOnDestroy(): void {
    this._tooltip.dispose();
    this._destroy$.next();
    this._destroy$.complete();
  }
}
