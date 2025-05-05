
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types';

type FavoritesContextType = {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [favorites, setFavorites] = useState<Product[]>([]);

  // استيراد المفضلة من التخزين المحلي عند تحميل الموقع
  useEffect(() => {
    const storedFavorites = localStorage.getItem('marketplace_favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // تخزين المفضلة في التخزين المحلي عند التغيير
  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem('marketplace_favorites', JSON.stringify(favorites));
    } else {
      localStorage.removeItem('marketplace_favorites');
    }
  }, [favorites]);

  const addToFavorites = (product: Product) => {
    setFavorites((prev) => [...prev, product]);
  };

  const removeFromFavorites = (productId: string) => {
    setFavorites((prev) => prev.filter((product) => product.id !== productId));
  };

  const isFavorite = (productId: string) => {
    return favorites.some((product) => product.id === productId);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
