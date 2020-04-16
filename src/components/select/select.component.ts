import {Component, ChangeDetectionStrategy, FactoryProvider, Input, Inject, ChangeDetectorRef, Optional, Type, AfterViewInit, OnInit, ContentChildren, QueryList, EventEmitter, forwardRef, resolveForwardRef, ElementRef, OnChanges, SimpleChanges, Attribute, OnDestroy, TemplateRef, ContentChild, ComponentFactoryResolver, ApplicationRef, Injector, EmbeddedViewRef, ComponentRef, ClassProvider} from "@angular/core";
import {extend, nameof, isBoolean, isPresent, isString} from "@jscrpt/common";
import {BehaviorSubject, Observable, Subscription} from "rxjs";

import {NgSelectOptions, NgSelectPlugin, PluginDescription, NormalizeFunc, NgSelectPluginTypes} from "../../misc";
import {NG_SELECT_OPTIONS, KEYBOARD_HANDLER_TYPE, NORMAL_STATE_TYPE, POPUP_TYPE, POSITIONER_TYPE, READONLY_STATE_TYPE, VALUE_HANDLER_TYPE, LIVE_SEARCH_TYPE} from "../../misc/types";
import {NgSelect, NgSelectPluginInstances, NgSelectAction, NgSelectFunction} from "./select.interface";
import {NG_SELECT_PLUGIN_INSTANCES} from "./types";
import {KeyboardHandler} from "../../plugins/keyboardHandler";
import {BasicKeyboardHandlerComponent} from "../../plugins/keyboardHandler/components";
import {KEYBOARD_HANDLER} from "../../plugins/keyboardHandler/types";
import {NormalState, NormalStateContext} from "../../plugins/normalState";
import {NORMAL_STATE} from "../../plugins/normalState/types";
import {BasicNormalStateComponent} from "../../plugins/normalState/components";
import {Popup, PopupContext} from "../../plugins/popup";
import {POPUP} from "../../plugins/popup/types";
import {BasicPopupComponent} from "../../plugins/popup/component";
import {Positioner} from "../../plugins/positioner";
import {POSITIONER} from "../../plugins/positioner/types";
import {BasicPositionerComponent} from "../../plugins/positioner/components";
import {ReadonlyState} from "../../plugins/readonlyState";
import {READONLY_STATE} from "../../plugins/readonlyState/types";
import {ValueHandler} from "../../plugins/valueHandler";
import {VALUE_HANDLER} from "../../plugins/valueHandler/types";
import {BasicValueHandlerComponent} from "../../plugins/valueHandler/components";
import {LiveSearch} from "../../plugins/liveSearch";
import {LIVE_SEARCH} from "../../plugins/liveSearch/types";
import {NoLiveSearchComponent} from "../../plugins/liveSearch/components";
import {NgSelectOption, NgSelectOptGroup} from "../option";
import {OptionComponent} from "../option/option.component";
import {OptGroupComponent} from "../option/optgroup.component";
import {PluginBus} from '../../misc/pluginBus/pluginBus';
import {PluginBusEvents} from '../../misc/pluginBus/pluginBus.interface';

//TODO - dynamic change of absolute popup
//TODO - dynamic change of options gatherer destroy called properly ?

/**
 * Default 'NgSelectOptions'
 * @internal
 */
