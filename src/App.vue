<script setup>
import { items } from "./movies.json";
import { StarIcon } from "@heroicons/vue/24/solid";
</script>

<template>
  <div class="mx-auto max-w-2xl py-16">
    <h2 class="text-2xl font-bold text-white">Movies</h2>

    <div
      class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
    >
      <div
        v-for="item in items"
        :key="item.id"
        class="group relative bg-white overflow-hidden rounded-md shadow-md"
      >
        <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden">
          <img :src="item.image" class="h-full w-full max-h-[400px]" />
        </div>
        <div class="flex flex-col p-4">
          <h3 class="font-bold text-gray-700">
            {{ item.name }}
          </h3>
          <div class="flex flex-row gap-2">
            <span
              v-for="genre in item.genres"
              :key="genre"
              class="mt-1 rounded-md text-white bg-blue-900 px-2 py-1 text-xs gap-6"
              >{{ genre }}</span
            >
          </div>
          <p class="mt-1 text-sm text-gray-500 h-[100px]">
            {{ item.description }}
          </p>
          <span class="flex flex-row gap-2">
            <StarIcon
              v-for="i in item.rating"
              :key="i"
              class="text-yellow-500 h-5 w-5"
            />
          </span>
        </div>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<style lang="scss" scoped></style>
