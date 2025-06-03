import React from 'react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, Share2, Heart, BookOpen, Calendar } from 'lucide-react';

const Community = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-e-dark text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('sections.community')}</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Join our growing network of farmers, agricultural experts, and enthusiasts to share knowledge and experiences.
          </p>
        </div>
        
        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-e-dark-accent p-6 rounded-lg text-center">
            <Users className="h-8 w-8 text-e-green mx-auto mb-2" />
            <h3 className="text-3xl font-bold">10,000+</h3>
            <p className="text-gray-400">Community Members</p>
          </div>
          
          <div className="bg-e-dark-accent p-6 rounded-lg text-center">
            <MessageSquare className="h-8 w-8 text-e-blue mx-auto mb-2" />
            <h3 className="text-3xl font-bold">25,000+</h3>
            <p className="text-gray-400">Discussions Started</p>
          </div>
          
          <div className="bg-e-dark-accent p-6 rounded-lg text-center">
            <Share2 className="h-8 w-8 text-e-yellow mx-auto mb-2" />
            <h3 className="text-3xl font-bold">5,000+</h3>
            <p className="text-gray-400">Knowledge Resources Shared</p>
          </div>
        </div>
        
        {/* Agricultural News */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <BookOpen className="h-6 w-6 text-e-green mr-2" />
            <h2 className="text-3xl font-bold">{t('sections.agriNews')}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* News Item 1 */}
            <Card className="bg-e-dark-accent border-gray-800">
              <CardHeader>
                <div className="h-48 bg-gray-700 -mx-6 -mt-6 mb-4 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-gray-500" />
                </div>
                <CardTitle>{t('news.title1')}</CardTitle>
                <CardDescription className="flex items-center mt-2 text-gray-400">
                  <Calendar className="h-4 w-4 mr-1" /> April 5, 2025
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{t('news.summary1')}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="text-e-green border-e-green hover:bg-e-green/20">
                  {t('buttons.readMore')}
                </Button>
                <div className="flex items-center space-x-2 text-gray-400">
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    <span>24</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>8</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
            
            {/* News Item 2 */}
            <Card className="bg-e-dark-accent border-gray-800">
              <CardHeader>
                <div className="h-48 bg-gray-700 -mx-6 -mt-6 mb-4 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-gray-500" />
                </div>
                <CardTitle>{t('news.title2')}</CardTitle>
                <CardDescription className="flex items-center mt-2 text-gray-400">
                  <Calendar className="h-4 w-4 mr-1" /> March 28, 2025
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{t('news.summary2')}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="text-e-green border-e-green hover:bg-e-green/20">
                  {t('buttons.readMore')}
                </Button>
                <div className="flex items-center space-x-2 text-gray-400">
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    <span>36</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>12</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
            
            {/* News Item 3 */}
            <Card className="bg-e-dark-accent border-gray-800">
              <CardHeader>
                <div className="h-48 bg-gray-700 -mx-6 -mt-6 mb-4 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-gray-500" />
                </div>
                <CardTitle>{t('news.title3')}</CardTitle>
                <CardDescription className="flex items-center mt-2 text-gray-400">
                  <Calendar className="h-4 w-4 mr-1" /> March 15, 2025
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{t('news.summary3')}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="text-e-green border-e-green hover:bg-e-green/20">
                  {t('buttons.readMore')}
                </Button>
                <div className="flex items-center space-x-2 text-gray-400">
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    <span>42</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>18</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        {/* NPK Sensor Alternative */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <BookOpen className="h-6 w-6 text-e-green mr-2" />
            <h2 className="text-3xl font-bold">NPK Sensor Alternative</h2>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto mb-6">
            This section details an alternative NPK sensing method using cheaper components and machine learning to estimate Nitrogen, Phosphorus, and Potassium levels in the soil.
          </p>

          {/* Hardware Components */}
          <h3 className="text-2xl font-bold mb-4">Hardware Components</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-gray-300">
              <thead>
                <tr>
                  <th className="px-4 py-2">Component</th>
                  <th className="px-4 py-2">Purpose</th>
                  <th className="px-4 py-2">Placement</th>
                  <th className="px-4 py-2">Estimated Cost (INR ₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-t border-gray-800 px-4 py-2">RGB Sensor (or) NIR</td>
                  <td className="border-t border-gray-800 px-4 py-2">Estimate Nitrogen (N) and Phosphorus (P) via light reflectance</td>
                  <td className="border-t border-gray-800 px-4 py-2">Above soil (inside light-proof chamber with LED)</td>
                  <td className="border-t border-gray-800 px-4 py-2">₹300–₹900</td>
                </tr>
                <tr>
                  <td className="border-t border-gray-800 px-4 py-2">EC Sensor (DFRobot Gravity EC)</td>
                  <td className="border-t border-gray-800 px-4 py-2">Estimate Potassium (K) and Total Nutrient Salts</td>
                  <td className="border-t border-gray-800 px-4 py-2">Under soil (5–10 cm)</td>
                  <td className="border-t border-gray-800 px-4 py-2">₹800–₹1200</td>
                </tr>
                <tr>
                  <td className="border-t border-gray-800 px-4 py-2">DFRobot pH Sensor (SEN0161)</td>
                  <td className="border-t border-gray-800 px-4 py-2">Detect soil acidity/alkalinity</td>
                  <td className="border-t border-gray-800 px-4 py-2">Under soil</td>
                  <td className="border-t border-gray-800 px-4 py-2">₹1,200–₹1,500</td>
                </tr>
                <tr>
                  <td className="border-t border-gray-800 px-4 py-2">Capacitive Soil Moisture Sensor</td>
                  <td className="border-t border-gray-800 px-4 py-2">Helps correct EC/pH readings; monitors soil water level</td>
                  <td className="border-t border-gray-800 px-4 py-2">Under soil</td>
                  <td className="border-t border-gray-800 px-4 py-2">₹150–₹250</td>
                </tr>
                <tr>
                  <td className="border-t border-gray-800 px-4 py-2">White LED Array</td>
                  <td className="border-t border-gray-800 px-4 py-2">Uniform lighting for multispectral sensor</td>
                  <td className="border-t border-gray-800 px-4 py-2">Inside chamber above soil</td>
                  <td className="border-t border-gray-800 px-4 py-2">₹50</td>
                </tr>
                <tr>
                  <td className="border-t border-gray-800 px-4 py-2">ESP32 / Raspberry Pi Pico W</td>
                  <td className="border-t border-gray-800 px-4 py-2">Microcontroller with WiFi/BLE for sensor control and ML inference</td>
                  <td className="border-t border-gray-800 px-4 py-2">Inside waterproof housing</td>
                  <td className="border-t border-gray-800 px-4 py-2">₹300–₹600</td>
                </tr>
                <tr>
                  <td className="border-t border-gray-800 px-4 py-2">3.7V Li-ion Battery + Solar Charging Module (optional)</td>
                  <td className="border-t border-gray-800 px-4 py-2">Power source</td>
                  <td className="border-t border-gray-800 px-4 py-2">Enclosed</td>
                  <td className="border-t border-gray-800 px-4 py-2">₹250–₹400</td>
                </tr>
                <tr>
                  <td className="border-t border-gray-800 px-4 py-2">Waterproof Enclosure + Probe Housing (3D printed or PVC)</td>
                  <td className="border-t border-gray-800 px-4 py-2">Housing & protection</td>
                  <td className="border-t border-gray-800 px-4 py-2">One end above, other buried</td>
                  <td className="border-t border-gray-800 px-4 py-2">₹200–₹300</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Working Pipeline */}
          <h3 className="text-2xl font-bold mb-4 mt-8">Working Pipeline</h3>
          <ol className="list-decimal list-inside text-gray-300">
            <li><strong>Sensor Setup:</strong> Insert the probe in the field. The top of the probe (above soil) has a multispectral sensor in a covered box. The bottom (under soil) has pH, EC, and moisture sensors close together at 5–15 cm depth.</li>
            <li><strong>Data Collection:</strong>
              <ol className="list-decimal list-inside text-gray-300 ml-6 mt-2">
                <li>Multispectral sensor shines internal LED, scans light reflected from soil surface.</li>
                <li>EC sensor measures conductivity (linked to K and TDS).</li>
                <li>pH sensor measures acidity (affects P/N availability).</li>
                <li>Moisture sensor helps correct EC readings.</li>
              </ol>
            </li>
            <li><strong>ML-Based NPK Prediction:</strong> All sensor values are fed to an ML model (random forest/regression) onboard or in the cloud. The model outputs approximate Nitrogen, Phosphorus, Potassium (NPK) values and classifies soil health status (e.g., N-Deficient, Ideal, K-Surplus).</li>
            <li><strong>Fertilizer Recommendation:</strong> Based on predicted NPK values and crop type (optional input), the system recommends what fertilizer to apply, how much to apply, and when to apply it.</li>
            <li><strong>Output/Communication:</strong> Send results via OLED display (optional), WiFi/Bluetooth to phone, or upload to cloud (Firebase, MQTT, ThingsBoard).</li>
          </ol>

          {/* Circuit Diagrams */}
          <h3 className="text-2xl font-bold mb-4 mt-8">Circuit Diagrams</h3>
          <div className="flex flex-wrap justify-center">
            <img src="CircuitDiagram.jpeg" alt="Circuit Diagram 1" className="max-w-full h-auto m-2" />
            <img src="CircuitDiagram2.jpeg" alt="Circuit Diagram 2" className="max-w-full h-auto m-2" />
             <img src="Probe.jpeg" alt="Probe Diagram" className="max-w-full h-auto m-2" />
          </div>

          {/* Benefits of Alternative */}
          <h3 className="text-2xl font-bold mb-4 mt-8">Benefits of this Alternative</h3>
          <p className="text-gray-400 max-w-2xl mx-auto mb-6">
            This alternative NPK sensor offers a cost-effective solution compared to traditional NPK sensors, which can cost around ₹27,000. This DIY alternative can be built for less than ₹5,000, making it accessible to a wider range of users.
          </p>

          {/* Accuracy Disclaimer */}
          <p className="text-gray-500 italic text-center">
            Disclaimer: The NPK values and soil health status provided by this alternative sensor are approximate and based on a machine learning model. Actual values may vary.
          </p>
        </div>
        
        {/* Join Community Section */}
        <div className="bg-e-dark-accent rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Join Our Community Today</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-6">
            Connect with fellow farmers, share your experiences, ask questions, and learn from agricultural experts from around the world.
          </p>
          <Button className="bg-e-green hover:bg-e-green/80 text-black px-6 py-2">
            Join Community
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Community;
