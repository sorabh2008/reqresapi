var data = require("./../data.json"),
	config = require("./../config.json")
	anzsic_codes = require("./../anzsic_codes.json")
	suburb = require("./../suburb.json")
	suburb_business = require("./../suburb_business.json")
	suburb_customers = require("./../suburb_customers.json");

module.exports = {

	get: function(req, res, next) {
		var resource = req.params.resource,
			itemArg = req.params[0] || req.query.id || null,
			items;
		switch(req.url) {
			case '/api/anzsic':
				return returnAll(anzsic_codes[resource], req, res);
			case '/api/suburb':
				return returnAll(suburb[resource], req, res);
			case '/api/suburb_business':
				return returnAll(suburb_business[resource], req, res);
			case '/api/suburb_customers':
				return returnAll(suburb_customers[resource], req, res);
		}
		
	},

	post: function(req, res, next) {
		var id = req.body.id || (Math.ceil(Math.random() * 1000)).toString().substring(0, 3),
			returnData = req.body;
		returnData.id = id;
		returnData.createdAt = new Date().toISOString();

		return res.status(201).send(returnData);
	},

	put: function(req, res, next) {
		var returnData = req.body;
		returnData.updatedAt = new Date().toISOString();
		return res.status(200).send(returnData);
	},

	patch: function(req, res, next) {
		var returnData = req.body;
		returnData.updatedAt = new Date().toISOString();
		return res.status(200).send(returnData);
	},

	delete: function(req, res, next) {
		return res.status(204).send({});
	},

	login: function(req, res, next) {
		if (req.body.username || req.body.email) {
			if (req.body.password) {
				return res.status(200).send({
					token: config.token
				});
			} else {
				return res.status(400).send({
					error: "Missing password"
				});
			}
		} else {
			return res.status(400).send({
				error: "Missing email or username"
			});
		}
	},

	register: function(req, res, next) {
		if (req.body.username || req.body.email) {
			if (req.body.password) {
				return res.status(201).send({
					token: config.token
				});
			} else {
				return res.status(400).send({
					error: "Missing password"
				});
			}
		} else {
			return res.status(400).send({
				error: "Missing email or username"
			});
		}
	},

	logout: function(req, res, next) {
		return res.status(200).send({});
	}

};

function returnAll(items, req, res) {
	var page = parseInt(req.query.page, 10) || 1,
		pageSize = parseInt(req.query.per_page, 10) || config.pagination.page_size,
		offset = (page - 1) * pageSize,
		paginatedItems = items.slice(offset, offset + pageSize);
	return res.status(200).send({
		data: items
	});
}

function returnSingle(items, itemArg, res) {
	var singleItem = items.filter(function(item) {
		return item.id == itemArg;
	});
	if (singleItem.length) {
		return res.status(200).send({
			data: singleItem[0]
		});
	}
	return res.status(404).send({});
}
