/**
 * The al-datetime-input:
 * Populate an input on the browser-side with correct timezone info
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
const DatetimeInput = Function.inherits('Alchemy.Element.Form.Base', 'DatetimeInput');

/**
 * Get/set the mode
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
DatetimeInput.setAttribute('datemode', null, function setMode(datemode) {
	this.populateInputWithValue(this.value, datemode);
	return datemode;
});

/**
 * Get/set the value
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
DatetimeInput.setAttribute('value', null, function setValue(value) {
	return this.populateInputWithValue(value, this.datemode);
});

/**
 * Set the value with a function call
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
DatetimeInput.setMethod(function setValue(value) {
	this.value = value;
});

/**
 * Revalidate the value
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 *
 * @return   {Object[]}
 */
DatetimeInput.setMethod(function populateInput() {
	return this.populateInputWithValue(this.value, this.datemode);
});

/**
 * Revalidate the value
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 *
 * @return   {Object[]}
 */
DatetimeInput.setMethod(function populateInputWithValue(value, datemode) {

	let iso_date,
	    date;

	if (value) {
		date = Date.create(value);
		iso_date = date.toISOString();
	} else {
		iso_date = '';
	}

	value = iso_date;

	if (Blast.isServer) {
		return value;
	}

	if (arguments.length == 1) {
		datemode = this.datemode;
	}

	let input = this.querySelector('input');

	if (!datemode) {
		datemode = 'datetime';
	}

	if (!input) {
		input = this.createElement('input');
		input.setAttribute('type', datemode + '-local');
	}

	if (!value) {
		input.value = '';
		return '';
	}

	let formatted;

	if (datemode == 'date') {
		formatted = date.format('Y-m-d');
	} else {
		formatted = date.format('Y-m-d\\TH:i:s');
	}

	input.value = formatted;

	return iso_date;
});

/**
 * Added to the DOM
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
DatetimeInput.setMethod(function introduced() {
	this.populateInput();
});