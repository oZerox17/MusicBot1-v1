const colors = require("colors");
const { EmbedBuilder } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
  .setName("autopause")
  .setDescription("Automatically pause when everyone leaves the voice channel (toggle)")
  .setRun(async (client, interaction) => {
    let channel = await client.getChannel(client, interaction);
    if (!channel) return;

    let player;
    if (client.manager.Engine)
      player = client.manager.Engine.players.get(interaction.guild.id);
    else
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription("Lavalink node is not connected"),
        ],
      });

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

    let autoPauseEmbed = new EmbedBuilder().setColor(client.config.embedColor);
    const autoPause = player.get("autoPause");
    player.set("requester", interaction.guild.members.me);

    if (!autoPause) {
      player.set("autoPause", true);
    } else {
      player.set("autoPause", false);
    }
    autoPauseEmbed
			.setDescription(`**Auto Pause is** \`${!autoPause ? "ON" : "OFF"}\``)
			.setFooter({
			  text: `The player will ${!autoPause ? "now be automatically" : "no longer be"} paused when everyone leaves the voice channel.`
			});
    client.warn(
      `Player: ${player.options.guild} | [${colors.blue(
        "AUTOPAUSE"
      )}] has been [${colors.blue(!autoPause ? "ENABLED" : "DISABLED")}] in ${
        client.guilds.cache.get(player.options.guild)
          ? client.guilds.cache.get(player.options.guild).name
          : "a guild"
      }`
    );

    const ret = await interaction.reply({ embeds: [autoPauseEmbed], fetchReply: true });
    if (ret) setTimeout(() => ret.delete().catch(client.warn), 20000);
    return ret;
  });

module.exports = command;
