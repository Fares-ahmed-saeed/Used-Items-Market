
import React, { useState, useEffect, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, X, ChevronLeft, User, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
}

interface ChatSystemProps {
  isOpen: boolean;
  onClose: () => void;
  sellerId: string | null;
}

// Mock data for contacts
const mockContacts = [
  { id: "seller1", name: "أحمد محمد", lastMessage: "شكراً لتواصلك. المنتج لا يزال متاحاً", unread: 2 },
  { id: "seller2", name: "سارة أحمد", lastMessage: "هل يمكن تخفيض السعر؟", unread: 0 },
  { id: "seller3", name: "محمد علي", lastMessage: "نعم، يمكنك استلامه غداً", unread: 1 },
];

// Mock messages by seller ID
const mockMessages: Record<string, Message[]> = {
  "seller1": [
    { id: "m1", senderId: "seller1", text: "مرحباً، هل لا يزال المنتج متاحاً؟", timestamp: new Date(Date.now() - 3600000 * 2), isRead: true },
    { id: "m2", senderId: "user", text: "نعم، لا يزال متاحاً", timestamp: new Date(Date.now() - 3600000), isRead: true },
    { id: "m3", senderId: "seller1", text: "رائع! هل يمكنني معاينته غداً؟", timestamp: new Date(Date.now() - 1800000), isRead: true },
    { id: "m4", senderId: "user", text: "بالتأكيد، متى تفضل؟", timestamp: new Date(Date.now() - 900000), isRead: true },
    { id: "m5", senderId: "seller1", text: "شكراً لتواصلك. المنتج لا يزال متاحاً", timestamp: new Date(Date.now() - 600000), isRead: false },
  ],
  "seller2": [
    { id: "m6", senderId: "user", text: "مرحباً، هل المنتج متاح؟", timestamp: new Date(Date.now() - 86400000), isRead: true },
    { id: "m7", senderId: "seller2", text: "نعم متاح. السعر ثابت؟", timestamp: new Date(Date.now() - 82800000), isRead: true },
    { id: "m8", senderId: "user", text: "نعم، السعر المذكور هو الأخير", timestamp: new Date(Date.now() - 79200000), isRead: true },
    { id: "m9", senderId: "seller2", text: "هل يمكن تخفيض السعر؟", timestamp: new Date(Date.now() - 75600000), isRead: true },
  ],
  "seller3": [
    { id: "m10", senderId: "seller3", text: "متى يمكنني استلام المنتج؟", timestamp: new Date(Date.now() - 172800000), isRead: true },
    { id: "m11", senderId: "user", text: "اليوم أو غداً، كما يناسبك", timestamp: new Date(Date.now() - 169200000), isRead: true },
    { id: "m12", senderId: "seller3", text: "نعم، يمكنك استلامه غداً", timestamp: new Date(Date.now() - 86400000), isRead: false },
  ],
};

