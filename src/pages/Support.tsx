
import React from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, Mail, Phone, MessageSquare, FileQuestion, Zap, Leaf } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage'; // Import the hook

const Support = () => {
  const { t } = useLanguage(); // Call the hook to get the t function
  return (
    <div className="min-h-screen bg-e-dark text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('supportPage.title')}</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t('supportPage.subtitle')}
          </p>
        </div>
        
        {/* FAQ Section */}
        <div className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <HelpCircle className="h-6 w-6 text-e-green mr-2" />
            <h2 className="text-3xl font-bold">{t('supportPage.faq.title')}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* FAQ Item 1 */}
            <Card className="bg-e-dark-accent border-gray-800">
              <CardHeader>
                <div className="flex items-center">
                  <div className="bg-e-green/20 p-2 rounded-full mr-3">
                    <FileQuestion className="h-5 w-5 text-e-green" />
                  </div>
                  <CardTitle>{t('supportPage.faq.q1.title')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  {t('supportPage.faq.q1.answer')}
                </p>
              </CardContent>
            </Card>
            
            {/* FAQ Item 2 */}
            <Card className="bg-e-dark-accent border-gray-800">
              <CardHeader>
                <div className="flex items-center">
                  <div className="bg-e-green/20 p-2 rounded-full mr-3">
                    <FileQuestion className="h-5 w-5 text-e-green" />
                  </div>
                  <CardTitle>{t('supportPage.faq.q2.title')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  {t('supportPage.faq.q2.answer')}
                </p>
              </CardContent>
            </Card>
            
            {/* FAQ Item 3 */}
            <Card className="bg-e-dark-accent border-gray-800">
              <CardHeader>
                <div className="flex items-center">
                  <div className="bg-e-green/20 p-2 rounded-full mr-3">
                    <FileQuestion className="h-5 w-5 text-e-green" />
                  </div>
                  <CardTitle>{t('supportPage.faq.q3.title')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  {t('supportPage.faq.q3.answer')}
                </p>
              </CardContent>
            </Card>
            
            {/* FAQ Item 4 */}
            <Card className="bg-e-dark-accent border-gray-800">
              <CardHeader>
                <div className="flex items-center">
                  <div className="bg-e-green/20 p-2 rounded-full mr-3">
                    <FileQuestion className="h-5 w-5 text-e-green" />
                  </div>
                  <CardTitle>{t('supportPage.faq.q4.title')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  {t('supportPage.faq.q4.answer')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Email Support */}
          <Card className="bg-e-dark-accent border-gray-800">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-e-blue/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-e-blue" />
              </div>
              <CardTitle>{t('supportPage.contactOptions.email.title')}</CardTitle>
              <CardDescription className="text-gray-400">{t('supportPage.contactOptions.email.description')}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-e-blue font-medium">support@kharifknights.com</p>
            </CardContent>
          </Card>
          
          {/* Phone Support */}
          <Card className="bg-e-dark-accent border-gray-800">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-e-green/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Phone className="h-8 w-8 text-e-green" />
              </div>
              <CardTitle>{t('supportPage.contactOptions.phone.title')}</CardTitle>
              <CardDescription className="text-gray-400">{t('supportPage.contactOptions.phone.description')}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-e-green font-medium">+1 (555) 123-4567</p>
            </CardContent>
          </Card>
          
          {/* Live Chat */}
          <Card className="bg-e-dark-accent border-gray-800">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-e-yellow/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-e-yellow" />
              </div>
              <CardTitle>{t('supportPage.contactOptions.chat.title')}</CardTitle>
              <CardDescription className="text-gray-400">{t('supportPage.contactOptions.chat.description')}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button className="bg-e-yellow hover:bg-e-yellow/80 text-black">
                {t('supportPage.contactOptions.chat.button')}
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Contact Form */}
        <div className="bg-e-dark-accent rounded-lg p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">{t('supportPage.contactForm.title')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t('supportPage.contactForm.nameLabel')}</label>
              <Input className="bg-e-dark border-gray-700 text-white" placeholder={t('supportPage.contactForm.namePlaceholder')} />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t('supportPage.contactForm.emailLabel')}</label>
              <Input className="bg-e-dark border-gray-700 text-white" placeholder={t('supportPage.contactForm.emailPlaceholder')} />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-1">{t('supportPage.contactForm.subjectLabel')}</label>
            <Input className="bg-e-dark border-gray-700 text-white" placeholder={t('supportPage.contactForm.subjectPlaceholder')} />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-1">{t('supportPage.contactForm.messageLabel')}</label>
            <Textarea
              className="bg-e-dark border-gray-700 text-white min-h-[120px]"
              placeholder={t('supportPage.contactForm.messagePlaceholder')}
            />
          </div>
          
          <Button className="w-full bg-e-green hover:bg-e-green/80 text-black">
            {t('supportPage.contactForm.submitButton')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Support;
