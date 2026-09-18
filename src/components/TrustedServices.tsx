import { useState, useEffect, useCallback } from 'react';
import {
  Star,
  Phone,
  MessageCircle,
  BadgeCheck,
  Wrench,
  Zap,
  BookOpen,
  Scissors,
  Sprout,
  Loader2,
  Search,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { TrustedService } from '@/types';

const categoryIcons: Record<string, typeof Wrench> = {
  Plumber: Wrench,
  Electrician: Zap,
  Tutor: BookOpen,
  Hairdresser: Scissors,
  Gardener: Sprout,
};

const categoryColors: Record<string, string> = {
  Plumber: 'bg-blue-100 text-blue-600',
  Electrician: 'bg-amber-100 text-amber-600',
  Tutor: 'bg-purple-100 text-purple-600',
  Hairdresser: 'bg-pink-100 text-pink-600',
  Gardener: 'bg-green-100 text-green-600',
};

export default function TrustedServices() {
  const [services, setServices] = useState<TrustedService[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('All');

  const fetchServices = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from('trusted_services')
      .select('*')
      .order('rating', { ascending: false });

    if (fetchError) {
      setLoading(false);
      return;
    }
    if (data) setServices(data as TrustedService[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const categories = ['All', 'Plumber', 'Electrician', 'Tutor', 'Hairdresser', 'Gardener'];

  const filtered = services.filter((s) => {
    const matchesFilter = filter === 'All' || s.category === filter;
    const matchesSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatWhatsApp = (number: string) => {
    const cleaned = number.replace(/\D/g, '');
    return `https://wa.me/${cleaned}`;
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="px-4 pt-4 pb-28 space-y-4">
      {/* Search */}
      <div className="relative animate-fade-in">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search services or providers..."
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-gray-700 placeholder:text-gray-400 shadow-sm"
        />
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
              filter === cat
                ? 'bg-pink-500 text-white shadow-sm'
                : 'bg-white text-gray-500 border border-pink-100 hover:bg-pink-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-pink-400 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-pink-100">
          <Wrench className="w-12 h-12 text-pink-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No providers found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((service, idx) => {
            const Icon = categoryIcons[service.category] || Wrench;
            const colorClass = categoryColors[service.category] || 'bg-pink-100 text-pink-600';
            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100 hover:shadow-md transition-all animate-slide-up"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${colorClass}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-gray-800 text-sm truncate">{service.name}</h3>
                      {service.verified && (
                        <BadgeCheck className="w-4 h-4 text-pink-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 font-medium">{service.category}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      {renderStars(service.rating)}
                      {service.verified && (
                        <span className="text-xs text-pink-500 font-bold">Verified</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-pink-600">{service.price_range}</span>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`tel:${service.phone.replace(/\s/g, '')}`}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-pink-500 text-white font-semibold py-2.5 rounded-xl hover:bg-pink-600 transition-all active:scale-95 text-sm shadow-sm"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </a>
                  <a
                    href={formatWhatsApp(service.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 text-white font-semibold py-2.5 rounded-xl hover:bg-green-600 transition-all active:scale-95 text-sm shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
