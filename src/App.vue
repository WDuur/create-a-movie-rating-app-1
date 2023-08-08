<script setup lang="ts">
import { Ref, ref, onMounted } from "vue"
import { Movie } from "./movies"
import { useQuery, useMutation } from "@vue/apollo-composable"
import { movieQuery } from "./graphql/movies.query"
import { ratingMutation } from "./graphql/rating.mutation"
import { deleteMovieMutation } from "./graphql/deleteMovie.mutation"
import { StarIcon } from "@heroicons/vue/24/solid"
import { TrashIcon } from "@heroicons/vue/24/outline"
import NewMovie from "./components/organism/newMovie.vue"

const isModalOpen: Ref<boolean> = ref(false)
const moviesGQL = ref<Movie[]>([])
let newMovieData = ref<Movie | null>(null)

const fetchMovieList = () => {
  const { onResult: onResult } = useQuery(movieQuery, () => ({
    fetchPolicy: "no-cache",
  }))
  onResult((result) => {
    moviesGQL.value = [...(result.data?.movies ?? [])].reverse()
    console.log(moviesGQL.value)
  })
}
onMounted(() => {
  fetchMovieList()
})

/**
 * Updates the rating of a movie.
 *
 * @param {number} movieIndex - The index of the movie in the moviesGQL array.
 * @param {number} rating - The new rating for the movie.
 * @return {Promise<void>} A Promise that resolves once the rating has been updated.
 */
const { mutate: updateMovieRating } = useMutation(ratingMutation)
const updateRating = async (
  movieIndex: number,
  stars: number,
): Promise<void> => {
  const movieId = moviesGQL.value[movieIndex].id

  await updateMovieRating({
    payload: {
      id: movieId,
      stars: stars,
    },
  })

  const moviesCopy = [...moviesGQL.value]
  const updatedMovie = {
    ...moviesCopy[movieIndex],
    rating: {
      stars: stars,
    },
  }
  moviesCopy.splice(movieIndex, 1, updatedMovie)
  moviesGQL.value = moviesCopy
}

/**
 * Toggles the modal and returns the new state of isModalOpen.
 *
 * @return {boolean} The new state of isModalOpen.
 */
const toggleModal = (): boolean => {
  return (isModalOpen.value = !isModalOpen.value)
}

const { mutate: deleteMovie, onDone: deleteMovieSuccess } =
  useMutation(deleteMovieMutation)
const deleteMovies = async (id: number): Promise<void> => {
  await deleteMovie({
    deleteMovieId: id,
  })
}
deleteMovieSuccess((result: any) => {
  if (result) {
    const deletedMovieId = result.data.deleteMovie.id

    moviesGQL.value = moviesGQL.value.filter(
      (movie) => movie.id !== deletedMovieId,
    )
  }
})

let euro = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
})

const handleAddNewMovie = (data: Movie) => {
  newMovieData.value = data
  moviesGQL.value = [newMovieData.value, ...moviesGQL.value]
  toggleModal()
}
</script>

<template>
  <div class="m-overview">
    <NewMovie :is-modal-open="isModalOpen" @toggle-modal="handleAddNewMovie" />
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
          <img :src="movie?.image" />
          <StarIcon
            class="m-overview-card__star"
            :class="[
              'm-overview-card__star',
              {
                'm-overview-card__star-rating--selected':
                  movie.rating?.stars !== null,
              },
            ]"
          />
          <span class="m-overview-card__star-rating">{{
            movie.rating?.stars ? movie.rating.stars : "-"
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
            {{ movie.id }}{{ movie.description }}
          </p>
          <div class="m-overview-card-content__prices">
            <ul>
              <li v-html="`koop: ${euro.format(movie.price?.buyPrice)}`" />
              <li v-html="`huur: ${euro.format(movie.price?.rentPrice)}`" />
            </ul>
          </div>
          <span class="m-overview-card-content__rating">
            Raiting: {{ movie.rating?.stars }}/5

            <span
              ><button
                v-for="star in 5"
                :key="star"
                :disabled="movie.rating?.stars === star"
                @click="updateRating(index, star)"
              >
                <StarIcon
                  class="m-overview-card-content__star"
                  :class="
                    movie.rating !== null
                      ? star <= movie.rating?.stars
                        ? 'm-overview-card-content__star--selected'
                        : 'm-overview-card-content__star--open'
                      : 'm-overview-card-content__star--open'
                  "
                /></button
            ></span>
            <TrashIcon
              class="m-overview-card-content--delete"
              @click="deleteMovies(movie.id)"
            />
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
  @apply mx-auto px-4  lg:max-w-7xl bg-gray-900;
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
    @apply relative overflow-hidden rounded-md shadow-md bg-white text-gray-900;

    &__image {
      @apply w-full overflow-hidden aspect-square;
      img {
        @apply h-full w-full;
      }
    }
    &__star {
      @apply absolute top-1 right-1.5 text-gray-300 h-14 w-14;
      &-rating {
        @apply font-bold absolute top-5 right-7 gap-2;
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
      &__prices {
        @apply py-1;
      }
      &__rating {
        @apply flex flex-row justify-between;
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
      &--delete {
        @apply h-5 w-5 cursor-pointer hover:text-red-600;
      }
    }
  }
  &-pillow {
    @apply mt-1 rounded-md text-white bg-blue-900 px-2 py-1 text-xs gap-6;
  }
}
</style>
