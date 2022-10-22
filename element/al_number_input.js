/**
 * The al-number-input custom element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 */
const NumberInput = Function.inherits('Alchemy.Element.Form.FeedbackInput', 'NumberInput');

/**
 * The hawkejs template to use
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 */
NumberInput.setTemplateFile('form/elements/number_input');

/**
 * The value property
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 */
NumberInput.setProperty(function value() {

	var input = this.input_el,
	    value = input.value;

	if (value === '') {
		return null;
	}

	return Number(value);

}, function setValue(value) {

	var input = this.input_el;

	if (value == null || value === '') {
		input.value = '';
	} else {
		input.value = value;
	}

});

/**
 * The disabled property
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 */
NumberInput.setProperty(function disabled() {
	return this.input_el.disabled;
}, function setDisabled(value) {
	return this.input_el.disabled = value;
});

/**
 * Added to the DOM for the first time
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 */
NumberInput.setMethod(function introduced() {

	var that = this,
	    minus = this.querySelector('.minus'),
	    plus  = this.querySelector('.plus'),
	    input = this.querySelector('.input');

	var accommodations_summary_element = this.accommodations_summary;

	minus.addEventListener('click', function onMinus(e) {
		e.preventDefault();
		adjustValue(-1, that);
	});

	plus.addEventListener('click', function onPlus(e) {
		e.preventDefault();
		adjustValue(+1, that);
	});

	function adjustValue(change, obj) {

		var max = Number(input.getAttribute('max')),
		    min = Number(input.getAttribute('min')),
		    val = Number(input.value) || 0;

		val += change;

		if (val > max) {
			val = max;
		}

		if (val < min) {
			val = min;
		}

		input.value = val;
	}
});