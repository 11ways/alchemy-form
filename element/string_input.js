/**
 * The alchemy-string-input custom element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.3
 */
const StringInput = Function.inherits('Alchemy.Element.Form.FeedbackInput', 'StringInput');

/**
 * The template to use for the content of this element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
StringInput.setTemplateFile('form/elements/string_input');

/**
 * The required attribute
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 */
StringInput.setAttribute('required', {boolean: true});

/**
 * The required attribute
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 */
StringInput.setAssignedProperty('validate');

/**
 * Revalidate the value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 *
 * @return   {Object[]}
 */
StringInput.setMethod(function getValidationConfig() {

	let result = [],
	    config = this.validate,
	    types;

	if (config && typeof config == 'string') {
		types = config;
		config = null;
	} else if (config && typeof config == 'object') {
		config = Array.cast(config);
	} else {
		types = this.getAttribute('validate');
	}

	if (types) {
		types = types.split(',');
	} else {
		types = [];
	}

	// Required always comes first if defined as an attribute
	if (this.required) {
		types.unshift('required');
	}

	for (let type of types) {
		if (type == 'email') {
			result.push({
				type    : 'regex',
				regex   : /[a-zA-Z0-9_\.-]+@[a-zA-Z0-9_\.-]+\.[a-zA-Z]{2,}/,
				message : 'microcopy:invalid-email',
				when    : 'onblur',
			});
		} else if (type == 'regex') {
			result.push({
				type    : 'regex',
				regex   : RegExp.interpret(this.getAttribute('validate-regex')),
				message : 'microcopy:invalid-pattern-match',
				when    : 'onblur',
			});
		} else if (type == 'remote') {
			let route = this.getAttribute('validate-route'),
			    url = this.getAttribute('validate-url');

			result.push({
				type    : 'remote',
				route   : route,
				url     : url,
				message : 'microcopy:invalid-remote',
				when    : 'onblur',
			});
		} else if (type == 'required') {
			result.push({
				type    : 'required',
				message : 'microcopy:cannot-be-empty'
			})
		}
	}

	let min_length = Number(this.getAttribute('min-length')) || 0;

	if (min_length > 0) {
		// Checking the minimum length only has to happen on blur
		result.push({
			type    : 'min_length',
			length  : min_length,
			message : 'microcopy:is-too-short',
			when    : 'onblur',
		});
	}

	let max_length = Number(this.getAttribute('max-length')) || 0;

	if (max_length > 0) {
		// Checking maximum length has to happen immediately
		result.push({
			type    : 'max_length',
			length  : max_length,
			message : 'microcopy:is-too-long',
		});
	}

	if (config) {
		for (let entry of config) {

			if (!entry.when) {
				entry.when = 'onblur';
			}

			result.push(entry);
		}
	}

	return result;
});

/**
 * Revalidate the value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 *
 * @param    {Object}   trigger   The revalidation trigger
 */
StringInput.setMethod(async function revalidate(trigger, force) {

	// Get the current value
	let value = this.value;

	if (value) {
		value = value.trim();
	}

	// Don't revalidate the same value twice
	if (this.last_validated_value == value) {
		return;
	}

	if (this.success_el) {
		this.success_el.innerHTML = '';
	}

	// Get the validation counter (important for async validations)
	let validation_counter = ++this.validation_counter;

	let config = this.getValidationConfig(),
	    error_params,
		check_count = 0,
		skip_count = 0,
		required;

	if (config && config.length) {

		required = config.findByPath('type', 'required');

		for (let entry of config) {

			if (!value.length && !required) {
				skip_count++;
				continue;
			}

			if (entry.when) {
				if (entry.when == 'onblur' && (!trigger || trigger.type != 'blur')) {
					skip_count++;
					continue;
				}
			}

			check_count++;

			if (entry.type == 'regex') {
				if (!entry.regex.test(value)) {
					error_params = [entry.message, null, true];
					break;
				}
			} else if (entry.type == 'min_length') {
				if (value.length < entry.length) {
					error_params = [entry.message, {
						value_length: value.length,
						min_length  : entry.length,
					}, true];
					break;
				}
			} else if (entry.type == 'max_length') {
				if (value.length > entry.length) {
					error_params = [entry.message, {
						value_length : value.length,
						max_length   : entry.length,
					}, true];
					break;
				}
			} else if (entry.type == 'remote') {

				let url;

				if (entry.url) {
					url = Classes.RURL.parse(entry.url);
				} else if (entry.route) {
					url = hawkejs.scene.helpers.Router.routeUrl(entry.route);
				}

				if(!url) {
					continue;
				}

				url.param('value', value);

				try {

					let result = await Blast.fetch(url);

					if (result) {
						if (!result.allowed) {
							error_params = [result.message || entry.message, null, true];
							break;
						}
					}
				} catch (err) {
					error_params = [entry.message || err.message, null, true];
					break;
				}
			}
		}
	}

	// Remove errors if not required and empty
	if (!required && !value.length) {
		this.removeErrors();
	}

	// Make sure something was checked, otherwise exit early
	if (!check_count) {
		return;
	}

	if (validation_counter != this.validation_counter) {
		// Another validation happened while we were waiting for the result
		if (!force) {
			return;
		}
	}

	if (!skip_count) {
		// Remember we validated this value (if all the checks were done)
		this.last_validated_value = value;
	}

	if (error_params) {
		this.addError(...error_params);
		return;
	}

	// Remove all errors when we got this far
	this.removeErrors();

	// Mark it as valid, but only if we checked all the checks
	if (!skip_count) {
		this.classList.add('valid');
		this.inputbox_el.classList.add('valid');

		let message = this.getAttribute('success-message');

		if (message) {
			this.addSuccess(message);
		}
	}
});

/**
 * Actions to perform when this element
 * has been added to the DOM for the first time
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 */
 StringInput.setMethod(function introduced() {

	const that = this,
	      input = this.input_el;

	if (this.readonly) {
		input.disabled = true;
	}

	let doRevalidate = Fn.throttle((e, force) => {
		this.revalidate(e, force);
	}, {
		minimum_wait  : 300,
		immediate     : false,
		reset_on_call : true
	});

	input.addEventListener('focus', e => {
		this.inputbox_el.classList.add('focus');
	});

	input.addEventListener('blur', e => {
		this.inputbox_el.classList.remove('focus');
		doRevalidate(e, true);
	});

	input.addEventListener('keyup', function onKeyup(e) {
		doRevalidate(e);
		that.emit('changing');
	});

	input.addEventListener('input',function onInput(e) {
		doRevalidate(e);
	});

	if (this.value) {
		this.revalidate();
	}
});
