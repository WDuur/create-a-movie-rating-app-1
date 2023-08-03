import gql from "graphql-tag";

export const ratingMutation = gql`
  mutation($payload: updateMovieRating!) {
    updateRating(payload: $payload) {
      id
    }
  }
`;
