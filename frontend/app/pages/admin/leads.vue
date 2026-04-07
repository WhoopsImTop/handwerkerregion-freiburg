<template>
  <div>
    <h1 class="text-base font-medium text-zinc-900">Anfragen</h1>
    <p class="mt-1 text-sm text-zinc-500">Eingehende Leads (Lesen &amp; Löschen)</p>
    <p v-if="err" class="mt-4 text-sm text-red-600">{{ err }}</p>
    <div class="mt-6 overflow-x-auto border border-zinc-200">
      <table class="w-full min-w-[720px] text-left text-sm">
        <thead class="border-b border-zinc-200 bg-zinc-50 text-xs text-zinc-500">
          <tr>
            <th class="px-3 py-2 font-medium">Datum</th>
            <th class="px-3 py-2 font-medium">Kategorie</th>
            <th class="px-3 py-2 font-medium">Name</th>
            <th class="px-3 py-2 font-medium">E-Mail</th>
            <th class="px-3 py-2 font-medium">Dringlichkeit</th>
            <th class="px-3 py-2 w-20" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="lead in rows" :key="lead.id" class="border-b border-zinc-100">
            <td class="px-3 py-2 whitespace-nowrap text-zinc-500">
              {{ formatDate(lead.createdAt) }}
            </td>
            <td class="px-3 py-2">{{ lead.category?.name || '–' }}</td>
            <td class="px-3 py-2">{{ lead.name }}</td>
            <td class="px-3 py-2 text-zinc-500">{{ lead.email }}</td>
            <td class="px-3 py-2 text-zinc-500">{{ lead.urgency }}</td>
            <td class="px-3 py-2 text-right">
              <button type="button" class="text-xs text-red-600 hover:text-red-800" @click="remove(lead)">
                Löschen
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' });

type LeadRow = {
  id: string;
  name: string;
  email: string;
  urgency: string;
  createdAt: string;
  category?: { name: string };
};

const { api } = useAdminApi();
const rows = ref<LeadRow[]>([]);
const err = ref('');

function formatDate(s: string) {
  try {
    return new Date(s).toLocaleString('de-DE', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  } catch {
    return s;
  }
}

async function load() {
  err.value = '';
  try {
    rows.value = await api<LeadRow[]>('/admin/leads');
  } catch (e: unknown) {
    const x = e as { data?: { error?: string } };
    err.value = x.data?.error || 'Laden fehlgeschlagen';
  }
}

async function remove(lead: LeadRow) {
  if (!confirm('Anfrage endgültig löschen?')) return;
  try {
    await api(`/admin/leads/${lead.id}`, { method: 'DELETE' });
    await load();
  } catch (e: unknown) {
    const x = e as { data?: { error?: string } };
    alert(x.data?.error || 'Löschen fehlgeschlagen');
  }
}

onMounted(load);
</script>
