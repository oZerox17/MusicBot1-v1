"use strict";

const { getClient } = require("../bot");

const setDefaultPlayerConfig = (instance) => {
	const config = getClient().config;
	const defaultValues = config.defaultPlayerValues;

	if (typeof defaultValues !== "object") return;

	const defaultKeys = Object.keys(config.defaultPlayerValues);

	defaultKeys.forEach((key) => {
		instance.set(key, defaultValues[key]);
	});
};

module.exports = {
	setDefaultPlayerConfig,
};
