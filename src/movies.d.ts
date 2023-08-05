interface Movie {
  id: number;
  name: string;
  description: string;
  image: string;
  rating: number | null;
  genres: string[];
  inTheaters: boolean;
  price: Price;
}

interface Price {
  buyPrice: number;
  rentPrice: number;
}


export const items: Movie[];