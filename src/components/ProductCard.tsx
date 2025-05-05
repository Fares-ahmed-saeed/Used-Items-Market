
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileAudio, FileVideo, Heart, MapPin, Sparkles, Star } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useFavorites } from '@/contexts/FavoritesContext';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const [isHovered, setIsHovered] = useState(false);

  // تنسيق التاريخ
  const formattedDate = new Date(product.createdAt).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  // دالة مساعدة للحصول على تسمية الحالة
  const getConditionLabel = (condition?: string) => {
    switch(condition) {
      case 'new': return t('جديد', 'New');
      case 'like-new': return t('شبه جديد', 'Like New');
      case 'good': return t('حالة جيدة', 'Good Condition');
      case 'used': return t('مستعمل', 'Used');
      case 'damaged': return t('به ضرر', 'Damaged');
      default: return '';
    }
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const productIsLiked = isFavorite(product.id);
    
    if (productIsLiked) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
    
    toast({
      title: productIsLiked 
        ? t('تمت إزالة المنتج من المفضلة', 'Removed from favorites') 
        : t('تمت إضافة المنتج للمفضلة', 'Added to favorites'),
      description: product.title,
    });
  };

  return (
    <Card 
      className={`overflow-hidden transition-all duration-300 cursor-pointer hover-glow splash-card ${isHovered ? 'scale-[1.03] shadow-lg' : 'scale-100'}`}
      onClick={() => onClick(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        <div className="product-image-container relative">
          <img 
            src={product.images[0] || "/placeholder.svg"} 
            alt={product.title} 
            className={`product-image h-48 w-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          
          {/* Overlay gradient on hover */}
          {isHovered && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300" />
          )}
          
          {new Date(product.createdAt) > new Date(Date.now() - 86400000 * 2) && (
            <div className="absolute top-2 right-2">
              <Badge variant="destructive" className="bg-gradient-to-r from-fuchsia-500 to-violet-600 flex items-center gap-1 animate-pulse">
                <Sparkles className="h-3 w-3" />
                {t('جديد', 'New')}
              </Badge>
            </div>
          )}
          
          {/* زر الإعجاب */}
          <button 
            className={`absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isFavorite(product.id) ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-white/100'
            }`}
            onClick={handleLikeClick}
          >
            <Heart className={`h-4 w-4 ${isFavorite(product.id) ? 'fill-white' : ''} ${isHovered && !isFavorite(product.id) ? 'animate-pulse' : ''}`} />
          </button>
          
          {/* مؤشرات الوسائط */}
          <div className="absolute bottom-2 left-2 flex gap-1">
            {product.videos && product.videos.length > 0 && (
              <Badge variant="secondary" className="bg-black bg-opacity-70 text-white">
                <FileVideo className="h-3 w-3 mr-1" /> {product.videos.length}
              </Badge>
            )}
            {product.audios && product.audios.length > 0 && (
              <Badge variant="secondary" className="bg-black bg-opacity-70 text-white">
                <FileAudio className="h-3 w-3 mr-1" /> {product.audios.length}
              </Badge>
            )}
          </div>
        </div>
        <div className="p-4">
          <h3 className={`font-medium text-lg mb-2 truncate transition-colors ${isHovered ? 'text-purple-700' : ''}`}>{product.title}</h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
          
          {/* شارات حالة المنتج والموقع */}
          <div className="flex flex-wrap gap-2 mb-3">
            {product.condition && (
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1">
                <Star className="h-3 w-3" />
                {getConditionLabel(product.condition)}
              </Badge>
            )}
            
            {product.location && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {product.location}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <span className="inline-flex px-3 py-1 rounded-full bg-gradient-to-r from-purple-600/40 to-fuchsia-600/40 text-sm font-medium text-white">{product.category}</span>
            <span className={`font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-violet-400 splash-glow transition-all ${isHovered ? 'scale-110' : ''}`}>{product.price} {t('جنيه', 'EGP')}</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground mt-3">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
