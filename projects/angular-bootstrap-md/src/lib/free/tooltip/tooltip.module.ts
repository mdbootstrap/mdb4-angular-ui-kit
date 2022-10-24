import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { TooltipContainerComponent } from './tooltip.component';
import { TooltipDirective } from './tooltip.directive';
import { TooltipConfig } from './tooltip.service';
import { ComponentLoaderFactory } from '../utils/component-loader/component-loader.factory';
import { PositioningService } from '../utils/positioning/positioning.service';

@NgModule({
    imports: [CommonModule],
    declarations: [TooltipDirective, TooltipContainerComponent],
    exports: [TooltipDirective]
})
export class TooltipModule {
  public static forRoot(): ModuleWithProviders<TooltipModule> {
    return {
      ngModule: TooltipModule,
      providers: [TooltipConfig, ComponentLoaderFactory, PositioningService],
    };
  }
}
