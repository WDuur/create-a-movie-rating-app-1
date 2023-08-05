import gql from "graphql-tag";

export const movieQuery = gql`
  query Movies {
    movies {
      id
      name
      description
      image
      genres
      rating
      inTheaters
      price {
        buyPrice
        rentPrice
      }
    }
  }
`;
