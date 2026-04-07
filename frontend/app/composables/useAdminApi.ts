export function useAdminApi() {
  const config = useRuntimeConfig();
  const token = useCookie<string | null>('admin_token', {
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    default: () => null,
  });

  async function api<T>(path: string, opts: RequestInit & { query?: Record<string, string | undefined> } = {}) {
    const { query, ...rest } = opts;
    let url = `${config.public.apiBase}${path}`;
    if (query) {
      const q = new URLSearchParams();
      for (const [k, v] of Object.entries(query)) {
        if (v !== undefined && v !== '') q.set(k, v);
      }
      const s = q.toString();
      if (s) url += `?${s}`;
    }
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(rest.headers as Record<string, string>),
    };
    if (token.value) headers.Authorization = `Bearer ${token.value}`;
    return $fetch<T>(url, { ...rest, headers });
  }

  return { api, token };
}
