import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgSelectEditDirective} from '../directives/ngSelectEdit/ngSelectEdit.directive';
import {EditNormalStateComponent} from '../plugins/normalState/edit/editNormalState.component';
import {EditLiveSearchComponent} from '../plugins/liveSearch/edit/editLiveSearch.component';
import {NgSelectModule} from './ngSelect.module';

/**
 * Module for select with editation and tags (jira like select)
 */
@NgModule(
{
    imports:
    [
        CommonModule,
        NgSelectModule
    ],
    declarations:
    [
        NgSelectEditDirective,
        EditNormalStateComponent,
        EditLiveSearchComponent
    ],
    exports:
    [
        NgSelectEditDirective,
        EditNormalStateComponent,
        EditLiveSearchComponent
    ],
    entryComponents:
    [
        EditNormalStateComponent,
        EditLiveSearchComponent
    ]
})
export class NgSelectEditModule
{
}