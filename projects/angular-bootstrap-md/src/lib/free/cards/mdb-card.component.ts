import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'mdb-card',
  templateUrl: './mdb-card.component.html',
  styleUrls: ['./cards-module.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MdbCardComponent implements OnInit {
  @Input() class: string;

  @Input()
  get cascade(): boolean {
    return this._cascade;
  }
  set cascade(value: BooleanInput) {
    this._cascade = coerceBooleanProperty(value);
  }
  private _cascade = false;

  @Input()
  get wider(): boolean {
    return this._wider;
  }
  set wider(value: BooleanInput) {
    this._wider = coerceBooleanProperty(value);
  }
  private _wider = false;

  @Input() imageBackground: string;

  @ViewChild('card', { static: true }) card: ElementRef;

  @Input() set narrower(value: BooleanInput) {
    const narrower = coerceBooleanProperty(value);

    if (narrower) {
      this._r.addClass(this._el.nativeElement, 'narrower');
    } else if (!narrower && this._el.nativeElement.classList.contains('narrower')) {
      this._r.removeClass(this._el.nativeElement, 'narrower');
    }
  }

  @Input() set reverse(value: BooleanInput) {
    const reverse = coerceBooleanProperty(value);

    if (reverse) {
      this._r.addClass(this._el.nativeElement, 'reverse');
    } else if (!reverse && this._el.nativeElement.classList.contains('reserse')) {
      this._r.removeClass(this._el.nativeElement, 'reverse');
    }
  }

  @Input() set dark(value: BooleanInput) {
    const dark = coerceBooleanProperty(value);

    if (dark) {
      this._r.addClass(this._el.nativeElement, 'card-dark');
    } else if (!dark && this._el.nativeElement.classList.contains('card-dark')) {
      this._r.removeClass(this._el.nativeElement, 'card-dark');
    }
  }

  @Input() set bgColor(color: string) {
    if (color) {
      this._r.addClass(this._el.nativeElement, color);
    }
  }

  @Input() set borderColor(color: string) {
    if (color) {
      this._r.addClass(this._el.nativeElement, color);
    }
  }

  constructor(private _el: ElementRef, private _r: Renderer2) {}

  ngOnInit() {
    this._r.addClass(this._el.nativeElement, 'card');
    if (this.cascade) {
      this._r.addClass(this._el.nativeElement, 'card-cascade');
    }
    if (this.wider) {
      this._r.addClass(this._el.nativeElement, 'wider');
    }
    if (this.narrower) {
      this._r.addClass(this._el.nativeElement, 'narrower');
    }
    if (this.class) {
      this.class.split(' ').forEach((element: any) => {
        this._r.addClass(this._el.nativeElement, element);
      });
    }
  }
}
