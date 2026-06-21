export interface Product {
  id: number;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  unit: string;
  category: "miody" | "produkty" | "zestawy";
  image: string;
  inStock: number;
  available?: boolean;
  badgeText?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
