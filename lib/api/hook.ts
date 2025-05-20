// lib/api/hooks.ts

import React from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryKey,
} from "@tanstack/react-query";
import {
  fetchData,
  fetchOne,
  createItem,
  updateItem,
  deleteItem,
} from "./api-crud";
import { stableSerialize } from "../utils";

export function useList<T, P extends Record<string, unknown>>(
  key: QueryKey,
  url: string,
  params?: P,
  defaults: Partial<P> = {}
) {
  const cleanParams = React.useMemo(
    () => cleanQueryParams(params, defaults),
    [JSON.stringify(params), JSON.stringify(defaults)]
  );
  return useQuery<T[], Error>({
    queryKey: [key, stableSerialize(cleanParams)],
    queryFn: () =>
      fetchData<{ items: T[] }>(url, cleanParams).then((r) => r.items),
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useItem<T>(
  key: QueryKey,
  url: string,
  id: number | string
) {
  return useQuery<T, Error>({
    queryKey: [key, id],
    queryFn: () => fetchOne<T>(url, String(id)),
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useCreate<T>(
  key: QueryKey,
  url: string
) {
  const qc = useQueryClient();
  return useMutation<T, Error, Partial<T>>({
    mutationFn: (data) => createItem<T>(url, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}

export function useUpdate<T>(
  key: QueryKey,
  url: string
) {
  const qc = useQueryClient();
  return useMutation<T, Error, { id: number; data: Partial<T> }>({
    mutationFn: ({ id, data }) => updateItem<T>(url, id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}

export function useDelete(
  key: QueryKey,
  url: string
) {
  const qc = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => deleteItem(url, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });
}

/**
 * Nettoie et formate de façon générique un objet de paramètres pour les requêtes.
 *
 * - fusionne avec des valeurs par défaut.
 * - filtre les clés dont la valeur est null, undefined ou chaîne vide.
 * - convertit les nombres et booléens en types primitifs, les autres en string.
 */
export function cleanQueryParams<T extends Record<string, unknown>>(
  params: T = {} as T,
  defaults: Record<string, unknown> = {}    // ← toujours un objet générique, jamais Partial<T>
): Record<string, string | number | boolean> {
  const merged = { ...defaults, ...params };
  const result: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(merged)) {
    if (value === null || value === undefined || value === "") continue;
    if (typeof value === "number" || typeof value === "boolean") {
      result[key] = value;
    } else {
      result[key] = String(value);
    }
  }

  return result;
}

