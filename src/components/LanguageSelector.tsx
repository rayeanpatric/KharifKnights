
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const LanguageSelector = () => {
  const { currentLanguage, setLanguage } = useLanguage();
  
  const handleLanguageChange = (value: string) => {
    if (value === 'en' || value === 'ta') {
      setLanguage(value);
      // Force a page refresh to ensure all components are updated
      window.dispatchEvent(new Event('language-changed'));
    }
  };
  
  return (
    <div className="flex items-center">
      <Globe className="h-4 w-4 mr-2 text-gray-300" />
      <Select
        value={currentLanguage}
        onValueChange={handleLanguageChange}
      >
        <SelectTrigger className="w-[100px] bg-transparent border-gray-700 text-gray-300 h-8">
          <SelectValue placeholder={currentLanguage === 'en' ? "English" : "தமிழ்"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="ta">தமிழ்</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
