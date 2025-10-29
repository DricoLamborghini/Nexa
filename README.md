# Nexa

Nexa is a Fortnite backend for all versions of fortnite!

This will be finished during my free time

If you want to contribute just fork this repository and make a pull request!

> [!TIP]
> Join the discord server for support! https://discord.gg/nexa-1229545680641462282

> [!WARNING]
> We do not accept any liability for the misuse of this program. Epic Games strictly prohibits the presence of cosmetics not bought from the game's official item shop on private servers, as it breaches the End User License Agreement (EULA).

## Todo

- Complete MCP

To install bun go [here](https://bun.sh/docs/installation)

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/index.ts
```

# Used API's

<img src="https://api.nitestats.com/v1/static/ns-logo.png" width="15" title="NiteStats-API"> [NiteStats API](https://nitestats.com/)

# Credits

- [Hybrid](https://github.com/HybridFNBR) for Discovery for 26.30+ and MOTD

- [Zetax](https://github.com/simplyzetax) for Error responses


## Added features
- MongoDB connection using mongoose (src/services/mongo.ts)
- User model (src/models/User.ts)
- Discord bot with `/create_account` slash command (src/discord/bot.ts)

## Setup
1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies: `bun i` or `npm install` (project uses bun by default)
3. Build / run according to your environment.

**Note:** Passwords are currently stored in plaintext in the DB for simplicity — I recommend hashing with bcrypt before production.
