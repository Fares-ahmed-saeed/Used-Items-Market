
import { Product } from "@/types";

// Initial sample data is now empty
const initialProducts: Product[] = [];

// Get products from localStorage or use initial data
const getStoredProducts = (): Product[] => {
  const storedProducts = localStorage.getItem("marketplace_products");
  return storedProducts ? JSON.parse(storedProducts) : initialProducts;
};

// Save products to localStorage
const saveProducts = (products: Product[]) => {
  localStorage.setItem("marketplace_products", JSON.stringify(products));
};

// Auto-remove products older than 30 days
const removeOldProducts = (products: Product[]): Product[] => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return products.filter(product => {
    const productDate = new Date(product.createdAt);
    return productDate > thirtyDaysAgo;
  });
};

// Initialize products and auto-remove old ones
let products = removeOldProducts(getStoredProducts());
saveProducts(products); // Save after removing old ones

// Get all products
export const getAllProducts = (): Product[] => {
  // Re-check for old products on each get to ensure old products are removed
  products = removeOldProducts(products);
  saveProducts(products);
  return products;
};

// Add a new product
export const addProduct = (product: Product) => {
  products = [...products, product];
  saveProducts(products);
  return product;
};

// Enhanced filter products with new filter options
export const filterProducts = (
  searchTerm: string = "",
  category: string = "",
  minPrice: number = 0,
  maxPrice: number = Number.MAX_SAFE_INTEGER,
  sort: string = "default",
  condition: string = "all",
  location: string = "all",
  seller: string = "all"
): Product[] => {
  // Filter by search term, category, and price range
  let filtered = products.filter(product => {
    const matchesSearch = searchTerm 
      ? product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    const matchesCategory = category ? product.category === category : true;
    
    const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
    
    const matchesCondition = condition === "all" ? true : 
      product.condition ? product.condition === condition : true;
    
    const matchesLocation = location === "all" ? true : 
      product.location ? product.location === location : true;
    
    const matchesSeller = seller === "all" ? true : 
      product.sellerType ? product.sellerType === seller : true;
    
    return matchesSearch && matchesCategory && matchesPrice && 
           matchesCondition && matchesLocation && matchesSeller;
  });
  
  // Sort the results
  switch (sort) {
    case "price_asc":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      filtered.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    default:
      // Default sorting, keep original order
      break;
  }
  
  return filtered;
};

// Add a new function to manually clean up old products
export const cleanupOldProducts = (): number => {
  const oldCount = products.length;
  products = removeOldProducts(products);
  saveProducts(products);
  return oldCount - products.length;
};

// Add function to manually delete a product by ID
export const deleteProduct = (productId: string): boolean => {
  const oldLength = products.length;
  products = products.filter(product => product.id !== productId);
  
  if (products.length !== oldLength) {
    saveProducts(products);
    return true;
  }
  return false;
};
