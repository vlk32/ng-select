import {CommonModule} from '@angular/common';
import {NgModule} from "@angular/core";
import {ScrollingModule} from '@angular/cdk/scrolling';

import {VirtualEditPopupComponent} from '../plugins/popup/virtualEdit/virtualEditPopup.component';

/**
 * Module for VirtualEditPopup components, can also by used for non edit version
 */
@NgModule(
{
    imports:
    [
        CommonModule,
        ScrollingModule
    ],
    declarations:
    [
        VirtualEditPopupComponent
    ],
    exports:
    [
        VirtualEditPopupComponent
    ]
})
export class VirtualEditPopupModule
{
}
