<script setup>
import { reactive } from "vue";
import { items } from "./movies.json";
import { StarIcon } from "@heroicons/vue/24/solid";

const movies = reactive(items);
const maxRaiting = 5;
</script>

<template>
  <div class="m-overview">
    <h2 class="m-overview__title">Movies</h2>

    <div class="m-overview-movies">
      <div v-for="movie in movies" :key="movie.id" class="m-overview-card">
        <div class="m-overview-card__image aspect-h-1 aspect-w-1">
          <img :src="movie.image" />
        </div>
        <div class="m-overview-card-content">
          <h3 class="m-overview-card-content__title">
            {{ movie.name }}
          </h3>
          <div class="m-overview-card-content__genres">
            <span
              v-for="genre in movie.genres"
              :key="`${movie.id}-${genre}`"
              class="m-overview-pillow"
              >{{ genre }}</span
            >
          </div>
          <p class="m-overview-card-content__description">
            {{ movie.description }}
          </p>
          <span class="m-overview-card-content__rating">
            Raiting: {{ movie.rating }}/5

            <button
              v-for="star in maxRaiting"
              :key="current"
              :disabled="movie.rating === star"
              @click="movie.rating = star"
            >
              <StarIcon
                class="m-overview-card-content__star"
                :class="
                  star <= movie.rating
                    ? 'm-overview-card-content__star--selected'
                    : 'm-overview-card-content__star--open'
                "
              />
            </button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.m-overview {
  @apply mx-auto px-4 py-16 lg:max-w-7xl;
  &__title {
    @apply text-2xl font-bold text-white;
  }
  &-movies {
    @apply grid gap-6 sm:grid-cols-2 lg:grid-cols-4;
  }
  &-card {
    @apply relative overflow-hidden rounded-md shadow-md bg-white;
    &__image {
      @apply w-full overflow-hidden;
      img {
        @apply h-full w-full max-h-80;
      }
    }
    &-content {
      @apply flex flex-col p-4 text-sm;

      &__title {
        @apply font-bold text-gray-700;
      }
      &__genres {
        @apply flex flex-row gap-2;
      }
      &__description {
        @apply mt-1 text-gray-500 h-28;
      }
      &__rating {
        @apply flex flex-row;
      }
      &__star {
        @apply text-gray-100 h-5 w-5;

        &--selected {
          @apply text-yellow-500;
        }
        &--open {
          @apply text-gray-300;
        }
      }
    }
  }
  &-pillow {
    @apply mt-1 rounded-md text-white bg-blue-900 px-2 py-1 text-xs gap-6;
  }
}
</style>
