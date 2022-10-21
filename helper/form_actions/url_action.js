/**
 * The Url action
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
const UrlAction = Function.inherits('Alchemy.Form.Action', 'Url');

/**
 * Add the url config property
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
UrlAction.addConfigProperty('url');

/**
 * Get an element representation
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.2.0
 *
 * @return   {HTMLElement}
 */
UrlAction.setMethod(function _constructElement(renderer) {

	let anchor = renderer.createElement('a');

	anchor.dataset.name = this.name;

	if (this.icon) {
		let alico = renderer.createElement('al-icon');
		alico.setIcon(this.icon);
		anchor.append(alico);
	} else {
		anchor.textContent = this.title || this.name;
	}

	anchor.setAttribute('href', this.url);
	anchor.setAttribute('title', this.title || this.name);
	
	return anchor;
});

/**
 * Execute this action programatically
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 *
 * @param    {Event}   event   Optional event
 */
UrlAction.setMethod(function execute(event) {

	if (event) {
		event.preventDefault();
	}

	if (!Blast.isBrowser || !this.url) {
		return;
	}

	hawkejs.scene.openUrl(this.url);
});