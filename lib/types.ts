export interface Product {
  id: number;
  name: string;
  slug?: string;
  description: string;
  longDescription: string;
  price: number;
  unit: string;
  category: "miody" | "produkty" | "zestawy";
  image: string;
  inStock: number;
  available?: boolean;
  badgeText?: string;
  /** Cena jest tylko propozycją — nie wolno jej sprzedawać ani wysyłać do feedu. */
  priceProposed?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}
