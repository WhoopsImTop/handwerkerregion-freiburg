<template>
  <div class="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
    <div class="w-full max-w-sm border border-zinc-200 bg-white p-8 shadow-sm">
      <h1 class="text-sm font-medium uppercase tracking-wide text-zinc-500">
        Superadmin
      </h1>
      <p class="mt-1 text-lg font-medium text-zinc-900">Anmelden</p>
      <form class="mt-6 space-y-4" @submit.prevent="submit">
        <div>
          <label class="block text-xs text-zinc-500">E-Mail</label>
          <input
            v-model="email"
            type="email"
            required
            class="mt-1 w-full border border-zinc-200 px-2 py-1.5 text-sm focus:border-zinc-400 focus:outline-none"
            autocomplete="username"
          >
        </div>
        <div>
          <label class="block text-xs text-zinc-500">Passwort</label>
          <input
            v-model="password"
            type="password"
            required
            class="mt-1 w-full border border-zinc-200 px-2 py-1.5 text-sm focus:border-zinc-400 focus:outline-none"
            autocomplete="current-password"
          >
        </div>
        <p v-if="error" class="text-xs text-red-600">
          {{ error }}
        </p>
        <button
          type="submit"
          :disabled="loading"
          class="w-full border border-zinc-900 bg-zinc-900 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {{ loading ? '…' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { jwtPayloadRole } from '~/utils/jwtRole';

definePageMeta({ layout: false });

const route = useRoute();
const config = useRuntimeConfig();
const { token } = useAdminApi();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

onMounted(() => {
  if (route.query.forbidden) {
    error.value = 'Kein Zugriff (nur Administratoren).';
  }
});

async function submit() {
  loading.value = true;
  error.value = '';
  try {
    const res = await $fetch<{ token: string; user: { role: string } }>(
      `${config.public.apiBase}/auth/login`,
      {
        method: 'POST',
        body: { email: email.value, password: password.value },
      },
    );
    if (res.user.role !== 'admin') {
      error.value = 'Dieses Konto ist kein Administrator.';
      return;
    }
    token.value = res.token;
    if (jwtPayloadRole(res.token) !== 'admin') {
      error.value = 'Token ungültig.';
      token.value = null;
      return;
    }
    await navigateTo('/admin');
  } catch (e: unknown) {
    const err = e as { data?: { error?: string }; message?: string };
    error.value = err.data?.error || err.message || 'Login fehlgeschlagen';
  } finally {
    loading.value = false;
  }
}
</script>
