import React, { useState } from 'react';
import { 
  Bus, 
  MapPin, 
  Clock, 
  Phone, 
  ShieldCheck, 
  Users, 
  Compass, 
  RefreshCw,
  X,
  AlertCircle
} from 'lucide-react';
import { BusTrackingInfo } from '../types';
import { BUS_TRACKING_DATA, CHILIMO_INFO } from '../data/mockData';

interface BusLiveTrackerModalProps {
  onClose: () => void;
  initialBusId?: string;
}

export const BusLiveTrackerModal: React.FC<BusLiveTrackerModalProps> = ({
  onClose,
  initialBusId = 'BUS-01'
}) => {
  const [buses, setBuses] = useState<BusTrackingInfo[]>(BUS_TRACKING_DATA);
  const [selectedBusId, setSelectedBusId] = useState<string>(initialBusId);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const activeBus = buses.find(b => b.busId === selectedBusId) || buses[0];

  const handleRefreshGps = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Simulate minor ETA decrement
      setBuses(prev => prev.map(bus => ({
        ...bus,
        currentSpeedKmH: Math.floor(25 + Math.random() * 15)
      })));
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 text-amber-900 rounded-2xl">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-[#0f1e36]">
                  Hordoffii Konkolaataa Mana Barumsaa Burayyuu
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 animate-pulse">
                  ● LIVE GPS
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Burayu School Bus Fleet Live Route Tracking & ETA • Chilimo Academy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshGps}
              className={`p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition ${isRefreshing ? 'animate-spin' : ''}`}
              title="GPS Haareessi"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bus Selector Tabs */}
        <div className="flex items-center gap-3 py-4">
          {buses.map(bus => (
            <button
              key={bus.busId}
              onClick={() => setSelectedBusId(bus.busId)}
              className={`flex-1 p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                selectedBusId === bus.busId
                  ? 'bg-[#0f1e36] text-white border-amber-400 shadow-md ring-2 ring-amber-400/30'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div>
                <div className="text-xs font-black">{bus.busId} • {bus.routeTitle}</div>
                <div className={`text-[11px] ${selectedBusId === bus.busId ? 'text-amber-300' : 'text-slate-500'}`}>
                  Taargaa: {bus.busNumberPlate}
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                bus.status === 'en_route' ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'
              }`}>
                {bus.status === 'en_route' ? 'Adeemsa Irra Jira' : 'Dhaabbateera'}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Bus KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Saffisa (Speed)</div>
            <div className="text-base font-black text-slate-900 mt-0.5">
              {activeBus.currentSpeedKmH} km/h
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Barattoota Fe'ate</div>
            <div className="text-base font-black text-slate-900 mt-0.5">
              {activeBus.onboardStudents} / {activeBus.totalCapacity}
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Konkolaachisaa</div>
            <div className="text-xs font-black text-slate-900 mt-1 truncate">
              {activeBus.driverName}
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Bilbila Bilbili</div>
            <a 
              href={`tel:${activeBus.driverPhone}`}
              className="text-xs font-black text-emerald-600 hover:underline mt-1 flex items-center gap-1"
            >
              <Phone className="w-3 h-3" />
              {activeBus.driverPhone}
            </a>
          </div>
        </div>

        {/* Visual Route Progress Map */}
        <div className="bg-gradient-to-br from-slate-900 to-[#0f1e36] text-white p-6 rounded-2xl border border-slate-800 shadow-inner relative overflow-hidden mb-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                Sarara Konkolaataa Burayyuu (Route Timeline)
              </span>
            </div>
            <span className="text-xs font-medium text-amber-300">
              Buufata 5 Guutuu
            </span>
          </div>

          {/* Stepper stops */}
          <div className="space-y-6 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-white/20 before:h-full">
            {activeBus.stops.map((stop, idx) => {
              const isCurrent = idx === activeBus.currentStopIndex;
              return (
                <div key={idx} className="relative flex items-start gap-4 z-10">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    stop.passed
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/40 animate-pulse'
                      : 'bg-white/20 text-slate-300'
                  }`}>
                    {stop.passed ? '✓' : idx + 1}
                  </div>

                  <div className="flex-1 bg-white/5 p-3 rounded-xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-black text-white flex items-center gap-2">
                        <span>{stop.name}</span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-400 text-slate-950">
                            BUS IS HERE
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Yeroo Qophaa'e: {stop.plannedTime}
                      </div>
                    </div>

                    <div className="text-right">
                      {stop.passed ? (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                          Darbeera (Passed)
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-amber-400 font-mono">
                          ETA: Daqiiqaa {stop.etaMinutes} keessatti
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Safety Note */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2 font-medium">
          <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
          <span>
            Balaa fi dhimma ariifachiisaaf bilbila konkolaachisaa <strong>{activeBus.driverPhone}</strong> yookiin waajjira bulchiinsaa <strong>{CHILIMO_INFO.phone}</strong> qunnamaa.
          </span>
        </div>

      </div>
    </div>
  );
};
