import { useState } from 'react';
import {
  MapPin,
  AlertTriangle,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Info,
} from 'lucide-react';
import FindHelp from '@/components/FindHelp';
import ReportIssue from '@/components/ReportIssue';
import UbuntuBoard from '@/components/UbuntuBoard';
import TrustedServices from '@/components/TrustedServices';

type Tab = 'find-help' | 'report-issue' | 'ubuntu-board' | 'trusted-services';

const tabs: {
  id: Tab;
  label: string;
  icon: typeof MapPin;
}[] = [
  { id: 'find-help', label: 'Find Help', icon: MapPin },
  { id: 'report-issue', label: 'Report', icon: AlertTriangle },
  { id: 'ubuntu-board', label: 'Ubuntu', icon: HeartHandshake },
  { id: 'trusted-services', label: 'Services', icon: ShieldCheck },
];

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('find-help');

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col max-w-md mx-auto relative">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-pink-500 to-pink-400 shadow-md">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-white font-bold text-lg leading-tight">
                Sawubona Community
              </h1>
              <p className="text-white/90 text-xs font-medium">
                Built for Thokoza Communities - Ubuntu Spirit
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'find-help' && <FindHelp />}
        {activeTab === 'report-issue' && <ReportIssue />}
        {activeTab === 'ubuntu-board' && <UbuntuBoard />}
        {activeTab === 'trusted-services' && <TrustedServices />}
      </main>

      {/* AI disclaimer footer */}
      <footer className="bg-white border-t border-pink-100 px-4 py-3">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-pink-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500 leading-relaxed">
            <span className="font-semibold text-gray-600">AI-assisted verification.</span>{' '}
            Please verify providers before payment. This app helps connect community members
            but does not guarantee service quality.
          </p>
        </div>
      </footer>

      {/* Bottom navigation */}
      <nav className="sticky bottom-0 z-40 bg-white border-t border-pink-100 shadow-lg">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-all relative ${
                  isActive ? 'text-pink-600' : 'text-gray-400'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-pink-500 rounded-full" />
                )}
                <div
                  className={`flex items-center justify-center w-10 h-8 rounded-xl transition-all ${
                    isActive ? 'bg-pink-100' : ''
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform ${
                      isActive ? 'scale-110' : 'scale-100'
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] font-semibold ${
                    isActive ? 'text-pink-600' : 'text-gray-400'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default App;
