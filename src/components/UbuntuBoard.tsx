import { useState, useEffect, useCallback } from 'react';
import {
  HandHeart,
  HeartHandshake,
  Plus,
  X,
  MapPin,
  MessageCircle,
  User,
  Package,
  Loader2,
  Send,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { UbuntuPost, PostType } from '@/types';

const LOCATIONS = ['Thokoza', 'Eden Park', 'Thinasonke', 'Germiston', 'Katlehong', 'Vosloorus'];

export default function UbuntuBoard() {
  const [posts, setPosts] = useState<UbuntuPost[]>([]);
  const [activeTab, setActiveTab] = useState<PostType>('offering');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    item: '',
    location: '',
    whatsapp: '',
  });

  const fetchPosts = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from('ubuntu_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError('Could not load community posts.');
    } else if (data) {
      setPosts(data as UbuntuPost[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.item || !form.location || !form.whatsapp) {
      setError('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const { error: insertError } = await supabase.from('ubuntu_posts').insert({
      post_type: activeTab,
      name: form.name,
      item: form.item,
      location: form.location,
      whatsapp: form.whatsapp,
    });

    if (insertError) {
      setError('Failed to post. Please try again.');
      setSubmitting(false);
      return;
    }

    setForm({ name: '', item: '', location: '', whatsapp: '' });
    setShowForm(false);
    setSubmitting(false);
    await fetchPosts();
  };

  const filteredPosts = posts.filter((p) => p.post_type === activeTab);

  const formatWhatsApp = (number: string) => {
    const cleaned = number.replace(/\D/g, '');
    return `https://wa.me/${cleaned}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="px-4 pt-4 pb-28 space-y-4">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-pink-400 to-pink-500 rounded-2xl p-4 flex items-center gap-3 shadow-md animate-fade-in">
        <HeartHandshake className="w-8 h-8 text-white flex-shrink-0" />
        <div>
          <p className="text-white font-bold text-base">Ubuntu Share Board</p>
          <p className="text-white/90 text-sm">Share what you have, ask for what you need</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-pink-100">
        <button
          onClick={() => setActiveTab('offering')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'offering'
              ? 'bg-pink-500 text-white shadow-sm'
              : 'text-gray-500 hover:bg-pink-50'
          }`}
        >
          <HandHeart className="w-4 h-4" />
          Offering Help
        </button>
        <button
          onClick={() => setActiveTab('needing')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'needing'
              ? 'bg-pink-500 text-white shadow-sm'
              : 'text-gray-500 hover:bg-pink-50'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          Needing Help
        </button>
      </div>

      {/* New post button */}
      <button
        onClick={() => setShowForm(true)}
        className="w-full flex items-center justify-center gap-2 bg-white text-pink-600 font-bold py-3.5 rounded-2xl border-2 border-pink-300 hover:bg-pink-50 transition-all active:scale-[0.98] shadow-sm"
      >
        <Plus className="w-5 h-5" />
        Post {activeTab === 'offering' ? 'an Offer' : 'a Request'}
      </button>

      {/* Post form modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center animate-fade-in"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-5 space-y-4 max-h-[85vh] overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-800">
                {activeTab === 'offering' ? 'Offer Help' : 'Request Help'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                  Your Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Mama Thandiwe"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-pink-50 border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-gray-700 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                  {activeTab === 'offering' ? 'What are you offering?' : 'What do you need?'}
                </label>
                <div className="relative">
                  <Package className="absolute left-3.5 top-4 w-5 h-5 text-pink-400" />
                  <textarea
                    value={form.item}
                    onChange={(e) => setForm({ ...form, item: e.target.value })}
                    placeholder={
                      activeTab === 'offering'
                        ? 'e.g. 2x school uniform size 12'
                        : 'e.g. Need food parcel for 3 days'
                    }
                    rows={2}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-pink-50 border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-gray-700 placeholder:text-gray-400 resize-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                  Location
                </label>
                <select
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-pink-50 border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-gray-700"
                >
                  <option value="">Select area...</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                  WhatsApp Number
                </label>
                <div className="relative">
                  <MessageCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
                  <input
                    type="tel"
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    placeholder="+27 82 123 4567"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-pink-50 border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-gray-700 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-xl px-4 py-3 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-pink-500 text-white font-bold py-4 rounded-xl hover:bg-pink-600 transition-all active:scale-[0.98] shadow-md disabled:opacity-60 text-base"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Post
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Posts feed */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-pink-400 animate-spin" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-pink-100">
            <HeartHandshake className="w-12 h-12 text-pink-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              No {activeTab === 'offering' ? 'offers' : 'requests'} yet.
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Be the first to {activeTab === 'offering' ? 'share what you have' : 'ask for help'}.
            </p>
          </div>
        ) : (
          filteredPosts.map((post, idx) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100 hover:shadow-md transition-all animate-slide-up"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    post.post_type === 'offering' ? 'bg-pink-100' : 'bg-pink-50'
                  }`}
                >
                  <HandHeart className="w-6 h-6 text-pink-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-gray-800 text-sm truncate">{post.name}</h3>
                    <span className="text-gray-400 text-xs flex-shrink-0">
                      {formatDate(post.created_at)}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mt-1">{post.item}</p>
                  <div className="flex items-center gap-1.5 mt-2 text-gray-500 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-pink-400" />
                    {post.location}
                  </div>
                  <a
                    href={formatWhatsApp(post.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 bg-green-500 text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-green-600 transition-all active:scale-95 text-sm shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp {post.name.split(' ')[0]}
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
