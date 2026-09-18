import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Phone,
  Clock,
  MapPin,
  Navigation,
  Hospital,
  Shield,
  Zap,
  Siren,
  Stethoscope,
} from 'lucide-react';

interface ServiceInfo {
  id: string;
  name: string;
  category: string;
  phone: string;
  hours: string;
  address: string;
  directionsUrl: string;
  icon: typeof Hospital;
  color: string;
  bgColor: string;
}

const services: ServiceInfo[] = [
  {
    id: 'clinic',
    name: 'Thokoza Community Clinic',
    category: 'Local Clinic',
    phone: '+2711 909 2000',
    hours: 'Mon-Fri 07:00-16:00, Sat 08:00-12:00',
    address: 'Ndaba St, Thokoza, Germiston, 1426',
    directionsUrl: 'https://maps.google.com/?q=Thokoza+Community+Clinic',
    icon: Stethoscope,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
  },
  {
    id: 'saps',
    name: 'Thokoza SAPS Police Station',
    category: 'SAPS Police Station',
    phone: '+2711 868 1200',
    hours: '24 Hours / 7 Days',
    address: 'Central Dr, Thokoza, Germiston, 1426',
    directionsUrl: 'https://maps.google.com/?q=Thokoza+SAPS+Police+Station',
    icon: Shield,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
  },
  {
    id: 'municipal',
    name: 'Water & Electricity Municipal Helpline',
    category: 'Municipal Helpline',
    phone: '+2711 999 2100',
    hours: '24 Hours / 7 Days',
    address: 'Ekurhuleni Metropolitan Municipality',
    directionsUrl: 'https://maps.google.com/?q=Ekurhuleni+Municipality',
    icon: Zap,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
  },
  {
    id: 'emergency',
    name: 'Emergency Services',
    category: 'Emergency',
    phone: '10111',
    hours: '24 Hours / 7 Days',
    address: 'National Emergency Line',
    directionsUrl: '',
    icon: Siren,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
];

export default function FindHelp() {
  const [search, setSearch] = useState('');
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return services;
    const q = search.toLowerCase();
    return services.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.phone.includes(q)
    );
  }, [search]);

  return (
    <div className="px-4 pt-4 pb-28 space-y-4">
      {/* Search */}
      <div className="relative animate-fade-in">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clinics, police, helplines..."
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-gray-700 placeholder:text-gray-400 shadow-sm"
        />
      </div>

      {/* Quick emergency banner */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-4 flex items-center justify-between shadow-lg animate-slide-up">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <Siren className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-base">Life-Threatening Emergency?</p>
            <p className="text-white/90 text-sm">Call 10111 immediately</p>
          </div>
        </div>
        <a
          href="tel:10111"
          className="bg-white text-red-600 font-bold px-5 py-2.5 rounded-xl shadow hover:bg-red-50 transition-all active:scale-95 text-sm"
        >
          Call Now
        </a>
      </div>

      {/* Service cards */}
      <div className="space-y-3">
        {filtered.map((service, idx) => {
          const Icon = service.icon;
          return (
            <div
              key={service.id}
              className={`bg-white rounded-2xl p-4 shadow-sm border border-pink-100 hover:shadow-md transition-all ${
                animateIn ? 'animate-slide-up' : ''
              }`}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-14 h-14 rounded-2xl ${service.bgColor} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className={`w-7 h-7 ${service.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-pink-500 uppercase tracking-wide">
                    {service.category}
                  </p>
                  <h3 className="font-bold text-gray-800 text-sm leading-snug mt-0.5">
                    {service.name}
                  </h3>

                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4 text-pink-400 flex-shrink-0" />
                      <a
                        href={`tel:${service.phone.replace(/\s/g, '')}`}
                        className="text-sm font-medium hover:text-pink-600 transition-colors"
                      >
                        {service.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4 text-pink-400 flex-shrink-0" />
                      <span className="text-xs">{service.hours}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-pink-400 flex-shrink-0" />
                      <span className="text-xs truncate">{service.address}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <a
                      href={`tel:${service.phone.replace(/\s/g, '')}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-pink-500 text-white font-semibold py-2.5 rounded-xl hover:bg-pink-600 transition-all active:scale-95 text-sm shadow-sm"
                    >
                      <Phone className="w-4 h-4" />
                      Call
                    </a>
                    {service.directionsUrl && (
                      <a
                        href={service.directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-pink-100 text-pink-700 font-semibold py-2.5 rounded-xl hover:bg-pink-200 transition-all active:scale-95 text-sm"
                      >
                        <Navigation className="w-4 h-4" />
                        Directions
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Hospital className="w-12 h-12 text-pink-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No services found for "{search}"</p>
        </div>
      )}
    </div>
  );
}
