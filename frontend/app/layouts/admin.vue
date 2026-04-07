<template>
  <div class="flex min-h-screen bg-zinc-50 text-zinc-800 antialiased">
    <aside class="w-52 shrink-0 border-r border-zinc-200 bg-white px-4 py-6">
      <p class="mb-6 text-xs font-medium uppercase tracking-wider text-zinc-400">
        Superadmin
      </p>
      <nav class="flex flex-col gap-0.5 text-sm">
        <NuxtLink
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          class="rounded px-2 py-1.5 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
          active-class="bg-zinc-100 font-medium text-zinc-900"
        >
          {{ l.label }}
        </NuxtLink>
      </nav>
      <button
        type="button"
        class="mt-8 w-full rounded border border-zinc-200 px-2 py-1.5 text-left text-xs text-zinc-500 hover:border-zinc-300 hover:text-zinc-800"
        @click="logout"
      >
        Abmelden
      </button>
    </aside>
    <main class="min-w-0 flex-1 p-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { logout } = useAdminAuth();

const links = [
  { to: '/admin', label: 'Übersicht' },
  { to: '/admin/categories', label: 'Kategorien' },
  { to: '/admin/companies', label: 'Unternehmen' },
  { to: '/admin/crawler', label: 'Crawler' },
  { to: '/admin/locations', label: 'Standorte' },
  { to: '/admin/users', label: 'Nutzer' },
  { to: '/admin/leads', label: 'Anfragen' },
];
</script>
