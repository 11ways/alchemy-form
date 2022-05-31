## 0.1.6 (WIP)

* Fix `FormApi#related` action searching through multiple fields in an `and` group
* Use microcopy translations in buttons
* Add `Action` class for user interaction
* Add context-menu support to `alchemy-table`
* Add support for using custom templates for `alchemy-select` options

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