const defaultOptions: NgSelectOptions =
{
    autoInitialize: true,
    absolute: false,
    forceValueCheckOnInit: false,
    multiple: false,
    readonly: false,
    valueComparer: (source, target) =>
    {
        return source == target;
    },
    liveSearchFilter: (query: string, normalizer: NormalizeFunc = value => value) =>
    {
        return itm => normalizer(itm.text).indexOf(normalizer(query)) >= 0;
    },
    normalizer: value =>
    {
        if(isString(value))
        {
            return value.toLowerCase();
        }

        return value;
    },
    cssClasses:
    {
    },
    plugins:
    {
        normalState: <PluginDescription<BasicNormalStateComponent>>
        {
            type: forwardRef(() => BasicNormalStateComponent)
        },
        liveSearch: <PluginDescription<NoLiveSearchComponent>>
        {
            type: forwardRef(() => NoLiveSearchComponent)
        },
        popup: <PluginDescription<BasicPopupComponent>>
        {
            type: forwardRef(() => BasicPopupComponent)
        },
        positioner: <PluginDescription<BasicPositionerComponent>>
        {
            type: forwardRef(() => BasicPositionerComponent)
        },
        keyboardHandler: <PluginDescription<BasicKeyboardHandlerComponent>>
        {
            type: forwardRef(() => BasicKeyboardHandlerComponent)
        },
        readonlyState: <PluginDescription<ReadonlyState>>
        {
            type: forwardRef(() => BasicNormalStateComponent)
        },
        valueHandler: <PluginDescription<BasicValueHandlerComponent>>
        {
            type: forwardRef(() => BasicValueHandlerComponent)
        }
    }
};

/**
 * NgSelect plugin instances factory method
 * @internal
 */
export function ngSelectPluginInstancesFactory()
{
    return {};
}

/**
 * Component that represents NgSelect itself, allows selection of value from options
 */
@Component(
{
    selector: 'ng-select',
    templateUrl: 'select.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers:
    [
        <FactoryProvider>
        {
            provide: NG_SELECT_PLUGIN_INSTANCES,
            useFactory: ngSelectPluginInstancesFactory
        },
        <ClassProvider>
        {
            provide: PluginBus,
            useClass: PluginBus
        }
    ],
    styles: [
        `:host
        {
            display: block;
            position: relative;
        }`
    ]
})
export class NgSelectComponent<TValue = any> implements NgSelect<TValue>, OnChanges, OnInit, AfterViewInit, OnDestroy
{
    //######################### protected fields #########################

    /**
     * NgSelect options
     */
    protected _selectOptions: NgSelectOptions<TValue>;

    /**
     * Subject used for indication that NgSelect was initialized
     */
    protected _initializedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    /**
     * Occurs when array of provided options has changed
     */
    protected _optionsChange: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Occurs when array of visible, displayed options has changed
     */
    protected _availableOptionsChange: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Array of available options to be displayed
     */
    protected _availableOptions: NgSelectOption<TValue>[] = [];

    /**
     * Live search plugin currently used in NgSelect
     */
    protected _liveSearch: LiveSearch;

    /**
     * Subscription for changes of live search value
     */
    protected _searchValueChangeSubscription: Subscription;

    /**
     * Instance of component ref for absolute popup
     */
    protected _absolutePopup: ComponentRef<Popup>;

    //######################### public properties - inputs #########################

    /**
     * Gets or sets NgSelect options
     */
    @Input()
    public get selectOptions(): NgSelectOptions<TValue>
    {
        return this._selectOptions;
    }
    public set selectOptions(options: NgSelectOptions<TValue>)
    {
        this._selectOptions = extend(true, this._selectOptions, options);
        this._pluginBus.selectOptions = this._selectOptions;
    }

    /**
     * Indication whether should be NgSelect disabled or not
     */
    @Input()
    public disabled: boolean;

    /**
     * Indication whether should be NgSelect readonly or not
     */
    @Input()
    public readonly: boolean;

    //######################### public properties - implementation of NgSelect #########################

    /**
     * Occurs every time when NgSelect is initialized or reinitialized, if value is false NgSelect was not initialized yet
     */
    public get initialized(): Observable<boolean>
    {
        return this._initializedSubject.asObservable();
    }

    /**
     * Gets current state of initialization
     */
    public isInitialized: boolean = false;

    //######################### public properties - implementation of TemplateGatherer #########################

    /**
     * Template used within normal state
     * @internal
     */
    @ContentChild('normalStateTemplate')
    public normalStateTemplate: TemplateRef<NormalStateContext>;

    /**
     * Template that is used within Popup as option
     * @internal
     */
    @ContentChild('optionTemplate')
    public optionTemplate?: TemplateRef<PopupContext>;

    //######################### public properties - implementation of OptionsGatherer #########################

    /**
     * Array of provided options for select
     * @internal
     */
    public get options(): NgSelectOption<TValue>[]
    {
        return this.optionsChildren.toArray();
    }

