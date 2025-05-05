
import React from 'react';
import Header from '@/components/Header';
import ListingForm from '@/components/ListingForm';
import { useLanguage } from '@/contexts/LanguageContext';

const AddListing = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* <Header /> */}
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-fuchsia-600 splash-glow">
            {t('إضافة إعلان جديد', 'Add New Listing')}
          </h1>
          <p className="text-purple-600">
            {t('أدخل معلومات المنتج الذي ترغب في بيعه', 'Enter information about the product you want to sell')}
          </p>
        </div>
        
        <ListingForm />
      </main>
      
      <footer className="border-t border-purple-100 py-6 mt-auto bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          {t('جميع الحقوق محفوظة لتيم الطوفان', 'All rights reserved for Team Al-Tofan')} &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default AddListing;
