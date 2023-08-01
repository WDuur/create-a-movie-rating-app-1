declare module './graphql/movies.query.cjs' {

  export interface Movie {
    id: number;
    name: string;
    description: string;
    image: string;
    rating: number | null;
    genres: string[];
    inTheaters: boolean;
  }
}