    /**
     * Occurs when array of provided options has changed
     * @internal
     */
    public get optionsChange(): EventEmitter<void>
    {
        return this._optionsChange;
    }

    /**
     * Array of visible, displayed options for select
     * @internal
     */
    public get availableOptions(): NgSelectOption<TValue>[]
    {
        return this._availableOptions;
    }

    /**
     * Occurs when array of visible, displayed options has changed
     * @internal
     */
    public get availableOptionsChange(): EventEmitter<void>
    {
        return this._availableOptionsChange;
    }

    /**
     * NgSelect plugin instances available for gatherer
     * @internal
     */
    public ngSelectPlugins: NgSelectPluginInstances;

    /**
     * Plugin bus used for inter plugin shared events
     * @internal
     */
    public pluginBus: PluginBus<TValue>;

    /**
     * Select element that implements default gatherers
     * @internal
     */
    public select: NgSelect<TValue>;

    //######################### public properties - template bindings #########################

    /**
     * Element used for live search
     * @internal
     */
    public liveSearchElement: HTMLElement[][];

    //######################### public properties - children #########################

    /**
     * Options children found inside ng-select
     * @internal
     */
    @ContentChildren(OptionComponent)
    public optionsChildren: QueryList<NgSelectOption>;

    //######################### public properties - children #########################

    /**
     * Options groups children found inside ng-select
     * @internal
     */
    @ContentChildren(OptGroupComponent)
    public optGroupsChildren: QueryList<NgSelectOptGroup>;

    //######################### constructors #########################
    constructor(protected _changeDetector: ChangeDetectorRef,
                protected _element: ElementRef<HTMLElement>,
                protected _componentFactoryResolver: ComponentFactoryResolver,
                protected _appRef: ApplicationRef,
                protected _injector: Injector,
                protected _pluginBus: PluginBus<TValue>,
                @Inject(NG_SELECT_PLUGIN_INSTANCES) protected _pluginInstances: NgSelectPluginInstances,
                @Inject(NG_SELECT_OPTIONS) @Optional() options?: NgSelectOptions<TValue>,
                @Inject(NORMAL_STATE_TYPE) @Optional() normalStateType?: Type<NormalState>,
                @Inject(KEYBOARD_HANDLER_TYPE) @Optional() keyboardHandlerType?: Type<KeyboardHandler>,
                @Inject(POPUP_TYPE) @Optional() popupType?: Type<Popup>,
                @Inject(POSITIONER_TYPE) @Optional() positionerType?: Type<Positioner>,
                @Inject(READONLY_STATE_TYPE) @Optional() readonlyStateType?: Type<ReadonlyState>,
                @Inject(VALUE_HANDLER_TYPE) @Optional() valueHandlerType?: Type<ValueHandler>,
                @Inject(LIVE_SEARCH_TYPE) @Optional() liveSearchType?: Type<LiveSearch>,
                @Attribute('readonly') readonly?: string,
                @Attribute('disabled') disabled?: string,
                @Attribute('multiple') multiple?: string)
    {
        //at least on of following is present (value is not important)
        let readonlyDefault = isPresent(readonly) || isPresent(disabled);
        let multipleDefault = isPresent(multiple);
        let opts: NgSelectOptions<TValue> = extend(true, {}, options);

        if(!opts.plugins)
        {
            opts.plugins = {};
        }

        if(keyboardHandlerType)
        {
            if(!opts.plugins.keyboardHandler)
            {
                opts.plugins.keyboardHandler = {};
            }

            opts.plugins.keyboardHandler.type = keyboardHandlerType;
        }

        if(normalStateType)
        {
            if(!opts.plugins.normalState)
            {
                opts.plugins.normalState = {};
            }

            opts.plugins.normalState.type = normalStateType;
        }

        if(popupType)
        {
            if(!opts.plugins.popup)
            {
                opts.plugins.popup = {};
            }

            opts.plugins.popup.type = popupType;
        }

        if(positionerType)
        {
            if(!opts.plugins.positioner)
            {
                opts.plugins.positioner = {};
            }

            opts.plugins.positioner.type = positionerType;
        }

        if(readonlyStateType)
        {
            if(!opts.plugins.readonlyState)
            {
                opts.plugins.readonlyState = {};
            }

            opts.plugins.readonlyState.type = readonlyStateType;
        }

        if(valueHandlerType)
        {
            if(!opts.plugins.valueHandler)
            {
                opts.plugins.valueHandler = {};
            }

            opts.plugins.valueHandler.type = valueHandlerType;
        }

        if(liveSearchType)
        {
            if(!opts.plugins.liveSearch)
            {
                opts.plugins.liveSearch = {};
            }

            opts.plugins.liveSearch.type = liveSearchType;
        }

        this._selectOptions = extend(true,
                                     <NgSelectOptions<TValue>>
                                     {
                                         optionsGatherer: this,
                                         templateGatherer: this,
                                     },
                                     defaultOptions,
                                     <NgSelectOptions<TValue>>
                                     {
                                         readonly: readonlyDefault,
                                         multiple: multipleDefault
                                     },
                                     opts);

        this._pluginBus.selectElement = this._element;
        this._pluginBus.selectOptions = this._selectOptions;
    }

