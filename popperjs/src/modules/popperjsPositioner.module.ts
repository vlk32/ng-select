import {NgModule} from "@angular/core";

import {PopperJsPositionerComponent} from '../plugins/positioner/popperjs/popperjsPositioner.component';

/**
 * Module for popperjs positioner plugin
 */
@NgModule(
{
    declarations:
    [
        PopperJsPositionerComponent
    ],
    exports:
    [
        PopperJsPositionerComponent
    ]
})
export class PopperJsPositionerModule
{
}
