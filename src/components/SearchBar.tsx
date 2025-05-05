
import React, { useState, useEffect } from 'react';
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  placeholder?: string;
}

const SearchBar = ({ searchTerm, setSearchTerm, placeholder = "البحث عن منتجات..." }: SearchBarProps) => {
  const [tempSearchTerm, setTempSearchTerm] = useState(searchTerm);

  // Live search effect with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setSearchTerm(tempSearchTerm);
    }, 300); // 300ms debounce time

    return () => clearTimeout(debounceTimer);
  }, [tempSearchTerm, setSearchTerm]);

  const clearSearch = () => {
    setTempSearchTerm('');
    setSearchTerm('');
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
          <Input
            type="text"
            value={tempSearchTerm}
            onChange={(e) => setTempSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="pr-10 w-full bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-300"
          />
          {tempSearchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-purple-100"
            >
              <X className="h-4 w-4 text-purple-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
