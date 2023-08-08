<script setup lang="ts">
import { ref } from "vue"
import { Movie } from "../../movies"
import { useMutation } from "@vue/apollo-composable"
import { addMovieMutation } from "../../graphql/addMovie.mutation"
import Modal from "../molecule/Modal.vue"

// const isModalOpen: Ref<boolean> = ref(false)

defineProps<{
  isModalOpen: boolean
}>()

/**
 * Generates a random integer between the given minimum and maximum values (inclusive).
 *
 * @param {number} min - The minimum value for the random integer.
 * @param {number} max - The maximum value for the random integer.
 * @return {number} The randomly generated integer.
 */
const getRandomInt = (min: number, max: number): number => {
  const range = max - min + 1
  return Math.floor(Math.random() * range) + min
}

const newMovie = ref<Movie>({
  id: getRandomInt(1, 999999),
  name: "",
  description: "",
  image: "",
  rating: {
    stars: 0,
  },
  genres: [],
  inTheaters: false,
  price: {
    buyPrice: 0,
    rentPrice: 0,
  },
})
/**
 * Submits the form.
 *
 * @return {void}
 */

const { mutate: addMovie } = useMutation(addMovieMutation)
const submitForm = async (): Promise<void> => {
  const newMovieData = {
    id: newMovie.value.id,
    name: newMovie.value.name,
    description: newMovie.value.description,
    image: newMovie.value.image,
    genres: newMovie.value.genres,

    inTheaters: newMovie.value.inTheaters,
  }

  await addMovie({
    payload: newMovieData,
  })

  emits("toggle-modal", newMovieData)
}
const emits = defineEmits(["toggle-modal"])

const toggleModal = () => {
  emits("toggle-modal")
}
</script>

<template>
  <Modal :is-modal-open="isModalOpen" @close-modal="toggleModal">
    <template #content>
      <form @submit.prevent="submitForm">
        <span class="modal-content__block">
          <label class="modal-content__label" for="name">Title:</label>
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
          <label class="modal-content__label" for="theaters">in theaters</label>
        </span>
        <span class="flex justify-end">
          <button class="modal__add-movie">Add Movie</button>
        </span>
      </form>
    </template>
  </Modal>
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
</style>
