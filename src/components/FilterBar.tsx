
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Filter, Sparkles, LayoutGrid, Star, Clock, MessageCircle } from "lucide-react";
import { categories } from "@/data/categories";
import { useLanguage } from '@/contexts/LanguageContext';

interface FilterBarProps {
  category: string;
  setCategory: (category: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  maxPrice: number;
  sort: string;
  setSort: (sort: string) => void;
  condition?: string;
  setCondition?: (condition: string) => void;
  location?: string;
  setLocation?: (location: string) => void;
  seller?: string;
  setSeller?: (seller: string) => void;
}

const FilterBar = ({
  category,
  setCategory,
  priceRange,
  setPriceRange,
  maxPrice,
  sort,
  setSort,
  condition = 'all',
  setCondition = () => {},
  location = 'all',
  setLocation = () => {},
}: FilterBarProps) => {
  const { t } = useLanguage();
  
  // Available conditions for filtering
  const conditions = [
    { value: 'all', label: t('جميع الحالات', 'All Conditions') },
    { value: 'new', label: t('جديد', 'New') },
    { value: 'like-new', label: t('شبه جديد', 'Like New') },
    { value: 'good', label: t('حالة جيدة', 'Good Condition') },
    { value: 'used', label: t('مستعمل', 'Used') },
    { value: 'damaged', label: t('به ضرر', 'Damaged') }
  ];
  
  // Available locations for filtering
  const locations = [
    { value: 'all', label: t('جميع المواقع', 'All Locations') },
    { value: 'cairo', label: t('القاهرة', 'Cairo') },
    { value: 'alexandria', label: t('الإسكندرية', 'Alexandria') },
    { value: 'giza', label: t('الجيزة', 'Giza') },
    { value: 'sharm', label: t('شرم الشيخ', 'Sharm El-Sheikh') },
    { value: 'luxor', label: t('الأقصر', 'Luxor') },
    { value: 'aswan', label: t('أسوان', 'Aswan') }
  ];
  
  return (
    <div className="splash-card rounded-lg p-4 my-4">
      <div className="flex items-center mb-4 gap-2">
        <Filter className="h-5 w-5 text-fuchsia-400" />
        <h2 className="text-lg font-semibold splash-glow">{t('الفلترة والترتيب', 'Filters & Sorting')}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium mb-1 flex items-center gap-1 text-fuchsia-200">
            <LayoutGrid className="h-3 w-3 text-fuchsia-400" />
            {t('التصنيف', 'Category')}
          </label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="splash-input">
              <SelectValue placeholder={t('جميع التصنيفات', 'All Categories')} />
            </SelectTrigger>
            <SelectContent className="bg-white border-purple-500/30">
              <SelectItem value="all">{t('جميع التصنيفات', 'All Categories')}</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{t(cat, cat)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Item Condition Filter */}
        <div>
          <label className="block text-sm font-medium mb-1 flex items-center gap-1 text-fuchsia-200">
            <Star className="h-3 w-3 text-fuchsia-400" />
            {t('حالة المنتج', 'Item Condition')}
          </label>
          <Select value={condition} onValueChange={setCondition}>
            <SelectTrigger className="splash-input">
              <SelectValue placeholder={t('جميع الحالات', 'All Conditions')} />
            </SelectTrigger>
            <SelectContent className="bg-white border-purple-500/30">
              {conditions.map((cond) => (
                <SelectItem key={cond.value} value={cond.value}>{cond.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium mb-1 flex items-center gap-1 text-fuchsia-200">
            <MessageCircle className="h-3 w-3 text-fuchsia-400" />
            {t('الموقع', 'Location')}
          </label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="splash-input">
              <SelectValue placeholder={t('جميع المواقع', 'All Locations')} />
            </SelectTrigger>
            <SelectContent className="bg-white border-purple-500/30">
              {locations.map((loc) => (
                <SelectItem key={loc.value} value={loc.value}>{loc.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-medium mb-1 flex items-center gap-1 text-fuchsia-200">
            <Sparkles className="h-3 w-3 text-violet-400" />
            {t('نطاق السعر:', 'Price Range:')} {priceRange[0]} - {priceRange[1]} {t('جنيه مصري', 'EGP')}
          </label>
          <Slider
            defaultValue={[0, 100000]}
            min={0}
            max={100000}
            step={1000}
            value={[priceRange[0], priceRange[1]]}
            onValueChange={(values) => setPriceRange([values[0], values[1]])}
            className="py-4"
          />
        </div>
        
        {/* Sort Options */}
        <div>
          <label className="block text-sm font-medium mb-1 flex items-center gap-1 text-fuchsia-200">
            <Clock className="h-3 w-3 text-fuchsia-400" />
            {t('الترتيب', 'Sort By')}
          </label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="splash-input">
              <SelectValue placeholder={t('الترتيب الافتراضي', 'Default Sorting')} />
            </SelectTrigger>
            <SelectContent className="bg-white border-purple-500/30">
              <SelectItem value="default">{t('الترتيب الافتراضي', 'Default Sorting')}</SelectItem>
              <SelectItem value="price_asc">{t('السعر: من الأقل للأعلى', 'Price: Low to High')}</SelectItem>
              <SelectItem value="price_desc">{t('السعر: من الأعلى للأقل', 'Price: High to Low')}</SelectItem>
              <SelectItem value="newest">{t('الأحدث أولاً', 'Newest First')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
