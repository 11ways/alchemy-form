## 0.2.7 (WIP)

* If a `al-field` element is assigned a `Field` instance to its `config` property without a parent `schema` property, it will be stored in its `assigned_data` property
* Make sure string fields use the `text` input type instead of `string` in some cases
* Automatically add the `does-not-expand` css class to `al-toggle` element
* Improve `al-toggle` styling

## 0.2.6 (2023-06-17)

* Fix `al-field-schema` element not being able to get schema of an arrayable field
* Add `Pathway` system for faceted breadcrumbs
* Allow `al-select` to take in simple arrays as data
* Allow getting the current operator in a query builder entry

## 0.2.5 (2023-04-20)

* Add more configuration to `al-code-input`

## 0.2.4 (2023-02-26)

* Don't look for a field when the path is not specified
* Make `al-field-schema` elements use `Field#getSubSchema()` method
* Add an icon to the translatable-field entry buttons to see if it has a translation or not

## 0.2.3 (2023-02-11)

* Use `Scene#pushToHistory()` instead of directly calling `pushState`
* Select `display_field_select` fields when requesting related data
* Make local-filtering in `al-select` elements case insensitive
* Fix `al-select` never getting more than the first page in `getRemoteFetchConfig` method
* Add `hasOneParent` field support
* Make `FormApi#related()` action make sure fields exist before querying them
* Add a workaround so `al-select` actually refreshes elements when removing the search value

## 0.2.2 (2023-01-23)

* Fix `al-button`'s `activate` event not being cancelable
* Add `placeholder` support to the string field

## 0.2.1 (2022-12-23)

* Enable `al-form` model validation
* Don't throw an error when a `al-field` element has no field name configured
* Overwrite preloaded `al-select` values with their processed variant
* Throw an error when a document does not have a `loadQueryBuilderData` method while using the `FormApi#queryBuilderData` action
* `QueryBuilderValue` instances will now always add a type to the `value_explicit` object
* Make `al-button` elements submit forms automatically
* Fix operator `al-select` element staying empty in a query builder entry
* Work around a race condition in the query builder
* Add `behaviour` attribute to `al-button` element

## 0.2.0 (2022-11-02)

* Use the `al-` prefix for all custom elements instead of nothing or `alchemy-`
* Add tab-elements & widget
* Add abstract `WithDataprovider` class and make `al-table` and `al-select` use it
* Allow `al-table` to reuse existing rows and prevent render flashes
* Add `al-state` and the abstract `Stateful` class for elements with states
* Add `al-button` element
* Allow adding a suffix option to certain fields
* Allow using `al-table` pager without a url
* Move widgets to `alchemy-widgets` plugin, because that depends on `alchemy-form`

## 0.1.12 (2022-10-12)

* Don't let users manually add form widgets
* Allow overriding alchemy-field title & description in extra widget settings
* Allow overriding an alchemy-field's used wrapper-view
* Add `AlchemyField#applyOptions(options)` method
* Allow an alchemy-field's field_title property to be set
* Allow turning off specific column filters in alchemy-table
* Add inline enum field view
* Fix alchemy-pager icons
* Use `Model#getDisplayTitle()` to get the display title of records for alchemy-select-items
* Make the QueryBuilder field's source data configurable
* Add `VariableDefinition.fromMany()` method
* `VariableDefinition.cast()` now also accepts `Field` instances
* Add `QueryBuilder.applyToCriteria()` method
* Fix schema fields sometimes getting the wrong schema from an Enum value

## 0.1.11 (2022-07-23)

* Upgrade to `alchemy-media` v0.6.3
* Add `purpose` and `mode` attributes to AlchemyForm-based elements for improved field-template getting
* Add first few `edit_inline` and `view_inline` field templates

## 0.1.10 (2022-07-14)

* Hide `code-input` contents until it's fully loaded
* Don't crash when failing to get a field definition in a table

## 0.1.9 (2022-07-06)

* Allow supplying a custom `data-src` to `alchemy-field` elements
* Add `view` templates for File & Datetime fields
* Use the new `alchemy.getClientModel()` method in `alchemy-field` element
* Add `alchemy-password-input` element

## 0.1.8 (2022-06-29)

* Move the `alchemy-select` pagination checker initializer to a static function
* Prevent `alchemy-select` from keeping on loading remote data when last few results were empty
* Fix pagination breaking re-opening of `alchemy-select` dropdown
* Fix initial value of a `BelongsTo` `alchemy-select` element not loading
* Fix `alchemy-select` downward-arrow-icon being rendered over value content
* Use `alchemy-code-input` for HTML fields
* Allow manually setting a value on `alchemy-field` elements
* Try to let `Field` instances decide the representation of values in `alchemy-table` elements
* Don't open the `alchemy-table` contextmenu when clicking on anchors

## 0.1.7 (2022-06-12)

* Fix `<alchemy-table>` code typo
* Fix QueryBuilderGroup value being set incorrectly
* Add `<alchemy-query-builder-value>` element
* Add `<alchemy-query-builder-variable>` element
* Add List variable definition, which can contain other variables

## 0.1.6 (2022-05-31)

* Fix `FormApi#related` action searching through multiple fields in an `and` group
* Use microcopy translations in buttons
* Add `Action` class for user interaction
* Add context-menu support to `alchemy-table`
* Add support for using custom templates for `alchemy-select` options
* Add QueryBuilder

## 0.1.5 (2022-03-21)

* Print `alchemy-select-item` contents as text, not html
* Only get a maximum of 50 related items
* Set the parent `alchemy-select` element when creating `alchemy-select-item` element

## 0.1.4 (2022-03-16)

* Make fields work with the new `Alchemy.Map.Backed` and `Alchemy.Map.Enum` class
* Add the `field_path_in_current_schema` property
* Make sure `alchemy-fields` know which `alchemy-form` they belong to
* Improve the `original_value` getters
* Set the `field-type` attribute of `alchemy-field` elements
* Fix `alchemy-field` elements sometimes not getting their value elements

## 0.1.3 (2022-02-20)

* Fix datetime fields never showing their value
* `alchemy-table` elements will now ignore old loadRemote responses
* The `index` property of a `alchemy-field-array-entry` element will now return the current, actual index
* Fix `schema` fields breaking when their schema depends on another field
* Populate `alchemy-form` with violations from the widget context
* Fix `alchemy-label` not always focusing on input after clicking on it
* Fix `alchemy-string-input` element and add `alchemy-number-input`
* Fix `alchemy-field` not setting the `for` attribute of its label

## 0.1.2 (2022-01-28)

* Add readonly attribute to fields
* Clear text input on focus out + improve accessibility of alchemy-select
* Add widget settings to alchemy-field
* Enable setting the language mode of ace editor

## 0.1.1 (2021-09-12)

* `alchemy-table` will now use the `FieldConfig#getDisplayValueIn(data)` method
* Fix alchemy-form not saving translatable array fields properly
* Make alchemy-select work as an enum field
* Set search field value upon rendering alchemy-table
* Make pager show record count instead of page numbers when the page size is known, fixes #3
* Add code-input element + fix alchemy-select not loading value when rendering on the server

## 0.1.0 (2020-12-10)

* Initial test release