import { useState, useEffect, useCallback } from 'react';
import {
  Camera,
  MapPin,
  FileText,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  X,
  ImageIcon,
  Tag,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { ReportedIssue, IssueStatus } from '@/types';

const ISSUE_TYPES = [
  { value: 'Pothole', label: 'Pothole' },
  { value: 'Water Leak', label: 'Water Leak' },
  { value: 'No Electricity', label: 'No Electricity' },
  { value: 'Street Light', label: 'Street Light Out' },
  { value: 'Waste', label: 'Waste / Rubbish' },
];

const statusConfig: Record<
  IssueStatus,
  { icon: typeof CheckCircle2; color: string; bgColor: string; label: string }
> = {
  Reported: {
    icon: AlertCircle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    label: 'Reported',
  },
  'In Progress': {
    icon: Clock,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    label: 'In Progress',
  },
  Resolved: {
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    label: 'Resolved',
  },
};

export default function ReportIssue() {
  const [issues, setIssues] = useState<ReportedIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    issue_type: '',
    location: '',
    description: '',
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchIssues = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from('reported_issues')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError('Could not load reported issues. Please try again.');
    } else if (data) {
      setIssues(data as ReportedIssue[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.issue_type || !form.location || !form.description) {
      setError('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const { error: insertError } = await supabase
      .from('reported_issues')
      .insert({
        issue_type: form.issue_type,
        location: form.location,
        description: form.description,
        photo_url: photoPreview,
        status: 'Reported',
      });

    if (insertError) {
      setError('Failed to submit your report. Please try again.');
      setSubmitting(false);
      return;
    }

    setSuccess(true);
    setForm({ issue_type: '', location: '', description: '' });
    setPhotoPreview(null);
    setSubmitting(false);
    await fetchIssues();

    setTimeout(() => setSuccess(false), 3000);
  };

  const updateStatus = async (id: string, newStatus: IssueStatus) => {
    const { error: updateError } = await supabase
      .from('reported_issues')
      .update({ status: newStatus })
      .eq('id', id);

    if (updateError) return;
    setIssues((prev) =>
      prev.map((issue) => (issue.id === id ? { ...issue, status: newStatus } : issue))
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="px-4 pt-4 pb-28 space-y-5">
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100 space-y-4 animate-fade-in"
      >
        <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
            <Tag className="w-4 h-4 text-pink-600" />
          </span>
          Report a Community Issue
        </h2>

        {/* Issue type */}
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1.5">
            Issue Type
          </label>
          <select
            value={form.issue_type}
            onChange={(e) => setForm({ ...form, issue_type: e.target.value })}
            className="w-full px-4 py-3.5 rounded-xl bg-pink-50 border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-gray-700"
          >
            <option value="">Select issue type...</option>
            {ISSUE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Photo upload */}
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1.5">
            Photo (optional)
          </label>
          {photoPreview ? (
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={photoPreview}
                alt="Issue preview"
                className="w-full h-48 object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={() => setPhotoPreview(null)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-all"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center gap-2 w-full h-32 rounded-xl border-2 border-dashed border-pink-300 bg-pink-50 cursor-pointer hover:bg-pink-100 transition-all">
              <Camera className="w-7 h-7 text-pink-400" />
              <span className="text-sm text-pink-500 font-medium">Tap to upload a photo</span>
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </label>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1.5">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Mgwiya Road, Thokoza Ext 1"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-pink-50 border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-gray-700 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1.5">
            Description
          </label>
          <div className="relative">
            <FileText className="absolute left-3.5 top-4 w-5 h-5 text-pink-400" />
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the issue in detail..."
              rows={3}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-pink-50 border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-gray-700 placeholder:text-gray-400 resize-none"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-xl px-4 py-3 text-sm animate-slide-up">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-xl px-4 py-3 text-sm animate-scale-in">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            Issue reported successfully! Thank you for helping your community.
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-pink-500 text-white font-bold py-4 rounded-xl hover:bg-pink-600 transition-all active:scale-[0.98] shadow-md disabled:opacity-60 disabled:cursor-not-allowed text-base"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Report
            </>
          )}
        </button>
      </form>

      {/* Reported issues list */}
      <div className="space-y-3">
        <h2 className="font-bold text-lg text-gray-800 px-1">
          Community Reports ({issues.length})
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-pink-400 animate-spin" />
          </div>
        ) : issues.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-pink-100">
            <ImageIcon className="w-12 h-12 text-pink-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No issues reported yet.</p>
            <p className="text-gray-400 text-sm mt-1">Be the first to report a problem.</p>
          </div>
        ) : (
          issues.map((issue, idx) => {
            const sConfig = statusConfig[issue.status];
            const StatusIcon = sConfig.icon;
            return (
              <div
                key={issue.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100 animate-slide-up"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase text-pink-600 bg-pink-100 px-2.5 py-1 rounded-lg">
                      {issue.issue_type}
                    </span>
                  </div>
                  <span
                    className={`flex items-center gap-1 text-xs font-bold ${sConfig.color} ${sConfig.bgColor} px-2.5 py-1 rounded-lg flex-shrink-0`}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    {sConfig.label}
                  </span>
                </div>

                {issue.photo_url && (
                  <img
                    src={issue.photo_url}
                    alt={issue.issue_type}
                    className="w-full h-36 object-cover rounded-xl mb-2"
                  />
                )}

                <p className="text-sm text-gray-700 leading-relaxed">{issue.description}</p>

                <div className="flex items-center gap-1.5 mt-2 text-gray-500 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-pink-400" />
                  {issue.location}
                </div>

                <p className="text-gray-400 text-xs mt-1">{formatDate(issue.created_at)}</p>

                {/* Status changer */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  {(['Reported', 'In Progress', 'Resolved'] as IssueStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(issue.id, s)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all active:scale-95 ${
                        issue.status === s
                          ? `${statusConfig[s].bgColor} ${statusConfig[s].color} ring-1 ring-current/20`
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
