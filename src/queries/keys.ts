// queries/keys.ts
export const qk = {
  regularDetail: (id: string) => ["regular", "detail", id] as const,
  regularGroups: (id: string) => ["regular", "groups", id] as const,
};
