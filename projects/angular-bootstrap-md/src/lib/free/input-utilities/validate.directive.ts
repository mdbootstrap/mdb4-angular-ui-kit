import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[mdbValidate]',
})
export class MdbValidateDirective implements OnInit {
  private _validate = true;
  private _validateSuccess = true;
  private _validateError = true;

  @Input()
  get mdbValidate(): boolean {
    return this._mdbValidate;
  }
  set mdbValidate(value: BooleanInput) {
    this._mdbValidate = coerceBooleanProperty(value);
  }
  private _mdbValidate = false;

  @Input()
  get validate(): boolean {
    return this._validate;
  }
  set validate(value: BooleanInput) {
    this._validate = coerceBooleanProperty(value);
    this.updateErrorClass();
    this.updateSuccessClass();
  }

  @Input()
  get validateSuccess(): boolean {
    return this._validateSuccess;
  }
  set validateSuccess(value: BooleanInput) {
    this._validateSuccess = coerceBooleanProperty(value);
    this.updateSuccessClass();
  }

  @Input()
  get validateError(): boolean {
    return this._validateError;
  }
  set validateError(value: BooleanInput) {
    this._validateError = coerceBooleanProperty(value);
    this.updateErrorClass();
    this.updateSuccessClass();
  }

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  updateSuccessClass() {
    if (this.validate && this.validateSuccess) {
      this.renderer.addClass(this.el.nativeElement, 'validate-success');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'validate-success');
    }
  }

  updateErrorClass() {
    if (this.validate && this.validateError) {
      this.renderer.addClass(this.el.nativeElement, 'validate-error');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'validate-error');
    }
  }

  ngOnInit() {
    this.updateSuccessClass();
    this.updateErrorClass();
  }
}
