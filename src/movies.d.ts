interface Movie {
  id: number;
  name: string;
  description: string;
  image: string;
  rating: Rating;
  genres: string[];
  inTheaters: boolean;
  price: Price;
}

interface Price {
  buyPrice: number;
  rentPrice: number;
}

interface Rating {
  stars: number ;
}


export const items: Movie[];