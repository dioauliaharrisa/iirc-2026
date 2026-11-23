<script setup lang="ts">
import PublicGoogleSheetsParser from "public-google-sheets-parser";

type Row = {
  no?: string;
  name?: string;
  scoreTotalP?: string;
  playerID?: string;
  country?: string;
};

const parser = new PublicGoogleSheetsParser(
  "1dL4cYaN3_5p7RGndKyIg14YcEwwcZSMedk5-QCJfMBE",
  { sheetName: "Display_Leaderboard_P", useFormat: true }
);

const items = ref<Row[]>([]);
const loading = ref(true);
const query = ref("");

parser
  .parse()
  .then((data: Row[]) => {
    items.value = data.filter((row) => row.name);
  })
  .finally(() => {
    loading.value = false;
  });

// Top 8 go on to the semi finals (two semi-final tables of four).
const CUT = 8;

// Sheet errors like #N/A / #REF! or empty cells show as a dash.
const scoreText = (value?: string) => {
  if (!value || value.startsWith("#")) return "–";
  return value;
};
const scoreTone = (value?: string) => {
  const n = Number(value);
  if (!value || value.startsWith("#") || Number.isNaN(n) || n === 0)
    return "text-gray-500";
  return n > 0 ? "text-emerald-700" : "text-secondary";
};

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return items.value;
  return items.value.filter((row) => row.name?.toLowerCase().includes(q));
});
const ranked = computed(() => filtered.value.filter((row) => row.no));
const unranked = computed(() => filtered.value.filter((row) => !row.no));

const rankBadge = (no?: string) => {
  switch (Number(no)) {
    case 1:
      return "bg-amber-400 text-amber-950";
    case 2:
      return "bg-slate-300 text-slate-900";
    case 3:
      return "bg-orange-300 text-orange-950";
    default:
      return Number(no) <= CUT
        ? "bg-primary text-white"
        : "bg-gray-100 text-gray-700";
  }
};
</script>

<template>
  <div class="min-h-dvh bg-gray-50 pb-24">
    <!-- Title band -->
    <div class="bg-primary px-4 pt-6 pb-5 text-white">
      <p class="text-xs font-semibold uppercase tracking-widest text-white/60">
        IIRC 2026
      </p>
      <h1 class="text-2xl font-bold">Leaderboard</h1>
      <p class="mt-1 text-sm text-white/70">Tap a player to see their games.</p>
    </div>

    <!-- Search -->
    <div class="sticky top-0 z-10 bg-gray-50/95 px-4 py-3 backdrop-blur">
      <UInput
        v-model="query"
        icon="i-material-symbols:search"
        placeholder="Find a player"
        size="lg"
        class="w-full"
        :ui="{ base: 'bg-white' }"
      />
    </div>

    <div class="mx-auto flex max-w-2xl flex-col gap-2 px-4">
      <!-- Loading -->
      <template v-if="loading">
        <USkeleton v-for="n in 8" :key="n" class="h-16 w-full rounded-xl" />
      </template>

      <template v-else>
        <!-- Ranked players -->
        <template v-for="row in ranked" :key="row.playerID">
          <button
            type="button"
            class="flex w-full items-center gap-3 rounded-xl border bg-white px-3 py-3 text-left shadow-xs transition active:scale-[0.99] hover:border-tertiary"
            :class="Number(row.no) <= CUT ? 'border-primary/20' : 'border-gray-200'"
            @click="$router.push(`/profile/${row.playerID}`)"
          >
            <span
              class="flex size-10 shrink-0 items-center justify-center rounded-full text-base font-bold tabular-nums"
              :class="rankBadge(row.no)"
            >
              {{ row.no }}
            </span>
            <span class="min-w-0 flex-1">
              <span class="block truncate font-semibold text-gray-900">
                {{ row.name }}
              </span>
              <span class="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                <img
                  v-if="row.country"
                  :src="`https://purecatamphetamine.github.io/country-flag-icons/3x2/${row.country}.svg`"
                  :alt="row.country"
                  class="h-3 w-4.5 rounded-[2px] object-cover ring-1 ring-gray-200"
                />
                <span>{{ row.playerID }}</span>
              </span>
            </span>
            <span
              class="shrink-0 text-right text-lg font-bold tabular-nums"
              :class="scoreTone(row.scoreTotalP)"
            >
              {{ scoreText(row.scoreTotalP) }}
            </span>
          </button>

          <!-- Semi-final cut line -->
          <div
            v-if="Number(row.no) === CUT && !query"
            class="my-2 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-secondary"
          >
            <span class="h-px flex-1 bg-secondary/40" />
            Semi-final cut
            <span class="h-px flex-1 bg-secondary/40" />
          </div>
        </template>

        <!-- Players without a rank yet -->
        <template v-if="unranked.length">
          <h2
            class="mt-6 mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500"
          >
            Not ranked yet · {{ unranked.length }}
          </h2>
          <div
            class="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white"
          >
            <button
              v-for="row in unranked"
              :key="row.playerID"
              type="button"
              class="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50"
              @click="$router.push(`/profile/${row.playerID}`)"
            >
              <img
                v-if="row.country"
                :src="`https://purecatamphetamine.github.io/country-flag-icons/3x2/${row.country}.svg`"
                :alt="row.country"
                class="h-3 w-4.5 rounded-[2px] object-cover ring-1 ring-gray-200"
              />
              <span class="flex-1 truncate text-sm text-gray-800">
                {{ row.name }}
              </span>
              <span class="text-xs text-gray-400">{{ row.playerID }}</span>
            </button>
          </div>
        </template>

        <!-- Empty states -->
        <p
          v-if="!ranked.length && !unranked.length"
          class="py-12 text-center text-sm text-gray-500"
        >
          {{ query ? `No player matches “${query}”.` : "No data yet." }}
        </p>
      </template>
    </div>
  </div>
</template>
