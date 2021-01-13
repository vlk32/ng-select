import {NgModule} from "@angular/core";

import {PopperJsPositionerComponent} from '../plugins/positioner/popperJs/popperJsPositioner.component';

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
