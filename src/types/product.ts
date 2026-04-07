export type Condition = 'nguyen-seal' | 'open-box' | 'no-box';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  model: string;
  price: number;
  originalPrice?: number;
  condition: Condition;
  images: string[];
  specs: Record<string, string>;
  description: string;
  inStock: boolean;
}

export interface Category {
  name: string;
  slug: string;
  models: string[];
  image: string;
}

export const conditionLabels: Record<Condition, string> = {
  'nguyen-seal': 'Nguyên Seal',
  'open-box': 'Open Box',
  'no-box': 'No Box',
};
