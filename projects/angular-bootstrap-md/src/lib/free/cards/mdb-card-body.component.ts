import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Component,
  Input,
  ElementRef,
  Renderer2,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'mdb-card-body',
  templateUrl: './mdb-card-body.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbCardBodyComponent implements OnInit {
  @Input() class: string;

  @Input() set cascade(value: BooleanInput) {
    const cascade = coerceBooleanProperty(value);

    if (cascade) {
      this._r.addClass(this._el.nativeElement, 'card-body-cascade');
    }
  }

  constructor(private _el: ElementRef, private _r: Renderer2) {}

  ngOnInit() {
    this._r.addClass(this._el.nativeElement, 'card-body');
    if (this.class) {
      this.class.split(' ').forEach((element: any) => {
        this._r.addClass(this._el.nativeElement, element);
      });
    }
  }
}
