const { embedNoLLNode, embedNoTrackPlaying, embedNotEnoughSong } = require("./embeds");

/**
 * @param {import("../lib/Bot")} client
 * @param {import("discord.js").Interaction} interaction
 * @param {{minimumQueueLength?: number}}
 */
const ccInteractionHook = async (client, interaction, { minimumQueueLength } = {}) => {
	if (!interaction.isButton()) {
		throw new Error("Invalid interaction type for this command");
	}

	const channel = await client.getChannel(client, interaction, {
		ephemeral: true,
	});

	/**
	 * @template T
	 * @param {T} data
	 */
	const returnError = (data) => {
		return {
			error: true,
			data,
		};
	};

	if (!channel) {
		return returnError(undefined);
	}

	/**
	 * @param {import("discord.js").EmbedBuilder} embed
	 */
	const sendError = (embed) => {
		return interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});
	};

	if (!client.manager.Engine) {
		return returnError(sendError(embedNoLLNode()));
	}

	const player = client.manager.Engine.players.get(interaction.guild.id);

	if (!player) {
		return returnError(sendError(embedNoTrackPlaying()));
	}

	if (
		typeof minimumQueueLength === "number" &&
		(player.queue?.length ?? 0) < minimumQueueLength
	) {
		return returnError(sendError(embedNotEnoughSong()));
	}

	return { error: false, data: { channel, sendError, player } };
};

const checkPlayerVolume = async (player, interaction) => {
	if (typeof player.volume !== "number")
		return interaction.reply({
			content: "Something's wrong: volume is not a number",
			ephemeral: true,
		});
};

module.exports = {
	ccInteractionHook,
	checkPlayerVolume,
};
