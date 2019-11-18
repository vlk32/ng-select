# Changelog

## Version 6.3.0

- added new module `NgSelectEditModule` which contains components for displaying select with editation and tags
- added new component `EditLiveSearchComponent` which allows is used within `EditNormalStateComponent` for editing and displaying selected value
- added new component `EditNormalStateComponent` which uses `EditLiveSearchComponent` for editing and displaying selected value
- added new component `EditPopupComponent` which is used for editing and displaying selected value
- added new directive `NgSelectEditDirective` which configures `NgSelect` to use edit plugin components
- added new option for select `normalizer` which is function which allows normalization of value before using it in search
- extended `ValueHandler` with new method `findAvailableOption` allowing search for option

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