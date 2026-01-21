# Alchemy Form Development Guide

## Overview

Alchemy Form is a comprehensive form handling plugin for AlchemyMVC that provides custom HTML elements for building, validating, and rendering forms. It supports complex field types, relationships, arrays, schemas, and advanced features like query builders.

## Commands
- Run tests: `npm test`

## Dependencies
- alchemymvc (>=1.4.0)
- alchemy-media (>=0.9.0)
- alchemy-styleboost (>=0.5.0)

## Directory Structure

```
element/                     # Custom form elements (~48 files)
├── 00_form_base.js          # Base class for all form elements
├── 05_feedback_input.js     # Abstract element with error/success feedback
├── 10_dataprovider.js       # Base for elements with remote data
├── 40_stateful.js           # State management for elements
├── al_form.js               # Main form element
├── al_field.js              # Base field element
├── al_field_array.js        # Array field wrapper
├── al_field_schema.js       # Schema/nested field support
├── al_field_translatable.js # Multilingual field support
├── al_select.js             # Dropdown selector
├── al_table.js              # Data table element
├── al_button.js             # Interactive button with states
├── al_query_builder*.js     # Query builder UI (5 files)
└── ...                      # Other input types

helper/
├── query_builder_ns.js      # Query builder namespace & criteria
├── field_recompute_handler.js # Computed field handler
├── form_actions/            # Form action handlers
└── query_builder_variable_definition/ # Variable type definitions

controller/
└── form_api_controller.js   # Backend API controller

config/
└── routes.js                # API routes
```

## Core Element Hierarchy

```
Alchemy.Element.Form.Base
├── al-form                         # Main form container
├── al-field                        # Base field element
│   ├── al-field-array              # Array fields
│   ├── al-field-schema             # Nested schema fields
│   └── al-field-translatable       # Multilingual fields
├── FeedbackInput (abstract)
│   ├── al-string-input
│   ├── al-number-input
│   └── al-password-input
├── WithDataprovider (abstract)
│   ├── al-select
│   ├── al-table
│   └── al-query-builder
└── Stateful (abstract)
    └── al-button
```

## Key Attributes

### Form Element (`<al-form>`)
- `action` - URL/route for submission
- `method` - POST/GET
- `model` - Associated data model name
- `readonly` - Read-only form flag
- `serialize-entire-document` - Include all document properties

### Field Element (`<al-field>`)
- `field-name` - Name in record
- `field-type` - Type of field (text, number, select, schema, array, etc.)
- `field-view` - Override template name
- `wrapper-view` - Override wrapper template
- `data-src` - Data source URL for dynamic options
- `min-entry-count`, `max-entry-count` - Array bounds
- `readonly` - Read-only field

### Shared Attributes
- `purpose` - "edit" or "view" mode
- `mode` - "inline", "standalone", etc.
- `zone` - "admin", "frontend", "chimera", etc.

## Form Usage

### Basic Form
```html
<al-form action="/api/save" model="User">
    <al-field field-name="username"></al-field>
    <al-field field-name="email"></al-field>
    <al-button behaviour="submit">Save</al-button>
</al-form>
```

### Programmatic Form Control
```javascript
const form = document.querySelector('al-form');

// Set document data
form.document = userDoc;

// Get form values
const values = form.getMainValue();

// Validate
const valid = await form.validate();

// Submit
await form.submit();

// Show validation errors
form.showViolations(validationError);

// Find specific field
const field = form.findFieldByPath('address.city');
```

## Field Types

### Basic Types
- `text`, `string` - Text input
- `number` - Numeric input
- `password` - Password input
- `boolean` - Toggle switch
- `date`, `datetime` - Date picker

### Complex Types
- `enum` - Dropdown selection
- `schema` - Nested object fields
- `array` - Repeatable field groups
- `belongsto` - Foreign key relationship
- `hasmany` - Multiple relationships

### Array Fields
```html
<al-field field-name="tags" field-type="array"
          min-entry-count="1" max-entry-count="10">
</al-field>
```

### Schema Fields
```html
<al-field field-name="address" field-type="schema">
    <!-- Nested fields rendered automatically -->
</al-field>
```

## Select Element

```html
<al-select data-src="/api/form/data/related"
           method="POST"
           page-size="20">
</al-select>
```

Properties:
- `recordsource` - Set data source
- `dataprovider` - Data loading instance
- `page`, `page_size` - Pagination

## Query Builder

```html
<al-query-builder>
    <al-query-builder-group condition="and">
        <al-query-builder-entry type="qb_entry">
            <!-- Field, operator, value inputs -->
        </al-query-builder-entry>
    </al-query-builder-group>
</al-query-builder>
```

