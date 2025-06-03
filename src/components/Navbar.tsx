
import React from 'react';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/hooks/useLanguage';
import LanguageSelector from './LanguageSelector';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <nav className="flex items-center justify-between p-4 border-b border-gray-800">
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold text-e-green">Kharif Knights</Link>
      </div>
      <div className="flex space-x-4 items-center">
        <Link to="/features" className="text-gray-300 hover:text-white">{t('nav.features')}</Link>
        <Link to="/about" className="text-gray-300 hover:text-white">{t('nav.about')}</Link>
        <Link to="/community" className="text-gray-300 hover:text-white">{t('nav.community')}</Link>
        <Link to="/support" className="text-gray-300 hover:text-white">{t('nav.support')}</Link>
        <div className="flex items-center ml-6 space-x-3">
          <LanguageSelector />
          <Link to="/login"> {/* Wrap Button with Link */}
            <Button className="bg-e-green hover:bg-e-green/90 text-black font-medium">
              {t('nav.signIn')}
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
