import React, { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { motion } from "framer-motion";
import { Sprout, Cloud, Droplet, Thermometer, Shield, Send } from "lucide-react";
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea"; // Textarea not used here currently
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import Groq from 'groq-sdk'; // Import Groq SDK

// Message type definition
type Message = {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

// Initialize Groq Client
const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;
let groq: Groq | null = null;

if (!groqApiKey) {
  console.error("Groq API key is missing. Please set VITE_GROQ_API_KEY in your .env file.");
} else {
  groq = new Groq({
    apiKey: groqApiKey,
    dangerouslyAllowBrowser: true, // Required for client-side usage
  });
}

const AgriCare = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null); // State for API errors
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add a welcome message when the component mounts
  useEffect(() => {
    const welcomeMessage = {
      id: 1,
      content: t('features.agricare.chat.welcomeMessage'),
      sender: 'bot' as const,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    // Check for API key existence on mount
    if (!groqApiKey) {
        setError("Groq API key is not configured. Please check console for details.");
    }
  }, [t]); // Added t to dependency array as it's used inside

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !groq) {
        if (!groq) {
            setError("Groq client is not initialized. Check API key configuration.");
            console.error("Groq client not initialized.");
        }
        return;
    }

    const userMessageContent = newMessage;
    // Add user message
    const userMessage = {
      id: Date.now(),
      content: userMessageContent,
      sender: 'user' as const,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);
    setError(null); // Clear previous errors

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          // Optional: Add system message or previous context here if needed
          // { role: "system", content: "You are a helpful farming assistant." },
          {
            role: "user",
            content: userMessageContent,
          },
        ],
        model: "llama3-8b-8192", // Use specified Groq model
      });

      const botResponseContent = chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

      const botResponse = {
        id: Date.now() + 1, // Ensure unique ID
        content: botResponseContent,
        sender: 'bot' as const,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);

    } catch (err) {
      console.error("Error calling Groq API:", err);
      setError("Failed to get response from AI. Please try again.");
      const errorMessage = {
          id: Date.now() + 1,
          content: "Error: Could not connect to the AI assistant.",
          sender: 'bot' as const,
          timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Send on Enter, allow Shift+Enter for newline (though Input doesn't multiline)
      e.preventDefault(); // Prevent default form submission or newline in Input
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-e-dark text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="text-e-blue">Agri</span>Care
          </h1>
          <p className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto">
            {t('features.agricare.pageSubtitle')}
          </p>
        </motion.div>


        {/* Farming Assistant Section */}
        <div className="grid md:grid-cols-2 gap-10 mb-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="order-2 md:order-1"
          >
            {/* Card height is defined here: h-[600px] */}
            <Card className="bg-e-dark-accent border-gray-800 text-white h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-e-blue" />
                  <span>{t('features.agricare.assistant')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col overflow-hidden"> {/* Added overflow-hidden */}
                {/* ScrollArea handles the scrolling within the flex-grow space */}
                <ScrollArea className="flex-grow pr-4 mb-4"> {/* Ensure ScrollArea takes available space */}
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`flex items-start max-w-[80%] gap-2 ${
                            msg.sender === 'user'
                              ? 'flex-row-reverse'
                              : 'flex-row'
                          }`}
                        >
                          <Avatar className={`h-8 w-8 ${msg.sender === 'user' ? 'bg-e-green' : 'bg-e-blue'}`}>
                            <div className="text-xs font-bold flex items-center justify-center h-full"> {/* Centered text */}
                              {msg.sender === 'user' ? t('features.agricare.chat.you') : t('features.agricare.chat.ai')}
                            </div>
                          </Avatar>
                          <div
                            className={`p-3 rounded-lg ${
                              msg.sender === 'user'
                                ? 'bg-e-green text-black'
                                : 'bg-e-dark-accent border border-gray-700'
                            }`}
                          >
                            {/* Render content safely, handle potential newlines if needed in future */}
                            <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                            <div className="text-xs mt-1 opacity-70">
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="flex items-start max-w-[80%] gap-2">
                          <Avatar className="h-8 w-8 bg-e-blue">
                            <div className="text-xs font-bold flex items-center justify-center h-full">{t('features.agricare.chat.ai')}</div>
                          </Avatar>
                          <div className="p-3 rounded-lg bg-e-dark-accent border border-gray-700 italic text-gray-400">
                            {t('features.agricare.typing')}
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} /> {/* Element to scroll to */}
                  </div>
                </ScrollArea>
                 {error && ( /* Display API Error */
                    <div className="text-red-500 text-sm mb-2 px-1">{error}</div>
                 )}
                <div className="flex gap-2 pt-2 border-t border-gray-700"> {/* Added border-top */}
                  <Input
                    placeholder={t('features.agricare.placeholder')}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="bg-e-dark border-gray-700 flex-grow" // Ensure input takes available space
                    disabled={isTyping || !groq} // Disable input while typing or if Groq not initialized
                  />
                  <Button
                    className="bg-e-blue hover:bg-e-blue/90"
                    onClick={handleSendMessage}
                    disabled={isTyping || !newMessage.trim() || !groq} // Disable button appropriately
                  >
                    <Send className="h-4 w-4" /> {/* Removed margin */}
                    {/* Removed Send text for smaller button */}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="order-1 md:order-2"
          >
            <h2 className="text-3xl font-bold mb-6">{t('features.agricare.assistantSection.title')}</h2>
            <p className="text-gray-300 mb-6 text-lg">
              {t('features.agricare.assistantSection.description')}
            </p>
            <div className="flex items-center gap-4 mb-4">
              <Droplet className="text-e-blue h-6 w-6" />
              <span>{t('features.agricare.assistantSection.feature1')}</span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <Thermometer className="text-e-yellow h-6 w-6" />
              <span>{t('features.agricare.assistantSection.feature2')}</span>
            </div>
            <div className="flex items-center gap-4">
              <Shield className="text-e-blue h-6 w-6" />
              <span>{t('features.agricare.assistantSection.feature3')}</span>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">{t('features.agricare.exampleQuestions.title')}</h3>
              <div className="space-y-2">
                <div className="p-2 bg-e-dark-accent rounded-md cursor-pointer hover:bg-e-dark-accent/80 transition-colors"
                  onClick={() => !isTyping && setNewMessage(t('features.agricare.exampleQuestions.q1'))} // Prevent changing while typing
                >
                  {t('features.agricare.exampleQuestions.q1')}
                </div>
                <div className="p-2 bg-e-dark-accent rounded-md cursor-pointer hover:bg-e-dark-accent/80 transition-colors"
                  onClick={() => !isTyping && setNewMessage(t('features.agricare.exampleQuestions.q2'))}
                >
                  {t('features.agricare.exampleQuestions.q2')}
                </div>
                <div className="p-2 bg-e-dark-accent rounded-md cursor-pointer hover:bg-e-dark-accent/80 transition-colors"
                  onClick={() => !isTyping && setNewMessage(t('features.agricare.exampleQuestions.q3'))}
                >
                  {t('features.agricare.exampleQuestions.q3')}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-16">{t('features.agricare.featuresSection.title')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: t('features.agricare.featuresSection.soilHealth.title'),
                description: t('features.agricare.featuresSection.soilHealth.description'),
                icon: <Sprout className="h-10 w-10 text-e-blue mb-4" />
              },
              {
                title: t('features.agricare.featuresSection.weatherIntegration.title'),
                description: t('features.agricare.featuresSection.weatherIntegration.description'),
                icon: <Cloud className="h-10 w-10 text-e-blue mb-4" />
              },
              {
                title: t('features.agricare.featuresSection.waterManagement.title'),
                description: t('features.agricare.featuresSection.waterManagement.description'),
                icon: <Droplet className="h-10 w-10 text-e-blue mb-4" />
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
                className="bg-e-dark-accent p-8 rounded-lg text-center hover:bg-e-dark-accent/70 transition-colors"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgriCare;
