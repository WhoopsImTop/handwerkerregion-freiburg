<template>
  <div>
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-base font-medium text-zinc-900">Unternehmen</h1>
        <p class="mt-1 text-sm text-zinc-500">CRUD, Sperren, Quelle &amp; Crawler-Status</p>
      </div>
      <button
        type="button"
        class="border border-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-900 hover:bg-zinc-900 hover:text-white"
        @click="openNew"
      >
        Neu
      </button>
    </div>

    <div class="mt-4 flex flex-wrap gap-3 text-xs">
      <label class="flex items-center gap-1.5 text-zinc-600">
        <span>Quelle</span>
        <select v-model="filters.source" class="border border-zinc-200 bg-white px-2 py-1" @change="load">
          <option value="">alle</option>
          <option value="manual">manuell</option>
          <option value="crawler">Crawler</option>
        </select>
      </label>
      <label class="flex items-center gap-1.5 text-zinc-600">
        <span>Crawler-Status</span>
        <select v-model="filters.crawlerStatus" class="border border-zinc-200 bg-white px-2 py-1" @change="load">
          <option value="">alle</option>
          <option value="none">none</option>
          <option value="pending">pending</option>
          <option value="approved">approved</option>
          <option value="rejected">rejected</option>
        </select>
      </label>
      <label class="flex items-center gap-1.5 text-zinc-600">
        <input v-model="filters.blockedOnly" type="checkbox" @change="load">
        nur gesperrt
      </label>
    </div>

    <p v-if="err" class="mt-4 text-sm text-red-600">{{ err }}</p>

    <div class="mt-6 overflow-x-auto border border-zinc-200">
      <table class="w-full min-w-[900px] text-left text-sm">
        <thead class="border-b border-zinc-200 bg-zinc-50 text-xs text-zinc-500">
          <tr>
            <th class="px-2 py-2 font-medium">Name</th>
            <th class="px-2 py-2 font-medium">Ort</th>
            <th class="px-2 py-2 font-medium">Quelle</th>
            <th class="px-2 py-2 font-medium">Crawler</th>
            <th class="px-2 py-2 font-medium">Sperre</th>
            <th class="px-2 py-2 w-40" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in rows" :key="c.id" class="border-b border-zinc-100">
            <td class="px-2 py-2">
              <span class="font-medium text-zinc-900">{{ c.name }}</span>
              <span class="block text-xs text-zinc-400">{{ c.slug }}</span>
            </td>
            <td class="px-2 py-2 text-zinc-600">{{ c.city }}</td>
            <td class="px-2 py-2 text-zinc-500">{{ c.source }}</td>
            <td class="px-2 py-2 text-zinc-500">{{ c.crawlerStatus }}</td>
            <td class="px-2 py-2">
              <span v-if="c.isBlocked" class="text-red-600">ja</span>
              <span v-else class="text-zinc-300">nein</span>
            </td>
            <td class="px-2 py-2 text-right text-xs">
              <button type="button" class="text-zinc-600 hover:text-zinc-900" @click="openEdit(c)">
                Bearbeiten
              </button>
              <button
                type="button"
                class="ml-2 text-zinc-600 hover:text-zinc-900"
                @click="toggleBlock(c)"
              >
                {{ c.isBlocked ? 'Entsperren' : 'Sperren' }}
              </button>
              <button type="button" class="ml-2 text-red-600 hover:text-red-800" @click="remove(c)">
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
      <div class="max-h-[92vh] w-full max-w-lg overflow-y-auto border border-zinc-200 bg-white p-6 shadow-lg">
        <h2 class="text-sm font-medium text-zinc-900">
          {{ modal.id ? 'Unternehmen bearbeiten' : 'Neues Unternehmen' }}
        </h2>
        <form class="mt-4 grid grid-cols-1 gap-3 text-sm" @submit.prevent="save">
          <div>
            <label class="text-xs text-zinc-500">Name *</label>
            <input v-model="form.name" required class="mt-1 w-full border border-zinc-200 px-2 py-1.5">
          </div>
          <div>
            <label class="text-xs text-zinc-500">Slug (optional)</label>
            <input v-model="form.slug" class="mt-1 w-full border border-zinc-200 px-2 py-1.5" placeholder="auto aus Name">
          </div>
          <div>
            <label class="text-xs text-zinc-500">Kategorie *</label>
            <select v-model="form.categoryId" required class="mt-1 w-full border border-zinc-200 px-2 py-1.5">
              <option disabled value="">wählen…</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="text-xs text-zinc-500">Standort</label>
            <select v-model="form.locationId" class="mt-1 w-full border border-zinc-200 px-2 py-1.5">
              <option value="">—</option>
              <option v-for="loc in locations" :key="loc.id" :value="loc.id">
                {{ loc.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="text-xs text-zinc-500">Beschreibung</label>
            <textarea v-model="form.description" rows="2" class="mt-1 w-full border border-zinc-200 px-2 py-1.5" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-xs text-zinc-500">E-Mail *</label>
              <input v-model="form.email" required type="email" class="mt-1 w-full border border-zinc-200 px-2 py-1.5">
            </div>
            <div>
              <label class="text-xs text-zinc-500">Telefon *</label>
              <input v-model="form.phone" required class="mt-1 w-full border border-zinc-200 px-2 py-1.5">
            </div>
          </div>
          <div>
            <label class="text-xs text-zinc-500">Website</label>
            <input v-model="form.website" class="mt-1 w-full border border-zinc-200 px-2 py-1.5">
          </div>
          <div>
            <label class="text-xs text-zinc-500">Adresse *</label>
            <input v-model="form.address" required class="mt-1 w-full border border-zinc-200 px-2 py-1.5">
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-xs text-zinc-500">Stadt *</label>
              <input v-model="form.city" required class="mt-1 w-full border border-zinc-200 px-2 py-1.5">
            </div>
            <div>
              <label class="text-xs text-zinc-500">PLZ *</label>
              <input v-model="form.postalCode" required class="mt-1 w-full border border-zinc-200 px-2 py-1.5">
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-xs text-zinc-500">Quelle</label>
              <select v-model="form.source" class="mt-1 w-full border border-zinc-200 px-2 py-1.5">
                <option value="manual">manuell</option>
                <option value="crawler">Crawler</option>
              </select>
            </div>
            <div>
              <label class="text-xs text-zinc-500">Crawler-Status</label>
              <select v-model="form.crawlerStatus" class="mt-1 w-full border border-zinc-200 px-2 py-1.5">
                <option value="none">none</option>
                <option value="pending">pending</option>
                <option value="approved">approved</option>
                <option value="rejected">rejected</option>
              </select>
            </div>
          </div>
          <label class="flex items-center gap-2 text-xs text-zinc-600">
            <input v-model="form.isBlocked" type="checkbox">
            gesperrt (unsichtbar öffentlich)
          </label>
          <label class="flex items-center gap-2 text-xs text-zinc-600">
            <input v-model="form.isClaimed" type="checkbox">
            beansprucht
          </label>
          <label class="flex items-center gap-2 text-xs text-zinc-600">
            <input v-model="form.isPremium" type="checkbox">
            Premium
          </label>
          <div>
            <label class="text-xs text-zinc-500">Crawler-Rohdaten (JSON, optional)</label>
            <textarea
              v-model="form.crawlerRawJson"
              rows="4"
              class="mt-1 w-full border border-zinc-200 px-2 py-1.5 font-mono text-xs"
              placeholder="{}"
            />
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

type Company = {
  id: string;
  name: string;
  slug: string;
  city: string;
  source: string;
  crawlerStatus: string;
  isBlocked: boolean;
  categoryId: string;
  locationId?: string | null;
  description?: string | null;
  email: string;
  phone: string;
  website?: string | null;
  address: string;
  postalCode: string;
  isClaimed: boolean;
  isPremium: boolean;
  crawlerRaw?: unknown;
};

type Cat = { id: string; name: string };
type Loc = { id: string; name: string };

const { api } = useAdminApi();
const rows = ref<Company[]>([]);
const categories = ref<Cat[]>([]);
const locations = ref<Loc[]>([]);
const err = ref('');
const modal = ref<Company | 'new' | null>(null);
const formErr = ref('');

const filters = reactive({
  source: '',
  crawlerStatus: '',
  blockedOnly: false,
});

const form = reactive({
  name: '',
  slug: '',
  categoryId: '',
  locationId: '',
  description: '',
  email: '',
  phone: '',
  website: '',
  address: '',
  city: '',
  postalCode: '',
  source: 'manual' as 'manual' | 'crawler',
  crawlerStatus: 'none' as string,
  isBlocked: false,
  isClaimed: false,
  isPremium: false,
  crawlerRawJson: '',
});

function resetForm() {
  form.name = '';
  form.slug = '';
  form.categoryId = categories.value[0]?.id || '';
  form.locationId = '';
  form.description = '';
  form.email = '';
  form.phone = '';
  form.website = '';
  form.address = '';
  form.city = '';
  form.postalCode = '';
  form.source = 'manual';
  form.crawlerStatus = 'none';
  form.isBlocked = false;
  form.isClaimed = false;
  form.isPremium = false;
  form.crawlerRawJson = '';
}

function fillForm(c: Company) {
  form.name = c.name;
  form.slug = c.slug;
  form.categoryId = c.categoryId;
  form.locationId = c.locationId || '';
  form.description = c.description || '';
  form.email = c.email;
  form.phone = c.phone;
  form.website = c.website || '';
  form.address = c.address;
  form.city = c.city;
  form.postalCode = c.postalCode;
  form.source = (c.source as 'manual' | 'crawler') || 'manual';
  form.crawlerStatus = c.crawlerStatus || 'none';
  form.isBlocked = c.isBlocked;
  form.isClaimed = c.isClaimed;
  form.isPremium = c.isPremium;
  form.crawlerRawJson =
    c.crawlerRaw != null ? JSON.stringify(c.crawlerRaw, null, 2) : '';
}

async function load() {
  err.value = '';
  try {
    const query: Record<string, string | undefined> = {};
    if (filters.source) query.source = filters.source;
    if (filters.crawlerStatus) query.crawlerStatus = filters.crawlerStatus;
    if (filters.blockedOnly) query.isBlocked = 'true';
    rows.value = await api<Company[]>('/admin/companies', { query });
  } catch (e: unknown) {
    const x = e as { data?: { error?: string } };
    err.value = x.data?.error || 'Laden fehlgeschlagen';
  }
}

async function loadRefs() {
  try {
    const [cats, locs] = await Promise.all([
      api<Cat[]>('/categories'),
      api<Loc[]>('/admin/locations'),
    ]);
    categories.value = cats;
    locations.value = locs;
  } catch {
    categories.value = [];
    locations.value = [];
  }
}

function openNew() {
  modal.value = 'new';
  formErr.value = '';
  resetForm();
}

function openEdit(c: Company) {
  modal.value = c;
  formErr.value = '';
  fillForm(c);
}

function parseCrawlerRaw(): unknown | undefined {
  const t = form.crawlerRawJson.trim();
  if (!t) return undefined;
  try {
    return JSON.parse(t) as unknown;
  } catch {
    throw new Error('Crawler-Rohdaten: ungültiges JSON');
  }
}

async function save() {
  formErr.value = '';
  let crawlerRaw: unknown | undefined;
  try {
    crawlerRaw = parseCrawlerRaw();
  } catch (e) {
    formErr.value = e instanceof Error ? e.message : 'JSON ungültig';
    return;
  }
  const body: Record<string, unknown> = {
    name: form.name,
    slug: form.slug || undefined,
    categoryId: form.categoryId,
    locationId: form.locationId || null,
    description: form.description || null,
    email: form.email,
    phone: form.phone,
    website: form.website || null,
    address: form.address,
    city: form.city,
    postalCode: form.postalCode,
    source: form.source,
    crawlerStatus: form.crawlerStatus,
    isBlocked: form.isBlocked,
    isClaimed: form.isClaimed,
    isPremium: form.isPremium,
    crawlerRaw: crawlerRaw ?? null,
  };
  try {
    if (modal.value && modal.value !== 'new') {
      await api(`/admin/companies/${modal.value.id}`, {
        method: 'PUT',
        body,
      });
    } else {
      await api('/admin/companies', { method: 'POST', body });
    }
    modal.value = null;
    await load();
  } catch (e: unknown) {
    const x = e as { data?: { error?: string } };
    formErr.value = x.data?.error || 'Speichern fehlgeschlagen';
  }
}

async function toggleBlock(c: Company) {
  try {
    await api(`/admin/companies/${c.id}/block`, {
      method: 'PATCH',
      body: { isBlocked: !c.isBlocked },
    });
    await load();
  } catch (e: unknown) {
    const x = e as { data?: { error?: string } };
    alert(x.data?.error || 'Aktion fehlgeschlagen');
  }
}

async function remove(c: Company) {
  if (!confirm(`„${c.name}“ unwiderruflich löschen?`)) return;
  try {
    await api(`/admin/companies/${c.id}`, { method: 'DELETE' });
    await load();
  } catch (e: unknown) {
    const x = e as { data?: { error?: string } };
    alert(x.data?.error || 'Löschen fehlgeschlagen');
  }
}

onMounted(async () => {
  await loadRefs();
  await load();
});
</script>
