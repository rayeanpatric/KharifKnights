
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import GrowthChart from './GrowthChart';

interface CropMetricsTabProps {
  growthData: number[];
}

const CropMetricsTab = ({ growthData }: CropMetricsTabProps) => {
  return (
    <div>
      <p className="text-sm text-gray-400 mb-2">Daily growth and health metrics</p>
      <Tabs defaultValue="growth">
        <TabsList className="grid grid-cols-3 mb-4 bg-gray-800">
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="yield">Yield</TabsTrigger>
        </TabsList>
        <TabsContent value="growth" className="h-52">
          <GrowthChart data={growthData} height={150} />
          <div className="flex justify-between mt-8">
            <div>
              <p className="text-sm text-gray-400">Growth Rate</p>
              <p className="text-2xl font-medium">2.3 cm/day</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Leaf Area</p>
              <p className="text-2xl font-medium">145 cm<sup>2</sup></p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="health">Health metrics content</TabsContent>
        <TabsContent value="yield">Yield metrics content</TabsContent>
      </Tabs>
    </div>
  );
};

export default CropMetricsTab;
