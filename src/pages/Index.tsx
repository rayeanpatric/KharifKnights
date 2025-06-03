import React, { useState, useEffect, useRef } from 'react';
import * as ort from 'onnxruntime-web'; // Import ONNX Runtime Web
import Navbar from '@/components/Navbar';
import ProgressBar from '@/components/ProgressBar';
import MetricCard from '@/components/MetricCard';
import RecommendationCard from '@/components/RecommendationCard';
import ForecastCard from '@/components/ForecastCard';
import WeatherDay from '@/components/WeatherDay';
import ActivityItem from '@/components/ActivityItem';
import CropMetricsTab from '@/components/CropMetricsTab';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { database } from '@/lib/firebase'; // Import Firebase database instance
import { ref, onValue } from "firebase/database";
import { useLanguage } from '@/hooks/useLanguage';
import { getAuth } from "firebase/auth";
// Import model files - Vite should handle these imports
import nitrogenModelPath from '@/models/nitrogen_model.onnx';
import phosphorusModelPath from '@/models/phosphorus_model.onnx';
import potassiumModelPath from '@/models/potassium_model.onnx';
import { 
  ThermometerSun, 
  Droplet, 
  Sprout, 
  Leaf, 
  Flower2, 
  Apple, 
  SunMedium, 
  Cloud, 
  CloudRain, 
  Wind, 
  AlertTriangle, 
  Bug,
  Droplets,
  Zap
} from "lucide-react";

// Sensor Data Interface
interface SensorData {
  temperature: string | number;
  humidity: string | number;
  soilMoisture: string | number;
  nitrogen: string | number;
  phosphorus: string | number;
  potassium: string | number;
}

