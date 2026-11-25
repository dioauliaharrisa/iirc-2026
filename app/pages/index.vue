<script setup lang="ts">
// Logo rows under the menu (files in public/logos).
const sponsorGroups = [
  {
    label: "Organized by",
    size: "h-24 w-24",
    logos: [{ name: "Riichi Indonesia", src: "/logos/riichi-indonesia.svg" }],
  },
  {
    label: "Mainly sponsored by",
    size: "h-24 w-40",
    logos: [
      { name: "Toko Mahjong", src: "/logos/toko-mahjong.svg" },
      { name: "Riichi City", src: "/logos/riichi-city.png" },
    ],
  },
  {
    label: "Supported by",
    size: "h-14 w-24",
    logos: [
      { name: "XTEN", src: "/logos/xten.svg" },
      { name: "Treyo", src: "/logos/treyo.svg" },
      { name: "CLUE Board Game Cafe", src: "/clue logo high res.png" },
    ],
  },
];
// Bold rows are the non-game items (registration, breaks, ceremonies).
const schedule = [
  {
    day: "Saturday, 5 December 2026",
    items: [
      ["08:30 - 08:50", "Registration", true],
      ["08:50 - 09:00", "Opening Speech", true],
      ["09:00 - 10:15", "1st Hanchan"],
      ["10:15 - 11:30", "2nd Hanchan"],
      ["11:30 - 12:30", "Lunch Break", true],
      ["12:30 - 13:45", "3rd Hanchan"],
      ["13:45 - 15:00", "4th Hanchan"],
      ["15:00 - 16:15", "5th Hanchan"],
      ["16:15 - 17:30", "6th Hanchan"],
      ["17:30 - 18:30", "Dinner Break", true],
      ["18:30 - 19:45", "7th Hanchan"],
      ["19:45 - 21:00", "8th Hanchan"],
    ],
  },
  {
    day: "Sunday, 6 December 2026",
    items: [
      ["09:00 - 10:15", "9th Hanchan"],
      ["10:15 - 11:30", "10th Hanchan"],
      ["11:30 - 12:30", "Lunch Break", true],
      ["12:30 - 13:45", "Semi-Final 1"],
      ["13:45 - 15:00", "Semi-Final 2"],
      ["15:00 - 16:15", "Final 1"],
      ["16:15 - 17:30", "Final 2"],
      ["17:30 - 18:00", "Closing Ceremony", true],
    ],
  },
] as { day: string; items: [string, string, boolean?][] }[];
</script>

<template>
  <div class="">
    <img
      class="mx-auto block w-[min(50vh,80vw)] p-8"
      src="/logos/iirc.svg"
      alt="IIRC"
    />
    <div class="p-4 text-center text-3xl font-semibold leading-tight">
      <p class="text-blue-900">
        Indonesia <span class="text-red-800">International</span>
      </p>
      <p class="text-blue-900">Riichi Championship</p>
      <p class="text-red-800 font-bold">2026</p>
    </div>
    <div
      class="grid grid-rows-2 grid-cols-2 place-items-center bg-secondary h-[20vh] text-white font-bold text-xl"
    >
      <UModal
        scrollable
        title="Schedule"
        :close="{
          color: 'primary',
          variant: 'outline',
        }"
      >
        <div>Schedule</div>
        <template #body>
          <UCard
            class="max-w-2xl mx-auto text-sm text-white h-[50vh] overflow-y-auto"
          >
            <div v-for="(day, d) in schedule" :key="d" class="mb-6">
              <h2 class="text-lg font-bold text-center bg-primary py-2">
                {{ day.day }}
              </h2>
              <div
                class="grid grid-cols-2 gap-x-6 gap-y-2 bg-gray-100 p-4 text-gray-900"
              >
                <template v-for="(item, i) in day.items" :key="i">
                  <div :class="{ 'font-bold': item[2] }">{{ item[0] }}</div>
                  <div :class="{ 'font-bold': item[2] }">{{ item[1] }}</div>
                </template>
              </div>
            </div>
          </UCard>
        </template>
      </UModal>

      <div class="cursor-pointer" @click="$router.push('leaderboard')">
        Leaderboard
      </div>
      <div class="cursor-pointer" @click="$router.push('table-result')">
        Table Results
      </div>
      <div class="cursor-pointer" @click="$router.push('leaderboard-top-8')">
        Top 8 Leaderboard
      </div>
    </div>
    <div class="flex flex-col gap-6 px-4 py-6 text-center">
      <div v-for="group in sponsorGroups" :key="group.label">
        <p class="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
          {{ group.label }}
        </p>
        <div class="flex flex-wrap items-center justify-center gap-6">
          <img
            v-for="logo in group.logos"
            :key="logo.name"
            :src="logo.src"
            :alt="logo.name"
            :class="group.size"
            class="object-contain"
          />
        </div>
      </div>
    </div>
    <UBanner class="h-[50px]" title=" " />
  </div>
</template>
