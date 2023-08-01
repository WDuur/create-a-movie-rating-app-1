<script setup lang="ts">
import { Ref, ref } from "vue"
import { items } from "./movies.json"
import { Movie } from "./movies"

import { useQuery } from "@vue/apollo-composable"

import { movieQuery } from "./graphql/movies.query"

import { StarIcon } from "@heroicons/vue/24/solid"
import Modal from "./Modal.vue"

const { onResult: onResult } = useQuery(movieQuery, () => ({
  fetchPolicy: "no-cache",
}))

const getRandomInt = (min: number, max: number): number => {
  const range = max - min + 1
  return Math.floor(Math.random() * range) + min
}
const maxRaiting: number = 5
const isModalOpen: Ref<boolean> = ref(false)
const movieList: Movie[] = items
const movies = ref<Movie[]>(movieList)

const moviesGQL = ref<Movie[]>([])
const newMovie = ref<Movie>({
  id: getRandomInt(1, 9999),
  name: "",
  description: "",
  image: "",
  rating: null,
  genres: [],
  inTheaters: false,
})

onResult((result) => {
  moviesGQL.value = result.data?.allMovies ?? []
})
const updateRating = (movieIndex: number, rating: number): void => {
  const updatedMovies = moviesGQL.value.slice()
  const updatedMovie = { ...updatedMovies[movieIndex] }
  updatedMovie.rating = rating
  updatedMovies.splice(movieIndex, 1, updatedMovie)
  moviesGQL.value = updatedMovies
}

const toggleModal = (): boolean => {
  return (isModalOpen.value = !isModalOpen.value)
}

const submitForm = (): void => {
  movies.value.push(newMovie.value)
  toggleModal()
}
</script>

<template>
  <div class="m-overview">
    <Modal :is-modal-open="isModalOpen" @close-modal="toggleModal">
      <template #content>
        {{ newMovie }}
        <form @submit.prevent="submitForm">
          <span class="modal-content__block">
            <label class="modal-content__label" for="name">Name:</label>
            <input
              class="modal-content__input"
              type="text"
              name="name"
              v-model="newMovie.name"
          /></span>
          <span class="block">
            <label class="modal-content__label" for="description"
              >Description:</label
            >
            <textarea
              class="modal-content__input"
              name="description"
              rows="4"
              cols="50"
              v-model="newMovie.description"
            ></textarea>
          </span>
          <span class="block">
            <label class="modal-content__label" for="image">Image:</label>
            <input
              class="modal-content__input"
              type="text"
              name="image"
              v-model="newMovie.image"
          /></span>
          <span class="block">
            <label class="modal-content__label" for="grene">Grene:</label>
            <select
              name="grene"
              id="grene"
              class="modal-content__input"
              multiple
              v-model="newMovie.genres"
            >
              <option value="SyFy">SyFy</option>
              <option value="Crime">Crime</option>
              <option value="Drama">Drama</option>
              <option value="Action">Action</option>
              <option value="Adventure">Adventure</option>
              <option value="Comedy">Comedy</option>
            </select>
          </span>
          <span class="flex gap-2 py-2">
            <input
              type="checkbox"
              id="theater"
              name="vehitheaters"
              v-model="newMovie.inTheaters"
            />
            <label class="modal-content__label" for="theaters"
              >in theaters</label
            >
          </span>
          <span class="flex justify-end">
            <button class="modal__add-movie">Add Movie</button>
          </span>
        </form>
      </template>
    </Modal>

    <div class="m-overview__header">
      <h2 class="m-overview__title">Movies</h2>
      <button class="m-overview__add-movie" @click="toggleModal">
        Add Movie
      </button>
    </div>
    <div class="m-overview-movies">
      <div
        v-for="(movie, index) in moviesGQL"
        :key="index"
        class="m-overview-card"
      >
        <div class="m-overview-card__image">
          <img :src="movie.image" />
          <StarIcon
            class="m-overview-card__star"
            :class="[
              'm-overview-card__star',
              {
                'm-overview-card__star-rating--selected': movie.rating !== null,
              },
            ]"
          />
          <span class="m-overview-card__star-rating">{{
            movie.rating ? movie.rating : "-"
          }}</span>
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
              :key="star"
              :disabled="movie.rating === star"
              @click="updateRating(index, star)"
            >
              <StarIcon
                class="m-overview-card-content__star"
                :class="
                  movie.rating !== null
                    ? star <= movie.rating
                      ? 'm-overview-card-content__star--selected'
                      : 'm-overview-card-content__star--open'
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
.modal {
  &-content {
    &__block {
      @apply block;
    }
    &__label {
      @apply block py-2;
    }
    &__input {
      @apply block w-full bg-gray-800 p-2 text-white;
    }
  }

  &__add-movie {
    @apply pointer-events-auto ml-8 rounded-md bg-indigo-600 px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-indigo-500;
  }
}
.m-overview {
  @apply mx-auto px-4  lg:max-w-7xl;
  &__header {
    @apply flex justify-between items-center;
  }
  &__title {
    @apply text-2xl font-bold text-white my-10;
  }
  &__add-movie {
    @apply pointer-events-auto ml-8 rounded-md bg-indigo-600 px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-indigo-500;
  }
  &-movies {
    @apply grid gap-6 sm:grid-cols-2 lg:grid-cols-4;
  }
  &-card {
    @apply relative overflow-hidden rounded-md shadow-md bg-white;
    &__image {
      @apply w-full overflow-hidden aspect-square;
      img {
        @apply h-full w-full max-h-80;
      }
    }
    &__star {
      @apply absolute top-1 right-1.5 text-gray-300 h-14 w-14;
      &-rating {
        @apply text-gray-700 font-bold absolute top-5 right-7;
        &--selected {
          @apply text-yellow-500;
        }
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
./graphql/movies.query.cjs