    //######################### public methods - implementation of OnChanges #########################

    /**
     * Called when input value changes
     */
    public ngOnChanges(changes: SimpleChanges): void
    {
        let updateReadonly = (state: boolean, firstChange: boolean) =>
        {
            //update options
            this.selectOptions.readonly = state;

            if(!firstChange)
            {
                this.initOptions();
                this.initialize();
            }
        };

        if(nameof<NgSelectComponent<TValue>>('disabled') in changes && isBoolean(this.disabled))
        {
            updateReadonly(this.disabled, changes[nameof<NgSelectComponent<TValue>>('disabled')].firstChange);
        }

        if(nameof<NgSelectComponent<TValue>>('readonly') in changes && isBoolean(this.readonly))
        {
            updateReadonly(this.readonly, changes[nameof<NgSelectComponent<TValue>>('readonly')].firstChange);
        }
    }

    //######################### public methods - implementation of OnInit #########################

    /**
     * Initialize component
     */
    public ngOnInit()
    {
        this.initOptions();
    }

    //######################### public methods - implementation of AfterViewInit #########################

    /**
     * Called when view was initialized
     */
    public ngAfterViewInit()
    {
        this._availableOptions = this.options;

        this.optionsChildren.changes.subscribe(() =>
        {
            this._availableOptions = this.options;
            this._optionsChange.emit();
            this._availableOptionsChange.emit();
        });
        
        if(this.selectOptions.absolute)
        {
            this._appendPopupToBody(this._selectOptions.plugins.popup.type);
        }

        if(this._selectOptions.autoInitialize)
        {
            this.initialize();
        }
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        this._searchValueChangeSubscription?.unsubscribe();
        this._searchValueChangeSubscription = null;

        this.selectOptions.optionsGatherer?.destroyGatherer();

        this._destroyAbsolutePopup();
    }

    //######################### public methods - implementation of OptionsGatherer #########################

    /**
     * Initialize gatherer during initialization phase
     * @internal
     */
    public initializeGatherer(): void
    {
        let liveSearch = this._pluginInstances[LIVE_SEARCH] as LiveSearch;

        if(this._liveSearch && this._liveSearch != liveSearch)
        {
            this._searchValueChangeSubscription.unsubscribe();
            this._searchValueChangeSubscription = null;

            this._liveSearch = null;
        }

        if(!this._liveSearch)
        {
            this._liveSearch = liveSearch;

            this._searchValueChangeSubscription = this._liveSearch.searchValueChange.subscribe(() =>
            {
                if(!this._liveSearch.searchValue)
                {
                    this._availableOptions = this.options;
                    this._availableOptionsChange.emit();

                    return;
                }

                this._availableOptions = this.options.filter(this.selectOptions.liveSearchFilter(this._liveSearch.searchValue, this.selectOptions.normalizer));
                this._availableOptionsChange.emit();
            });
        }
    }

