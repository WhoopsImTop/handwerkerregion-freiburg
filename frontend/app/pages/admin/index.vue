<template>
  <div>
    <h1 class="text-base font-medium text-zinc-900">Übersicht</h1>
    <p class="mt-1 text-sm text-zinc-500">
      Kennzahlen aus der API
    </p>
    <p v-if="err" class="mt-4 text-sm text-red-600">{{ err }}</p>
    <ul
      v-else-if="stats"
      class="mt-8 grid max-w-md grid-cols-2 gap-px border border-zinc-200 bg-zinc-200 text-sm"
    >
      <li v-for="row in statRows" :key="row.k" class="bg-white px-3 py-2">
        <span class="text-zinc-500">{{ row.label }}</span>
        <span class="ml-2 font-medium tabular-nums text-zinc-900">{{ row.v }}</span>
      </li>
    </ul>
    <p v-else class="mt-8 text-sm text-zinc-400">
      Lädt…
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' });

type Stats = {
  users: number;
  companies: number;
  categories: number;
  locations: number;
  leads: number;
  leadAssignments: number;
  crawlerPending: number;
  blockedCompanies: number;
};

const { api } = useAdminApi();
const stats = ref<Stats | null>(null);
const err = ref('');

const statRows = computed(() => {
  if (!stats.value) return [];
  const s = stats.value;
  return [
    { k: 'u', label: 'Nutzer', v: s.users },
    { k: 'c', label: 'Unternehmen', v: s.companies },
    { k: 'cat', label: 'Kategorien', v: s.categories },
    { k: 'loc', label: 'Standorte', v: s.locations },
    { k: 'l', label: 'Anfragen', v: s.leads },
    { k: 'a', label: 'Lead-Zuweisungen', v: s.leadAssignments },
    { k: 'cr', label: 'Crawler offen', v: s.crawlerPending },
    { k: 'bl', label: 'Gesperrte Betriebe', v: s.blockedCompanies },
  ];
});

onMounted(async () => {
  try {
    stats.value = await api<Stats>('/admin/stats');
  } catch (e: unknown) {
    const x = e as { data?: { error?: string } };
    err.value = x.data?.error || 'Statistik nicht ladbar';
  }
});
</script>
