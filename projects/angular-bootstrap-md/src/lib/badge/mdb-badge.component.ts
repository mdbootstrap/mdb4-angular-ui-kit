import { Component, OnInit, ElementRef, Renderer2, Input, HostBinding } from '@angular/core';

@Component({
    selector: 'mdb-badge',
    templateUrl: './mdb-badge.component.html'
})
export class MDBBadgeComponent implements OnInit {
    @Input() @HostBinding('class.badge-default') default: boolean;
    @Input() @HostBinding('class.badge-primary') primary: boolean;
    @Input() @HostBinding('class.badge-success') success: boolean;
    @Input() @HostBinding('class.badge-info') info: boolean;
    @Input() @HostBinding('class.badge-warning') warning: boolean;
    @Input() @HostBinding('class.badge-danger') danger: boolean;

    @Input() @HostBinding('class.badge-pill') pill: boolean;

    @Input() color: string;
    @Input() class: string;
    constructor(private _el: ElementRef, private _renderer: Renderer2) { }

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
