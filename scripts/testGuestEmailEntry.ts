import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(__dirname, "..");
const home = readFileSync(path.join(root, "src/features/home/HomeScreen.tsx"), "utf8");
const profile = readFileSync(path.join(root, "src/features/profile/ProfileScreen.tsx"), "utf8");
const app = readFileSync(path.join(root, "app/index.tsx"), "utf8");

// The invitation must never appear for a signed-in account.
assert.match(home, /profileIsAnonymous\s*\?\s*\(\s*<Pressable/s);
assert.match(home, /accessibilityLabel="Log ind med e-mail og synkroniser din fremgang"/);
assert.match(home, /onPress=\{onOpenProfile\}/);
assert.match(home, /<Text style=\{styles.guestLoginTitle\}>Log ind med e-mail<\/Text>/);

// The same Firebase identity that owns the session determines guest status;
// changing the local nickname must not convert a guest into an account.
assert.match(app, /profileIsAnonymous=\{auth\.currentUser\?\.isAnonymous \?\? !!profile\?\.isAnonymous\}/);
assert.match(profile, /const isAnonymous = auth\.currentUser\?\.isAnonymous \?\? profile\?\.isAnonymous \?\? true;/);
assert.doesNotMatch(profile, /nickname: name,\s*isAnonymous: false/);

// One tap must expose the real existing email challenge form before long stats.
const header = profile.indexOf('title="Min læring"');
const login = profile.indexOf('>Log ind med e-mail</Text>');
const form = profile.indexOf('<SynapseEmailLogin');
const stats = profile.indexOf('>OVERBLIK</Text>');
assert(header >= 0 && login > header && form > login && stats > form);
assert.equal(profile.match(/<SynapseEmailLogin\b/g)?.length, 1);

// No authentication side effects, redirects, or logout are introduced by the CTA.
assert.doesNotMatch(home, /signOutSynapseAccount|verifySynapseCode|setScreen\("auth"\)/);
console.log("Guest email entry: visible guest-only action, existing login form, preserved guest identity verified.");
