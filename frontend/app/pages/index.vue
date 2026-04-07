<template>
  <div class="mx-auto max-w-lg px-6 py-24">
    <h1 class="text-lg font-medium text-zinc-900">Handwerkerregion</h1>
    <p class="mt-2 text-sm text-zinc-500">
      Frontend-Platzhalter. Verwaltung:
    </p>
    <NuxtLink
      to="/admin/login"
      class="mt-6 inline-block text-sm text-zinc-700 underline decoration-zinc-300 underline-offset-2 hover:text-zinc-900"
    >
      Superadmin anmelden
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' });
</script>
