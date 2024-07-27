const os = require("os");
const moment = require("moment");
require("moment-duration-format");
const { EmbedBuilder } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
	.setName("stats")
	.setDescription("Get information about the bot")
	.setRun(async (client, interaction) => {
		let nodes = "";

		client.manager.Engine.nodes.forEach((node) => {
			// show lavalink uptime in a nice format
			const lavauptime = moment
				.duration(node.stats.uptime)
				.format(" D[d], H[h], m[m]");
			// show lavalink memory usage in a nice format
			const lavaram = (node.stats.memory.used / 1024 / 1024).toFixed(2);

			nodes += `\`\`\`yml\nNode: ${node.options.identifier}\nUptime: ${lavauptime}\nRAM: ${lavaram} MB\nPlayers: ${node.stats.playingPlayers} out of ${node.stats.players}\nWrapper: ${client.config.musicEngine}\`\`\`\n`;
		});

		// get OS info
		const osver = os.platform() + " " + os.release();

		// Get nodejs version
		const nodeVersion = process.version;

		// show system uptime
		const sysuptime = moment
			.duration(os.uptime() * 1000)
			.format("d[ Days]・h[ Hrs]・m[ Mins]・s[ Secs]");

		// get commit hash and date
		let gitHash = "unknown";
		try {
			gitHash = require("child_process")
				.execSync("git rev-parse HEAD")
				.toString()
				.trim();
		} catch (e) {
			// do nothing
			gitHash = "unknown";
		}

		const statsEmbed = new EmbedBuilder()
			.setTitle(`${client.user.username} Information`)
			.setColor(client.config.embedColor)
			.setDescription(
				`\`\`\`yml\nName: ${client.user.username}#${client.user.discriminator} [${client.user.id}]\nAPI: ${client.ws.ping}ms\n\`\`\``
			)
			.setFields([
				{
					name: `Lavalink stats`,
					value: nodes,
					inline: false,
				},
				{
					name: "Bot stats",
					value: `\`\`\`yml\nGuilds: ${
						client.guilds.cache.size
					} \nNodeJS: ${nodeVersion}\nDiscordMusicBot: v${
						require("../../package.json").version
					} \`\`\``,
					inline: true,
				},
				{
					name: "System stats",
					value: `\`\`\`yml\nOS: ${osver}\nUptime: ${sysuptime}\n\`\`\``,
					inline: false,
				},
			])
			.setFooter({ text: `Build: ${gitHash}` });

		return interaction.reply({ embeds: [statsEmbed], ephemeral: false });
	});

module.exports = command;
