/**
 * The al-pager element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
const Pager = Function.inherits('Alchemy.Element.Form.Base', 'Pager');

/**
 * The template code
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
Pager.setTemplate(`<ul>
	<li class="afp-first">
		<a href="#" aria-label="First page">
			<al-icon icon-name="left-to-line"></al-icon>
		</a>
	</li>
	<li class="afp-prev">
		<a href="#" aria-label="Previous page">
			<al-icon icon-name="left"></al-icon>
		</a>
	</li>

	<li class="afp-next">
		<a href="#" aria-label="Next page">
			<al-icon icon-name="right"></al-icon>
		</a>
	</li>
	<li class="afp-last">
		<a href="#" aria-label="Last page">
			<al-icon icon-name="right-to-line"></al-icon>
		</a>
	</li>
</ul>`, true);

/**
 * Pager links
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Pager.addElementGetter({
	link_first: 'li.afp-first',
	link_prev : 'li.afp-prev',
	link_next : 'li.afp-next',
	link_last : 'li.afp-last'
});

/**
 * The amount of page numbers to show
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Pager.setAttribute('visible-pages', {number: true});

/**
 * The current active page
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Pager.setAttribute('page', {number: true});

/**
 * The maximum amount of pages
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Pager.setAttribute('max-page', {number: true});

/**
 * The page-size
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Pager.setAttribute('page-size', {number: true});

/**
 * The src attribute: which url to target
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Pager.setAttribute('src', null, function setSrc(src) {

	// Recreate urls when the src changes
	// @TODO: Clean this up?
	if (src && this.page && this.max_page) {
		this.setAttributeSilent('src', src);
		this.showPage(this.page, this.max_page);
	}

	return src;
});

/**
 * The param-name attribute: which parameter name to use in the url
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Pager.setAttribute('url-param');

/**
 * Get the visible pages elements
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {Array}
 */
Pager.setMethod(function getVisiblePagesElements() {

	let anchor,
	    result = this._visible_page_elements,
	    count = this.visible_pages || 5,
	    el,
	    i;

	if (!result) {
		result = Array.cast(this.querySelectorAll('li.afp-page'));
	}

	this._visible_page_elements = result;

	if (count < result.length) {
		while (count < result.length) {
			el = result.pop();
			el.remove();
		}
	} else if (count > result.length) {
		while (count > result.length) {
			i = result.length + 1;
			el = this.createElement('li');
			el.classList.add('afp-page');

			anchor = this.createElement('a');
			anchor.href = '#';
			el.append(anchor);

			this.link_next.insertAdjacentElement('beforebegin', el);
			result.push(el);
		}
	}

	return result;
});

/**
 * Update page numbers
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 *
 * @param    {Number}   page
 * @param    {Number}   amount_of_pages
 */
Pager.setMethod(function showPage(page, amount_of_pages) {

	let start = page - 2,
	    end = page + 2;

	if (start < 1) {
		start = 1;
		end = 5;
	}

	let url = this.getCurrentUrl();

	if (end > amount_of_pages) {
		end = amount_of_pages;
	}

	this.page = page;
	this.max_page = amount_of_pages;
	//this.setAttributeSilent('max-page')

	let page_links = this.getVisiblePagesElements(),
	    anchor,
	    url_param = this.url_param,
	    src = this.src,
	    li,
	    nr,
	    i;

	// Create let scope
	if (true) {
		let first_anchor = this.link_first.children[0],
		    prev_anchor = this.link_prev.children[0],
		    next_anchor = this.link_next.children[0],
		    last_anchor = this.link_last.children[0],
		    data,
		    url;

		if (url_param) {
			data = {};
			data[url_param] = {page: 1};
			url = RURL.parse(src);
			url.param(data);
			first_anchor.setAttribute('href', url);
		}

		first_anchor.dataset.page = 1;

		let prev = page - 1;

		if (prev < 1) prev = 1;

		if (url_param) {
			data = {};
			data[url_param] = {page: prev};
			url = RURL.parse(src);
			url.param(data);
			prev_anchor.setAttribute('href', url);
		}

		prev_anchor.dataset.page = prev;

		let next = page + 1;

		if (next > amount_of_pages) {
			next_anchor.href = '#';
			next_anchor.disabled = true;
			next_anchor.removeAttribute('data-page');
		} else {
			next_anchor.disabled = false;

			if (url_param) {
				data = {};
				data[url_param] = {page: next};
				url = RURL.parse(src);
				url.param(data);
				next_anchor.setAttribute('href', url);
			}

			next_anchor.dataset.page = next;
		}

		if (url_param) {
			data = {};
			data[url_param] = {page: amount_of_pages};
			url = RURL.parse(src);
			url.param(data);
			last_anchor.setAttribute('href', url);
		}

		last_anchor.dataset.page = amount_of_pages;
	}

	for (i = 0; i < page_links.length; i++) {
		li = page_links[i];
		nr = start + i;

		if (nr > end) {
			li.hidden = true;
			continue;
		}

		li.hidden = false;
		li.dataset.page = nr;
		anchor = li.children[0];

		// Show regular pagenrs when no page size is known
		if (!this.page_size) {
			anchor.textContent = nr;
		} else {
			let range = ((nr - 1) * this.page_size);
			anchor.textContent = (1 + range) + ' - ' + (range + this.page_size);
		}

		if (nr == page) {
			li.classList.add('afp-active');
		} else {
			li.classList.remove('afp-active');
		}

		if (src && url_param) {
			let url = RURL.parse(src),
			    data = {};

			data[url_param] = {
				page      : nr,
			};

			url.param(data);

			anchor.setAttribute('href', url);
		} else {
			anchor.setAttribute('href', '#');
		}
	}
});

/**
 * Added to the DOM for the first time
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Pager.setMethod(function introduced() {

	const that = this;

	this.addEventListener('click', function onClick(e) {

		let page_nr_el = e.target.queryUp('[data-page]');

		if (!page_nr_el) {

			let anchor = e.target.queryUp('a');

			if (anchor && anchor.href == '#') {
				e.preventDefault();
			}

			return;
		}

		let page_nr = parseInt(page_nr_el.dataset.page);

		if (!page_nr || !isFinite(page_nr)) {
			return;
		}

		let page_event = that.emit('pager-request', {
			detail: {
				click_event: e,
				page_nr    : page_nr
			}
		});
	});
});