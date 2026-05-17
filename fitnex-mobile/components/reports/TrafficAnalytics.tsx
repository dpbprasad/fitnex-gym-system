'use client';

import Card from '@/components/ui/Card';

interface TrafficAnalyticsProps {
  totalCheckIns: number;
  averageDaily: number;
  peakHour: string;
}

export default function TrafficAnalytics({ totalCheckIns, averageDaily, peakHour }: TrafficAnalyticsProps) {
  return (
    <Card>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Traffic Analytics</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <span className="text-gray-700">Total Check-ins</span>
          <span className="text-lg font-semibold text-blue-600">
            {totalCheckIns}
          </span>
        </div>

        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
          <span className="text-gray-700">Average Daily</span>
          <span className="text-lg font-semibold text-purple-600">
            {averageDaily.toFixed(1)}
          </span>
        </div>

        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
          <span className="text-gray-700">Peak Hour</span>
          <span className="text-lg font-semibold text-orange-600">
            {peakHour}
          </span>
        </div>
      </div>
    </Card>
  );
}
