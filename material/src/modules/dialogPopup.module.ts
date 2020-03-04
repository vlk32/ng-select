import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatDialogModule} from "@angular/material/dialog";

import {BasicDialogPopupComponent} from "../components/basicDialogPopup/types";
import {DialogPopupComponent} from "../plugins/popup/dialog/dialogPopup.component";

/**
 * Module allows using of angular material dialog for metadata selector
 */
@NgModule(
{
    imports:
    [
        CommonModule,
        MatDialogModule
    ],
    declarations:
    [
        DialogPopupComponent,
        BasicDialogPopupComponent
    ],
    exports:
    [
        DialogPopupComponent,
        BasicDialogPopupComponent
    ]
})
export class DialogPopupModule
{
}