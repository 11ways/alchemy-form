/**
 * The alchemy field element
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
var AlFEntry = Function.inherits('Alchemy.Element.AlInput', function AlchemyFieldEntry() {
	return AlchemyFieldEntry.super.call(this);
});

/**
 * The actual input
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlFEntry.setAssignedProperty('input');

/**
 * The index of this entry
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlFEntry.setAssignedProperty('index');

/**
 * A reference to the view
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlFEntry.setProperty(function view() {
	return this.field.view;
});

/**
 * The field this belongs to
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlFEntry.setAssignedProperty('field', null, function setField(field) {
	this.input = field.input(field.options, this.index);
});

/**
 * Pass along the value of the input
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlFEntry.setMethod(function getData() {
	if (this.input) {
		return this.input.getData();
	}
});

/**
 * Get the viewname
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlFEntry.setMethod(function getViewName() {

	if (this.options) {
		if (this.options.type) {
			return 'form/' + this.options.type;
		}
	}

	return 'form/default_edit';
});

/**
 * This element has been inserted in the DOM
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlFEntry.setMethod(function introduced() {

	var that = this;

	if (!this.innerHTML) {
		this.getContent(removeEntryListener);
	} else {
		removeEntryListener();
	}

	function removeEntryListener() {
		var remove_entry = that.querySelector('.remove-entry');

		if (!remove_entry) {
			return;
		}

		remove_entry.addEventListener('click', function onClick(e) {
			e.preventDefault();
			that.removeEntry();
		});
	}
});


/**
 * Remove this entry
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlFEntry.setMethod(function removeEntry() {

	var index;

	index = this.field.field_entries.indexOf(this);

	if (index > -1) {
		this.field.field_entries.splice(index, 1);
	}

	this.remove();
});

/**
 * Get the content for hawkejs
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlFEntry.setMethod(function makeContent(callback) {

	var that = this,
	    tasks = [],
	    placeholder,
	    variables,
	    view_name,
	    options,
	    i;

	view_name = 'form/entry_wrappers/default_edit';

	variables = {
		form  : this.form,
		field : this.field,
		entry : this,
		input : this.input
	};

	options = {
		print : false,
		wrap  : this
	};

	placeholder = this.view.print_element(view_name, variables, options);

	placeholder.getContent(function gotResult(err, html) {

		if (err) {
			return callback(err);
		}

		that.innerHTML = html;
		callback(null);
	});
});