import { EventEmitter, Injectable } from '@angular/core';
import { BsDropdownMenuDirective } from './dropdown-menu.directive';
import { BsComponentRef } from '../utils/component-loader/bs-component-ref.class';

@Injectable()
export class BsDropdownState {
  direction: 'down' | 'up' = 'down';
  autoClose: boolean;
  isOpenChange = new EventEmitter<boolean>();
  isDisabledChange = new EventEmitter<boolean>();
  toggleClick = new EventEmitter<boolean>();

  /**
   * Content to be displayed as popover.
   */
  dropdownMenu: Promise<BsComponentRef<BsDropdownMenuDirective>>;
  resolveDropdownMenu: (componentRef: BsComponentRef<BsDropdownMenuDirective>) => void;

  constructor() {
    this.dropdownMenu = new Promise((resolve) => {
      this.resolveDropdownMenu = resolve;
    });
  }
}
