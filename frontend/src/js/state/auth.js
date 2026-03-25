import { storage } from "../utils/storage.js";

const KEY_TOKEN = "ts_token";
const KEY_USER = "ts_user";

export const auth = {
  isAuthenticated() {
    return Boolean(storage.get(KEY_TOKEN));
  },

  getToken() {
    return storage.get(KEY_TOKEN);
  },

  getUser() {
    return storage.getJson(KEY_USER);
  },

  setSession({ token, user }) {
    storage.set(KEY_TOKEN, token);
    storage.setJson(KEY_USER, user);
  },

  logout() {
    storage.remove(KEY_TOKEN);
    storage.remove(KEY_USER);
  },
};

