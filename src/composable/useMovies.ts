import { nextTick, ref } from "vue";
import { Movie } from "../movies"
import { useQuery, useMutation, provideApolloClient } from "@vue/apollo-composable"
import { ApolloClient, InMemoryCache } from "@apollo/client/core";

import { movieQuery } from "../graphql/movies.query"
import { addMovieMutation } from "../graphql/addMovie.mutation"
import { deleteMovieMutation } from "../graphql/deleteMovie.mutation"
import { ratingMutation } from "../graphql/rating.mutation"


const cache = new InMemoryCache();
const apolloClient = new ApolloClient({
  uri: "http://localhost:9000/graphql",
  cache,
})

provideApolloClient(apolloClient);

const movieList = ref<Movie[]>([])

export function useMovies() { 
  
  const { onResult: onResult, refetch: fetchMovies } = useQuery(movieQuery, () => ({
    fetchPolicy: 'cache-first',
  }));
  onResult((result: any) => {
    movieList.value = [...(result.data?.movies ?? [])]
  })
 
  const getMovies = () => {
    fetchMovies()
  }

  const addNewMovie = async (newMovie: Movie) => {
    const { mutate: addMovie } = useMutation(addMovieMutation);
    const newMovieData = {
      id: Math.floor(Math.random() * 99999),
      name: newMovie.name,
      description: newMovie.description,
      image: newMovie.image ? newMovie.image : "https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg",
      genres: newMovie.genres,
      inTheaters: newMovie.inTheaters,
    }

    await addMovie({
      payload: newMovieData,
    })

    nextTick(() => {
      fetchMovies()
    }) 
  }
   

  const deleteMovie = async (id: number) => {

    const { mutate: deleteMoviePayload } = useMutation(deleteMovieMutation)
   
    await deleteMoviePayload({
      deleteMovieId: id,
    })
    
    nextTick(() => {
      fetchMovies()
    })
  }

  
  const updateRating = async (
    movieIndex: number,
    stars: number,
  ): Promise<void> => {
    const movieId = movieList.value[movieIndex].id
    const { mutate: updateMovieRating } = useMutation(ratingMutation)
    await updateMovieRating({
      payload: {
        id: movieId,
        stars: stars,
      },
    })

    const moviesCopy = [...movieList.value]
    const updatedMovie = {
      ...moviesCopy[movieIndex],
      rating: {
        stars: stars,
      },
    }
    moviesCopy.splice(movieIndex, 1, updatedMovie)
    movieList.value = moviesCopy
  }

  
	return {
		movieList,
    getMovies,
    addNewMovie,
    deleteMovie,
    updateRating,
	}
}