import { http } from "./httpClient";

export async function login({ username, password }) {
  const { data } = await http.post("/auth/login", { username, password });
  return data;
}

export async function register({ username, password }) {
  const { data } = await http.post("/auth/register", { username, password });
  return data;
}

export async function me() {
  const { data } = await http.get("/auth/me");
  return data;
}

export async function logout() {
  const { data } = await http.post("/auth/logout");
  return data;
}
