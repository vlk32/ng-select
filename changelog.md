# Changelog

## Version 10.0.0 (2020-08-10)

### Features

- added new option `flipCallback` for `BasicPositioner` plugin, which allows to execute when flip occurs
- added new option `scrollTarget` for `BasicPositioner` plugin, which allows to provided scroll target element
- added new option `activateOnScroll` for `BasicPositioner` plugin, which allows turning on and off watching for scroll event and changing position of popup, defaults to `true`
- added new option `activateOnResize` for `BasicPositioner` plugin, which allows turning on and off watching for resize event and changing position of popup, defaults to `true`
- added new `ScrollTargetSelector` service that is for obtaining scroll target

### BREAKING CHANGES

- minimal supported version of *Angular* is `10.0.0`
- minimal supported version of `@jscrpt/common` is `1.2.0`
- minimal supported version of `@anglr/common` is `8.0.0`
- `BasicPositionerComponent` has new parameter in constructor `ScrollTargetSelector`

## Version 9.1.3 (2020-07-09)

### Bug Fixes

- fixed `absolute` select `popup` plugin, now should correctly use `liveSearch` plugin
- fixed `NgSelectControlValueAccessor` now using `===` for comparison of multivalue and `valueComparer` for single value comparison when changing value

## Version 9.1.2 (2020-07-03)

### Bug Fixes

- fixed forgotten `console.trace` in code, removed
- fixed default `valueComparer`, now using `===` for correct comparison

## Version 9.1.1 (2020-06-26)

### Bug Fixes

- fixed problem with setting *select* as *readonly* or *disabled*, when `NormalState` plugin was completely removed from plugins

## Version 9.1.0 (2020-04-23)

### Bug Fixes

- fixed dynamic `DynamicOptionsGatherer` now correctly uses selected option text during initialization, if live search text is not present, to obtain available options
- fixed dynamic `DynamicOptionsGatherer` now keeps last available options for single value select if live search text has not changed
- fixed `EditLiveSearchComponent` now resets displayed value when `valueHandler.value` has changed
- fixed displaying of multi value in `EditNormalStateComponent` with `object` as value
- fixed `EditNormalStateComponent` canceling of selected value now updates displayed live search text
- fixed `DynamicValueHandlerComponent` multi value change now correctly changes instance of array

### Features

- added new `NgSelectAbsoluteDirective` directive that allows you to set select popup to absolute using `absolute` html attribute
- added new `NgSelectPlaceholderDirective` directive that allows you to set select live search placeholder text using `placeholder` html attribute
- added new `NgSelectHasValuePipe` pipe that allows you to test whether `valueHandler.selectedOptions` has any value selected
- `NgSelectValuePipe` extended with new optional parameter, which allows you to change displayed text of selected options
- `EditLiveSearchOptions` extended with new option `emptyCancel`, if set to true, empty live search cancels selected single select value
- `NormalStateOptions` extended with new option `optionDisplayText`, which allows you to set function callback used for obtaining display text for *normalState*

## Version 9.0.0 (2020-04-17)

### Bug Fixes

- fixed removing of html element for absolute `popup` plugin
- fixed `DynamicValueHandler` adding value to multi select

### Features

- added new module `NgSelectEditModule` which contains components for displaying select with editation and tags
- added new component `EditLiveSearchComponent` which allows is used within `EditNormalStateComponent` for editing and displaying selected value
- added new component `EditNormalStateComponent` which uses `EditLiveSearchComponent` for editing and displaying selected value
- added new component `EditPopupComponent` which is used for editing and displaying selected value
- added new component `EditKeyboardHandlerComponent` which is used handling keyboard events in edit select
- added new directive `NgSelectEditDirective` which configures `NgSelect` to use edit plugin components
- added new `ExcludingOptionsGatherer` which allows removal of selected options from available options, extends built in options gatherer
- added new option for select, `normalizer` which is function which allows normalization of value before using it in search
- `optionsGatherer` extended with `select` containing select instance itself
- `PluginBus` extended with `liveSearchFocus` used for emitting event that should set focus on live search input
- `PluginBus` extended with `updateDisplayedValue` used for emitting event that should update displayed value if needed

### BREAKING CHANGES

- `valueHandler` plugin does not handle `popup` plugin visibility change anymore
- `popup` plugin now has *text* for displaying text when no results *available options*
- base `PopupAbstractComponent` class requires `StringLocalization` service as constructor parameter
- `CodeOptionsGatherer` constructor does not accept `Normalizer` and `LiveSearch`, they are used from selection options

## Version 8.0.0 (2020-04-14)

### Bug fixes

- fixed canceling value for `ValueHandlerBase` for multi value

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
- added new `NoPositionerComponent` as `Positioner` plugin
- *subpackage* `@anglr/select/material`
   - added new `DialogPopupModule` that allows usage of *DialogPopupComponent*
   - added new `DialogPopupComponent` as `Popup` plugin (using angular cdk dialog)

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