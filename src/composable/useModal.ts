import { ref, Ref } from "vue";


const isModalOpen: Ref<boolean> = ref(false)
export function useModal() { 

  const toggleModal = () => {
    isModalOpen.value = !isModalOpen.value
  }

  return {
		isModalOpen,
    toggleModal,
	}
}
