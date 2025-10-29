import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from "discord.js";
import { connectDB } from "../services/mongo";
import { registerUser } from "../structs/functions";

const token = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID; // optional

if (!token) {
  console.warn("[discord] DISCORD_BOT_TOKEN not set. Bot will not start.");
} else {
  (async () => {
    await connectDB();

    const commands = [
      new SlashCommandBuilder()
        .setName("create_account")
        .setDescription("Create a Nexa account (email + username + password)")
        .addStringOption(opt => opt.setName("email").setDescription("Email address").setRequired(true))
        .addStringOption(opt => opt.setName("username").setDescription("Username").setRequired(true))
        .addStringOption(opt => opt.setName("password").setDescription("Password").setRequired(true))
        .toJSON(),
    ];

    const rest = new REST({ version: "10" }).setToken(token);

    try {
      console.log("[discord] Registering slash commands...");
      if (guildId) {
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
        console.log("[discord] Registered commands to guild", guildId);
      } else {
        await rest.put(Routes.applicationCommands(clientId), { body: commands });
        console.log("[discord] Registered global commands (may take up to 1 hour).");
      }
    } catch (err) {
      console.error("[discord] Failed to register commands:", err);
    }

    const client = new Client({ intents: [GatewayIntentBits.Guilds] });

    client.once("ready", () => {
      console.log(`[discord] Logged in as ${client.user?.tag}`);
    });

    client.on("interactionCreate", async interaction => {
      if (!interaction.isChatInputCommand()) return;
      if (interaction.commandName === "create_account") {
        const email = interaction.options.getString("email", true);
        const username = interaction.options.getString("username", true);
        const password = interaction.options.getString("password", true);

        try {
          const resp = await registerUser(interaction.user.id, username, email, password);
          if (resp.status >= 400) {
            await interaction.reply({ content: resp.message || 'Error', ephemeral: true });
            return;
          }
          await interaction.reply({ content: 'Account created successfully.', ephemeral: true });
        } catch (err) {
          console.error("[discord] Error creating account:", err);
          await interaction.reply({ content: "Server error while creating account.", ephemeral: true });
        }
      }
    });

    client.login(token);
  })();
}
