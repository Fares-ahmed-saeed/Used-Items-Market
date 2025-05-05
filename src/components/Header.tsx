
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Heart, PenSquare, Sparkles } from 'lucide-react';
import SearchBar from './SearchBar';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFavorites } from '@/contexts/FavoritesContext';

const Header = () => {
  const { t } = useLanguage();
  const { favorites } = useFavorites();
  
  return (
    <header className="border-b border-purple-100 bg-white shadow-sm hidden md:block">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-400 splash-glow flex items-center">
            <Sparkles className="h-5 w-5 mr-1 text-fuchsia-400" />
            {t('سوق الأشياء المستعملة', 'Used Items Market')}
          </Link>
        </div>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="relative mx-5">
            <SearchBar searchTerm="" setSearchTerm={() => {}} placeholder={t('ابحث عن منتج...', 'Search for a product...')} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/favorites" className="relative">
            <Button variant="outline" className="flex items-center gap-1 border-purple-200 hover:border-purple-300">
              <Heart className="h-4 w-4 text-fuchsia-500" />
              <span>{t('المفضلة', 'Favorites')}</span>
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-fuchsia-500 text-white text-xs rounded-full">
                  {favorites.length}
                </span>
              )}
            </Button>
          </Link>
          <LanguageSwitcher />
          <Link to="/add-listing">
            <Button className="flex items-center gap-2 bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-700 hover:to-violet-700 text-white shadow-md">
              <PenSquare className="h-4 w-4" />
              <span>{t('إضافة إعلان جديد', 'Add New Listing')}</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
