const SlashCommand = require("../../lib/SlashCommand");
const { EmbedBuilder } = require("discord.js");
const playerUtil = require("../../util/player");
const { redEmbed } = require("../../util/embeds");

const command = new SlashCommand()
	.setName("skip")
	.setDescription("Skip the current song")
	.setRun(async (client, interaction, options) => {
		let channel = await client.getChannel(client, interaction);
		if (!channel) {
			return;
		}

		let player;
		if (client.manager.Engine) {
			player = client.manager.Engine.players.get(interaction.guild.id);
		} else {
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor("Red")
						.setDescription("Lavalink node is not connected"),
				],
			});
		}

		if (!player) {
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor("Red")
						.setDescription("There is nothing to skip."),
				],
				ephemeral: true,
			});
		}

		const song = player.queue.current;

		const status = playerUtil.skip(player);

		if (status === 1) {
			return interaction.reply({
				embeds: [
					redEmbed({
						desc: `There is nothing after [${song.title}](${song.uri}) in the queue.`
					}),
				],
			});
		}

		const ret = await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(client.config.embedColor)
					.setDescription("✅ | **Skipped!**"),
			],
		 	fetchReply: true 
		});
		if (ret) setTimeout(() => ret.delete().catch(client.warn), 20000);
		return ret;
	});

module.exports = command;
