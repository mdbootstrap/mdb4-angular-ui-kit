
import { Component, Input, ElementRef, Renderer2, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'mdb-card',
    templateUrl: './mdb-card.component.html',
})

export class MdbCardComponent implements OnInit {
    @Input() class: string;
    @Input() cascade: boolean;
    @Input() wider: boolean;

    @ViewChild('card') card: ElementRef;


    @Input() set narrower(narrower: boolean) {
        if (narrower) {
            this._r.addClass(this._el.nativeElement, 'narrower');
        }
    }

    @Input() set reverse(reverse: boolean) {
        if (reverse) {
            this._r.addClass(this._el.nativeElement, 'reverse');
        }
    }

    @Input() set dark(dark: boolean) {
        if (dark) {
            this._r.addClass(this._el.nativeElement, 'card-dark');
        }
    }

    @Input() set bgColor(color: string) {
        if (color) {
            this._r.addClass(this.card.nativeElement, color);
        }
    }

    @Input() set borderColor(color: string) {
        if (color) {
            this._r.addClass(this.card.nativeElement, color);
        }
    }

    constructor(private _el: ElementRef, private _r: Renderer2) { }

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
        if (this._el.nativeElement.parentElement.classList.contains('card-deck')) {
            this._r.addClass(this.card.nativeElement, 'w-100');
            this._r.addClass(this.card.nativeElement, 'mx-0');
        }
    }
}