    /**
     * Called when gatherer needs to be destroyed
     * @internal
     */
    public destroyGatherer(): void
    {
    }

    //######################### public methods - template bindings #########################

    /**
     * Sets normal state component
     * @param normalState - Created normal state that is rendered
     * @internal
     */
    public setNormalStateComponent(normalState: NormalState)
    {
        this._registerNewPlugin(normalState, NORMAL_STATE, 'normalState');
    }

    /**
     * Sets keyboard handler component
     * @param keyboardHandler - Created keyboard handler that is rendered
     * @internal
     */
    public setKeyboardHandlerComponent(keyboardHandler: KeyboardHandler)
    {
        this._registerNewPlugin(keyboardHandler, KEYBOARD_HANDLER, 'keyboardHandler');
    }

    /**
     * Sets popup component
     * @param popup - Created popup that is rendered
     * @internal
     */
    public setPopupComponent(popup: Popup)
    {
        this._registerNewPlugin(popup, POPUP, 'popup');
    }

    /**
     * Sets positioner component
     * @param positioner - Created positioner that is rendered
     * @internal
     */
    public setPositionerComponent(positioner: Positioner)
    {
        this._registerNewPlugin(positioner, POSITIONER, 'positioner');
    }

    /**
     * Sets readonly state component
     * @param readonlyState - Created readonly state that is rendered
     * @internal
     */
    public setReadonlyStateComponent(readonlyState: ReadonlyState)
    {
        this._registerNewPlugin(readonlyState, READONLY_STATE, 'readonlyState');
    }

    /**
     * Sets value handler component
     * @param valueHandler - Created value handler that is rendered
     * @internal
     */
    public setValueHandlerComponent(valueHandler: ValueHandler<TValue>)
    {
        this._registerNewPlugin(valueHandler, VALUE_HANDLER, 'valueHandler');
    }

    /**
     * Sets live search component
     * @param liveSearch - Created live search that is rendered
     * @internal
     */
    public setLiveSearchComponent(liveSearch: LiveSearch)
    {
        this._registerNewPlugin(liveSearch, LIVE_SEARCH, 'liveSearch');
    }

    //######################### public methods #########################

    /**
     * Initialize component, automatically called once if not blocked by options
     */
    public initialize()
    {
        let liveSearchPlugin = this._pluginInstances[LIVE_SEARCH] as LiveSearch;
        this.liveSearchElement = [[liveSearchPlugin.liveSearchElement]];
        this._changeDetector.detectChanges();
        
        this.selectOptions.optionsGatherer.initializeGatherer();

        this._pluginInstances[LIVE_SEARCH].initialize();
        this._pluginInstances[KEYBOARD_HANDLER].initialize();
        this._pluginInstances[VALUE_HANDLER].initialize();
        this._pluginInstances[NORMAL_STATE]?.initialize();
        this._pluginInstances[READONLY_STATE]?.initialize();
        this._pluginInstances[POPUP].initialize();
        this._pluginInstances[POSITIONER].initialize();

        this.isInitialized = true;
        this._initializedSubject.next(true);
    }

    /**
     * Initialize options, automaticaly called during init phase, but can be used to reinitialize NgSelectOptions
     */
    public initOptions()
    {
        this.selectOptions.optionsGatherer.ngSelectPlugins = this._pluginInstances;
        this.selectOptions.optionsGatherer.pluginBus = this._pluginBus;
        this.selectOptions.optionsGatherer.select = this;

        let initOptionsPlugin = (pluginKey: string, pluginName: keyof NgSelectPluginTypes) =>
        {
            if(this._selectOptions.plugins[pluginName])
            {
                this._selectOptions.plugins[pluginName].type = resolveForwardRef(this._selectOptions.plugins[pluginName].type);

                if(this._pluginInstances[pluginKey])
                {
                    if(this._selectOptions.plugins && this._selectOptions.plugins[pluginName] && this._selectOptions.plugins[pluginName].options)
                    {
                        this._pluginInstances[pluginKey].options = this._selectOptions.plugins[pluginName].options;
                    }

                    this._pluginInstances[pluginKey].initOptions();
                }
            }
        }

        if(this._selectOptions.plugins)
        {
            initOptionsPlugin(NORMAL_STATE, 'normalState');
            initOptionsPlugin(KEYBOARD_HANDLER, 'keyboardHandler');
            initOptionsPlugin(POPUP, 'popup');
            initOptionsPlugin(POSITIONER, 'positioner');
            initOptionsPlugin(READONLY_STATE, 'readonlyState');
            initOptionsPlugin(VALUE_HANDLER, 'valueHandler');
            initOptionsPlugin(LIVE_SEARCH, 'liveSearch');
        }
    }

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    public invalidateVisuals(): void
    {
        this._changeDetector.detectChanges();
    }

