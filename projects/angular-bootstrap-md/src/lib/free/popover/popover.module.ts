import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentLoaderFactory } from '../utils/component-loader/component-loader.factory';
import { PositioningService } from '../utils/positioning/positioning.service';
import { PopoverConfig } from './popover.config';
import { PopoverDirective } from './popover.directive';
import { PopoverContainerComponent } from './popover-container.component';

@NgModule({
    imports: [CommonModule],
    declarations: [PopoverDirective, PopoverContainerComponent],
    exports: [PopoverDirective]
})
export class PopoverModule {
  public static forRoot(): ModuleWithProviders<PopoverModule> {
    return {
      ngModule: PopoverModule,
      providers: [PopoverConfig, ComponentLoaderFactory, PositioningService],
    };
  }
}
