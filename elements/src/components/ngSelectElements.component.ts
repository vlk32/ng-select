import {Component, ChangeDetectionStrategy, FactoryProvider, Input, ChangeDetectorRef, ElementRef, Inject, Attribute} from "@angular/core";
import {isString} from '@jscrpt/common';
import {NgSelectComponent, NG_SELECT_PLUGIN_INSTANCES, ngSelectPluginInstancesFactory, NgSelectOptions, NgSelectAction, NgSelectFunction, NgSelectPluginInstances, NgSelectPlugin, CodeOptionsGatherer, NgSelectOption} from "@anglr/select";
import {Observable} from "rxjs";

import {NgSelectWebComponent} from "./ngSelectElements.interface";

const NG_OPTION = "NG-OPTION";

/**
 * Component that represents WebComponent implementation of NgSelect
 */
@Component(
{
    selector: 'ng-select-web-component',
    templateUrl: 'ngSelectElements.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers:
    [
        <FactoryProvider>
        {
            provide: NG_SELECT_PLUGIN_INSTANCES,
            useFactory: ngSelectPluginInstancesFactory
        }
    ],
    styles:
    [
        `:host
        {
            display: block;
            position: relative;
        }`
    ]
})
export class NgSelectElementsComponent<TValue> extends NgSelectComponent<TValue> implements NgSelectWebComponent<TValue>
{
    //######################### protected fields #########################

    /**
     * Mutation observer, that observes ng-options
     */
    protected _optionsObserver: MutationObserver;

    /**
     * Options gatherer used for NgSelect WebComponent
     */
    protected _codeOptionsGatherer: CodeOptionsGatherer<TValue> = new CodeOptionsGatherer<TValue>();

    //######################### public properties #########################

    /**
     * Occurs every time when NgSelect is initialized or reinitialized, if value is false NgSelect was not initialized yet
     */
    @Input()
    public get initializedWC(): Observable<boolean>
    {
        return this.initialized;
    }

    /**
     * Gets current state of initialization
     */
    @Input()
    public get isInitializedWC(): boolean
    {
        return this.isInitialized;
    }

    /**
     * Gets or sets NgSelect options
     */
    @Input('selectOptions')
    public set selectOptionsWC(options: NgSelectOptions<TValue>)
    {
        if(isString(options))
        {
            try
            {
                options = JSON.parse(options);
            }
            catch(e)
            {
                console.log(e);

                options = {};
            }
        }

        this.selectOptions = options;
    }
    public get selectOptionsWC(): NgSelectOptions<TValue>
    {
        return this.selectOptions;
    }

    //######################### constructors #########################
    constructor(changeDetector: ChangeDetectorRef,
                element: ElementRef<HTMLElement>,
                @Inject(NG_SELECT_PLUGIN_INSTANCES) protected pluginInstances: NgSelectPluginInstances,
                @Attribute('readonly') readonly?: string,
                @Attribute('disabled') disabled?: string,
                @Attribute('multiple') multiple?: string)
    {
        super(changeDetector, element, pluginInstances, null, null, null, null, null, null, null, null, readonly, disabled, multiple);

        this._selectOptions.optionsGatherer = this._codeOptionsGatherer;

        this._optionsObserver = new MutationObserver(mutationsList =>
        {
            let added: boolean = false;
            let removed: boolean = false;

            mutationsList.forEach(itm => 
            {
                itm.addedNodes.forEach(node =>
                {
                    if(node.nodeName == NG_OPTION)
                    {
                        added = true;
                    }
                });

                itm.removedNodes.forEach(node =>
                {
                    if(node.nodeName == NG_OPTION)
                    {
                        removed = true;
                    }
                });

                if(added || removed)
                {
                    let options: NgSelectOption<TValue>[] = [];

                    for(let x = 0; x < element.nativeElement.children.length; x++)
                    {
                        let itm = element.nativeElement.children.item(x) as NgSelectOption<TValue> & HTMLElement;

                        if(itm.nodeName == NG_OPTION)
                        {
                            options.push(itm);
                        }
                    }

                    this._codeOptionsGatherer.options = options;
                    this._codeOptionsGatherer.optionsChange.emit();
                    this._codeOptionsGatherer.availableOptionsChange.emit();
                }
            });
        });

        this._optionsObserver.observe(element.nativeElement,
                                      {
                                          childList: true
                                      });
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        if(this._optionsObserver)
        {
            this._optionsObserver.disconnect();
            this._optionsObserver = null;
        }

        super.ngOnDestroy();
    }

    //######################### public methods #########################

    /**
     * Initialize component, automatically called once if not blocked by options
     */
    @Input()
    public initializeWC = () => this.initialize();

    /**
     * Initialize options, automaticaly called during init phase, but can be used to reinitialize NgSelectOptions
     */
    @Input()
    public initOptionsWC = () => this.initOptions();

    /**
     * Gets instance of plugin by its id
     * @param pluginId Id of plugin, use constants
     */
    @Input()
    public getPluginWC = <PluginType extends NgSelectPlugin>(pluginId: string): PluginType => this.getPlugin(pluginId);

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    @Input()
    public invalidateVisualsWC = (): void => this.invalidateVisuals();

    /**
     * Executes actions on NgSelect
     * @param actions Array of actions that are executed over NgSelect
     */
    @Input()
    public executeWC = (...actions: NgSelectAction<TValue>[]) => this.execute(...actions);

    /**
     * Executes function on NgSelect and returns result
     * @param func Function that is executed and its result is returned
     */
    @Input()
    public executeAndReturnWC = <TResult>(func: NgSelectFunction<TResult, TValue>): TResult => this.executeAndReturn(func);
}