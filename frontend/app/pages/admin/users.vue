<template>
  <div>
    <h1 class="text-base font-medium text-zinc-900">Nutzer</h1>
    <p class="mt-1 text-sm text-zinc-500">Konten sperren oder freigeben</p>
    <p v-if="err" class="mt-4 text-sm text-red-600">{{ err }}</p>
    <div class="mt-6 overflow-x-auto border border-zinc-200">
      <table class="w-full min-w-[520px] text-left text-sm">
        <thead class="border-b border-zinc-200 bg-zinc-50 text-xs text-zinc-500">
          <tr>
            <th class="px-3 py-2 font-medium">E-Mail</th>
            <th class="px-3 py-2 font-medium">Rolle</th>
            <th class="px-3 py-2 font-medium">Status</th>
            <th class="px-3 py-2 w-32" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in rows" :key="u.id" class="border-b border-zinc-100">
            <td class="px-3 py-2">{{ u.email }}</td>
            <td class="px-3 py-2 text-zinc-500">{{ u.role }}</td>
            <td class="px-3 py-2">
              <span v-if="u.isBlocked" class="text-red-600">gesperrt</span>
              <span v-else class="text-zinc-400">aktiv</span>
            </td>
            <td class="px-3 py-2 text-right">
              <button
                v-if="!u.isBlocked"
                type="button"
                class="text-xs text-red-600 hover:text-red-800"
                @click="setBlock(u, true)"
              >
                Sperren
              </button>
              <button
                v-else
                type="button"
                class="text-xs text-zinc-600 hover:text-zinc-900"
                @click="setBlock(u, false)"
              >
                Entsperren
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

type UserRow = {
  id: string;
  email: string;
  role: string;
  isBlocked: boolean;
};

const { api } = useAdminApi();
const rows = ref<UserRow[]>([]);
const err = ref('');

async function load() {
  err.value = '';
  try {
    rows.value = await api<UserRow[]>('/admin/users');
  } catch (e: unknown) {
    const x = e as { data?: { error?: string } };
    err.value = x.data?.error || 'Laden fehlgeschlagen';
  }
}

async function setBlock(u: UserRow, isBlocked: boolean) {
  const msg = isBlocked
    ? `Nutzer „${u.email}“ sperren?`
    : `Sperre für „${u.email}“ aufheben?`;
  if (!confirm(msg)) return;
  try {
    await api(`/admin/users/${u.id}/block`, {
      method: 'PATCH',
      body: { isBlocked },
    });
    await load();
  } catch (e: unknown) {
    const x = e as { data?: { error?: string } };
    alert(x.data?.error || 'Aktion fehlgeschlagen');
  }
}

onMounted(load);
</script>
