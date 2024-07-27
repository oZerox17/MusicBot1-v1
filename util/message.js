"use strict";

const { getClient } = require("../bot");

const deleteMessageDelay = (message, delay = 20000) => {
	if (!message) return;

	setTimeout(() => message.delete().catch(getClient().warn), delay);
};

module.exports = {
	deleteMessageDelay,
};
