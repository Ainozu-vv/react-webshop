import { http } from "./httpClient";

export async function listUsers() {
  const { data } = await http.get("/users");
  return data;
}

export async function getUser(id) {
  const users = await listUsers();
  const asArray = Array.isArray(users) ? users : [];
  const numericId = Number(id);
  const found = asArray.find((u) => u?.id === id || u?.id === numericId);
  if (!found) {
    throw new Error("User not found");
  }
  return found;
}

export async function patchUserPermissions(id, { add = [], remove = [] }) {
  const { data } = await http.patch(`/users/${id}/permissions`, { add, remove });
  return data;
}
