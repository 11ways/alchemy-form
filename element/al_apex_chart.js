/**
 * The apex-chart custom element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.8
 * @version  0.2.8
 */
const ApexChart = Function.inherits('Alchemy.Element.Form.Base', 'ApexChart');

/**
 * The actual ApexChart config
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.8
 * @version  0.2.8
 */
ApexChart.setAssignedProperty('apex_config');

/**
 * The element has been added to the dom for the first time
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.8
 * @version  0.2.8
 */
ApexChart.setMethod(async function introduced() {

	await hawkejs.require('https://cdn.jsdelivr.net/npm/apexcharts');

	let apex_config = this.apex_config;

	let timeline = this.createElement('div');
	timeline.classList.add('apex-chart-container');
	this.append(timeline);

	let instance = new ApexCharts(timeline, apex_config);
	instance.render();
});