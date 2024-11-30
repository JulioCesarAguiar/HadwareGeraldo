import axios from 'axios';

export interface Item {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

const API_URL = 'https://fakestoreapi.com';

export const api = axios.create({
  baseURL: API_URL,
});

export const fetchItems = async (): Promise<Item[]> => {
  const response = await api.get<Item[]>('/products');
  return response.data;
};