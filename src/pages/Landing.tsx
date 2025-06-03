import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Sprout, Droplet, Sun, Cloud, Flower, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from '@/hooks/useLanguage';
import { getAuth } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { database } from '@/lib/firebase';

const Landing = () => {
  const [animationComplete, setAnimationComplete] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserName = async () => {
      const userNameFromLocalStorage = localStorage.getItem('name');
      if (userNameFromLocalStorage) {
        setUserName(userNameFromLocalStorage);
        return;
      }
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const userRef = ref(database, 'users/' + user.uid);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          setUserName(data?.name || 'Farmer');
        });
      } else {
        setUserName('Farmer');
      }
    };

    fetchUserName();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  // Letters for the animated title
  const letters = "Kharif Knights".split("");
  
  return (
    <div className="flex flex-col items-center min-h-screen bg-e-dark text-white overflow-x-hidden">
      {/* Animation Hero Section */}
      <div className="relative w-full h-screen flex flex-col items-center justify-center">
        {/* Animated Crop Field */}
        <motion.div 
          className="relative h-64 mb-8 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Background elements */}
          <motion.div
            className="absolute w-full bottom-0 h-16 bg-e-dark-accent rounded-lg opacity-70"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          
          {/* Crop plants animations */}
          <motion.div className="absolute bottom-12 w-full flex justify-center items-end">
            <motion.div 
              className="flex space-x-4 md:space-x-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Row of plants with different heights/delays */}
              {[...Array(9)].map((_, i) => (
                <motion.div
                  key={i}
                  className="relative flex flex-col items-center"
                  variants={itemVariants}
                >
                  <motion.div 
                    className="flex flex-col items-center"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 0.5 + (i * 0.1),
                      ease: "easeOut" 
                    }}
                    style={{ transformOrigin: 'bottom center' }}
                  >
                    <motion.div
                      animate={{ 
                        rotateZ: i % 2 === 0 ? [0, -2, 0, 2, 0] : [0, 2, 0, -2, 0],
                      }}
                      transition={{ 
                        duration: 4 + (i % 3),
                        ease: "easeInOut",
                        repeat: Infinity,
                      }}
                      style={{ transformOrigin: 'bottom center' }}
                    >
                      {i % 3 === 0 ? (
                        <Sprout className={`h-14 w-14 text-e-green opacity-${90 - (i * 5)}`} />
                      ) : i % 3 === 1 ? (
                        <Flower className={`h-12 w-12 text-e-green opacity-${95 - (i * 5)}`} />
                      ) : (
                        <Sprout className={`h-16 w-16 text-e-green opacity-${85 - (i * 5)}`} />
                      )}
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Animated environmental elements */}
          <motion.div
            className="absolute top-2 left-[15%]"
            animate={{ 
              y: [0, -8, 0],
              opacity: [0.5, 0.9, 0.5],
              rotate: [0, 10, 0, -10, 0]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              delay: 1,
            }}
          >
            <Cloud className="h-10 w-10 text-gray-400 opacity-70" />
          </motion.div>
          
          <motion.div
            className="absolute top-6 right-[20%]"
            animate={{ 
              rotate: [0, 360],
              scale: [0.8, 1, 0.8], 
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <Sun className="h-12 w-12 text-e-yellow opacity-80" />
          </motion.div>

          <motion.div
            className="absolute bottom-16 right-[30%]"
            animate={{ 
              y: [0, -5, 0], 
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              delay: 2,
            }}
          >
            <Droplet className="h-7 w-7 text-e-blue opacity-70" />
          </motion.div>
        </motion.div>
        
        {/* Animated Title with Letter Animation */}
        <div className="mb-10">
          <motion.div 
            className="flex justify-center mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center">
              {letters.map((letter, index) => (
                <motion.span
                  key={index}
                  className={`text-5xl font-bold inline-block ${letter === " " ? "mx-2" : ""} ${index === 0 ? "text-e-green" : ""}`}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{
                    duration: 0.5,
                    delay: 1 + (index * 0.1),
                    ease: "easeOut"
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.8 }}
          className="text-center mb-12 px-4"
        >
          <h2 className="text-2xl md:text-3xl font-medium text-gray-200 mb-6">
            Hi {userName}, want to know about your farming?
          </h2>
          <Button 
            onClick={() => navigate('/dashboard')} 
            className="bg-e-green hover:bg-e-green/90 text-black font-semibold text-lg py-6 px-8 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105"
          >
            Let's Go <ArrowRight className="ml-1" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;
