import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CommonModule as NgCommonModule} from '@anglr/common';
import {NgSelectElementsComponent} from './ngSelect.component';
import {NgSelectModule} from '../select';


@NgModule(
{
    imports:
    [
        CommonModule,
        NgCommonModule,
        NgSelectModule
    ],
    declarations:
    [
        NgSelectElementsComponent
    ]
})
export class NgSelectElementsModule
{
}