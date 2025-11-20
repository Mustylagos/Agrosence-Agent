import { useState, useEffect } from 'react';
import { Sprout, Cloud, TrendingUp } from 'lucide-react';
import { api } from '../services/api';

export default function Header() {
  const [mode, setMode] = useState('mock');
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const health = await api.getHealth();
      setMode(health.mode);
      setIsLive(health.mode === 'live');
    } catch (error) {
      console.error('Health check failed:', error);
    }
  };

  return (
    <header className="bg-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sprout className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">AgroSense Agent</h1>
              <p className="text-sm text-green-100">Agricultural Market & Climate Advisor</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4" />
                <span>Market Prices</span>
              </div>
              <div className="flex items-center space-x-1">
                <Cloud className="h-4 w-4" />
                <span>Weather Alerts</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-green-700 px-3 py-1.5 rounded-full text-xs">
              <div className={`h-2 w-2 rounded-full ${isLive ? 'bg-yellow-400' : 'bg-blue-400'} animate-pulse`}></div>
              <span className="font-medium">
                {isLive ? 'Live (Azure)' : 'Mock Data'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
