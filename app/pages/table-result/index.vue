<script setup lang="ts">
// import type { AccordionItem } from "@nuxt/ui";
import PublicGoogleSheetsParser from "public-google-sheets-parser";

const options = { sheetName: "Display_Match_Up", useFormat: true };
const parser = new PublicGoogleSheetsParser(
  "1dL4cYaN3_5p7RGndKyIg14YcEwwcZSMedk5-QCJfMBE",
  options
);
const items = ref<{ [key: string]: string }[]>([]);
parser.parse().then((data) => {
  items.value = data.map((row, index) => ({
    label: `Hanchan ${index + 1}`,
    content: Object.entries(row).map(([key, value]) => ({
      key,
      grouped: parseTablePlayers(value),
    })),
  }));
});
const active = ref(["0"]);

const generateTableName = (i, label) => {
  if (i === 0 && (label === "Hanchan 11" || label === "Hanchan 12"))
    return "Final Table 1";
  if (i === 1 && (label === "Hanchan 11" || label === "Hanchan 12"))
    return "Final Table 2";
  return `Table ${i + 1}`;
};
</script>

<template>
  <div class="h-dvh bg-primary">
    <UAccordion
      v-model="active"
      type="multiple"
      :items="items"
      :ui="{
        item: 'text-gray-800 bg-gray-100 border-secondary last:border-b-0',
        trigger: 'px-2 text-xl bg-secondary text-white',
      }"
    >
      <template #content="{ item }">
        <div
          v-for="(entry, i) in item.content"
          :key="i"
          class="flex flex-col justify-center border border-secondary"
        >
          <div class="bg-[#99484c]">
            <h5 class="p-2 text-lg font-semibold text-white">
              {{ generateTableName(i, item.label) }}
            </h5>
          </div>
          <div
            v-for="(each, ii) in entry.grouped"
            :key="ii"
            class="p-2 flex items-center gap-3"
          >
            <span
              class="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-white"
              :title="`Seat ${seatOf(ii)}`"
            >
              {{ seatOf(ii) }}
            </span>
            <p
              @click="$router.push(`profile/${each.id}`)"
              class="flex-1 cursor-pointer"
            >
              {{ each.name }}
            </p>
            <p class="font-semibold">{{ each.score }}</p>
          </div>
        </div>
      </template>
    </UAccordion>
    <UBanner class="h-[50px]" title=" " />
  </div>
</template>
