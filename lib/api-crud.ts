import api from "./api";

export async function fetchData<T>(endpoint: string, params?: Record<string, any>): Promise<T>{
  const response = await api.get(endpoint, {params})
  return response.data
}

export async function fetchOne<T>(endpoint: string, id: string): Promise<T>{
  const response = await api.get(`${endpoint}/${id}`)
  return response.data
}

export async function createItem<T, D = any>(endpoint: string, data: D): Promise<T> {
  const response = await api.post(endpoint, data);
  return response.data;
}

export async function updateItem<T, D = any>(endpoint: string, id: number, data: D): Promise<T> {
  const response = await api.put(`${endpoint}/${id}`, data);
  return response.data;
}

export async function deleteItem(endpoint: string, id: number): Promise<void> {
  await api.delete(`${endpoint}/${id}`);
}
