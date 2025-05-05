
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";
import { Calendar, FileAudio, FileVideo, X, Phone, Mail, MessageSquare, Globe, Clock, BadgeCheck, Shield } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProductDetailsProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenChat?: (sellerId: string) => void;
}

const ProductDetails = ({ product, isOpen, onClose, onOpenChat }: ProductDetailsProps) => {
  const { t } = useLanguage();
  const [contactSheetOpen, setContactSheetOpen] = useState(false);
  const [messageText, setMessageText] = useState('');

  if (!product) return null;

  const formattedDate = new Date(product.createdAt).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  const handleContactClick = (method: string) => {
    const contactInfo = product.contactInfo || {};
    
    if (method === 'phone' && contactInfo.phone) {
      // Copy phone number to clipboard
      navigator.clipboard.writeText(contactInfo.phone)
        .then(() => toast({ title: t("تم نسخ رقم الهاتف", "Phone number copied"), description: t("يمكنك الآن التواصل مع البائع", "You can now contact the seller") }))
        .catch(err => console.error('فشل نسخ الرقم: ', err));
    } else if (method === 'email' && contactInfo.email) {
      // Open email client
      window.location.href = `mailto:${contactInfo.email}?subject=${t("استفسار حول", "Inquiry about")} ${product.title}`;
    } else if (method === 'message') {
      if (messageText.trim() === '') {
        toast({ 
          title: t("الرسالة فارغة", "Message is empty"), 
          description: t("يرجى كتابة رسالتك قبل الإرسال", "Please write your message before sending"),
          variant: "destructive" 
        });
      } else {
        // Close the contact sheet after selecting the contact method
        setContactSheetOpen(false);
        toast({ 
          title: t("تم إرسال رسالتك", "Your message has been sent"), 
          description: t("سيتم الرد عليك قريبًا من قبل البائع", "The seller will respond to you soon") 
        });
        setMessageText('');
      }
    } else if (method === 'chat' && onOpenChat) {
      // Close product details and open chat
      onClose();
      // Use seller1 as a default seller ID if not present in product
      const sellerId = product.sellerId || 'seller1';
      onOpenChat(sellerId);
    } else {
      toast({
        title: t("معلومات الاتصال غير متوفرة", "Contact information not available"),
        description: t("لم يقم البائع بتوفير معلومات الاتصال هذه", "The seller has not provided this contact information"),
        variant: "destructive"
      });
    }
  };

  // Format availability hours
  const getAvailabilityText = (availability: string) => {
    switch(availability) {
      case 'morning': return t('صباحاً (8ص - 12م)', 'Morning (8AM - 12PM)');
      case 'afternoon': return t('بعد الظهر (12م - 4م)', 'Afternoon (12PM - 4PM)');
      case 'evening': return t('مساءً (4م - 8م)', 'Evening (4PM - 8PM)');
      case 'night': return t('ليلاً (8م - 12ص)', 'Night (8PM - 12AM)');
      default: return t('في أي وقت', 'Anytime');
    }
  };

  // Determine which contact methods are available
  const hasPhone = product.contactInfo?.phone && product.contactInfo.phone.trim() !== '';
  const hasEmail = product.contactInfo?.email && product.contactInfo.email.trim() !== '';
  const preferredMethod = product.contactInfo?.preferredContactMethod || 'phone';
  const availabilityHours = product.contactInfo?.availabilityHours || 'anytime';
  const showPublicly = product.contactInfo?.showPublicly !== false;
  const profileUrl = product.contactInfo?.profileUrl;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-right text-purple-900">{product.title}</DialogTitle>
          <DialogDescription className="text-right flex items-center justify-end gap-2 text-purple-600">
            <Calendar className="h-4 w-4" />
            {t("تم النشر في", "Posted on")} {formattedDate}
          </DialogDescription>
        </DialogHeader>
        <DialogClose className="absolute left-4 top-4">
          <X className="h-4 w-4" />
          <span className="sr-only">{t("إغلاق", "Close")}</span>
        </DialogClose>

        {/* Product Images Carousel */}
        <div className="mt-4">
          {product.images && product.images.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {product.images.map((image, index) => (
                  <CarouselItem key={index} className="basis-full">
                    <div className="border border-purple-100 rounded-lg p-1 overflow-hidden bg-white">
                      <img
                        src={image}
                        alt={`${t("صورة", "Image")} ${index + 1} ${t("للمنتج", "of product")}`}
                        className="w-full h-64 object-contain rounded-md"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="border-purple-200 bg-white text-purple-700 hover:bg-purple-50" />
              <CarouselNext className="border-purple-200 bg-white text-purple-700 hover:bg-purple-50" />
            </Carousel>
          ) : (
            <div className="border border-purple-100 rounded-lg p-1 overflow-hidden bg-white">
              <img
                src="/placeholder.svg"
                alt={t("صورة افتراضية", "Placeholder image")}
                className="w-full h-64 object-contain rounded-md"
              />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="mt-6 space-y-4 text-right">
          <div className="flex justify-between items-center">
            <Badge className="text-lg py-1 px-3 bg-gradient-to-r from-purple-600 to-fuchsia-600">{product.price} {t("جنيه", "EGP")}</Badge>
            <Badge variant="outline" className="border-purple-200 text-purple-700 bg-purple-50">{product.category}</Badge>
          </div>
          
          <div className="mt-4 bg-white p-4 rounded-lg border border-purple-100">
            <h3 className="text-lg font-medium mb-2 text-purple-900">{t("الوصف", "Description")}</h3>
            <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
          </div>

          {/* Media Section (if available) */}
          {((product.videos && product.videos.length > 0) || (product.audios && product.audios.length > 0)) && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3 text-purple-900">{t("الوسائط المرفقة", "Attached Media")}</h3>
              
              {/* Videos */}
              {product.videos && product.videos.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-md font-medium mb-2 flex items-center text-purple-800">
                    <FileVideo className="h-4 w-4 ml-1" /> {t("فيديوهات", "Videos")}
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {product.videos.map((video, index) => (
                      <div key={index} className="rounded-md overflow-hidden bg-white border border-purple-100">
                        <video controls className="w-full">
                          <source src={video} />
                          {t("متصفحك لا يدعم تشغيل الفيديو", "Your browser does not support video playback")}
                        </video>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Audios */}
              {product.audios && product.audios.length > 0 && (
                <div>
                  <h4 className="text-md font-medium mb-2 flex items-center text-purple-800">
                    <FileAudio className="h-4 w-4 ml-1" /> {t("تسجيلات صوتية", "Audio Recordings")}
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {product.audios.map((audio, index) => (
                      <div key={index} className="rounded-md overflow-hidden bg-white border border-purple-100 p-3">
                        <audio controls className="w-full">
                          <source src={audio} />
                          {t("متصفحك لا يدعم تشغيل الصوت", "Your browser does not support audio playback")}
                        </audio>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Contact Section - Enhanced */}
          <div className="mt-6 bg-gradient-to-r from-purple-50 to-fuchsia-50 p-4 rounded-lg border border-purple-100">
            <div className="flex justify-between items-center">
              <Badge variant="outline" className="bg-white border-purple-200 text-purple-700 flex items-center gap-1">
                <Shield className="h-3 w-3" /> {t("تواصل آمن", "Safe Communication")}
              </Badge>
              <h3 className="text-lg font-medium text-purple-900 flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-purple-600" />
                {t("تواصل مع البائع", "Contact the Seller")}
              </h3>
            </div>
            
            {showPublicly && (hasPhone || hasEmail) ? (
              <div className="mt-4">
                <div className="bg-white p-4 rounded-lg border border-purple-100 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {profileUrl ? (
                        <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 text-sm hover:underline">
                          {t("زيارة الملف الشخصي", "Visit Profile")}
                        </a>
                      ) : null}
                      
                      <div className="flex flex-col items-end">
                        <h4 className="font-medium text-purple-900">{t("البائع", "Seller")}</h4>
                        <p className="text-sm text-gray-500">
                          {t("عضو منذ", "Member since")} {new Date(product.createdAt).toLocaleDateString('ar-EG', {year: 'numeric', month: 'short'})}
                        </p>
                      </div>
                    </div>
                    
                    <Avatar className="h-12 w-12 border-2 border-purple-100">
                      <AvatarFallback className="bg-gradient-to-r from-purple-200 to-fuchsia-200 text-purple-700">
                        {product.title.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-right">
                    {hasPhone && (
                      <div className="bg-purple-50 p-3 rounded-md flex justify-between items-center">
                        <Button 
                          variant="outline"
                          size="sm" 
                          className="text-purple-700 border-purple-300 bg-white hover:bg-purple-100"
                          onClick={() => handleContactClick('phone')}
                        >
                          {t("نسخ الرقم", "Copy Number")}
                        </Button>
                        <div className="flex flex-col items-end">
                          <span className="text-sm text-gray-500">{t("رقم الهاتف", "Phone Number")}:</span>
                          <span dir="ltr" className="font-medium text-purple-900">{product.contactInfo?.phone}</span>
                        </div>
                      </div>
                    )}
                    
                    {hasEmail && (
                      <div className="bg-purple-50 p-3 rounded-md flex justify-between items-center">
                        <Button 
                          variant="outline"
                          size="sm" 
                          className="text-purple-700 border-purple-300 bg-white hover:bg-purple-100"
                          onClick={() => handleContactClick('email')}
                        >
                          {t("إرسال بريد", "Send Email")}
                        </Button>
                        <div className="flex flex-col items-end">
                          <span className="text-sm text-gray-500">{t("البريد الإلكتروني", "Email Address")}:</span>
                          <span dir="ltr" className="font-medium text-purple-900">{product.contactInfo?.email}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 flex items-center justify-end gap-2 text-sm text-gray-600">
                    <span>{getAvailabilityText(availabilityHours)}</span>
                    <Clock className="h-4 w-4 text-purple-700" />
                    <span>{t("أوقات التواصل المفضلة", "Preferred Contact Times")}:</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Sheet open={contactSheetOpen} onOpenChange={setContactSheetOpen}>
                    <SheetTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="border-purple-200 bg-white text-purple-700 hover:bg-purple-50 flex gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        {t("إرسال رسالة", "Send Message")}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-96 bg-white">
                      <SheetHeader>
                        <SheetTitle className="text-center text-xl text-purple-800">{t("إرسال رسالة للبائع", "Send a Message to the Seller")}</SheetTitle>
                      </SheetHeader>
                      
                      <div className="mt-6 px-2">
                        <div className="bg-purple-50 p-4 rounded-md mb-4">
                          <h4 className="font-medium text-purple-900 mb-2">{t("بخصوص المنتج", "Regarding the Product")}</h4>
                          <p className="text-purple-800">{product.title}</p>
                        </div>
                        
                        <textarea
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          placeholder={t("اكتب رسالتك هنا...", "Write your message here...")}
                          className="w-full p-3 border border-purple-200 rounded-md focus:ring-2 focus:ring-purple-300 focus:border-purple-400 bg-white h-32"
                        />
                        
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <Button 
                            variant="outline"
                            className="border-purple-200 text-purple-700 hover:bg-purple-50"
                            onClick={() => setContactSheetOpen(false)}
                          >
                            {t("إلغاء", "Cancel")}
                          </Button>
                          <Button 
                            className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700"
                            onClick={() => handleContactClick('message')}
                          >
                            {t("إرسال الرسالة", "Send Message")}
                          </Button>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                  
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 flex gap-2"
                    onClick={() => handleContactClick('chat')}
                  >
                    <MessageSquare className="h-4 w-4" />
                    {t("محادثة مباشرة", "Live Chat")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center p-4 mt-4 bg-white rounded-md border border-purple-100">
                <p className="text-muted-foreground">
                  {t("لم يقم البائع بتوفير معلومات الاتصال", "The seller has not provided contact information")}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose} className="border-purple-200 text-purple-700 hover:bg-purple-50">
            {t("إغلاق", "Close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetails;