const ChatSystem = ({ isOpen, onClose, sellerId }: ChatSystemProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [activeChat, setActiveChat] = useState<string | null>(sellerId);
  const [contacts, setContacts] = useState(mockContacts);
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [showContactsList, setShowContactsList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Reset states when opening chat
  useEffect(() => {
    if (isOpen && sellerId) {
      setActiveChat(sellerId);
      setShowContactsList(false);
      
      // Mark all messages as read
      if (messages[sellerId]) {
        const updatedMessages = {...messages};
        updatedMessages[sellerId] = updatedMessages[sellerId].map(msg => ({
          ...msg,
          isRead: true
        }));
        setMessages(updatedMessages);
        
        // Update unread count in contacts
        setContacts(contacts.map(contact => 
          contact.id === sellerId ? { ...contact, unread: 0 } : contact
        ));
      }
    } else {
      setShowContactsList(true);
    }
  }, [isOpen, sellerId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat, messages]);

  const handleSend = () => {
    if (!newMessage.trim() || !activeChat) return;
    
    // Create new message
    const newMsg: Message = {
      id: `new-${Date.now()}`,
      senderId: 'user',
      text: newMessage.trim(),
      timestamp: new Date(),
      isRead: true
    };
    
    // Update messages
    const updatedMessages = {...messages};
    if (!updatedMessages[activeChat]) {
      updatedMessages[activeChat] = [];
    }
    updatedMessages[activeChat] = [...updatedMessages[activeChat], newMsg];
    
    setMessages(updatedMessages);
    setNewMessage('');
    
    // Update last message in contacts
    setContacts(contacts.map(contact => 
      contact.id === activeChat 
        ? { ...contact, lastMessage: newMessage.trim() } 
        : contact
    ));
    
    // Simulate reply after 1-3 seconds
    setTimeout(() => {
      const autoReply: Message = {
        id: `reply-${Date.now()}`,
        senderId: activeChat,
        text: t('شكراً للتواصل! سأرد عليك قريباً.', 'Thanks for reaching out! I\'ll get back to you soon.'),
        timestamp: new Date(),
        isRead: true
      };
      
      const updatedMessagesWithReply = {...messages};
      updatedMessagesWithReply[activeChat] = [...(updatedMessagesWithReply[activeChat] || []), autoReply];
      
      setMessages(updatedMessagesWithReply);
      
      toast({
        title: t('رسالة جديدة', 'New Message'),
        description: t('لقد تلقيت رسالة جديدة من البائع', 'You received a new message from the seller')
      });
    }, 1000 + Math.random() * 2000);
  };

  const handleSelectChat = (contactId: string) => {
    setActiveChat(contactId);
    setShowContactsList(false);
    
    // Mark all messages as read
    if (messages[contactId]) {
      const updatedMessages = {...messages};
      updatedMessages[contactId] = updatedMessages[contactId].map(msg => ({
        ...msg,
        isRead: true
      }));
      setMessages(updatedMessages);
      
      // Update unread count in contacts
      setContacts(contacts.map(contact => 
        contact.id === contactId ? { ...contact, unread: 0 } : contact
      ));
    }
  };

  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
  };

  // Get active contact's name
  const activeContactName = activeChat ? 
    contacts.find(c => c.id === activeChat)?.name || t('البائع', 'Seller') : 
    '';

  const getUnreadCount = () => {
    return contacts.reduce((total, contact) => total + contact.unread, 0);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 bg-white">
        <SheetHeader className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white p-4">
          <div className="flex items-center justify-between">
            {!showContactsList && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowContactsList(true)}
                className="text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            
            <SheetTitle className="text-white text-xl">
              {showContactsList ? (
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  {t('الرسائل', 'Messages')}
                  {getUnreadCount() > 0 && (
                    <Badge className="bg-white text-purple-700 hover:bg-white/90">{getUnreadCount()}</Badge>
                  )}
                </div>
              ) : activeContactName}
            </SheetTitle>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        {/* Contacts List */}
        {showContactsList && (
          <div className="h-[calc(100vh-5rem)] flex flex-col">
            <ScrollArea className="flex-1">
              {contacts.length > 0 ? (
                <div className="p-2">
                  {contacts.map(contact => (
                    <div 
                      key={contact.id}
                      onClick={() => handleSelectChat(contact.id)}
                      className={`
                        p-3 rounded-lg mb-2 cursor-pointer flex items-center gap-3
                        ${contact.unread > 0 ? 'bg-purple-50' : 'hover:bg-gray-50'}
                      `}
                    >
                      <Avatar className={contact.unread > 0 ? 'border-2 border-purple-400' : ''}>
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white">
                          {contact.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-center">
                          <h4 className={`font-medium ${contact.unread > 0 ? 'text-purple-900' : 'text-gray-900'}`}>
                            {contact.name}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {formatMessageTime(new Date(messages[contact.id]?.slice(-1)[0]?.timestamp || Date.now()))}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm truncate text-gray-500 max-w-[200px]">
                            {contact.lastMessage}
                          </p>
                          
                          {contact.unread > 0 && (
                            <Badge className="bg-purple-600">{contact.unread}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-6 text-center">
                  <div>
                    <MessageCircle className="h-12 w-12 text-purple-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {t('لا توجد رسائل', 'No messages yet')}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {t('عندما تبدأ محادثة مع بائع، ستظهر هنا', 'When you start a conversation with a seller, it will appear here')}
                    </p>
                  </div>
                </div>
              )}
            </ScrollArea>
          </div>
        )}

        {/* Chat Messages */}
        {!showContactsList && activeChat && (
          <div className="h-[calc(100vh-5rem)] flex flex-col">
            {/* Chat header */}
            <div className="border-b p-2 flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white">
                  {activeContactName.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{activeContactName}</div>
                <div className="text-xs text-muted-foreground flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  <span>{t('على الإنترنت الآن', 'Online now')}</span>
                </div>
              </div>
            </div>
            
            {/* Messages */}
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-4">
                {messages[activeChat]?.map((message) => (
                  <div 
                    key={message.id}
                    className={`flex ${message.senderId === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`
                        max-w-[80%] p-3 rounded-lg 
                        ${message.senderId === 'user' 
                          ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white rounded-br-none' 
                          : 'bg-gray-100 text-gray-900 rounded-bl-none'
                        }
                      `}
                    >
                      <p>{message.text}</p>
                      <div className={`text-xs mt-1 flex items-center justify-end gap-1 
                        ${message.senderId === 'user' ? 'text-purple-100' : 'text-gray-500'}`}>
                        {formatMessageTime(message.timestamp)}
                        {message.senderId === 'user' && (
                          <span>{message.isRead ? '✓✓' : '✓'}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Message input */}
            <div className="p-3 border-t">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }} 
                className="flex items-center gap-2"
              >
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t('اكتب رسالتك...', 'Type your message...')}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  size="icon"
                  className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ChatSystem;
