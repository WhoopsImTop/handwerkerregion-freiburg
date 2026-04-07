<template>
  <div>
    <div class="flex items-end justify-between gap-4">
      <div>
        <h1 class="text-base font-medium text-zinc-900">Kategorien</h1>
        <p class="mt-1 text-sm text-zinc-500">Anlegen, bearbeiten, löschen</p>
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
      <table class="w-full min-w-[640px] text-left text-sm">
        <thead class="border-b border-zinc-200 bg-zinc-50 text-xs text-zinc-500">
          <tr>
            <th class="px-3 py-2 font-medium">Name</th>
            <th class="px-3 py-2 font-medium">Slug</th>
            <th class="px-3 py-2 font-medium w-28" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in rows" :key="c.id" class="border-b border-zinc-100">
            <td class="px-3 py-2">{{ c.name }}</td>
            <td class="px-3 py-2 text-zinc-500">{{ c.slug }}</td>
            <td class="px-3 py-2 text-right">
              <button type="button" class="text-xs text-zinc-600 hover:text-zinc-900" @click="openEdit(c)">
                Bearbeiten
              </button>
              <button type="button" class="ml-2 text-xs text-red-600 hover:text-red-800" @click="remove(c)">
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
      <div class="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-zinc-200 bg-white p-6 shadow-lg">
        <h2 class="text-sm font-medium text-zinc-900">
          {{ modal.id ? 'Kategorie bearbeiten' : 'Neue Kategorie' }}
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
            <label class="text-xs text-zinc-500">SEO-Titel</label>
            <input v-model="form.seoTitle" required class="mt-1 w-full border border-zinc-200 px-2 py-1.5 text-sm">
          </div>
          <div>
            <label class="text-xs text-zinc-500">SEO-Beschreibung</label>
            <textarea v-model="form.seoDescription" required rows="3" class="mt-1 w-full border border-zinc-200 px-2 py-1.5 text-sm" />
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

type Category = {
  id: string;
  name: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
};

const { api } = useAdminApi();
const rows = ref<Category[]>([]);
const err = ref('');
const modal = ref<Category | 'new' | null>(null);
const form = reactive({
  name: '',
  slug: '',
  seoTitle: '',
  seoDescription: '',
});
const formErr = ref('');

async function load() {
  err.value = '';
  try {
    rows.value = await api<Category[]>('/categories');
  } catch (e: unknown) {
    const x = e as { data?: { error?: string } };
    err.value = x.data?.error || 'Laden fehlgeschlagen';
  }
}

function openNew() {
  modal.value = 'new';
  form.name = '';
  form.slug = '';
  form.seoTitle = '';
  form.seoDescription = '';
  formErr.value = '';
}

function openEdit(c: Category) {
  modal.value = c;
  form.name = c.name;
  form.slug = c.slug;
  form.seoTitle = c.seoTitle;
  form.seoDescription = c.seoDescription;
  formErr.value = '';
}

async function save() {
  formErr.value = '';
  try {
    if (modal.value && modal.value !== 'new') {
      await api(`/admin/categories/${modal.value.id}`, {
        method: 'PUT',
        body: { ...form },
      });
    } else {
      await api('/admin/categories', {
        method: 'POST',
        body: { ...form },
      });
    }
    modal.value = null;
    await load();
  } catch (e: unknown) {
    const x = e as { data?: { error?: string } };
    formErr.value = x.data?.error || 'Speichern fehlgeschlagen';
  }
}

async function remove(c: Category) {
  if (!confirm(`Kategorie „${c.name}“ löschen?`)) return;
  try {
    await api(`/admin/categories/${c.id}`, { method: 'DELETE' });
    await load();
  } catch (e: unknown) {
    const x = e as { data?: { error?: string } };
    alert(x.data?.error || 'Löschen fehlgeschlagen');
  }
}

onMounted(load);
</script>
