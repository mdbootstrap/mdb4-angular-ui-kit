import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  Renderer2,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'mdb-badge',
  templateUrl: './mdb-badge.component.html',
  styleUrls: ['./badge-module.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MDBBadgeComponent implements OnInit {
  @Input()
  @HostBinding('class.badge-default')
  get default(): boolean {
    return this._default;
  }
  set default(value: BooleanInput) {
    this._default = coerceBooleanProperty(value);
  }
  private _default = false;

  @Input()
  @HostBinding('class.badge-primary')
  get primary(): boolean {
    return this._primary;
  }
  set primary(value: BooleanInput) {
    this._primary = coerceBooleanProperty(value);
  }
  private _primary = false;

  @Input()
  @HostBinding('class.badge-secondary')
  get secondary(): boolean {
    return this._secondary;
  }
  set secondary(value: BooleanInput) {
    this._secondary = coerceBooleanProperty(value);
  }
  private _secondary = false;

  @Input()
  @HostBinding('class.badge-success')
  get success(): boolean {
    return this._success;
  }
  set success(value: BooleanInput) {
    this._success = coerceBooleanProperty(value);
  }
  private _success = false;

  @Input()
  @HostBinding('class.badge-info')
  get info(): boolean {
    return this._info;
  }
  set info(value: BooleanInput) {
    this._info = coerceBooleanProperty(value);
  }
  private _info = false;

  @Input()
  @HostBinding('class.badge-warning')
  get warning(): boolean {
    return this._warning;
  }
  set warning(value: BooleanInput) {
    this._warning = coerceBooleanProperty(value);
  }
  private _warning = false;

  @Input()
  @HostBinding('class.badge-danger')
  get danger(): boolean {
    return this._danger;
  }
  set danger(value: BooleanInput) {
    this._danger = coerceBooleanProperty(value);
  }
  private _danger = false;

  @Input()
  @HostBinding('class.badge-pill')
  get pill(): boolean {
    return this._pill;
  }
  set pill(value: BooleanInput) {
    this._pill = coerceBooleanProperty(value);
  }
  private _pill = false;

  @Input() classInside: string;

  @Input() color: string;
  @Input() class: string;

  constructor(private _el: ElementRef, private _renderer: Renderer2) {}

  ngOnInit() {
    this._renderer.addClass(this._el.nativeElement, 'badge');
    if (this.color) {
      const customClassArr = this.color.split(' ');

      customClassArr.forEach((el: string) => {
        this._renderer.addClass(this._el.nativeElement, el);
      });
    }
  }
}
