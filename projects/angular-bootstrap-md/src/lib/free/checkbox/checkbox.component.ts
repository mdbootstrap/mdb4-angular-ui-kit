import {
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  NumberInput,
} from '@angular/cdk/coercion';
import {
  Component,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject, timer } from 'rxjs';
import { take } from 'rxjs/operators';

export const CHECKBOX_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  useExisting: forwardRef(() => CheckboxComponent),
  multi: true,
};

let defaultIdNumber = 0;

export class MdbCheckboxChange {
  element: CheckboxComponent;
  checked: boolean;
}

@Component({
  selector: 'mdb-checkbox',
  templateUrl: './checkbox.component.html',
  providers: [CHECKBOX_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent implements OnInit, OnChanges {
  @ViewChild('input', { static: true }) inputEl: any;

  private defaultId = `mdb-checkbox-${++defaultIdNumber}`;

  @Input() class: string;
  @Input() checkboxId: string = this.defaultId;

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: BooleanInput) {
    this._required = coerceBooleanProperty(value);
  }
  private _required = false;

  @Input() name: string;
  @Input() value: string;

  @Input()
  get checked(): boolean {
    return this._checked;
  }
  set checked(value: BooleanInput) {
    this._checked = coerceBooleanProperty(value);
  }
  private _checked = false;

  @Input()
  get filledIn(): boolean {
    return this._filledIn;
  }
  set filledIn(value: BooleanInput) {
    this._filledIn = coerceBooleanProperty(value);
  }
  private _filledIn = false;

  @Input()
  get indeterminate(): boolean {
    return this._indeterminate;
  }
  set indeterminate(value: BooleanInput) {
    this._indeterminate = coerceBooleanProperty(value);
  }
  private _indeterminate = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
  }
  private _disabled = false;

  @Input()
  get rounded(): boolean {
    return this._rounded;
  }
  set rounded(value: BooleanInput) {
    this._rounded = coerceBooleanProperty(value);
  }
  private _rounded = false;

  @Input() checkboxPosition = 'left';

  @Input()
  get default(): boolean {
    return this._default;
  }
  set default(value: BooleanInput) {
    this._default = coerceBooleanProperty(value);
  }
  private _default = false;

  @Input()
  get inline(): boolean {
    return this._inline;
  }
  set inline(value: BooleanInput) {
    this._inline = coerceBooleanProperty(value);
  }
  private _inline = false;

  @Input()
  get tabIndex(): number {
    return this._tabIndex;
  }
  set tabIndex(value: NumberInput) {
    this._tabIndex = coerceNumberProperty(value);
  }
  private _tabIndex: number;

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<MdbCheckboxChange> = new EventEmitter<MdbCheckboxChange>();

  private checkboxClicked = new Subject<boolean>();

  constructor(private _cdRef: ChangeDetectorRef) {}

  @HostListener('click', ['$event'])
  onLabelClick(event: any) {
    event.stopPropagation();
    this.checkboxClicked.next(true);
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.checkboxClicked.next(false);
  }

  ngOnInit() {
    if (this.indeterminate && !this.filledIn && !this.rounded) {
      this.inputEl.indeterminate = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('checked')) {
      this.checked = changes.checked.currentValue;
    }
  }

  get changeEvent() {
    const newChangeEvent = new MdbCheckboxChange();
    newChangeEvent.element = this;
    newChangeEvent.checked = this.checked;
    return newChangeEvent;
  }

  toggle() {
    if (this.disabled) {
      return;
    }
    this.checked = !this.checked;
    this.indeterminate = false;
    this.onChange(this.checked);

    this._cdRef.markForCheck();
  }

  onCheckboxClick(event: any) {
    event.stopPropagation();
    this.toggle();
  }

  onCheckboxChange(event: any) {
    event.stopPropagation();
    timer(0).subscribe(() => this.change.emit(this.changeEvent));
  }

  onBlur() {
    this.checkboxClicked.pipe(take(1)).subscribe((val) => {
      if (!val) {
        this.onTouched();
      }
    });
  }

  // Control Value Accessor Methods
  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any) {
    this.value = value;
    this.checked = !!value;
    this._cdRef.markForCheck();
  }

  registerOnChange(fn: (_: any) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }
}