    /**
     * Gets instance of plugin by its id
     * @param pluginId - Id of plugin, use constants
     */
    public getPlugin<PluginType extends NgSelectPlugin>(pluginId: string): PluginType
    {
        return this._pluginInstances[pluginId] as PluginType;
    }

    /**
     * Subscribes for event
     * @param eventName - Name of event that should be listened to
     * @param handler - Function used for handling event
     */
    public listenTo<TParam = void>(eventName: keyof PluginBusEvents, handler: (data: TParam) => void): Subscription
    {
        return this._pluginBus[eventName].subscribe(handler);
    }

    /**
     * Executes actions on NgSelect
     * @param actions - Array of actions that are executed over NgSelect
     */
    public execute(...actions: NgSelectAction<TValue>[])
    {
        if(!actions)
        {
            return;
        }

        actions.forEach(action => action(this));
    }

    /**
     * Executes function on NgSelect and returns result
     * @param func - Function that is executed and its result is returned
     */
    public executeAndReturn<TResult>(func: NgSelectFunction<TResult, TValue>): TResult
    {
        if(!func)
        {
            return null;
        }

        return func(this);
    }

    //######################### protected methods #########################

    /**
     * Appends popup component directly to body, allows absolute positioning over page body
     * @param component - Popup component type to be appended
     */
    protected _appendPopupToBody(component: Type<Popup>) 
    {
        // 0. Destroyes absolute popup if it exists
        this._destroyAbsolutePopup();

        if(!component)
        {
            return;
        }

        // 1. Create a component reference from the component 
        this._absolutePopup = this._componentFactoryResolver
            .resolveComponentFactory(component)
            .create(this._injector);
        
        // 2. Attach component to the appRef so that it's inside the ng component tree
        this._appRef.attachView(this._absolutePopup.hostView);
        
        // 3. Get DOM element from component
        const domElem = (this._absolutePopup.hostView as EmbeddedViewRef<any>)
            .rootNodes[0] as HTMLElement;
        
        // 4. Append DOM element to the body
        document.body.appendChild(domElem);

        this.setPopupComponent(this._absolutePopup.instance);
    }

    /**
     * Destroyes absolute popup if it exists
     */
    protected _destroyAbsolutePopup()
    {
        if(this._absolutePopup)
        {
            this._appRef.detachView(this._absolutePopup.hostView);
            this._absolutePopup.destroy();
            this._absolutePopup = null;
        }
    }

    /**
     * Registers newly created plugin
     * @param plugin - Plugin to be registered
     * @param pluginKey - Key of plugin used for pluginInstances
     * @param pluginName - Name property for plugin from options
     */
    protected _registerNewPlugin(plugin: NgSelectPlugin, pluginKey: string, pluginName: keyof NgSelectPluginTypes)
    {
        if(!plugin)
        {
            this._pluginInstances[pluginKey] = null;

            return;
        }

        this._pluginInstances[pluginKey] = plugin;

        if(this._selectOptions.plugins && this._selectOptions.plugins[pluginName] && this._selectOptions.plugins[pluginName].options)
        {
            plugin.options = this._selectOptions.plugins[pluginName].options;
        }

        plugin.initOptions();

        if(this._selectOptions.plugins && this._selectOptions.plugins[pluginName] && this._selectOptions.plugins[pluginName].instanceCallback)
        {
            this._selectOptions.plugins[pluginName].instanceCallback(plugin);
        }
    }
}