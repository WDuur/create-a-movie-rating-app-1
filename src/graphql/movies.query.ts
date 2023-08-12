import gql from "graphql-tag";

export const movieQuery = gql`
  query Movies {
    movies {
      id
      name
      description
      image
      genres
      inTheaters
    }
  }
`;

// export const movieQuery = gql`
//   query Movies {
//     movies {
//       id
//       name
//       description
//       image
//       genres
//       rating {
//         stars
//       }
//       inTheaters
//       price {
//         buyPrice
//         rentPrice
//       }
//     }
//   }
// `;
