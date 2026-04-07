<template>
  <div>
    <div class="flex items-end justify-between gap-4">
      <div>
        <h1 class="text-base font-medium text-zinc-900">Standorte</h1>
        <p class="mt-1 text-sm text-zinc-500">Orte für SEO / Filter</p>
      </div>
      <button
        type="button"
        class="border border-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-900 hover:bg-zinc-900 hover:text-white"
        @click="openNew"
      >
        Neu
      </button>
    </div>
    <p v-if="err" class="mt-4 text-sm text-red-600">{{ err }}</p>
    <div class="mt-6 overflow-x-auto border border-zinc-200">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-zinc-200 bg-zinc-50 text-xs text-zinc-500">
          <tr>
            <th class="px-3 py-2 font-medium">Name</th>
            <th class="px-3 py-2 font-medium">Slug</th>
            <th class="px-3 py-2 font-medium">PLZ</th>
            <th class="px-3 py-2 w-28" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="l in rows" :key="l.id" class="border-b border-zinc-100">
            <td class="px-3 py-2">{{ l.name }}</td>
            <td class="px-3 py-2 text-zinc-500">{{ l.slug }}</td>
            <td class="px-3 py-2 text-zinc-500">{{ l.postalCode || '–' }}</td>
            <td class="px-3 py-2 text-right">
              <button type="button" class="text-xs text-zinc-600 hover:text-zinc-900" @click="openEdit(l)">
                Bearbeiten
              </button>
              <button type="button" class="ml-2 text-xs text-red-600" @click="remove(l)">
                Löschen
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="modal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      @click.self="modal = null"
    >
      <div class="w-full max-w-md border border-zinc-200 bg-white p-6 shadow-lg">
        <h2 class="text-sm font-medium text-zinc-900">
          {{ modal.id ? 'Standort bearbeiten' : 'Neuer Standort' }}
        </h2>
        <form class="mt-4 space-y-3" @submit.prevent="save">
          <div>
            <label class="text-xs text-zinc-500">Name</label>
            <input v-model="form.name" required class="mt-1 w-full border border-zinc-200 px-2 py-1.5 text-sm">
          </div>
          <div>
            <label class="text-xs text-zinc-500">Slug</label>
            <input v-model="form.slug" required class="mt-1 w-full border border-zinc-200 px-2 py-1.5 text-sm">
          </div>
          <div>
            <label class="text-xs text-zinc-500">Postleitzahl (optional)</label>
            <input v-model="form.postalCode" class="mt-1 w-full border border-zinc-200 px-2 py-1.5 text-sm">
          </div>
          <p v-if="formErr" class="text-xs text-red-600">{{ formErr }}</p>
          <div class="flex gap-2 pt-2">
            <button type="submit" class="border border-zinc-900 bg-zinc-900 px-3 py-1.5 text-xs text-white">
              Speichern
            </button>
            <button type="button" class="border border-zinc-200 px-3 py-1.5 text-xs" @click="modal = null">
              Abbrechen
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' });

type Loc = { id: string; name: string; slug: string; postalCode?: string | null };

const { api } = useAdminApi();
const rows = ref<Loc[]>([]);
const err = ref('');
const modal = ref<Loc | 'new' | null>(null);
const form = reactive({ name: '', slug: '', postalCode: '' });
const formErr = ref('');

async function load() {
  err.value = '';
  try {
    rows.value = await api<Loc[]>('/admin/locations');
  } catch (e: unknown) {
    const x = e as { data?: { error?: string } };
    err.value = x.data?.error || 'Laden fehlgeschlagen';
  }
}

function openNew() {
  modal.value = 'new';
  form.name = '';
  form.slug = '';
  form.postalCode = '';
  formErr.value = '';
}

function openEdit(l: Loc) {
  modal.value = l;
  form.name = l.name;
  form.slug = l.slug;
  form.postalCode = l.postalCode || '';
  formErr.value = '';
}

async function save() {
  formErr.value = '';
  try {
    const body = {
      name: form.name,
      slug: form.slug,
      postalCode: form.postalCode || null,
    };
    if (modal.value && modal.value !== 'new') {
      await api(`/admin/locations/${modal.value.id}`, { method: 'PUT', body });
    } else {
      await api('/admin/locations', { method: 'POST', body });
    }
    modal.value = null;
    await load();
  } catch (e: unknown) {
    const x = e as { data?: { error?: string } };
    formErr.value = x.data?.error || 'Speichern fehlgeschlagen';
  }
}

async function remove(l: Loc) {
  if (!confirm(`„${l.name}“ löschen?`)) return;
  try {
    await api(`/admin/locations/${l.id}`, { method: 'DELETE' });
    await load();
  } catch (e: unknown) {
    const x = e as { data?: { error?: string } };
    alert(x.data?.error || 'Löschen fehlgeschlagen');
  }
}

onMounted(load);
</script>
