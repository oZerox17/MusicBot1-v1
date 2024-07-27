const colors = require("colors");
const { EmbedBuilder } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");
const { autoQueueEmbed } = require("../../util/embeds");

const command = new SlashCommand()
	.setName("autoqueue")
	.setDescription("Automatically add songs to the queue (toggle)")
	.setRun(async (client, interaction) => {
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
						.setDescription("There's nothing playing in the queue"),
				],
				ephemeral: true,
			});
		}
		
		const autoQueue = player.get("autoQueue");
		player.set("requester", interaction.guild.members.me);
		
		if (!autoQueue) {
			player.set("autoQueue", true);
		} else {
			player.set("autoQueue", false);
		}

		client.warn(
			`Player: ${ player.options.guild } | [${ colors.blue(
				"AUTOQUEUE",
			) }] has been [${ colors.blue(!autoQueue? "ENABLED" : "DISABLED") }] in ${
				client.guilds.cache.get(player.options.guild)
					? client.guilds.cache.get(player.options.guild).name
					: "a guild"
			}`,
		);
		
		const ret = await interaction.reply({ embeds: [autoQueueEmbed({autoQueue})], fetchReply: true });
		if (ret) setTimeout(() => ret.delete().catch(client.warn), 20000);
		return ret;
	});

module.exports = command;
