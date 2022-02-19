## 0.1.3 (WIP)

* Fix datetime fields never showing their value
* `alchemy-table` elements will now ignore old loadRemote responses
* The `index` property of a `alchemy-field-array-entry` element will now return the current, actual index
* Fix `schema` fields breaking when their schema depends on another field
* Populate `alchemy-form` with violations from the widget context
* Fix `alchemy-label` not always focusing on input after clicking on it
* Fix `alchemy-string-input` element and add `alchemy-number-input`

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