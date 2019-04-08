import {NgModule, DoBootstrap, Injector} from '@angular/core';
import {CommonModule} from '@angular/common';
import {createCustomElement} from '@angular/elements';
import {CommonModule as NgCommonModule} from '@anglr/common';
import {NgSelectModule} from '@anglr/select';

import {NgSelectElementsComponent} from '../components/ngSelectElements.component';

/**
 * Represents module for WebComponent NgSelect
 */
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
export class NgSelectElementsModule implements DoBootstrap
{
    //######################### constructor #########################
    constructor(injector: Injector) 
    {
        const ngSelect = createCustomElement(NgSelectElementsComponent, {injector});
        customElements.define('ng-select', ngSelect);
    }

    //######################### public methods - implementation of DoBootstrap #########################
    
    /**
     * Called during bootstrapping of module
     */
    public ngDoBootstrap()
    {
    }
}