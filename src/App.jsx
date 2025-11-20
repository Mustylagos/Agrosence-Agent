import { useState, useEffect } from 'react';
import Header from './components/Header';
import ChatWidget from './components/ChatWidget';
import Dashboard from './components/Dashboard';
import { BarChart3, MessageSquare } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('agrosense_user');
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  const handleSaveSession = () => {
    const name = prompt('Enter your name to save session:');
    if (name) {
      localStorage.setItem('agrosense_user', name);
      setUserName(name);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Chat Assistant</span>
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Dashboard</span>
            </button>
          </div>

          {userName && (
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="text-sm text-gray-600">Welcome, </span>
              <span className="text-sm font-semibold text-green-600">{userName}</span>
            </div>
          )}
          {!userName && (
            <button
              onClick={handleSaveSession}
              className="bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Save Session
            </button>
          )}
        </div>

        <div className="flex-1 flex flex-col">
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col max-h-[calc(100vh-220px)]">
              <ChatWidget />
            </div>
          )}
          {activeTab === 'dashboard' && <Dashboard />}
        </div>
      </div>

      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
            <p>AgroSense Agent - Agricultural Market & Climate Advisor</p>
            <p>Serving smallholder farmers across Northern Nigeria</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
