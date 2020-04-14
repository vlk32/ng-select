import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatDialogModule} from "@angular/material/dialog";

import {BasicDialogPopupComponent} from "../components/basicDialogPopup/types";
import {DialogPopupComponent} from "../plugins/popup/dialog/dialogPopup.component";
import {DialogPopupDirective} from '../directives/types';

/**
 * Module allows using of angular material dialog for select popup
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
        BasicDialogPopupComponent,
        DialogPopupDirective
    ],
    exports:
    [
        DialogPopupComponent,
        BasicDialogPopupComponent,
        DialogPopupDirective
    ]
})
export class NgSelectDialogPopupModule
{
}