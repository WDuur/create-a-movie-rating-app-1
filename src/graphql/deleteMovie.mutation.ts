import gql from "graphql-tag";

export const deleteMovieMutation = gql`
  mutation DeleteMovie($deleteMovieId: ID!) {
    deleteMovie(id: $deleteMovieId) {
      id
    }
  }
`;
