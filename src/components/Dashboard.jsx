import { useState, useEffect } from 'react';
import { TrendingUp, MessageSquare, Users, Activity } from 'lucide-react';
import { api } from '../services/api';

export default function Dashboard() {
  const [marketStats, setMarketStats] = useState(null);
  const [chatStats, setChatStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [market, chat] = await Promise.all([
        api.getMarketStats(),
        api.getChatStats()
      ]);
      setMarketStats(market.stats);
      setChatStats(chat.stats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const topCrops = marketStats?.cropCounts
    ? Object.entries(marketStats.cropCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h2>
        <p className="text-gray-600">System statistics and usage overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Market Requests"
          value={marketStats?.totalRequests || 0}
          icon={<TrendingUp className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Chat Messages"
          value={chatStats?.totalChats || 0}
          icon={<MessageSquare className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="English Queries"
          value={chatStats?.languageCounts.english || 0}
          icon={<Users className="h-6 w-6" />}
          color="purple"
        />
        <StatCard
          title="Hausa Queries"
          value={chatStats?.languageCounts.hausa || 0}
          icon={<Activity className="h-6 w-6" />}
          color="orange"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Requested Crops</h3>
        {topCrops.length > 0 ? (
          <div className="space-y-3">
            {topCrops.map(([crop, count], index) => (
              <div key={crop} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-full font-semibold text-sm">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 font-medium capitalize">{crop}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-200 rounded-full h-2 w-32">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(count / topCrops[0][1]) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-600 font-medium w-12 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No data available yet. Start using the system to see statistics.</p>
        )}
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Supported States:</span>
            <p className="text-gray-800 font-medium">Kano, Kaduna, Katsina, Sokoto, Kebbi</p>
          </div>
          <div>
            <span className="text-gray-600">Supported Crops:</span>
            <p className="text-gray-800 font-medium">Maize, Rice, Tomato, Sorghum, Cowpea</p>
          </div>
          <div>
            <span className="text-gray-600">Languages:</span>
            <p className="text-gray-800 font-medium">English, Hausa</p>
          </div>
          <div>
            <span className="text-gray-600">Features:</span>
            <p className="text-gray-800 font-medium">Prices, Forecasts, Weather, AI Chat</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
