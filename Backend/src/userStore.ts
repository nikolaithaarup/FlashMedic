import crypto from "crypto";
import fs from "fs";
import path from "path";

export type User = {
  id: string;
  nickname: string;
  classLabel?: string;
  createdAt: string;
};

const USERS_FILE = path.join(__dirname, "..", "data", "users.json");

function loadUsers(): User[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
}

function saveUsers(users: User[]) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

export function createUser(nickname: string, classLabel?: string): User {
  const users = loadUsers();
  const id = crypto.randomUUID();

  const newUser: User = {
    id,
    nickname,
    classLabel,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);
  return newUser;
}

export function findUserById(id: string): User | undefined {
  const users = loadUsers();
  return users.find((u) => u.id === id);
}
