import gql from "graphql-tag";

export const addMovieMutation = gql`
  mutation addMovie($payload: addNewMovie) {
    addMovie(payload: $payload) {
      id
      name
      inTheaters
      image
      genres
      description
    }
  }
`;
