
import React from 'react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/hooks/useLanguage';
import { enTranslations } from '@/localization/en'; // Import translations directly
import { taTranslations } from '@/localization/ta'; // Import translations directly
import { Users, Award, Target, Globe } from 'lucide-react';

const About = () => {
  const { t, currentLanguage } = useLanguage(); // Get currentLanguage

  // Select the correct translation object
  const translations = currentLanguage === 'en' ? enTranslations : taTranslations;
  // Access the team object directly - Use type assertion for safety
  const teamMembersData = (translations.aboutPage?.team || {}) as Record<string, { name: string; role: string; desc?: string; bio?: string }>;

  // Filter out the 'title' key and get an array of member objects
  const membersArray = Object.entries(teamMembersData)
    .filter(([key]) => key.startsWith('member'))
    .map(([, value]) => value);

  return (
    <div className="min-h-screen bg-e-dark text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('aboutPage.title')}</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t('aboutPage.subtitle')}
          </p>
        </div>
        
        {/* Mission and Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-e-dark-accent p-8 rounded-lg border border-gray-800">
            <div className="flex items-center mb-4">
              <div className="bg-e-green/20 p-3 rounded-full mr-3">
                <Target className="h-6 w-6 text-e-green" />
              </div>
              <h2 className="text-2xl font-bold">{t('aboutPage.mission.title')}</h2>
            </div>
            <p className="text-gray-300">
              {t('aboutPage.mission.text')}
            </p>
          </div>
          
          <div className="bg-e-dark-accent p-8 rounded-lg border border-gray-800">
            <div className="flex items-center mb-4">
              <div className="bg-e-blue/20 p-3 rounded-full mr-3">
                <Globe className="h-6 w-6 text-e-blue" />
              </div>
              <h2 className="text-2xl font-bold">{t('aboutPage.vision.title')}</h2>
            </div>
            <p className="text-gray-300">
              {t('aboutPage.vision.text')}
            </p>
          </div>
        </div>
        
        {/* Team Section */}
        <div className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gray-800 p-2 rounded-full mr-2">
              <Users className="h-5 w-5 text-e-green" />
            </div>
            <h2 className="text-3xl font-bold">{t('aboutPage.team.title')}</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {membersArray.map((member, index) => (
              <div key={index} className="bg-e-dark-accent rounded-lg overflow-hidden border border-gray-800 hover:border-e-green transition-all">
                <div className="h-48 bg-gray-700 flex items-center justify-center">
                  {/* Placeholder for potential member image */}
                  <Users className="h-20 w-20 text-gray-500" />
                </div>
                <div className="p-4">
                  {/* Ensure properties exist before accessing */}
                  <h3 className="font-bold text-lg mb-1">{member?.name || 'Name Missing'}</h3>
                  <p className="text-e-green mb-2">{member?.role || 'Role Missing'}</p>
                  {/* Use 'desc' or 'bio' based on translation file structure */}
                  <p className="text-gray-400 text-sm">
                    {member?.desc || member?.bio || 'Description Missing'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Achievements section removed */}
      </div>
    </div>
  );
};

export default About;
