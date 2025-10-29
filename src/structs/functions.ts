import { User } from "../models/User";
import { Profile } from "../models/Profiles";
import { Friends } from "../models/Friends";
import { SaCCodes } from "../models/SaCCodes";
import { createProfiles, createUserStatsProfiles } from "./profile";
import bcrypt from "bcryptjs";
import crypto from "crypto";

function MakeID() {
  if ((crypto as any).randomUUID) return (crypto as any).randomUUID();
  return crypto.createHash('sha1').update(String(Date.now())+Math.random()).digest('hex');
}

export async function registerUser(discordId: string | null, username: string, email: string, plainPassword: string) {
  email = email.toLowerCase();

  if (!username || !email || !plainPassword) {
    return { message: "Username, email, or password is required.", status: 400 };
  }

  if (discordId && await User.findOne({ discordId })) {
    return { message: "You already created an account!", status: 400 };
  }

  if (await User.findOne({ email })) {
    return { message: "Email is already in use.", status: 400 };
  }

  const accountId = MakeID().replace(/-/ig, "");
  const matchmakingId = MakeID().replace(/-/ig, "");

  const emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (!emailFilter.test(email)) {
    return { message: "You did not provide a valid email address.", status: 400 };
  }
  if (username.length >= 25) {
    return { message: "Your username must be less than 25 characters long.", status: 400 };
  }
  if (username.length < 3) {
    return { message: "Your username must be at least 3 characters long.", status: 400 };
  }
  if (plainPassword.length >= 128) {
    return { message: "Your password must be less than 128 characters long.", status: 400 };
  }
  if (plainPassword.length < 4) {
    return { message: "Your password must be at least 4 characters long.", status: 400 };
  }

  const allowedCharacters = (" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~").split("") as string[];
  for (let character of username) {
    if (!allowedCharacters.includes(character)) {
      return { message: "Your username has special characters, please remove them and try again.", status: 400 };
    }
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  try {
    const created = new Date();
    const user = await User.create({
      created,
      discordId: discordId || null,
      accountId,
      username,
      username_lower: username.toLowerCase(),
      email,
      password: hashedPassword,
      matchmakingId
    });

    await Profile.create({ created: user.created, accountId: user.accountId, profiles: createProfiles(user.accountId) });
    await Friends.create({ created: user.created, accountId: user.accountId });
    createUserStatsProfiles(user.accountId);
  } catch (err: any) {
    if (err.code == 11000) {
      return { message: `Username or email is already in use.`, status: 400 };
    }
    console.error("registerUser error", err);
    return { message: "An unknown error has occurred, please try again later.", status: 400 };
  }

  return { message: `Successfully created an account with the username **${username}**`, status: 200 };
}