Apply to criteria:
```javascript
const Qb = Blast.Classes.Alchemy.QueryBuilder;
Qb.applyToCriteria(queryBuilderValue, criteria, inverted);
```

Supported operators: `equals`, `ne`, `starts_with`, `ends_with`, `is_empty`, `is_null`, `>`, `<`, `>=`, `<=`

## Button States

```html
<al-button behaviour="submit">
    <al-state name="default">Save</al-state>
    <al-state name="busy">Saving...</al-state>
    <al-state name="done">Saved!</al-state>
    <al-state name="error">Error</al-state>
</al-button>
```

```javascript
button.setState('busy', 3000, 'default');  // Revert after 3s
```

## Table Element

```html
<al-table data-src="/api/records" method="POST">
    <!-- Columns configured via schema or attributes -->
</al-table>

<al-pager></al-pager>
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/form/data/related` | POST | Fetch related records for select/autocomplete |
| `/api/form/data/qbdata` | POST | Load query builder variable data |
| `/api/form/data/recompute/{model}/{field}` | POST | Recompute computed field |
| `/api/form/data/enum_info/{model}/{id}` | GET | Get enum display info |

## Computed Fields

Fields can be automatically recomputed when dependencies change:

```javascript
// Server-side: define computed field
MyModel.addField('full_name', 'String', {
    computed: {
        fields: ['first_name', 'last_name'],
        compute: doc => `${doc.first_name} ${doc.last_name}`
    }
});
```

Client-side automatically calls recompute API when dependencies change.

## Validation

Validation is schema-based and returns violations:

```javascript
// Form validates against model schema
const valid = await form.validate();

// Show errors inline
form.showViolations(err);

// Access specific field errors
field.showError(violation);
```

## Template Customization

Field templates follow a fallback chain:
1. `field-view` attribute value
2. `{purpose}_{mode}` template
3. `{purpose}` template
4. Default template

```html
<al-field field-name="bio" field-view="custom_textarea"></al-field>
```

## Event Handling

```javascript
// Form submit
form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Custom handling
});

// Field change
field.addEventListener('change', (e) => {
    console.log('New value:', e.target.value);
});

// Button activation
button.addEventListener('activate', (e) => {
    // Button was clicked
});
```

## Field Value Internals

### Value Storage

`al-field` uses several internal mechanisms to manage values:

- **`LAST_SET_VALUE` (Symbol)** - Stores the most recently set value, even before render completes
- **`value_to_render`** - Property used in templates, returns `LAST_SET_VALUE` or falls back to `original_value`
- **`value_element`** - The actual input element inside the field (may not exist until rendered)
- **`original_value`** - The initial value, used for change detection

### Value Flow

```
setValue(value)
    ↓
Store in LAST_SET_VALUE
    ↓
If value_element exists and has setter → set directly
    ↓
Otherwise → rerender() to update template
    ↓
Template uses value_to_render → renders value_element
```

### Render Safety

When setting values during a render (before `value_element` exists):
- Check `this.hasAttribute('data-he-rerendering')` before calling `rerender()`
- The value is already in `LAST_SET_VALUE` and will be picked up via `value_to_render`
- Calling `rerender()` during a render can cause deadlocks

### Key Methods

| Method | Description |
|--------|-------------|
| `valueElementHasValuePropertySetter()` | Checks if value_element can accept values directly |
| `value_to_render` (property) | Returns the value for template rendering |
| `prepareRenderVariables()` | Hawkejs lifecycle method, sets up template variables |

## Gotchas

1. **Field paths:** Use dot notation for nested fields (`address.city`)

2. **Array indices:** Array fields include index in path (`items.0.name`)

3. **Schema supplier:** Schema fields need parent field reference via `getSchemaSupplierField()`

4. **Dataprovider base:** Elements using remote data extend `WithDataprovider`, not `Base`

5. **Purpose inheritance:** Child elements inherit `purpose` from parent form

6. **Value serialization:** `form.getMainValue()` returns unwrapped object, `form.value` wraps with model name

7. **Readonly mode:** Set `purpose="view"` for read-only display

8. **Zone-based templates:** Use `zone` attribute for context-specific rendering (admin vs frontend)

9. **Rerender during render:** Never call `rerender()` when `data-he-rerendering` attribute is present - can cause deadlock

10. **Value before render:** Values set before first render are stored in `LAST_SET_VALUE` symbol and accessed via `value_to_render`

11. **value vs value_to_render:** In templates, use `value_to_render` which handles pending values correctly
