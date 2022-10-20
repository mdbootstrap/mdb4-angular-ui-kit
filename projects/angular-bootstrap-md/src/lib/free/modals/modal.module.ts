import { NgModule, ModuleWithProviders, NO_ERRORS_SCHEMA } from '@angular/core';

import { ModalBackdropComponent } from './modalBackdrop.component';
import { ModalDirective } from './modal.directive';
import { PositioningService } from '../utils/positioning/positioning.service';
import { ComponentLoaderFactory } from '../utils/component-loader/component-loader.factory';
import { ModalContainerComponent } from './modalContainer.component';
import { MDBModalService } from './modal.service';
import { A11yModule } from '@angular/cdk/a11y';

@NgModule({
    declarations: [ModalBackdropComponent, ModalDirective, ModalContainerComponent],
    imports: [A11yModule],
    exports: [ModalBackdropComponent, ModalDirective],
    schemas: [NO_ERRORS_SCHEMA]
})
export class ModalModule {
  public static forRoot(): ModuleWithProviders<ModalModule> {
    return {
      ngModule: ModalModule,
      providers: [MDBModalService, ComponentLoaderFactory, PositioningService],
    };
  }
}
