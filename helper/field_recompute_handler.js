/**
 * Recompute fields in the browser that has its logic in the server
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 *
 * @param   {Alchemy.Client.Document}  document
 * @param   {Alchemy.Client.Field}     field
 */
alchemy.registerCustomHandler('recompute_field', async function fieldRecomputeHandler(document, field) {

	let body = {
		_id   : document._id,
	};

	for (let other_field of field.dependency_fields) {
		let value = other_field.getRecordValue(document);
		body[other_field.name] = value;
	}

	let resource_options = {
		name  : 'FormApi#recompute',
		post  : true,
		body  : body,
	};

	let params = {
		model_name : document.$model_name,
		field      : field.name,
	};

	let helpers;

	if (Blast.isServer) {
		helpers = document.conduit?.renderer?.helpers;
	} else {
		helpers = hawkejs.scene.helpers;
	}

	if (!helpers) {
		return;
	}

	let response = await helpers.Alchemy.getResource(resource_options, params);

	return response?.result;
});