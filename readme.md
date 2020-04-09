[![npm version](https://badge.fury.io/js/%40anglr%2Fselect.svg)](https://badge.fury.io/js/%40anglr%2Fselect)
[![Build status](https://ci.appveyor.com/api/projects/status/rib22utc0ap6vrxc?svg=true)](https://ci.appveyor.com/project/kukjevov/ng-select)

# Angular Select

- [API](https://ressurectit.github.io/#/content/api/ng-select/select)
- [API Extensions](https://ressurectit.github.io/#/content/api/ng-select-extensions/select-extensions)
- [Samples](https://ressurectit.github.io/#/content/select#samples)

This is very modular select component where every part can be replaced. Main component is using *plugins* (`KeyboardHandler`, `LiveSearch`, `NormalState`, `Popup`, `Positioner`, `ReadonlyState`, `ValueHandler`) for rendering select itself or just for handling certain events. Main component `NgSelectComponent` also implements `OptionsGatherer` and `TemplateGatherer`.

- `OptionsGatherer` - Used for obtaining options
- `TemplateGatherer` - Used for obtaining templates that can be used within plugins

#### Plugins

 - `KeyboardHandler`- This plugin is responsible for handling keyboard events within `Popup` and `NormalState`
 - `LiveSearch` - This plugin is responsible for rendering live search input
 - `NormalState` - This plugin is responsible for rendering of normal state for select, currently selected option(s), this is what you see when select is closed
 - `Popup` - This plugin is responsible for rendering of popup window, available options are visible when select is open
 - `Positioner` - This plugin is responsible for positioning of `Popup`
 - `ReadonlyState` - This plugin can be used for displaying custom readonly state if select is set as readonly or as disabled
 - `ValueHandler` - This plugin is responsible for handling selected value