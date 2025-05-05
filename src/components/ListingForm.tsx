
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, FileAudio, FileVideo, X, Phone, Mail, MessageSquare, Share2, Globe, Clock, Star, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { categories } from "@/data/categories";
import { Product, ContactInfo } from "@/types";
import { addProduct } from "@/data/products";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useLanguage } from '@/contexts/LanguageContext';

const ListingForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [audios, setAudios] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('images');
  
  // New product info state
  const [condition, setCondition] = useState<'new' | 'like-new' | 'good' | 'used' | 'damaged'>('new');
  const [location, setLocation] = useState('cairo');
  
  // Contact information state with proper typing
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState<'phone' | 'email' | 'platform'>('phone');
  const [contactAvailability, setContactAvailability] = useState<'anytime' | 'morning' | 'afternoon' | 'evening' | 'night'>('anytime');
  const [sharedContactInfo, setSharedContactInfo] = useState(true);
  const [profileUrl, setProfileUrl] = useState('');
  
  // Available conditions for product
  const conditions = [
    { value: 'new', label: t('جديد', 'New') },
    { value: 'like-new', label: t('شبه جديد', 'Like New') },
    { value: 'good', label: t('حالة جيدة', 'Good Condition') },
    { value: 'used', label: t('مستعمل', 'Used') },
    { value: 'damaged', label: t('به ضرر', 'Damaged') }
  ];
  
  // Available locations for product
  const locations = [
    { value: 'cairo', label: t('القاهرة', 'Cairo') },
    { value: 'alexandria', label: t('الإسكندرية', 'Alexandria') },
    { value: 'giza', label: t('الجيزة', 'Giza') },
    { value: 'sharm', label: t('شرم الشيخ', 'Sharm El-Sheikh') },
    { value: 'luxor', label: t('الأقصر', 'Luxor') },
    { value: 'aswan', label: t('أسوان', 'Aswan') }
  ];
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Limit to 5 images
    if (images.length + files.length > 5) {
      toast({
        title: t("الحد الأقصى 5 صور", "Maximum 5 images"),
        description: t("يمكنك رفع 5 صور كحد أقصى", "You can upload a maximum of 5 images"),
        variant: "destructive"
      });
      return;
    }
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle video upload
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Limit to 2 videos
    if (videos.length + files.length > 2) {
      toast({
        title: t("الحد الأقصى 2 فيديو", "Maximum 2 videos"),
        description: t("يمكنك رفع فيديوهين كحد أقصى", "You can upload a maximum of 2 videos"),
        variant: "destructive"
      });
      return;
    }
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setVideos(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle audio upload
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Limit to 3 audio files
    if (audios.length + files.length > 3) {
      toast({
        title: t("الحد الأقصى 3 ملفات صوتية", "Maximum 3 audio files"),
        description: t("يمكنك رفع 3 ملفات صوتية كحد أقصى", "You can upload a maximum of 3 audio files"),
        variant: "destructive"
      });
      return;
    }
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setAudios(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };
  
  // Remove media
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  const removeAudio = (index: number) => {
    setAudios(prev => prev.filter((_, i) => i !== index));
  };
  
  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !price || !category || (images.length === 0 && videos.length === 0 && audios.length === 0)) {
      toast({
        title: t("خطأ في النموذج", "Form Error"),
        description: t("جميع الحقول مطلوبة ويجب رفع ملف واحد على الأقل (صورة، فيديو، أو صوت)", "All fields are required and you must upload at least one file (image, video, or audio)"),
        variant: "destructive"
      });
      return;
    }
    
    if (!phone && !email) {
      toast({
        title: t("معلومات الاتصال مطلوبة", "Contact Information Required"),
        description: t("يجب إدخال رقم هاتف أو بريد إلكتروني على الأقل", "You must enter at least a phone number or email"),
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Create new product
    const newProduct: Product = {
      id: Date.now().toString(),
      title,
      description,
      price: parseFloat(price),
      category,
      images,
      videos,
      audios,
      condition,
      location,
      contactInfo: {
        phone,
        email,
        preferredContactMethod,
        availabilityHours: contactAvailability,
        showPublicly: sharedContactInfo,
        profileUrl: profileUrl || undefined
      },
      createdAt: new Date().toISOString()
    };
    
    // Add product to store
    addProduct(newProduct);
    
    toast({
      title: t("تم إضافة الإعلان بنجاح", "Listing Added Successfully"),
      description: t("تمت إضافة إعلانك وسيظهر في القائمة الرئيسية", "Your listing has been added and will appear in the main list")
    });
    
    // Redirect to homepage
    navigate('/');
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto bg-white shadow-md border border-purple-100">
      <CardHeader className="bg-gradient-to-r from-fuchsia-50 to-purple-50 border-b border-purple-100">
        <CardTitle className="text-xl font-bold text-purple-800">
          {t("إضافة إعلان جديد", "Add New Listing")}
        </CardTitle>
        <CardDescription className="text-purple-600">
          {t("أدخل معلومات المنتج الذي ترغب في بيعه", "Enter information about the product you want to sell")}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-lg border border-purple-100 shadow-sm">
            <h3 className="text-lg font-medium text-purple-900 mb-4 flex items-center">
              <Image className="h-5 w-5 text-purple-700 mr-2" />
              {t("معلومات المنتج الأساسية", "Basic Product Information")}
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-purple-800">
                  {t("عنوان الإعلان", "Listing Title")}
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("أدخل عنوان الإعلان", "Enter listing title")}
                  className="bg-white border-purple-200 focus:border-purple-400"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-purple-800">
                  {t("وصف المنتج", "Product Description")}
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("اكتب وصفاً تفصيلياً للمنتج", "Write a detailed description of the product")}
                  className="bg-white border-purple-200 focus:border-purple-400"
                  rows={4}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-purple-800">
                    {t("السعر (جنيه)", "Price (EGP)")}
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="bg-white border-purple-200 focus:border-purple-400"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-purple-800">
                    {t("التصنيف", "Category")}
                  </Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger id="category" className="bg-white border-purple-200 focus:ring-purple-400">
                      <SelectValue placeholder={t("اختر التصنيف", "Choose category")} />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat} className="focus:bg-purple-50">{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* New product condition and location section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="condition" className="flex items-center gap-2 text-purple-800">
                    <Star className="h-4 w-4 text-purple-600" />
                    {t("حالة المنتج", "Product Condition")}
                  </Label>
                  <Select 
                    value={condition} 
                    onValueChange={(value: 'new' | 'like-new' | 'good' | 'used' | 'damaged') => setCondition(value)}
                  >
                    <SelectTrigger id="condition" className="bg-white border-purple-200 focus:ring-purple-400">
                      <SelectValue placeholder={t("اختر حالة المنتج", "Choose product condition")} />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {conditions.map((cond) => (
                        <SelectItem key={cond.value} value={cond.value} className="focus:bg-purple-50">
                          {cond.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2 text-purple-800">
                    <MapPin className="h-4 w-4 text-purple-600" />
                    {t("الموقع", "Location")}
                  </Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger id="location" className="bg-white border-purple-200 focus:ring-purple-400">
                      <SelectValue placeholder={t("اختر الموقع", "Choose location")} />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {locations.map((loc) => (
                        <SelectItem key={loc.value} value={loc.value} className="focus:bg-purple-50">
                          {loc.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="p-4 bg-gradient-to-r from-fuchsia-50 to-violet-50 rounded-lg border border-purple-100 shadow-sm">
            <h3 className="text-lg font-medium text-purple-900 mb-4 flex items-center">
              <Phone className="h-5 w-5 text-purple-700 mr-2" />
              {t("معلومات الاتصال", "Contact Information")}
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2 text-purple-800">
                    <Phone className="h-4 w-4 text-purple-600" />
                    {t("رقم الهاتف", "Phone Number")}
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t("01xxxxxxxxx", "01xxxxxxxxx")}
                    className="bg-white border-purple-200 focus:border-purple-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-purple-800">
                    <Mail className="h-4 w-4 text-purple-600" />
                    {t("البريد الإلكتروني", "Email")}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("example@domain.com", "example@domain.com")}
                    className="bg-white border-purple-200 focus:border-purple-400"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferredContactMethod" className="text-purple-800">
                    {t("طريقة الاتصال المفضلة", "Preferred Contact Method")}
                  </Label>
                  <Select 
                    value={preferredContactMethod} 
                    onValueChange={(value: 'phone' | 'email' | 'platform') => setPreferredContactMethod(value)}
                  >
                    <SelectTrigger id="preferredContactMethod" className="bg-white border-purple-200 focus:ring-purple-400">
                      <SelectValue placeholder={t("اختر طريقة التواصل المفضلة", "Choose preferred contact method")} />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="phone" className="focus:bg-purple-50">{t("الهاتف", "Phone")}</SelectItem>
                      <SelectItem value="email" className="focus:bg-purple-50">{t("البريد الإلكتروني", "Email")}</SelectItem>
                      <SelectItem value="platform" className="focus:bg-purple-50">{t("رسالة نصية", "Platform Message")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactAvailability" className="flex items-center gap-2 text-purple-800">
                    <Clock className="h-4 w-4 text-purple-600" />
                    {t("أوقات التواصل المفضلة", "Preferred Contact Times")}
                  </Label>
                  <Select 
                    value={contactAvailability} 
                    onValueChange={(value: 'anytime' | 'morning' | 'afternoon' | 'evening' | 'night') => setContactAvailability(value)}
                  >
                    <SelectTrigger id="contactAvailability" className="bg-white border-purple-200 focus:ring-purple-400">
                      <SelectValue placeholder={t("أوقات التواصل", "Contact times")} />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="anytime" className="focus:bg-purple-50">{t("في أي وقت", "Anytime")}</SelectItem>
                      <SelectItem value="morning" className="focus:bg-purple-50">{t("صباحاً (8ص - 12م)", "Morning (8am - 12pm)")}</SelectItem>
                      <SelectItem value="afternoon" className="focus:bg-purple-50">{t("بعد الظهر (12م - 4م)", "Afternoon (12pm - 4pm)")}</SelectItem>
                      <SelectItem value="evening" className="focus:bg-purple-50">{t("مساءً (4م - 8م)", "Evening (4pm - 8pm)")}</SelectItem>
                      <SelectItem value="night" className="focus:bg-purple-50">{t("ليلاً (8م - 12ص)", "Night (8pm - 12am)")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="profileUrl" className="flex items-center gap-2 text-purple-800">
                    <Globe className="h-4 w-4 text-purple-600" />
                    {t("رابط الملف الشخصي (اختياري)", "Profile URL (optional)")}
                  </Label>
                  <Input
                    id="profileUrl"
                    type="url"
                    dir="ltr"
                    value={profileUrl}
                    onChange={(e) => setProfileUrl(e.target.value)}
                    placeholder={t("https://example.com/profile", "https://example.com/profile")}
                    className="bg-white border-purple-200 focus:border-purple-400"
                  />
                  <p className="text-xs text-gray-500">
                    {t("يمكنك إضافة رابط لملفك الشخصي أو موقع التواصل الاجتماعي", "You can add a link to your profile or social media")}
                  </p>
                </div>
                
                <div className="flex items-center h-full pt-6">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <input
                      type="checkbox"
                      id="sharedContactInfo"
                      checked={sharedContactInfo}
                      onChange={(e) => setSharedContactInfo(e.target.checked)}
                      className="w-4 h-4 text-purple-600 bg-gray-100 border-purple-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="sharedContactInfo" className="text-sm text-gray-700">
                      {t("اظهار معلومات الاتصال للجميع", "Show contact information to everyone")}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-lg border border-purple-100 shadow-sm">
            <Label className="text-lg font-medium text-purple-900 mb-4 flex items-center">
              <Share2 className="h-5 w-5 text-purple-700 mr-2" />
              {t("ملفات الوسائط", "Media Files")}
            </Label>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-4 bg-purple-100">
                <TabsTrigger value="images" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  <span>{t("الصور", "Images")}</span>
                </TabsTrigger>
                <TabsTrigger value="videos" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white flex items-center gap-2">
                  <FileVideo className="h-4 w-4" />
                  <span>{t("الفيديوهات", "Videos")}</span>
                </TabsTrigger>
                <TabsTrigger value="audios" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white flex items-center gap-2">
                  <FileAudio className="h-4 w-4" />
                  <span>{t("الصوتيات", "Audio")}</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="images">
                <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center bg-white">
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <label 
                    htmlFor="images" 
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Image className="h-12 w-12 text-purple-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      {t("اضغط لاختيار الصور أو اسحب وأفلت", "Click to select images or drag and drop")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t("PNG, JPG, GIF حتى 5MB (5 صور كحد أقصى)", "PNG, JPG, GIF up to 5MB (maximum 5 images)")}
                    </p>
                  </label>
                </div>
                
                {/* Image previews */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative group bg-white p-1 border border-purple-100 rounded-md overflow-hidden shadow-sm">
                        <img
                          src={img}
                          alt={t(`صورة ${index + 1}`, `Image ${index + 1}`)}
                          className="h-24 w-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="videos">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Input
                    id="videos"
                    type="file"
                    accept="video/*"
                    multiple
                    className="hidden"
                    onChange={handleVideoUpload}
                  />
                  <label 
                    htmlFor="videos" 
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <FileVideo className="h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      {t("اضغط لاختيار الفيديوهات أو اسحب وأفلت", "Click to select videos or drag and drop")}
                    </p>
                    <p className="text-xs text-gray-400">
                      {t("MP4, MOV, AVI حتى 20MB (2 فيديو كحد أقصى)", "MP4, MOV, AVI up to 20MB (maximum 2 videos)")}
                    </p>
                  </label>
                </div>
                
                {/* Video previews */}
                {videos.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {videos.map((video, index) => (
                      <div key={index} className="relative group">
                        <video
                          src={video}
                          controls
                          className="h-32 w-full object-cover rounded-md bg-black"
                        />
                        <button
                          type="button"
                          onClick={() => removeVideo(index)}
                          className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="audios">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Input
                    id="audios"
                    type="file"
                    accept="audio/*"
                    multiple
                    className="hidden"
                    onChange={handleAudioUpload}
                  />
                  <label 
                    htmlFor="audios" 
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <FileAudio className="h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      {t("اضغط لاختيار الملفات الصوتية أو اسحب وأفلت", "Click to select audio files or drag and drop")}
                    </p>
                    <p className="text-xs text-gray-400">
                      {t("MP3, WAV, OGG حتى 10MB (3 ملفات كحد أقصى)", "MP3, WAV, OGG up to 10MB (maximum 3 files)")}
                    </p>
                  </label>
                </div>
                
                {/* Audio previews */}
                {audios.length > 0 && (
                  <div className="space-y-3 mt-4">
                    {audios.map((audio, index) => (
                      <div key={index} className="relative group bg-gray-100 rounded-md p-2">
                        <div className="flex items-center">
                          <audio
                            src={audio}
                            controls
                            className="w-full"
                          />
                          <button
                            type="button"
                            onClick={() => removeAudio(index)}
                            className="ml-2 bg-gray-200 hover:bg-gray-300 rounded-full p-1 text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <CardFooter className="px-0 pt-6 flex justify-center">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 shadow-md shadow-purple-300/30"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? t('جاري النشر...', 'Publishing...') 
                : t('نشر الإعلان', 'Publish Listing')}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default ListingForm;
