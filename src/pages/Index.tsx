
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import FilterBar from '@/components/FilterBar';
import ProductDetails from '@/components/ProductDetails';
import ChatSystem from '@/components/ChatSystem';
import { filterProducts, getAllProducts, cleanupOldProducts } from '@/data/products';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sort, setSort] = useState('default');
  const [maxPrice, setMaxPrice] = useState(100000);
  
  // New filter states
  const [condition, setCondition] = useState('all');
  const [location, setLocation] = useState('all');
  
  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  
  // Chat system states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatSellerId, setActiveChatSellerId] = useState<string | null>(null);
  
  // Product details modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Handle product click
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };
  
  // Handle chat open
  const handleOpenChat = (sellerId: string) => {
    setActiveChatSellerId(sellerId);
    setIsChatOpen(true);
  };
  
  // Calculate maximum price from all products for the slider
  useEffect(() => {
    const allProducts = getAllProducts();
    if (allProducts.length > 0) {
      const highest = Math.max(...allProducts.map(p => p.price));
      // الحد الأقصى هو 100,000 بغض النظر عن أعلى سعر موجود
      setMaxPrice(100000);
    }
  }, []);
  
  // Auto-cleanup old products when the component mounts
  useEffect(() => {
    const removedCount = cleanupOldProducts();
    if (removedCount > 0) {
      toast({
        title: t(`تم إزالة ${removedCount} إعلان`, `${removedCount} listings removed`),
        description: t("تمت إزالة الإعلانات القديمة تلقائياً (التي مر عليها أكثر من 30 يوم)", "Old listings (over 30 days) were automatically removed"),
      });
    }
  }, []);
  
  // Filter products when search or filters change
  useEffect(() => {
    const actualCategory = category === 'all' ? '' : category;
    const filtered = filterProducts(
      searchTerm,
      actualCategory,
      priceRange[0],
      priceRange[1],
      sort,
      condition,
      location,
      'all' 
    );
    setProducts(filtered);
  }, [searchTerm, category, priceRange, sort, condition, location]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* <Header /> */}
      
      <main className="container mx-auto px-4 py-6 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('سوق الأشياء المستعملة', 'Used Items Market')}</h1>
          <p className="text-muted-foreground">{t('اكتشف منتجات رائعة بأسعار مناسبة من البائعين المحليين', 'Discover great products at affordable prices from local sellers')}</p>
        </div>
        
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            placeholder={t('ابحث عن منتج...', 'Search for a product...')}
          />
        </div>
        
        {/* Filter Bar with Advanced Filters */}
        <FilterBar
          category={category}
          setCategory={setCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          maxPrice={maxPrice}
          sort={sort}
          setSort={setSort}
          condition={condition}
          setCondition={setCondition}
          location={location}
          setLocation={setLocation}
        />
        
        {/* Products Grid */}
        <div className="mt-6">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onClick={handleProductClick} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-purple-100">
              <Sparkles className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h3 className="text-xl font-medium mb-2 text-purple-800">{t('لا توجد منتجات متاحة', 'No products available')}</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {t('أضف منتجك الأول أو جرّب تغيير معايير البحث أو الفلترة!', 'Add your first product or try changing search criteria or filters!')}
              </p>
              <div className="mt-4">
                <a href="/add-listing" className="text-purple-600 hover:text-purple-800 hover:underline font-medium">
                  {t('إضافة إعلان جديد', 'Add New Listing')} &larr;
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Product Details Modal */}
      <ProductDetails 
        product={selectedProduct}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onOpenChat={handleOpenChat}
      />
      
      {/* Chat System */}
      <ChatSystem 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        sellerId={activeChatSellerId} 
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

export default Index;
