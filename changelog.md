# Changelog

## Version 9.0.0 (2020-04-16)

### Bug Fixes

- fixed removing of html element for absolute `popup` plugin

### Features

- added new module `NgSelectEditModule` which contains components for displaying select with editation and tags
- added new component `EditLiveSearchComponent` which allows is used within `EditNormalStateComponent` for editing and displaying selected value
- added new component `EditNormalStateComponent` which uses `EditLiveSearchComponent` for editing and displaying selected value
- added new component `EditPopupComponent` which is used for editing and displaying selected value
- added new component `EditKeyboardHandlerComponent` which is used handling keyboard events in edit select
- added new directive `NgSelectEditDirective` which configures `NgSelect` to use edit plugin components
- added new option for select, `normalizer` which is function which allows normalization of value before using it in search
- `optionsGatherer` extended with `select` containing select instance itself
- `PluginBus` extended with `liveSearchFocus` used for emitting event that should set focus on live search input

### BREAKING CHANGES

- `valueHandler` plugin does not handle `popup` plugin visibility change anymore
- `popup` plugin now has *text* for displaying text when no results *available options*
- base `PopupAbstractComponent` class requires `StringLocalization` service as constructor parameter

## Version 8.0.0 (2020-04-14)

### Features

- all generic types are now optional, all defaults to `any`
- added new method `listenTo` to `NgSelect` allowing subscribing to select events
- added `PluginBus` which serves serves as bus for shared events also shared select options and gatherers
   - `selectOptions`, only relevant options
   - `selectElement`, element representing root html select element
   - `togglePopup`, handles popup visibility toggling
   - `showHidePopup`, handles changing visibility of popup
   - `optionSelect`, handles option selection
   - `optionCancel`, handles options cancelation
   - `focus`, hanles gaining focus
- added new extension method `patchOptions` which allows changing options without running initialization
- `optionsGatherer` extended with `pluginBus`
- added `NormalStateAbstractComponent` for easier implementation of new `normalState` plugin
- added `PopupAbstractComponent` for easier implementation of new `popup` plugin
- added `DialogPopupDirective` allowing changing popup to dialog using directive

### BREAKING CHANGES

- all plugins now have to have `pluginBus`
- `KeyboardHandler` plugin removed `selectElement`, `optionsGatherer`, `popupVisibilityRequest`, `optionSelect` properties, use new `PluginBus` instead
- `NormalState` plugin removed `templateGatherer`, `click`, `focus`, `cancelOption`, `readonly` properties, use new `PluginBus` instead
- `Positioner` plugin removed `selectElement`, `optionsGatherer` properties, use new `PluginBus` instead
- `Popup` plugin removed `multiple`, `optionsGatherer`, `templateGatherer`, `selectElement`, `optionClick` properties, use new `PluginBus` instead
- `ValueHandler` plugin removed `multiple`, `optionsGatherer`, `valueComparer`, `liveSearchFilter`, `normalizer`, `popupVisibilityRequest` properties, use new `PluginBus` instead
- *subpackage* `@anglr/select/material` 
   - completely changed types for `DialogPopup`
   - renamed `DialogPopupModule` to `NgSelectDialogPopupModule`

## Version 7.2.0

- *subpackage* `@anglr/select/material` 
   - added new `DialogPopupModule` that allows usage of *DialogPopupComponent*
   - added new `DialogPopupComponent` as `Popup` plugin (using angular cdk dialog)
- added new `NoPositionerComponent` as `Positioner` plugin
- fixed canceling value for `ValueHandlerBase` for multi value

## Version 7.1.0

- updated `BasicPositionerComponent`, logic for positioning moved to `@anglr/common/positions`

## Version 7.0.0

- updated to latest stable *Angular* 9
- added generating of API doc

## Version 6.2.1

 - fixed emitting of *same* value during initialization as form control change

## Version 6.2.0

- added support for *absolute popup* using `absolute` option for `NgSelectOptions`
- fixed emitting of `null` value for initialization of `BasicValueHandlerComponent` with lazy options
- added new options for select `forceValueCheckOnInit` which allows setting of real `ValueHandler` to `FormControl` on initialization
- fixed overflowing `NormalState` text over icon

## Version 6.1.1

- fixed *detect changes after view was destroyed* in `NormalStateComponent` when used in *ngIf*

## Version 6.1.0

- updated dependency on `@anglr/common` to at least version `6.4.0`
- plugin `TextsLocator` replaced with `StringLocalization` service from common

## Version 6.0.0

- initial version of new `NgSelectComponent`
- SSR support
- Angular IVY ready (APF compliant package)
- added support for ES2015 compilation
- Angular 8
- new `NgSelectComponent` is modular with support of several plugins
   - selectors for component are `ng-select`, `ng-option`, `ng-optgroup`
- supported plugins
   - `KeyboardHandler` plugin, allows handling of keyboard events
   - `LiveSearch` plugin, allows user to filter options
      - `NoLiveSearchComponent` used when there is no need for *live search*, default
      - `BasicLiveSearchComponent` used when you want basic live search input
   - `NormalState` plugin, represents normal state of `NgSelect` which you can see
   - `Popup` plugin, represents popup with options
   - `Positioner` plugin, allows positioning of `Popup`
   - `ReadonlyState` plugin, if specified allows special look of readonly, disabled state of `NgSelect`, defaults to readonly `NormalState`
   - `TextsLocator` plugin, used for obtaining texts that are displayed
   - `ValueHandler` plugin, represents internal state of value in `NgSelect` and handling of value changes
      - `BasicValueHandlerComponent` allows only values that exists in options, default
      - `DynamicValueHandlerComponent` allows any value, even values non existing in options, best used for dynamically loaded options
- `OptionsGatherer` used for obtaining options, defaults to `NgSelectComponent` itself, allows obtaining *options* as `ContentChildren`
   - `DynamicOptionsGatherer` used for obtaining options dynamically, best with combination of *live search*
   - `CodeOptionsGatherer` used for obtaining *static* options but directly from code, not from html template
- `TemplateGatherer` allows gathering custom templates, defaults to `NgSelect` using `ContentChild`
   - `optionTemplate` - template that allows changing look of option content
   - `normalStateTemplate` - template that allows changing look of normal state content
- `NgSelect` support *extensions* that can execute some code over `NgSelect` and its *plugins*
   - `getValue` extension allows obtaining of current value of `NgSelect`
   - `onFocus` extension allows registration of callback when `NgSelect` gains focus
   - `reinitializeOptions` extension allows reinitialization of `selectOptions`
   - `setReadonly` extension allows changing state of `NgSelect`, readonly or normal
   - `setValue` extension allows changing current value of `NgSelect`
   - `valueChange` extension allows registration of callback when `NgSelect` value changes