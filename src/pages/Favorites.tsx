
import React from 'react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import ProductDetails from '@/components/ProductDetails';
import { useState } from 'react';
import { Product } from '@/types';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Bookmark, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Favorites = () => {
  const { favorites } = useFavorites();
  const { t } = useLanguage();
  
  // حالة لعرض تفاصيل المنتج
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // معالج لنقر المنتج لفتح التفاصيل
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* <Header /> */}
      
      <main className="container mx-auto px-4 py-6 flex-1">
        <div className="mb-8 flex items-center">
          <Heart className="h-6 w-6 text-fuchsia-500 mr-2" />
          <h1 className="text-3xl font-bold">{t('المفضلة', 'Favorites')}</h1>
        </div>
        
        {/* قائمة المنتجات المفضلة */}
        <div className="mt-6">
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favorites.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onClick={handleProductClick} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-purple-100">
              <Bookmark className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h3 className="text-xl font-medium mb-2 text-purple-800">
                {t('لا توجد منتجات في المفضلة', 'No favorite products yet')}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {t('استكشف المنتجات وأضف بعضها إلى المفضلة لتجدها هنا!', 'Browse products and add some to your favorites to find them here!')}
              </p>
              <div className="mt-4">
                <Link to="/">
                  <Button variant="outline" className="hover:text-purple-800 hover:border-purple-300">
                    {t('عودة إلى المتجر', 'Back to Shop')} &larr;
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* شاشة تفاصيل المنتج */}
      <ProductDetails 
        product={selectedProduct}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onOpenChat={(sellerId) => {/* معالج الدردشة هنا */}}
      />
      
      <footer className="bg-white border-t py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>{t('جميع الإعلانات تُحذف تلقائيًا بعد 30 يومًا من النشر', 'All listings are automatically deleted 30 days after posting')}</p>
          <p className="mt-2">{t('جميع الحقوق محفوظة لتيم الطوفان', 'All rights reserved for Team Al-Tofan')} &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Favorites;
