<template>
  <div>
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-base font-medium text-zinc-900">Crawler</h1>
        <p class="mt-1 max-w-xl text-sm text-zinc-500">
          Einträge mit Quelle „Crawler“ und Status „ausstehend“ prüfen. Nach Freigabe sind sie öffentlich sichtbar;
          Ablehnung sperrt den Datensatz.
        </p>
      </div>
      <button
        v-if="categories.length"
        type="button"
        class="border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600 hover:border-zinc-400 hover:text-zinc-900"
        @click="demoEntry"
      >
        Test-Eintrag (Demo)
      </button>
    </div>
    <p v-if="err" class="mt-4 text-sm text-red-600">{{ err }}</p>
    <p v-if="!rows.length && !err" class="mt-8 text-sm text-zinc-400">
      Keine ausstehenden Crawler-Einträge.
    </p>
    <ul v-else class="mt-6 space-y-4">
      <li
        v-for="c in rows"
        :key="c.id"
        class="border border-zinc-200 bg-white p-4 text-sm"
      >
        <div class="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p class="font-medium text-zinc-900">{{ c.name }}</p>
            <p class="text-xs text-zinc-500">{{ c.slug }} · {{ c.city }}</p>
          </div>
          <div class="flex gap-2">
            <button
              type="button"
              class="border border-zinc-900 bg-zinc-900 px-3 py-1 text-xs text-white hover:bg-zinc-800"
              @click="decide(c, 'approve')"
            >
              Freigeben
            </button>
            <button
              type="button"
              class="border border-zinc-200 px-3 py-1 text-xs text-red-700 hover:border-red-300"
              @click="decide(c, 'reject')"
            >
              Ablehnen
            </button>
          </div>
        </div>
        <details class="mt-3">
          <summary class="cursor-pointer text-xs text-zinc-500">
            Rohdaten (JSON)
          </summary>
          <pre class="mt-2 max-h-48 overflow-auto border border-zinc-100 bg-zinc-50 p-2 text-xs text-zinc-700">{{ prettyRaw(c.crawlerRaw) }}</pre>
        </details>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' });

type Company = {
  id: string;
  name: string;
  slug: string;
  city: string;
  crawlerRaw?: unknown;
};

type Category = { id: string; name: string };

const { api } = useAdminApi();
const rows = ref<Company[]>([]);
const categories = ref<Category[]>([]);
const err = ref('');

function prettyRaw(raw: unknown) {
  if (raw == null) return '—';
  try {
    return JSON.stringify(raw, null, 2);
  } catch {
    return String(raw);
  }
}

async function load() {
  err.value = '';
  try {
    rows.value = await api<Company[]>('/admin/companies', {
      query: { source: 'crawler', crawlerStatus: 'pending' },
    });
  } catch (e: unknown) {
    const x = e as { data?: { error?: string } };
    err.value = x.data?.error || 'Laden fehlgeschlagen';
  }
}

async function loadCategories() {
  try {
    categories.value = await api<Category[]>('/categories');
  } catch {
    categories.value = [];
  }
}

async function decide(c: Company, action: 'approve' | 'reject') {
  const msg =
    action === 'approve'
      ? `„${c.name}“ freigeben?`
      : `„${c.name}“ ablehnen (wird gesperrt)?`;
  if (!confirm(msg)) return;
  try {
    await api(`/admin/companies/${c.id}/crawler`, {
      method: 'PATCH',
      body: { action },
    });
    await load();
  } catch (e: unknown) {
    const x = e as { data?: { error?: string } };
    alert(x.data?.error || 'Aktion fehlgeschlagen');
  }
}

async function demoEntry() {
  const cat = categories.value[0];
  if (!cat) return;
  try {
    await api('/admin/companies', {
      method: 'POST',
      body: {
        name: `Crawler-Demo ${new Date().toISOString().slice(11, 19)}`,
        categoryId: cat.id,
        email: 'demo@crawler.local',
        phone: '0000',
        address: 'Musterstraße 1',
        city: 'Freiburg',
        postalCode: '79098',
        source: 'crawler',
        crawlerStatus: 'pending',
        isBlocked: true,
        crawlerRaw: {
          importedBy: 'admin-ui-demo',
          at: new Date().toISOString(),
          note: 'Beispiel für ein Crawler-Ergebnis',
        },
      },
    });
    await load();
  } catch (e: unknown) {
    const x = e as { data?: { error?: string } };
    alert(x.data?.error || 'Demo fehlgeschlagen');
  }
}

onMounted(async () => {
  await loadCategories();
  await load();
});
</script>
