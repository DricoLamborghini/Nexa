import fs from "fs";
import path from "path";
export function createProfiles(accountId: string) {
  try {
    const profilePath = path.join(process.cwd(), "static", "profiles", "profile_athena.json");

    if (!fs.existsSync(profilePath)) {
      console.error("[profile] Missing static/profiles/profile_athena.json!");
      return {};
    }

    // default athena load
    const raw = fs.readFileSync(profilePath, "utf-8");
    const profileData = JSON.parse(raw);

    const clonedProfile = JSON.parse(JSON.stringify(profileData));

    clonedProfile.accountId = accountId;
    if (clonedProfile._id) clonedProfile._id = accountId;
    if (clonedProfile.created) clonedProfile.created = new Date().toISOString();
    if (clonedProfile.updated) clonedProfile.updated = new Date().toISOString();

    // If it has nested structures that need the account ID
    if (clonedProfile.profiles && typeof clonedProfile.profiles === "object") {
      for (const key in clonedProfile.profiles) {
        const p = clonedProfile.profiles[key];
        if (p && typeof p === "object") {
          p.accountId = accountId;
          if (p._id) p._id = accountId + "_" + key;
          if (p.created) p.created = new Date().toISOString();
          if (p.updated) p.updated = new Date().toISOString();
        }
      }
    }

    return clonedProfile;
  } catch (err) {
    console.error("[profile] Failed to load default Athena profile:", err);
    return {};
  }
}

export function createUserStatsProfiles(accountId: string) {
  return true;
}