const Index = () => {
  const { t } = useLanguage();
  const [userName, setUserName] = useState<string | null>(null);

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // State for sensor data
  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: '--', // Initialize as placeholders
    humidity: '--',
    soilMoisture: '--',
    nitrogen: '--',
    phosphorus: '--',
    potassium: '--'
  });

  // State for ONNX sessions
  const [nitrogenSession, setNitrogenSession] = useState<ort.InferenceSession | null>(null);
  const [phosphorusSession, setPhosphorusSession] = useState<ort.InferenceSession | null>(null);
  const [potassiumSession, setPotassiumSession] = useState<ort.InferenceSession | null>(null);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [predictionError, setPredictionError] = useState<string | null>(null);

  // Ref to track if prediction is running to avoid overlaps
  const isPredicting = useRef(false);

  // State for irrigation time picker
  const [showIrrigationTimePicker, setShowIrrigationTimePicker] = useState(false);
  const [scheduledIrrigationTime, setScheduledIrrigationTime] = useState<string | null>(null);

  // Mock data for charts (remains the same for now)
  const tempData = [20, 22, 25, 24, 26, 25, 27, 28, 30, 29, 28, 27, 28, 27, 26, 25, 24];
  const humidityData = [50, 52, 55, 58, 60, 62, 65, 67, 68, 65, 63, 60, 62, 63, 65, 64, 63];
  const soilData = [40, 42, 43, 42, 44, 45, 44, 43, 45, 46, 45, 44, 43, 42, 45, 44, 45];
  const growthData = [30, 50, 20, 35, 65, 45, 30, 20, 45, 60, 80, 65, 55, 45, 60, 75, 70, 65, 55, 40, 50, 60, 70, 60];

  // ONNX Model Loading Effect
  useEffect(() => {
    const loadModels = async () => {
      try {
        setModelsLoading(true);
        setPredictionError(null);
        // Set execution providers - 'wasm' is a good default for broad compatibility
        ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.21.0/dist/"; // Adjust path if hosting locally

        const nSession = await ort.InferenceSession.create(nitrogenModelPath);
        const pSession = await ort.InferenceSession.create(phosphorusModelPath);
        const kSession = await ort.InferenceSession.create(potassiumModelPath);

        setNitrogenSession(nSession);
        setPhosphorusSession(pSession);
        setPotassiumSession(kSession);
        console.log("ONNX models loaded successfully.");
      } catch (error) {
        console.error("Error loading ONNX models:", error);
        setPredictionError("Failed to load prediction models.");
      } finally {
        setModelsLoading(false);
      }
    };
    loadModels();
  }, []); // Run only once on mount

  // Prediction Function
  const predictNPK = async (temp: number, hum: number, soil: number) => {
    if (isPredicting.current || modelsLoading || !nitrogenSession || !phosphorusSession || !potassiumSession) {
        console.log("Prediction skipped: Models not ready or prediction in progress.");
        return;
    }
    if (isNaN(temp) || isNaN(hum) || isNaN(soil)) {
        console.log("Prediction skipped: Invalid input data.");
        setSensorData(prev => ({ ...prev, nitrogen: '--', phosphorus: '--', potassium: '--' }));
        return;
    }

    isPredicting.current = true;
    setPredictionError(null);
    console.log(`Running prediction with Temp: ${temp}, Hum: ${hum}, Soil: ${soil}`);

    try {
      // Prepare input tensor - ASSUMING shape [1, 3] and float32 type.
      // Verify this matches your model's expected input!
      const inputArray = [temp, hum, soil];
      const inputTensor = new ort.Tensor('float32', Float32Array.from(inputArray), [1, 3]);
      const feeds = { [nitrogenSession.inputNames[0]]: inputTensor }; // Use the actual input name

      // Run inference for each model
      const nitrogenResult = await nitrogenSession.run(feeds);
      const phosphorusResult = await phosphorusSession.run(feeds); // Assuming same input name
      const potassiumResult = await potassiumSession.run(feeds); // Assuming same input name

      // Extract results - ASSUMING the output is a single float value.
      // Verify this matches your model's output structure!
      const nValue = nitrogenResult[nitrogenSession.outputNames[0]].data[0] as number;
      const pValue = phosphorusResult[phosphorusSession.outputNames[0]].data[0] as number;
      const kValue = potassiumResult[potassiumSession.outputNames[0]].data[0] as number;

      console.log(`Prediction results: N=${nValue.toFixed(2)}, P=${pValue.toFixed(2)}, K=${kValue.toFixed(2)}`);

      // Update state
      setSensorData(prevData => ({
        ...prevData,
        nitrogen: nValue.toFixed(2),
        phosphorus: pValue.toFixed(2),
        potassium: kValue.toFixed(2)
      }));

    } catch (error) {
      console.error("Error during NPK prediction:", error);
      setPredictionError("Error predicting NPK values.");
      // Reset NPK values in state on error
      setSensorData(prevData => ({
        ...prevData,
        nitrogen: '--',
        phosphorus: '--',
        potassium: '--'
      }));
    } finally {
      isPredicting.current = false;
    }
  };

  // Firebase Data Fetching Effect (Modified)
  useEffect(() => {
    const sensorDataRef = ref(database, 'sensorData');

    // Helper function to extract number before unit
    const parseValue = (str: string): number | null => {
        const match = str.match(/([\d.]+)/); // Find the first number (integer or decimal)
        return match ? parseFloat(match[1]) : null;
    };


    // Listener for Temp, Humidity, Soil
    const unsubscribeSensor = onValue(sensorDataRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.receivedData && typeof data.receivedData === 'string') {
        try {
          const parts = data.receivedData.split(','); // e.g., ["Temp:23.10C", "Hum:88.00%", "Soil:100%"]
          const tempStr = parts.find((p: string) => p.startsWith('Temp:'));
          const humStr = parts.find((p: string) => p.startsWith('Hum:'));
          const soilStr = parts.find((p: string) => p.startsWith('Soil:'));

          const tempVal = tempStr ? parseValue(tempStr.split(':')[1]) : null;
          const humVal = humStr ? parseValue(humStr.split(':')[1]) : null;
          const soilVal = soilStr ? parseValue(soilStr.split(':')[1]) : null;

          setSensorData(prevData => ({
            ...prevData,
            temperature: tempVal !== null ? tempVal.toFixed(1) : prevData.temperature, // Use toFixed(1) for consistency with screenshot
            humidity: humVal !== null ? humVal.toFixed(0) : prevData.humidity, // Use toFixed(0) for consistency
            soilMoisture: soilVal !== null ? soilVal.toFixed(0) : prevData.soilMoisture
          }));

          // Trigger prediction if we have valid numbers
          if (tempVal !== null && humVal !== null && soilVal !== null) {
             // Use parseFloat again to ensure numbers are passed to prediction
             predictNPK(parseFloat(tempVal.toFixed(1)), parseFloat(humVal.toFixed(0)), parseFloat(soilVal.toFixed(0)));
          } else {
             // Reset NPK if input is invalid
             setSensorData(prev => ({ ...prev, nitrogen: '--', phosphorus: '--', potassium: '--' }));
          }

        } catch (error) {
          console.error("Error parsing sensor data (receivedData):", error);
          // Reset NPK on parsing error
          setSensorData(prev => ({ ...prev, nitrogen: '--', phosphorus: '--', potassium: '--' }));
        }
      } else {
         console.log("Waiting for sensor data (temp/hum/soil) or invalid format...");
         // Reset NPK if no valid data structure
         setSensorData(prev => ({ ...prev, nitrogen: '--', phosphorus: '--', potassium: '--' }));
      }
    });

    // Cleanup listener on component unmount
    return () => {
      unsubscribeSensor();
    };
    // Rerun effect if prediction function identity changes (e.g., due to model loading)
  }, [nitrogenSession, phosphorusSession, potassiumSession, modelsLoading]);
  const auth = getAuth();
  useEffect(() => {
    const fetchUserName = async () => {
        let userNameFromLocalStorage = null;
        // Check if local storage is available
        if (typeof localStorage !== 'undefined') {
            userNameFromLocalStorage = localStorage.getItem('name');
        } else {
            console.warn("Local storage is not available in this environment.");
            // Implement fallback mechanism here (e.g., cookies)
        }
        if (userNameFromLocalStorage) {
          setUserName(userNameFromLocalStorage);
          return;
        }
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

  return (
    <div className="min-h-screen bg-e-dark text-white">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">{userName ? `Welcome, ${userName}!` : t('dashboard.title')}</h1>
            <div className="flex items-center text-gray-400">
              <span className="mr-2">{formattedDate}</span> {/* Display current date */}
              <span>{t('dashboard.daysUntilHarvest', { currentDay: 45, totalDays: 50 })}</span>
            </div>
          </div>
          
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Select>
              <SelectTrigger className="w-36 bg-e-dark-accent border-gray-700">
                <SelectValue placeholder={t('dashboard.selectCropPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rice">{t('dashboard.cropOptions.rice')}</SelectItem>
                <SelectItem value="wheat">{t('dashboard.cropOptions.wheat')}</SelectItem>
                <SelectItem value="cotton">{t('dashboard.cropOptions.cotton')}</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="w-36 bg-e-dark-accent border-gray-700">
                <SelectValue placeholder={t('dashboard.selectFieldPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="field1">{t('dashboard.fieldOptions.field1')}</SelectItem>
                <SelectItem value="field2">{t('dashboard.fieldOptions.field2')}</SelectItem>
                <SelectItem value="field3">{t('dashboard.fieldOptions.field3')}</SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="bg-e-green hover:bg-e-green/90 text-black">{t('dashboard.buttons.addNewCrop')}</Button>
          </div>
        </div>
        
        {/* Growth Progress */}
        <div className="bg-e-dark-accent rounded-lg p-5 mb-6">
          <h2 className="text-xl font-medium mb-1">{t('dashboard.growthProgress.title')}</h2>
          <p className="text-sm text-gray-400 mb-3">{t('dashboard.daysUntilHarvest', { currentDay: 45, totalDays: 50 })}</p>
          <ProgressBar progress={90} />
          
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="flex flex-col items-center">
              <div className="bg-e-dark-accent border border-e-green rounded-full p-2 mb-2">
                <Sprout className="h-5 w-5 text-e-green" />
              </div>
              <span className="text-sm text-e-green">{t('dashboard.growthProgress.stages.germination')}</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-e-dark-accent border border-e-green rounded-full p-2 mb-2">
                <Leaf className="h-5 w-5 text-e-green" />
              </div>
              <span className="text-sm text-e-green">{t('dashboard.growthProgress.stages.vegetative')}</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-e-dark-accent border border-e-green rounded-full p-2 mb-2">
                <Flower2 className="h-5 w-5 text-e-green" />
              </div>
              <span className="text-sm text-e-green">{t('dashboard.growthProgress.stages.flowering')}</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-e-dark-accent border border-gray-700 rounded-full p-2 mb-2">
                <Apple className="h-5 w-5 text-gray-500" />
              </div>
              <span className="text-sm text-gray-500">{t('dashboard.growthProgress.stages.mature')}</span>
            </div>
          </div>
        </div>
        
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <MetricCard 
            title={t('indexPage.temperature')} // Use translation
            value={sensorData.temperature} // Use state value
            unit="°C"
            change={{ value: 2, type: 'increase' }}
            icon={<ThermometerSun className="h-4 w-4" />}
            color="#FF5C5C"
            lastUpdated={t('dashboard.metrics.lastUpdated', { value: 5 })} // Example value
            chartData={tempData}
          />
          
          <MetricCard 
            title={t('indexPage.humidity')} // Use translation
            value={sensorData.humidity} // Use state value
            unit="%"
            change={{ value: 5, type: 'increase' }}
            icon={<Droplet className="h-4 w-4" />}
            color="#4EADFF"
            lastUpdated={t('dashboard.metrics.lastUpdated', { value: 5 })} // Example value
            chartData={humidityData}
          />
          
          <MetricCard 
            title={t('indexPage.soilMoisture')} // Use translation
            value={sensorData.soilMoisture} // Use state value
            unit="%"
            change={{ value: 3, type: 'increase' }}
            icon={<Sprout className="h-4 w-4" />}
            color="#0FCE66"
            lastUpdated={t('dashboard.metrics.lastUpdated', { value: 5 })} // Example value
            chartData={soilData}
          />
          {/* NPK Cards - Added */}
          {/* NPK Cards - Updated */}
           <MetricCard
            title={t('indexPage.nitrogen')}
            value={modelsLoading ? t('dashboard.metrics.status.loading') : predictionError ? t('dashboard.metrics.status.error') : sensorData.nitrogen}
            unit={modelsLoading || predictionError || sensorData.nitrogen === '--' ? '' : "kg/ha"} // Unit logic remains
            icon={<Leaf className="h-4 w-4 text-green-500" />}
            color="#22c55e"
            change={{ value: 0, type: 'increase' }}
            lastUpdated={predictionError ? predictionError : modelsLoading ? t('dashboard.metrics.status.loadingModels') : t('dashboard.metrics.status.predicted')}
            chartData={[]}
            // isLoading prop removed as it's not supported by MetricCard
          />
           <MetricCard
            title={t('indexPage.phosphorus')}
            value={modelsLoading ? t('dashboard.metrics.status.loading') : predictionError ? t('dashboard.metrics.status.error') : sensorData.phosphorus}
            unit={modelsLoading || predictionError || sensorData.phosphorus === '--' ? '' : "kg/ha"}
            icon={<Zap className="h-4 w-4 text-purple-500" />}
            color="#a855f7"
            change={{ value: 0, type: 'increase' }}
            lastUpdated={predictionError ? predictionError : modelsLoading ? t('dashboard.metrics.status.loadingModels') : t('dashboard.metrics.status.predicted')}
            chartData={[]}
            // isLoading prop removed
          />
           <MetricCard
            title={t('indexPage.potassium')}
            value={modelsLoading ? t('dashboard.metrics.status.loading') : predictionError ? t('dashboard.metrics.status.error') : sensorData.potassium}
            unit={modelsLoading || predictionError || sensorData.potassium === '--' ? '' : "kg/ha"}
            icon={<Flower2 className="h-4 w-4 text-orange-500" />}
            color="#f97316"
            change={{ value: 0, type: 'increase' }}
            lastUpdated={predictionError ? predictionError : modelsLoading ? t('dashboard.metrics.status.loadingModels') : t('dashboard.metrics.status.predicted')}
            chartData={[]}
            // isLoading prop removed
          />
        </div>
        
        {/* Weather and Crop Forecast */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ForecastCard title={t('dashboard.forecast.weather.title')} subtitle={t('dashboard.forecast.weather.subtitle')}>
            <div className="grid grid-cols-5 gap-2">
              <WeatherDay day={t('dashboard.forecast.weather.days.today')} icon={<SunMedium className="h-8 w-8 text-e-yellow" />} temp="28°C" />
              <WeatherDay day={t('dashboard.forecast.weather.days.tue')} icon={<Cloud className="h-8 w-8 text-gray-400" />} temp="26°C" />
              <WeatherDay day={t('dashboard.forecast.weather.days.wed')} icon={<CloudRain className="h-8 w-8 text-e-blue" />} temp="24°C" />
              <WeatherDay day={t('dashboard.forecast.weather.days.thu')} icon={<CloudRain className="h-8 w-8 text-e-blue" />} temp="23°C" />
              <WeatherDay day={t('dashboard.forecast.weather.days.fri')} icon={<SunMedium className="h-8 w-8 text-e-yellow" />} temp="27°C" />
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Wind className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-sm">{t('dashboard.forecast.weather.details.wind')}</span>
                </div>
                <span className="text-sm">12 km/h</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <CloudRain className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-sm">{t('dashboard.forecast.weather.details.chanceOfRain')}</span>
                </div>
                <span className="text-sm">10%</span>
              </div>
            </div>
          </ForecastCard>
          
          <ForecastCard title={t('dashboard.forecast.crop.title')} subtitle={t('dashboard.forecast.crop.subtitle')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-400 mb-1">{t('dashboard.forecast.crop.estimatedYield')}</p>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">4.2</span>
                  <span className="ml-1">{t('dashboard.forecast.crop.yieldUnit')}</span>
                </div>
                <span className="text-xs text-e-green">{t('dashboard.forecast.crop.yieldChange', { value: '+8' })}</span> {/* Example value */}
              </div>
              
              <div className="flex items-center">
                <div className="w-20 h-20 rounded-full border-4 border-e-green flex items-center justify-center relative">
                  <span className="text-2xl font-bold">90%</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-1">{t('dashboard.forecast.crop.harvestTimeline')}</p>
              <ProgressBar progress={90} />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{t('dashboard.forecast.crop.timelinePlanting', { date: 'Jan 22' })}</span> {/* Example date */}
                <span>{t('dashboard.forecast.weather.days.today')}</span>
                <span>{t('dashboard.forecast.crop.timelineHarvest', { date: 'Apr 12' })}</span> {/* Example date */}
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-400 mb-1">{t('dashboard.forecast.crop.marketPriceForecast')}</p>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm">{t('dashboard.forecast.crop.priceCurrent')}<span className="text-white">₹2,450{t('dashboard.forecast.crop.priceUnit')}</span></p> {/* Example price */}
                </div>
                <div>
                  <p className="text-sm">{t('dashboard.forecast.crop.priceHarvest')}<span className="text-e-green">₹2,850{t('dashboard.forecast.crop.priceUnit')}</span></p> {/* Example price */}
                </div>
              </div>
            </div>
          </ForecastCard>
        </div>
        
        {/* Crop Metrics and Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-e-dark-accent rounded-lg p-5">
            <h2 className="text-xl font-medium mb-2">{t('dashboard.cropMetrics.title')}</h2>
            <CropMetricsTab growthData={growthData} />
          </div>
          
          <div className="bg-e-dark-accent rounded-lg p-5">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-medium">{t('dashboard.recommendations.title')}</h2>
              <span className="text-xs text-gray-400">{t('dashboard.recommendations.subtitle')}</span>
            </div>
            
            <RecommendationCard 
              title={t('dashboard.recommendations.irrigation.title')}
              description={t('dashboard.recommendations.irrigation.description')}
              icon={<Droplets className="h-5 w-5 text-e-blue" />}
              // actionLabel removed, button added below
              variant="warning"
            />
            {/* Button to trigger time picker */}
            <Button
              className="mt-2 bg-e-blue hover:bg-e-blue/90 text-white"
              onClick={() => setShowIrrigationTimePicker(true)}
              disabled={showIrrigationTimePicker} // Disable if picker is already open
            >
              {t('dashboard.recommendations.irrigation.action')}
            </Button>

            {/* Conditional Time Picker */}
            {showIrrigationTimePicker && (
              <div className="mt-3 flex items-center space-x-2 p-3 bg-e-dark-shade rounded">
                {/* Time Picker Component Here */}
                <Button
                  className="bg-e-blue hover:bg-e-blue/90 text-white"
                  onClick={() => {
                    // Handle time selection logic here
                    setScheduledIrrigationTime("Selected Time"); // Placeholder
                    setShowIrrigationTimePicker(false); // Close picker
                  }}
                >
                  {t('dashboard.recommendations.irrigation.action')}
                </Button>
                <span>{scheduledIrrigationTime || t('dashboard.recommendations.irrigation.noTimeSet')}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Activity Feed */}
        <div className="mb-20  mt-20">
          <h2 className="text-xl font-medium mb-10">{t('dashboard.activityFeed.title')}</h2>
          <div>
            {/* Example Activity Items */}
            <div className="mb-2">
              <ActivityItem
                title={t('dashboard.activityFeed.items.soilAnalysis')}
                description={t('dashboard.activityFeed.items.soilAnalysisDescription')}
                icon={<Sprout className="h-4 w-4 text-e-green" />}
                time="5 minutes ago"
              />
            </div>
            <div className="mb-2">
              <ActivityItem
                title={t('dashboard.activityFeed.items.irrigationScheduled')}
                description={t('dashboard.activityFeed.items.irrigationScheduledDescription')}
                icon={<Droplets className="h-4 w-4 text-e-blue" />}
                time="30 minutes ago"
              />
            </div>
            <div className="mb-2">
              <ActivityItem
                title={t('dashboard.activityFeed.items.pestDetected')}
                description={t('dashboard.activityFeed.items.pestDetectedDescription')}
                icon={<Bug className="h-4 w-4 text-e-yellow" />}
                time="1 hour ago"
              />
            </div>
            <div className="mb-2">
              <ActivityItem
                title={t('dashboard.activityFeed.items.fertilizerApplied')}
                description={t('dashboard.activityFeed.items.fertilizerAppliedDescription')}
                icon={<Leaf className="h-4 w-4 text-e-green" />}
                time="2 hours ago"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
