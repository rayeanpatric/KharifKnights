export const enTranslations = {
  nav: {
    features: "Features",
    about: "About Us",
    community: "Community",
    support: "Support",
    signIn: "Sign In"
  },
  landing: {
    tagline: "Smart Farming Solutions",
    description: "Transforming agriculture with intelligent monitoring and analytics",
    welcome: "Hi Karthick, want to know about your farming?",
    letsGo: "Let's Go"
  },
  indexPage: { // Added section for Index page translations
    temperature: "Temperature",
    humidity: "Humidity",
    soilMoisture: "Soil Moisture",
    nitrogen: "Nitrogen (N)",
    phosphorus: "Phosphorus (P)",
    potassium: "Potassium (K)",
  },
  features: {
    moisture: "Moisture Tracking",
    weather: "Weather Forecasts",
    growth: "Growth Analytics",
    agrivision: {
      title: "Crop Monitoring System",
      summary: "Advanced visual analytics for real-time crop monitoring",
      description: "AgriVision uses cutting-edge computer vision to monitor your crops remotely, providing data-driven insights about crop health, growth stages, and potential risks.",
      point1: "Real-time crop health monitoring with image recognition",
      point2: "Disease identification and early warning systems",
      point3: "Growth pattern analysis and yield predictions",
      droneFeed: "Drone Live Feed",
      pestDetection: "Pest Detection",
      detected: "Detected",
      notDetected: "Not Detected",
      status: "Status",
      lastUpdated: "Last Updated",
      pageSubtitle: "Advanced image recognition and analytics for modern farming",
      viewSlamButton: "View SLAM 3D Visualization",
      droneFeedAlt: "Farm Aerial View",
      liveBadge: "LIVE",
      droneBadge: "Drone #{droneNumber}",
      fieldBadge: "Field #{fieldNumber} - {location}",
      refreshButton: "Refresh",
      // Specific keys for UI elements
      diseasePrediction: "Disease Prediction", // Added
      uploadImageButton: "Upload Image", // Added
      imagePreviewCard: { // Added structure
          title: "Image Preview",
          pestAlt: "Pest Image Preview", // Renamed existing analysisCard.pestAlt for consistency
          diseaseAlt: "Disease Image Preview" // Added
      },
      predictionResultCard: { // Added structure
          title: "Prediction Result"
      },
      errors: { // Added common error messages structure
          loadFailed: "Error loading model or labels. Please refresh.",
          modelNotLoaded: "Model not loaded yet. Please wait or refresh.",
          missingModelOrImage: "Model session or image URL is missing.",
          predictionFailed: "Prediction failed. Please try again.",
          fileReadError: "Error reading the selected file.",
          unknown: "Unknown prediction result.",
          noDetection: "No significant detection found.",
          lowConfidence: "Low confidence detection" // Added for classification
      },
      pestMessages: { // Kept existing pest messages
        detectedTitle: "Potential aphid infestation detected on crop leaves.",
        detectedAction: "Recommended action: Inspect field section {section} and consider organic pesticide application.",
        notDetectedTitle: "No pest activity detected in the current frame.",
        notDetectedAction: "Continuing scheduled monitoring. Next comprehensive scan in {hours} hours.",
      },
      analysisCard: {
          title: "Analysis",
          pestAlt: "Pest Detection",
          healthyAlt: "Healthy Plants",
          slamInterface: { // Assuming these need English versions too
            rotateView: "Rotate View",
            zoomInOut: "Zoom In/Out",
            layerToggle: "Layers",
            measurementTools: "Measurement Tools",
            legend: "Legend",
            soilQuality: "Soil Quality",
            plantDensity: "Plant Density"
          }
        },
      featuresSection: {
        title: "AgriVision Features",
        cropHealth: {
          title: "Crop Health Monitoring",
          description: "Detect diseases and pest infestations early by analyzing leaf patterns and discoloration."
        },
        growthTracking: {
          title: "Growth Tracking",
          description: "Track plant growth patterns over time with precise measurements and visualization."
        },
        yieldPrediction: {
          title: "Yield Prediction",
          description: "Estimate harvest yields based on visual data analysis and historical patterns."
        }
      }
    },
    agricare: {
      title: "Farm Management Assistant",
      summary: "Comprehensive care solutions for your agricultural needs",
      description: "AgriCare offers personalized farm management guidance, optimizing resource usage and improving crop yields through intelligent recommendations and monitoring.",
      point1: "Tailored irrigation and fertilization schedules",
      point2: "Pest management and intervention recommendations",
      point3: "Soil health monitoring and nutrient optimization",
      assistant: "Farming Assistant",
      askQuestion: "Ask a question...",
      send: "Send",
      typing: "Typing...",
      placeholder: "Ask anything about farming techniques...",
      pageSubtitle: "Smart monitoring and care solutions for your crops",
      assistantSection: {
        title: "Intelligent Crop Management",
        description: "AgriCare provides a comprehensive suite of tools to monitor soil health, irrigation needs, and environmental conditions for optimal crop growth. Ask our farming assistant any questions about your crops and get intelligent recommendations.",
        feature1: "Smart irrigation management",
        feature2: "Environmental condition monitoring",
        feature3: "Pest and disease prevention"
      },
      chat: {
        you: "You",
        ai: "AI",
        welcomeMessage: "Hello! I'm your AgriCare assistant. How can I help you with your farming today?",
        // Sample responses are usually dynamic, but adding keys if needed
        sampleResponse1: "Based on the soil analysis, I recommend reducing the nitrogen application by 15% in the southern field section.",
        sampleResponse2: "The current weather forecast shows a 70% chance of rain in the next 48 hours. Consider delaying your irrigation schedule.",
        sampleResponse3: "Your crop's growth pattern indicates potential zinc deficiency. Consider applying a foliar spray with zinc supplements.",
        sampleResponse4: "Analyzing historical data suggests that rotating to legumes next season would improve soil nitrogen content naturally.",
        sampleResponse5: "The latest satellite imagery shows uneven growth patterns in the northeast section. This might indicate drainage issues.",
        sampleResponse6: "Based on the current market trends, consider harvesting your crops within the next 7-10 days for optimal pricing.",
        sampleResponse7: "The pest detection system has identified early signs of fungal infection. Preventative treatment is recommended."
      },
      exampleQuestions: {
        title: "Example Questions",
        q1: "What's the best time to water my tomato plants?",
        q2: "How can I prevent aphid infestations naturally?",
        q3: "What crop rotation would work best for my soil type?",
        q4: "What's the optimal soil temperature for root development?", // Added Q4 & Q5 based on ta.ts
        q5: "How do I prevent soil compaction after irrigation?"
      },
      systemMessages: { // Added based on ta.ts
        loading: "Loading data...",
        error: "An error occurred. Please try again.",
        noData: "No data available."
      },
      featuresSection: {
        title: "AgriCare Features",
        soilHealth: {
          title: "Soil Health Analysis",
          description: "Monitor nutrient levels, pH balance, and soil composition for optimal growing conditions."
        },
        weatherIntegration: {
          title: "Weather Integration",
          description: "Stay ahead of weather changes with forecasts integrated directly into your farming schedule."
        },
        waterManagement: {
          title: "Water Management",
          description: "Optimize water usage with intelligent irrigation scheduling based on soil moisture and crop needs."
        }
      }
    },
    // Sensor Dashboard Titles (Added)
    sensorDashboardTitle: "Live Sensor Dashboard",
    temperature: "Temperature",
    humidity: "Humidity",
    soilMoisture: "Soil Moisture",
    nitrogen: "Nitrogen (N)",
    phosphorus: "Phosphorus (P)",
    potassium: "Potassium (K)",
  },
  signup: {
    title: "Sign Up",
    description: "Create a new account",
    nameLabel: "Your Name",
    namePlaceholder: "Enter your name",
    phoneNumberLabel: "Phone Number",
    phoneNumberPlaceholder: "Enter your phone number",
    mailIdLabel: "Mail ID",
    mailIdPlaceholder: "Enter your mail ID",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    confirmPasswordLabel: "Confirm Password",
    confirmPasswordPlaceholder: "Confirm your password",
    signUpButton: "Sign Up",
    alreadyAccount: "Already have an account?",
    loginLink: "Log In"
  },
  login: {
    title: "Login",
    mailIdLabel: "Mail ID",
    mailIdPlaceholder: "Enter your Mail ID",
    description: "Enter your Mail ID and password to access your account.",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    loginButton: "Login",
    noAccount: "Don't have an account?",
    signUpLink: "Sign Up Here"
  },
  sections: {
    features: "Our Features",
    community: "Community",
    agriNews: "Agricultural News"
  },
  buttons: {
    letsGo: "Let's Go",
    learnMore: "Learn More",
    hide: "Hide Details",
    readMore: "Read More"
  },
  cards: {
    title1: "Smart Irrigation",
    desc1: "Water management system that optimizes usage based on soil moisture levels",
    title2: "Water Quality",
    desc2: "Monitors water quality parameters essential for plant health",
    title3: "Solar Planning",
    desc3: "Optimizes crop exposure to sunlight for maximum photosynthesis",
    title4: "Weather Analysis",
    desc4: "Predictive modeling of weather patterns affecting crop cycles",
    title5: "Bloom Tracking",
    desc5: "Monitors flowering phases and pollination opportunities",
    title6: "Knowledge Base",
    desc6: "Access to agricultural best practices and scholarly resources"
  },
  news: {
    title1: "New Drought-Resistant Rice Variety Released",
    summary1: "Scientists have developed a new rice variety that can withstand extended drought periods while maintaining yield.",
    title2: "Sustainable Farming Practices Gain Momentum",
    summary2: "Farmers across the country are adopting regenerative agriculture techniques for long-term soil health.",
    title3: "Smart Agriculture Tech Investment Reaches New High",
    summary3: "Venture capital investment in agricultural technology startups hit $8.7 billion in the first quarter."
  },
  dashboard: { // Added based on ta.ts structure
    title: "Dashboard",
    daysUntilHarvest: "Day {currentDay} of {totalDays} until harvest",
    selectCropPlaceholder: "Select Crop",
    cropOptions: {
      rice: "Rice",
      wheat: "Wheat",
      cotton: "cotton"
    },
    selectFieldPlaceholder: "Select Field",
    fieldOptions: {
      field1: "Field 1",
      field2: "Field 2",
      field3: "Field 3"
    },
    buttons: {
      addNewCrop: "Add New Crop"
    },
    growthProgress: {
      title: "Growth Progress",
      stages: {
        germination: "Germination",
        vegetative: "Vegetative",
        flowering: "Flowering",
        mature: "Mature"
      }
    },
    metrics: {
      temperature: {
        title: "Temperature"
      },
      humidity: {
        title: "Humidity"
      },
      soilMoisture: {
        title: "Soil Moisture"
      },
      lastUpdated: "{value} mins ago",
      status: { // Added status messages
        loading: "Loading...",
        error: "Error",
        loadingModels: "Loading models",
        predicted: "Predicted"
      }
    },
    forecast: {
      weather: {
        title: "Weather Forecast",
        subtitle: "5-day forecast for your location",
        days: {
          today: "Today",
          tue: "Tue",
          wed: "Wed",
          thu: "Thu",
          fri: "Fri"
        },
        details: {
          wind: "Wind",
          chanceOfRain: "Chance of Rain"
        }
      },
      crop: {
        title: "Crop Forecast",
        subtitle: "Predicted yield and harvest timeline",
        estimatedYield: "Estimated Yield",
        yieldUnit: "tons/acre",
        yieldChange: "{value}% from last season",
        harvestTimeline: "Harvest Timeline",
        timelinePlanting: "Planting ({date})",
        timelineHarvest: "Harvest ({date})",
        marketPriceForecast: "Market Price Forecast",
        priceCurrent: "Current: ",
        priceHarvest: "Harvest: ",
        priceUnit: "/quintal"
      }
    },
    cropMetrics: {
      title: "Crop Metrics",
      subtitle: "Daily growth and health measurements",
      tabs: {
        growth: "Growth",
        health: "Health",
        yield: "Yield"
      },
      growthTab: {
        growthRateLabel: "Growth Rate",
        leafAreaLabel: "Leaf Area"
      },
      healthTab: {
        placeholder: "Health metrics content"
      },
      yieldTab: {
        placeholder: "Yield metrics content"
      }
    },
    activityFeed: {
      title: "Activity Feed",
      subtitle: "Recent events and notifications",
      timeFormat: "{day}, {time}",
      irrigationActivated: {
        title: "Irrigation System Activated",
        description: "Automated irrigation delivered 2.5L/m² of water."
      },
      temperatureAlert: {
        title: "Temperature Alert",
        description: "Temperature exceeded 30°C for more than 2 hours."
      },
      rainDetected: {
        title: "Rain Detected",
        description: "Light rain (2mm) detected. Irrigation schedule adjusted."
      },
      pestAlert: {
        title: "Pest Detection Alert",
        description: "AI image analysis detected possible aphid infestation in section B3."
      },
      items: {
        soilAnalysis: "Soil Analysis",
        soilAnalysisDescription: "Soil analysis completed.",
        irrigationScheduled: "Irrigation Scheduled",
        irrigationScheduledDescription: "Irrigation scheduled for tomorrow.",
        pestDetected: "Pest Detected",
        pestDetectedDescription: "Pest detected in sector 4.",
        fertilizerApplied: "Fertilizer Applied",
        fertilizerAppliedDescription: "Fertilizer applied to field 2."
      }
    },
    recommendations: {
      title: "Recommendations",
      subtitle: "Smart suggestions based on current conditions",
      irrigation: {
        title: "Irrigation Needed",
        description: "Soil moisture is below optimal levels. Consider irrigating within the next 24 hours.",
        action: "Schedule Irrigation",
        scheduledAt: "Irrigation scheduled at {time}"
      },
      sunlight: {
        title: "Optimal Sunlight",
        description: "Current sunlight levels are ideal for crop growth. No action needed.",
      },
      fertilizer: {
        title: "Fertilizer Application",
        description: "Based on the growth stage, apply nitrogen-rich fertilizer within the next 3 days.",
        action: "View Fertilizer Guide"
      },
      pest: {
        title: "Pest Alert",
        description: "Early signs of aphid infestation detected. Immediate action recommended.",
        action: "View Treatment Options"
      }
    }
  },
  footer: { // Added based on ta.ts
    copyright: "© {year} Kharif-Knighs. All rights reserved.",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    contact: "Contact"
  },
  featuresPage: { // Added based on ta.ts
    titlePart1: "Our",
    titlePart2: "Smart Farming",
    titlePart3: "Features",
    subtitle: "Discover our innovative tools designed to revolutionize your farming experience",
    agrivision: {
      description: "Use advanced image recognition to detect crop diseases, track growth patterns, and monitor plant health with our cutting-edge computer vision technology.",
      exploreButton: "Explore AgriVision"
    },
    agricare: {
      description: "Monitor and manage your crop's environmental conditions, soil health, and irrigation needs with smart sensors and intelligent recommendations.",
      exploreButton: "Explore AgriCare"
    }
  },
  communityPage: { // Added based on ta.ts
    title: "Farming Community",
    subtitle: "Collaborate with fellow farmers and share experiences",
    discussionForum: {
      title: "Discussion Forum",
      topics: {
        organicFarming: "Organic Farming Techniques",
        cropRotation: "Crop Rotation Strategies",
        waterManagement: "Water Conservation Methods"
      },
      recentPosts: {
        title: "Expert Q&A",
        askQuestion: "Ask a Question",
        categories: {
          pestControl: "Pest Control",
          soilHealth: "Soil Health",
          irrigation: "Irrigation Methods"
        }
      }
    },
    expertQna: {
      title: "Expert Q&A",
      askQuestion: "Ask a Question",
      categories: {
        pestControl: "Pest Control",
        soilHealth: "Soil Health",
        irrigation: "Irrigation Methods"
      }
    }
  },
  aboutPage: { // Added based on ta.ts
    title: "About Kharif Knights",
    subtitle: "We are a team of agricultural technology experts dedicated to empowering farmers with smart farming solutions that increase productivity while promoting sustainability.",
    mission: {
      title: "Our Mission",
      text: "To revolutionize agriculture through accessible technology that helps farmers make data-driven decisions, optimize resource usage, and increase crop yields sustainably."
    },
    vision: {
      title: "Our Vision",
      text: "A world where every farmer has access to cutting-edge agricultural technology, enabling sustainable practices that feed communities while preserving natural resources."
    },
    team: {
      title: "Our Team",
      member1: { name: "Dharun Raagav", role: "ML engineer", desc: "Expert in Machine Learning and AI applications for agriculture." },
      member2: { name: "Rayean Patric", role: "Research and analyst", desc: "Specializes in agricultural data analysis and market research." },
      member3: { name: "Nicholas Christo", role: "Circuit Designer", desc: "Designs and optimizes electronic circuits for agricultural sensors." },
      member4: { name: "Karthik K S", role: "Communication manager", desc: "Manages communications and outreach to the farming community." },
      member5: { name: "Srevarshan", role: "IOT engineer", desc: "Develops and implements IOT solutions for smart farming." },
      member6: { name: "Monish K S", role: "Frontend Engineer", desc: "Designs and develops user interfaces for web and mobile applications." },
      member7: { name: "Dr. Balaji Ganesh R", role: "Associate Professor, Mentor", desc: "Provides mentorship and guidance to the team." }
    },
    achievements: {
      title: "Our Achievements",
      achievement1: {
        title: "AgTech Innovation Award 2024",
        description: "Recognized for our revolutionary AgriVision crop monitoring system"
      },
      achievement2: {
        title: "Sustainable Technology Excellence",
        description: "For reducing water consumption by 30% in partner farms"
      },
      achievement3: {
        title: "100,000+ Farmers Served",
        description: "Milestone reached in Q1 2025, with presence in 12 countries"
      }
    }
  },
  supportPage: { // Added based on ta.ts
    title: "Support Center",
    subtitle: "We're here to help you get the most out of your Kharif Knights experience. Browse our resources or contact us directly.",
    faq: {
      title: "Frequently Asked Questions",
      q1: {
        title: "How do I install sensors in my field?",
        answer: "Our sensors are designed for easy installation. Follow our step-by-step guide in the installation manual, or watch our tutorial videos. If you need assistance, our technical team can schedule a remote session to help you."
      },
      q2: {
        title: "How often should I calibrate my sensors?",
        answer: "We recommend calibrating your sensors at the beginning of each growing season or every six months. The app will send you reminders when calibration is due. Our auto-calibration feature also adjusts settings based on environmental factors."
      },
      q3: {
        title: "Can I use Kharif Knights in areas with poor internet?",
        answer: "Yes! Our system is designed to work in areas with limited connectivity. The sensors store data locally and sync when connection is available. You can also set up a local hub to gather data from multiple sensors for periodic uploads."
      },
      q4: {
        title: "How accurate are the weather forecasts?",
        answer: "Our weather forecasts combine data from multiple meteorological sources and local sensors for high accuracy. We typically achieve 85-90% accuracy for 3-day forecasts and 70-80% for 5-day forecasts, depending on your region and local weather patterns."
      }
    },
    contactOptions: {
      email: {
        title: "Email Support",
        description: "Get a response within 24 hours"
      },
      phone: {
        title: "Phone Support",
        description: "Available Mon-Fri, 9 AM - 6 PM"
      },
      chat: {
        title: "Live Chat",
        description: "Get instant assistance",
        button: "Start Chat"
      }
    },
    contactForm: {
      title: "Send us a Message",
      nameLabel: "Your Name",
      namePlaceholder: "John Doe",
      emailLabel: "Email Address",
      emailPlaceholder: "john@example.com",
      subjectLabel: "Subject",
      subjectPlaceholder: "How can we help you?",
      messageLabel: "Message",
      messagePlaceholder: "Please describe your issue or question in detail",
      submitButton: "Submit"
    }
  },
  notFoundPage: { // Added based on ta.ts
    message: "Oops! Page Not Found",
    returnHome: "Return to Home"
  }
}
