import { auth } from "../state/auth.js";
import { ui } from "../ui/ui.js";
import { mockApi } from "./mockApi.js";

const BASE_URL = "/api";

async function fetchJson(path, { method = "GET", body, headers = {} } = {}) {
  const token = auth.getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const msg = data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export const apiClient = {
  async request(path, options) {
    if (ui.getApiMode() === "mock") {
      return await mockApi.request(path, options);
    }
    return await fetchJson(path, options);
  },
};

