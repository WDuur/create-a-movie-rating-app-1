import gql from "graphql-tag";

export const movieQuery = gql`
  query allMovies {
    allMovies {
      id
      name
      description
      image
      genres
      rating
      inTheaters
    }
  }
`;
