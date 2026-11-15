import { useState, useEffect, useMemo, type FormEvent } from 'react';
import { ToastProvider, useToast } from './Toast';

const API_BASE = 'http://localhost:7001';

interface ReviewItem {
  id: number;
  name: string;
  company: string;
  role: string;
  projectType: string;
  rating: number;
  reviewText: string;
  consent: boolean;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

interface DeveloperItem {
  id: number;
  name: string;
  email: string;
  skill: string;
  portfolio?: string | null;
  message?: string | null;
  status: 'Pending' | 'Reviewing' | 'Accepted' | 'Rejected';
  createdAt: string;
}

interface ContactItem {
  id: number;
  name: string;
  email: string;
  topic?: string | null;
  message: string;
  status: 'Unread' | 'Read' | 'Replied' | 'Archived';
  createdAt: string;
}

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  client?: string | null;
  year?: string | null;
  summary: string;
  solution?: string | null;
  metric?: string | null;
  tags: string[];
  image?: string | null;
  url?: string | null;
  isFeatured: boolean;
  status: 'Draft' | 'Published' | 'Archived';
  order: number;
  createdAt: string;
}

function AdminContent() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'reviews' | 'developers' | 'contacts' | 'portfolios'>('reviews');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isServerLive, setIsServerLive] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  // Pure live backend state - zero fake / mock data
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [developers, setDevelopers] = useState<DeveloperItem[]>([]);
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);

  // Portfolio modal state
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [editingPortfolioId, setEditingPortfolioId] = useState<number | null>(null);
  const [portfolioForm, setPortfolioForm] = useState({
    title: '',
    category: 'Web',
    client: '',
    year: '2026',
    summary: '',
    solution: '',
    metric: '',
    tags: '',
    image: '',
    url: '',
    isFeatured: false,
    status: 'Published' as 'Draft' | 'Published' | 'Archived',
  });

  const loadData = async () => {
    setLoading(true);
    let serverOk = false;
    try {
      // 1. Fetch reviews
      const revRes = await fetch(`${API_BASE}/review`).catch(() => null);
      if (revRes && revRes.ok) {
        serverOk = true;
        const revJson = await revRes.json();
        setReviews(Array.isArray(revJson.reviews) ? revJson.reviews : []);
      }

      // 2. Fetch developers
      const devRes = await fetch(`${API_BASE}/developer`).catch(() => null);
      if (devRes && devRes.ok) {
        serverOk = true;
        const devJson = await devRes.json();
        setDevelopers(Array.isArray(devJson.applications) ? devJson.applications : []);
      }

      // 3. Fetch contacts
      const conRes = await fetch(`${API_BASE}/contact`).catch(() => null);
      if (conRes && conRes.ok) {
        serverOk = true;
        const conJson = await conRes.json();
        setContacts(Array.isArray(conJson.contacts) ? conJson.contacts : []);
      }

      // 4. Fetch portfolios
      const portRes = await fetch(`${API_BASE}/portfolio`).catch(() => null);
      if (portRes && portRes.ok) {
        serverOk = true;
        const portJson = await portRes.json();
        setPortfolios(Array.isArray(portJson.portfolios) ? portJson.portfolios : []);
      }

      setIsServerLive(serverOk);
    } catch {
      setIsServerLive(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Review Actions
  const handleReviewStatus = async (id: number, status: 'Approved' | 'Rejected' | 'Pending') => {
    try {
      const res = await fetch(`${API_BASE}/review/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
        toast(`Review #${id} updated to ${status}`);
      } else {
        toast(`Failed to update review #${id}`);
      }
    } catch {
      toast('Network error updating review');
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (!confirm(`Delete review #${id}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/review/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        toast(`Review #${id} deleted`);
      } else {
        toast('Failed to delete review');
      }
    } catch {
      toast('Network error deleting review');
    }
  };

  // Developer Actions
  const handleDeveloperStatus = async (id: number, status: DeveloperItem['status']) => {
    try {
      const res = await fetch(`${API_BASE}/developer/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setDevelopers((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
        toast(`Application #${id} updated to ${status}`);
      } else {
        toast(`Failed to update application #${id}`);
      }
    } catch {
      toast('Network error updating application');
    }
  };

  const handleDeleteDeveloper = async (id: number) => {
    if (!confirm(`Delete developer application #${id}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/developer/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDevelopers((prev) => prev.filter((d) => d.id !== id));
        toast(`Application #${id} deleted`);
      } else {
        toast('Failed to delete application');
      }
    } catch {
      toast('Network error deleting application');
    }
  };

  // Contact Actions
  const handleContactStatus = async (id: number, status: ContactItem['status']) => {
    try {
      const res = await fetch(`${API_BASE}/contact/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
        toast(`Contact #${id} marked as ${status}`);
      } else {
        toast(`Failed to update contact #${id}`);
      }
    } catch {
      toast('Network error updating contact');
    }
  };

  const handleDeleteContact = async (id: number) => {
    if (!confirm(`Delete inquiry #${id}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/contact/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setContacts((prev) => prev.filter((c) => c.id !== id));
        toast(`Inquiry #${id} deleted`);
      } else {
        toast('Failed to delete inquiry');
      }
    } catch {
      toast('Network error deleting inquiry');
    }
  };

  // Portfolio Actions
  const handlePortfolioStatus = async (id: number, status: PortfolioItem['status']) => {
    try {
      const res = await fetch(`${API_BASE}/portfolio/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setPortfolios((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
        toast(`Project #${id} status changed to ${status}`);
      } else {
        toast('Failed to update portfolio status');
      }
    } catch {
      toast('Network error updating portfolio status');
    }
  };

  const handleDeletePortfolio = async (id: number) => {
    if (!confirm(`Delete project #${id}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/portfolio/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPortfolios((prev) => prev.filter((p) => p.id !== id));
        toast(`Project #${id} deleted`);
      } else {
        toast('Failed to delete project');
      }
    } catch {
      toast('Network error deleting project');
    }
  };

  const openCreatePortfolio = () => {
    setEditingPortfolioId(null);
    setPortfolioForm({
      title: '',
      category: 'Web',
      client: '',
      year: '2026',
      summary: '',
      solution: '',
      metric: '',
      tags: '',
      image: '',
      url: '',
      isFeatured: false,
      status: 'Published',
    });
    setShowPortfolioModal(true);
  };

  const openEditPortfolio = (item: PortfolioItem) => {
    setEditingPortfolioId(item.id);
    setPortfolioForm({
      title: item.title,
      category: item.category,
      client: item.client || '',
      year: item.year || '2026',
      summary: item.summary,
      solution: item.solution || '',
      metric: item.metric || '',
      tags: item.tags ? item.tags.join(', ') : '',
      image: item.image || '',
      url: item.url || '',
      isFeatured: item.isFeatured,
      status: item.status,
    });
    setShowPortfolioModal(true);
  };

  const handleSavePortfolio = async (e: FormEvent) => {
    e.preventDefault();
    if (!portfolioForm.title.trim() || !portfolioForm.summary.trim()) {
      alert('Title and problem/summary are required.');
      return;
    }

    const tagList = portfolioForm.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: portfolioForm.title.trim(),
      category: portfolioForm.category,
      client: portfolioForm.client.trim() || null,
      year: portfolioForm.year.trim() || '2026',
      summary: portfolioForm.summary.trim(),
      solution: portfolioForm.solution.trim() || null,
      metric: portfolioForm.metric.trim() || null,
      tags: tagList,
      image: portfolioForm.image.trim() || null,
      url: portfolioForm.url.trim() || null,
      isFeatured: portfolioForm.isFeatured,
      status: portfolioForm.status,
    };

    try {
      if (editingPortfolioId) {
        const res = await fetch(`${API_BASE}/portfolio/${editingPortfolioId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const json = await res.json();
          setPortfolios((prev) =>
            prev.map((p) => (p.id === editingPortfolioId ? json.data || { ...p, ...payload } : p))
          );
          toast(`Project #${editingPortfolioId} updated`);
          setShowPortfolioModal(false);
        } else {
          toast('Server returned error updating project');
        }
      } else {
        const res = await fetch(`${API_BASE}/portfolio`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setPortfolios((prev) => [json.data, ...prev]);
          } else {
            await loadData();
          }
          toast('New project created');
          setShowPortfolioModal(false);
        } else {
          toast('Server returned error creating project');
        }
      }
    } catch {
      toast('Network error saving project');
    }
  };

  // =========================================================================
  // REAL-TIME DATA CALCULATIONS FOR CHARTS & GRAPHS (ZERO FAKE DATA)
  // =========================================================================

  // 1. Overall volume across 4 modules
  const totalVolume = reviews.length + developers.length + contacts.length + portfolios.length;

  // 2. 7-Day Activity Trend Bar Chart
  const last7DaysData = useMemo(() => {
    const days: { dateLabel: string; count: number }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });

      const rCount = reviews.filter((r) => r.createdAt?.startsWith(dateStr)).length;
      const dCount = developers.filter((dev) => dev.createdAt?.startsWith(dateStr)).length;
      const cCount = contacts.filter((c) => c.createdAt?.startsWith(dateStr)).length;
      const pCount = portfolios.filter((p) => p.createdAt?.startsWith(dateStr)).length;

      days.push({
        dateLabel: dayLabel,
        count: rCount + dCount + cCount + pCount,
      });
    }
    return days;
  }, [reviews, developers, contacts, portfolios]);

  const max7DaysCount = useMemo(() => {
    const max = Math.max(...last7DaysData.map((d) => d.count), 0);
    return max > 0 ? max : 5; // fallback scale ceiling
  }, [last7DaysData]);

  // 3. Ratings Breakdown (5 to 1 stars)
  const ratingCounts = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = r.rating as 1 | 2 | 3 | 4 | 5;
      if (counts[star] !== undefined) counts[star]++;
    });
    return counts;
  }, [reviews]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return '0.0';
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  // 4. Status counts for the currently active tab
  const activeTabBreakdown = useMemo(() => {
    if (activeTab === 'reviews') {
      const pending = reviews.filter((r) => r.status === 'Pending').length;
      const approved = reviews.filter((r) => r.status === 'Approved').length;
      const rejected = reviews.filter((r) => r.status === 'Rejected').length;
      return [
        { label: 'Pending', count: pending, color: '#f59e0b' },
        { label: 'Approved', count: approved, color: '#16a34a' },
        { label: 'Rejected', count: rejected, color: '#dc2626' },
      ];
    }
    if (activeTab === 'developers') {
      const pending = developers.filter((d) => d.status === 'Pending').length;
      const reviewing = developers.filter((d) => d.status === 'Reviewing').length;
      const accepted = developers.filter((d) => d.status === 'Accepted').length;
      const rejected = developers.filter((d) => d.status === 'Rejected').length;
      return [
        { label: 'Pending', count: pending, color: '#f59e0b' },
        { label: 'Reviewing', count: reviewing, color: '#2563eb' },
        { label: 'Accepted', count: accepted, color: '#16a34a' },
        { label: 'Rejected', count: rejected, color: '#dc2626' },
      ];
    }
    if (activeTab === 'contacts') {
      const unread = contacts.filter((c) => c.status === 'Unread').length;
      const read = contacts.filter((c) => c.status === 'Read').length;
      const replied = contacts.filter((c) => c.status === 'Replied').length;
      const archived = contacts.filter((c) => c.status === 'Archived').length;
      return [
        { label: 'Unread', count: unread, color: '#f59e0b' },
        { label: 'Read', count: read, color: '#6b7280' },
        { label: 'Replied', count: replied, color: '#16a34a' },
        { label: 'Archived', count: archived, color: '#9ca3af' },
      ];
    }
    // Portfolios
    const published = portfolios.filter((p) => p.status === 'Published').length;
    const draft = portfolios.filter((p) => p.status === 'Draft').length;
    const archived = portfolios.filter((p) => p.status === 'Archived').length;
    return [
      { label: 'Published', count: published, color: '#16a34a' },
      { label: 'Draft', count: draft, color: '#6b7280' },
      { label: 'Archived', count: archived, color: '#9ca3af' },
    ];
  }, [activeTab, reviews, developers, contacts, portfolios]);

  // Filtered views
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchStatus = statusFilter === 'all' || r.status.toLowerCase() === statusFilter.toLowerCase();
      const matchSearch =
        !search ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.company.toLowerCase().includes(search.toLowerCase()) ||
        r.projectType.toLowerCase().includes(search.toLowerCase()) ||
        r.reviewText.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [reviews, statusFilter, search]);

  const filteredDevelopers = useMemo(() => {
    return developers.filter((d) => {
      const matchStatus = statusFilter === 'all' || d.status.toLowerCase() === statusFilter.toLowerCase();
      const matchSearch =
        !search ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.email.toLowerCase().includes(search.toLowerCase()) ||
        d.skill.toLowerCase().includes(search.toLowerCase()) ||
        (d.message && d.message.toLowerCase().includes(search.toLowerCase()));
      return matchStatus && matchSearch;
    });
  }, [developers, statusFilter, search]);

  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      const matchStatus = statusFilter === 'all' || c.status.toLowerCase() === statusFilter.toLowerCase();
      const matchSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        (c.topic && c.topic.toLowerCase().includes(search.toLowerCase())) ||
        c.message.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [contacts, statusFilter, search]);

  const filteredPortfolios = useMemo(() => {
    return portfolios.filter((p) => {
      const matchStatus = statusFilter === 'all' || p.status.toLowerCase() === statusFilter.toLowerCase();
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        (p.client && p.client.toLowerCase().includes(search.toLowerCase())) ||
        p.summary.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return matchStatus && matchSearch;
    });
  }, [portfolios, statusFilter, search]);

  return (
    <div style={{ minHeight: '100vh', background: '#f8f6f0', color: '#102b23', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Top Header */}
      <header
        style={{
          background: '#173d32',
          padding: '16px 24px',
          color: '#f1e8d8',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          borderBottom: '2px solid #b99a65',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.3px', color: '#ffffff' }}>
            Valance Admin
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              padding: '2px 8px',
              borderRadius: 4,
              fontWeight: 600,
              background: isServerLive ? '#1e4638' : '#3d1717',
              color: isServerLive ? '#6ee7b7' : '#fca5a5',
              border: `1px solid ${isServerLive ? '#2e6b56' : '#7f1d1d'}`,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: isServerLive ? '#34d399' : '#ef4444',
              }}
            />
            {isServerLive ? 'Connected: 7001' : 'Backend Offline'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={loadData}
            disabled={loading}
            style={{
              background: '#224e41',
              color: '#ffffff',
              border: '1px solid #366d5b',
              padding: '6px 12px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
          <a
            href="/"
            style={{
              color: '#b99a65',
              fontSize: 12,
              fontWeight: 600,
              textDecoration: 'none',
              marginLeft: 8,
            }}
          >
            Exit to Site →
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px 48px' }}>
        {/* Connection Notice if Server Offline */}
        {isServerLive === false && (
          <div
            style={{
              background: '#fee2e2',
              border: '1px solid #f87171',
              color: '#991b1b',
              padding: '12px 16px',
              borderRadius: 6,
              fontSize: 13,
              marginBottom: 20,
            }}
          >
            <strong>Backend Unreachable:</strong> Cannot connect to <code>http://localhost:7001</code>. Make sure the Node server is running with <code>npm run dev</code>. Showing only live database data.
          </div>
        )}

        {/* =========================================================================
            GRAPHS & CHARTS SECTION (INSTEAD OF STAT CARDS)
            ========================================================================= */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 16,
            marginBottom: 24,
          }}
        >
          {/* Chart 1: 7-Day Ingestion Activity Column Chart */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e5d6bf',
              borderRadius: 8,
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <strong style={{ fontSize: 13, color: '#102b23', display: 'block' }}>7-Day Activity Trend</strong>
                <span style={{ fontSize: 11, color: '#6b7280' }}>Daily new submissions from backend</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#173d32', background: '#f1e8d8', padding: '2px 8px', borderRadius: 4 }}>
                {last7DaysData.reduce((acc, d) => acc + d.count, 0)} Total
              </span>
            </div>

            {/* SVG Bar Chart */}
            <div style={{ height: 110, display: 'flex', alignItems: 'flex-end', gap: 8, paddingTop: 10, borderBottom: '1px solid #e5e7eb' }}>
              {last7DaysData.map((d, idx) => {
                const heightPercent = max7DaysCount > 0 ? Math.max((d.count / max7DaysCount) * 80, d.count > 0 ? 10 : 2) : 2;
                return (
                  <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: d.count > 0 ? '#173d32' : '#9ca3af', marginBottom: 2 }}>
                      {d.count > 0 ? d.count : 0}
                    </span>
                    <div
                      title={`${d.dateLabel}: ${d.count} submissions`}
                      style={{
                        width: '75%',
                        height: `${heightPercent}%`,
                        background: d.count > 0 ? '#173d32' : '#e5e7eb',
                        borderRadius: '3px 3px 0 0',
                        transition: 'height 0.2s ease',
                      }}
                    />
                  </div>
                );
              })}
            </div>
            {/* X-axis labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              {last7DaysData.map((d, idx) => (
                <div key={idx} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: '#6b7280' }}>
                  {d.dateLabel.split(' ')[0]}
                </div>
              ))}
            </div>
          </div>

          {/* Chart 2: Database Volume Distribution */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e5d6bf',
              borderRadius: 8,
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <strong style={{ fontSize: 13, color: '#102b23', display: 'block' }}>Database Volume Composition</strong>
                <span style={{ fontSize: 11, color: '#6b7280' }}>Proportion of records stored across tables</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#173d32' }}>
                {totalVolume} records
              </span>
            </div>

            {/* Segmented Distribution Bar */}
            <div style={{ height: 16, background: '#f3f4f6', borderRadius: 4, display: 'flex', overflow: 'hidden', marginBottom: 14 }}>
              {totalVolume === 0 ? (
                <div style={{ width: '100%', height: '100%', background: '#e5e7eb' }} />
              ) : (
                <>
                  <div style={{ width: `${(reviews.length / totalVolume) * 100}%`, background: '#173d32' }} title={`Reviews: ${reviews.length}`} />
                  <div style={{ width: `${(developers.length / totalVolume) * 100}%`, background: '#b99a65' }} title={`Developers: ${developers.length}`} />
                  <div style={{ width: `${(contacts.length / totalVolume) * 100}%`, background: '#2563eb' }} title={`Contacts: ${contacts.length}`} />
                  <div style={{ width: `${(portfolios.length / totalVolume) * 100}%`, background: '#102b23' }} title={`Portfolio: ${portfolios.length}`} />
                </>
              )}
            </div>

            {/* Legend / Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: '#173d32' }} />
                <span style={{ color: '#374151' }}>Reviews:</span>
                <strong>{reviews.length}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: '#b99a65' }} />
                <span style={{ color: '#374151' }}>Developers:</span>
                <strong>{developers.length}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: '#2563eb' }} />
                <span style={{ color: '#374151' }}>Inquiries:</span>
                <strong>{contacts.length}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: '#102b23' }} />
                <span style={{ color: '#374151' }}>Portfolios:</span>
                <strong>{portfolios.length}</strong>
              </div>
            </div>
          </div>

          {/* Chart 3: Active Tab Status / Stage Breakdown */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e5d6bf',
              borderRadius: 8,
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <strong style={{ fontSize: 13, color: '#102b23', display: 'block', textTransform: 'capitalize' }}>
                  {activeTab} Workflow Pipeline
                </strong>
                <span style={{ fontSize: 11, color: '#6b7280' }}>Current approval & status division</span>
              </div>
              {activeTab === 'reviews' && (
                <span style={{ fontSize: 12, fontWeight: 700, color: '#b99a65' }}>
                  Avg {averageRating} ★
                </span>
              )}
            </div>

            {/* If Reviews tab: render rating frequency bars */}
            {activeTab === 'reviews' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = ratingCounts[stars as 1 | 2 | 3 | 4 | 5];
                  const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
                      <span style={{ width: 28, color: '#374151', fontWeight: 600 }}>{stars} ★</span>
                      <div style={{ flex: 1, height: 8, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: '#b99a65', borderRadius: 4 }} />
                      </div>
                      <span style={{ width: 20, textAlign: 'right', color: '#6b7280', fontSize: 10 }}>{count}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* For Developers, Contacts, Portfolio: horizontal gauge meters */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {activeTabBreakdown.map((item) => {
                  const totalInTab = activeTabBreakdown.reduce((sum, i) => sum + i.count, 0);
                  const pct = totalInTab > 0 ? (item.count / totalInTab) * 100 : 0;
                  return (
                    <div key={item.label} style={{ fontSize: 11 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <span style={{ color: '#374151', fontWeight: 600 }}>{item.label}</span>
                        <span style={{ color: '#6b7280' }}>{item.count} ({Math.round(pct)}%)</span>
                      </div>
                      <div style={{ height: 7, background: '#f3f4f6', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: item.color, borderRadius: 3 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Tab Bar */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #dcd3c4',
            marginBottom: 20,
            gap: 4,
          }}
        >
          <button
            onClick={() => { setActiveTab('reviews'); setStatusFilter('all'); }}
            style={{
              background: activeTab === 'reviews' ? '#ffffff' : 'transparent',
              color: activeTab === 'reviews' ? '#173d32' : '#6b7280',
              border: activeTab === 'reviews' ? '1px solid #dcd3c4' : '1px solid transparent',
              borderBottom: activeTab === 'reviews' ? '1px solid #ffffff' : 'none',
              padding: '10px 18px',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              marginBottom: -1,
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
            }}
          >
            Reviews ({reviews.length})
          </button>

          <button
            onClick={() => { setActiveTab('developers'); setStatusFilter('all'); }}
            style={{
              background: activeTab === 'developers' ? '#ffffff' : 'transparent',
              color: activeTab === 'developers' ? '#173d32' : '#6b7280',
              border: activeTab === 'developers' ? '1px solid #dcd3c4' : '1px solid transparent',
              borderBottom: activeTab === 'developers' ? '1px solid #ffffff' : 'none',
              padding: '10px 18px',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              marginBottom: -1,
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
            }}
          >
            Developers ({developers.length})
          </button>

          <button
            onClick={() => { setActiveTab('contacts'); setStatusFilter('all'); }}
            style={{
              background: activeTab === 'contacts' ? '#ffffff' : 'transparent',
              color: activeTab === 'contacts' ? '#173d32' : '#6b7280',
              border: activeTab === 'contacts' ? '1px solid #dcd3c4' : '1px solid transparent',
              borderBottom: activeTab === 'contacts' ? '1px solid #ffffff' : 'none',
              padding: '10px 18px',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              marginBottom: -1,
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
            }}
          >
            Inquiries ({contacts.length})
          </button>

          <button
            onClick={() => { setActiveTab('portfolios'); setStatusFilter('all'); }}
            style={{
              background: activeTab === 'portfolios' ? '#ffffff' : 'transparent',
              color: activeTab === 'portfolios' ? '#173d32' : '#6b7280',
              border: activeTab === 'portfolios' ? '1px solid #dcd3c4' : '1px solid transparent',
              borderBottom: activeTab === 'portfolios' ? '1px solid #ffffff' : 'none',
              padding: '10px 18px',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              marginBottom: -1,
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
            }}
          >
            Portfolio ({portfolios.length})
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5d6bf',
            borderRadius: 8,
            padding: '12px 16px',
            marginBottom: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>Filter:</span>
            {activeTab === 'reviews' &&
              ['all', 'pending', 'approved', 'rejected'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 4,
                    fontSize: 12,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: statusFilter === s ? '#173d32' : '#e5e7eb',
                    background: statusFilter === s ? '#173d32' : '#ffffff',
                    color: statusFilter === s ? '#ffffff' : '#374151',
                    textTransform: 'capitalize',
                  }}
                >
                  {s}
                </button>
              ))}

            {activeTab === 'developers' &&
              ['all', 'pending', 'reviewing', 'accepted', 'rejected'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 4,
                    fontSize: 12,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: statusFilter === s ? '#173d32' : '#e5e7eb',
                    background: statusFilter === s ? '#173d32' : '#ffffff',
                    color: statusFilter === s ? '#ffffff' : '#374151',
                    textTransform: 'capitalize',
                  }}
                >
                  {s}
                </button>
              ))}

            {activeTab === 'contacts' &&
              ['all', 'unread', 'read', 'replied'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 4,
                    fontSize: 12,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: statusFilter === s ? '#173d32' : '#e5e7eb',
                    background: statusFilter === s ? '#173d32' : '#ffffff',
                    color: statusFilter === s ? '#ffffff' : '#374151',
                    textTransform: 'capitalize',
                  }}
                >
                  {s}
                </button>
              ))}

            {activeTab === 'portfolios' &&
              ['all', 'published', 'draft', 'archived'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 4,
                    fontSize: 12,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: statusFilter === s ? '#173d32' : '#e5e7eb',
                    background: statusFilter === s ? '#173d32' : '#ffffff',
                    color: statusFilter === s ? '#ffffff' : '#374151',
                    textTransform: 'capitalize',
                  }}
                >
                  {s}
                </button>
              ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="text"
              placeholder="Search by keyword…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: 4,
                border: '1px solid #d1d5db',
                fontSize: 13,
                outline: 'none',
                minWidth: 200,
              }}
            />

            {activeTab === 'portfolios' && (
              <button
                onClick={openCreatePortfolio}
                style={{
                  background: '#173d32',
                  color: '#ffffff',
                  border: 0,
                  padding: '7px 14px',
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                + New Project
              </button>
            )}
          </div>
        </div>

        {/* ==================== TAB 1: REVIEWS ==================== */}
        {activeTab === 'reviews' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredReviews.length === 0 ? (
              <div style={{ background: '#ffffff', border: '1px solid #e5d6bf', borderRadius: 8, padding: 32, textAlign: 'center', color: '#6b7280' }}>
                No reviews found in database matching current filter.
              </div>
            ) : (
              filteredReviews.map((r) => (
                <div
                  key={r.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e5d6bf',
                    borderRadius: 8,
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <strong style={{ fontSize: 15, color: '#102b23' }}>{r.name}</strong>
                        <span style={{ fontSize: 13, color: '#6b7280' }}>
                          — {r.role}, {r.company}
                        </span>
                        <span style={{ background: '#f3f4f6', color: '#374151', padding: '2px 8px', borderRadius: 4, fontSize: 11 }}>
                          {r.projectType}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
                        Rating: {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)} ({r.rating}/5) • Submitted: {new Date(r.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 4,
                          textTransform: 'uppercase',
                          background: r.status === 'Approved' ? '#dcfce7' : r.status === 'Pending' ? '#fef3c7' : '#fee2e2',
                          color: r.status === 'Approved' ? '#166534' : r.status === 'Pending' ? '#92400e' : '#991b1b',
                        }}
                      >
                        {r.status}
                      </span>
                    </div>
                  </div>

                  <div style={{ background: '#fcfbf8', border: '1px solid #f0ebe1', padding: '10px 14px', borderRadius: 6, fontSize: 13, color: '#1f2937', lineHeight: 1.5 }}>
                    "{r.reviewText}"
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #f3f0e8', paddingTop: 8 }}>
                    {r.status !== 'Approved' && (
                      <button
                        onClick={() => handleReviewStatus(r.id, 'Approved')}
                        style={{
                          background: '#166534',
                          color: '#ffffff',
                          border: 0,
                          padding: '4px 12px',
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Approve
                      </button>
                    )}
                    {r.status !== 'Rejected' && (
                      <button
                        onClick={() => handleReviewStatus(r.id, 'Rejected')}
                        style={{
                          background: '#ffffff',
                          color: '#991b1b',
                          border: '1px solid #fca5a5',
                          padding: '4px 12px',
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Reject
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteReview(r.id)}
                      style={{
                        background: 'transparent',
                        color: '#9ca3af',
                        border: 0,
                        padding: '4px 8px',
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ==================== TAB 2: DEVELOPERS ==================== */}
        {activeTab === 'developers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredDevelopers.length === 0 ? (
              <div style={{ background: '#ffffff', border: '1px solid #e5d6bf', borderRadius: 8, padding: 32, textAlign: 'center', color: '#6b7280' }}>
                No developer applications found in database matching current filter.
              </div>
            ) : (
              filteredDevelopers.map((d) => (
                <div
                  key={d.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e5d6bf',
                    borderRadius: 8,
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <strong style={{ fontSize: 15, color: '#102b23' }}>{d.name}</strong>
                        <a href={`mailto:${d.email}`} style={{ fontSize: 13, color: '#173d32', textDecoration: 'underline' }}>
                          {d.email}
                        </a>
                        <span style={{ background: '#f3f4f6', color: '#374151', padding: '2px 8px', borderRadius: 4, fontSize: 11 }}>
                          {d.skill}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
                        Submitted: {new Date(d.createdAt).toLocaleDateString()}
                        {d.portfolio && (
                          <span style={{ marginLeft: 10 }}>
                            Portfolio:{' '}
                            <a href={d.portfolio} target="_blank" rel="noopener noreferrer" style={{ color: '#173d32', textDecoration: 'underline' }}>
                              {d.portfolio}
                            </a>
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <select
                        value={d.status}
                        onChange={(e) => handleDeveloperStatus(d.id, e.target.value as any)}
                        style={{
                          fontSize: 12,
                          padding: '3px 8px',
                          borderRadius: 4,
                          border: '1px solid #d1d5db',
                          background: '#ffffff',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Reviewing">Reviewing</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      <button
                        onClick={() => handleDeleteDeveloper(d.id)}
                        style={{
                          background: 'transparent',
                          color: '#9ca3af',
                          border: 0,
                          padding: '4px 8px',
                          fontSize: 12,
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {d.message && (
                    <div style={{ background: '#fcfbf8', border: '1px solid #f0ebe1', padding: '10px 14px', borderRadius: 6, fontSize: 13, color: '#1f2937', lineHeight: 1.5 }}>
                      {d.message}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* ==================== TAB 3: CONTACTS ==================== */}
        {activeTab === 'contacts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredContacts.length === 0 ? (
              <div style={{ background: '#ffffff', border: '1px solid #e5d6bf', borderRadius: 8, padding: 32, textAlign: 'center', color: '#6b7280' }}>
                No contact inquiries found in database matching current filter.
              </div>
            ) : (
              filteredContacts.map((c) => (
                <div
                  key={c.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e5d6bf',
                    borderRadius: 8,
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <strong style={{ fontSize: 15, color: '#102b23' }}>{c.name}</strong>
                        <a href={`mailto:${c.email}`} style={{ fontSize: 13, color: '#173d32', textDecoration: 'underline' }}>
                          {c.email}
                        </a>
                        {c.topic && (
                          <span style={{ background: '#f3f4f6', color: '#374151', padding: '2px 8px', borderRadius: 4, fontSize: 11 }}>
                            {c.topic}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
                        Received: {new Date(c.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <select
                        value={c.status}
                        onChange={(e) => handleContactStatus(c.id, e.target.value as any)}
                        style={{
                          fontSize: 12,
                          padding: '3px 8px',
                          borderRadius: 4,
                          border: '1px solid #d1d5db',
                          background: '#ffffff',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="Unread">Unread</option>
                        <option value="Read">Read</option>
                        <option value="Replied">Replied</option>
                        <option value="Archived">Archived</option>
                      </select>
                      <button
                        onClick={() => handleDeleteContact(c.id)}
                        style={{
                          background: 'transparent',
                          color: '#9ca3af',
                          border: 0,
                          padding: '4px 8px',
                          fontSize: 12,
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div style={{ background: '#fcfbf8', border: '1px solid #f0ebe1', padding: '10px 14px', borderRadius: 6, fontSize: 13, color: '#1f2937', lineHeight: 1.5 }}>
                    {c.message}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #f3f0e8', paddingTop: 8 }}>
                    <a
                      href={`mailto:${c.email}?subject=Re: Inquiry with Valance`}
                      style={{
                        background: '#173d32',
                        color: '#ffffff',
                        textDecoration: 'none',
                        padding: '4px 12px',
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      Reply via Email ↗
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ==================== TAB 4: PORTFOLIO ==================== */}
        {activeTab === 'portfolios' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredPortfolios.length === 0 ? (
              <div style={{ background: '#ffffff', border: '1px solid #e5d6bf', borderRadius: 8, padding: 32, textAlign: 'center', color: '#6b7280' }}>
                No portfolio projects found in database matching current filter.
              </div>
            ) : (
              filteredPortfolios.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e5d6bf',
                    borderRadius: 8,
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <strong style={{ fontSize: 16, color: '#102b23' }}>{p.title}</strong>
                        <span style={{ background: '#173d32', color: '#ffffff', padding: '2px 8px', borderRadius: 4, fontSize: 11 }}>
                          {p.category}
                        </span>
                        {p.client && (
                          <span style={{ fontSize: 13, color: '#6b7280' }}>
                            Client: {p.client}
                          </span>
                        )}
                        {p.year && (
                          <span style={{ fontSize: 12, color: '#9ca3af' }}>
                            ({p.year})
                          </span>
                        )}
                        {p.isFeatured && (
                          <span style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', padding: '1px 6px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                            Featured
                          </span>
                        )}
                      </div>
                      {p.url && (
                        <div style={{ fontSize: 12, marginTop: 2 }}>
                          <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ color: '#173d32', textDecoration: 'underline' }}>
                            {p.url} ↗
                          </a>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 4,
                          textTransform: 'uppercase',
                          background: p.status === 'Published' ? '#dcfce7' : p.status === 'Draft' ? '#f3f4f6' : '#fee2e2',
                          color: p.status === 'Published' ? '#166534' : p.status === 'Draft' ? '#374151' : '#991b1b',
                        }}
                      >
                        {p.status}
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>
                    <strong>Problem:</strong> {p.summary}
                  </div>

                  {p.solution && (
                    <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>
                      <strong>Solution:</strong> {p.solution}
                    </div>
                  )}

                  {p.metric && (
                    <div style={{ fontSize: 13, color: '#166534', fontWeight: 600 }}>
                      Outcome Metric: {p.metric}
                    </div>
                  )}

                  {p.tags && p.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: '#9ca3af' }}>Tags:</span>
                      {p.tags.map((t) => (
                        <span key={t} style={{ background: '#f3f4f6', color: '#374151', padding: '1px 6px', borderRadius: 4, fontSize: 11 }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #f3f0e8', paddingTop: 8 }}>
                    {p.status !== 'Published' ? (
                      <button
                        onClick={() => handlePortfolioStatus(p.id, 'Published')}
                        style={{
                          background: '#166534',
                          color: '#ffffff',
                          border: 0,
                          padding: '4px 12px',
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Publish
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePortfolioStatus(p.id, 'Draft')}
                        style={{
                          background: '#ffffff',
                          color: '#374151',
                          border: '1px solid #d1d5db',
                          padding: '4px 12px',
                          borderRadius: 4,
                          fontSize: 12,
                          cursor: 'pointer',
                        }}
                      >
                        Set to Draft
                      </button>
                    )}

                    <button
                      onClick={() => openEditPortfolio(p)}
                      style={{
                        background: '#ffffff',
                        color: '#173d32',
                        border: '1px solid #173d32',
                        padding: '4px 12px',
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeletePortfolio(p.id)}
                      style={{
                        background: 'transparent',
                        color: '#9ca3af',
                        border: 0,
                        padding: '4px 8px',
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal for Portfolio Create/Edit */}
        {showPortfolioModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: '#ffffff',
                borderRadius: 8,
                maxWidth: 600,
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                border: '1px solid #e5d6bf',
                padding: '24px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid #e5e7eb', paddingBottom: 10 }}>
                <h3 style={{ margin: 0, fontSize: 17, color: '#102b23' }}>
                  {editingPortfolioId ? 'Edit Project' : 'New Portfolio Project'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowPortfolioModal(false)}
                  style={{ background: 'transparent', border: 0, fontSize: 16, cursor: 'pointer', color: '#6b7280' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSavePortfolio} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={portfolioForm.title}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid #d1d5db', fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                      Category
                    </label>
                    <select
                      value={portfolioForm.category}
                      onChange={(e) => setPortfolioForm({ ...portfolioForm, category: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid #d1d5db', fontSize: 13, boxSizing: 'border-box' }}
                    >
                      <option value="Web">Web</option>
                      <option value="App">App</option>
                      <option value="SEO">SEO</option>
                      <option value="Automation">Automation</option>
                      <option value="AI">AI</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                      Client (Optional)
                    </label>
                    <input
                      type="text"
                      value={portfolioForm.client}
                      onChange={(e) => setPortfolioForm({ ...portfolioForm, client: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid #d1d5db', fontSize: 13, boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                      Year
                    </label>
                    <input
                      type="text"
                      value={portfolioForm.year}
                      onChange={(e) => setPortfolioForm({ ...portfolioForm, year: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid #d1d5db', fontSize: 13, boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                      Status
                    </label>
                    <select
                      value={portfolioForm.status}
                      onChange={(e) => setPortfolioForm({ ...portfolioForm, status: e.target.value as any })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid #d1d5db', fontSize: 13, boxSizing: 'border-box' }}
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                    Problem / Challenge *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={portfolioForm.summary}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, summary: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid #d1d5db', fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                    Solution (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={portfolioForm.solution}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, solution: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid #d1d5db', fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                      Outcome Metric (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 85% time saved"
                      value={portfolioForm.metric}
                      onChange={(e) => setPortfolioForm({ ...portfolioForm, metric: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid #d1d5db', fontSize: 13, boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      placeholder="Node.js, PostgreSQL"
                      value={portfolioForm.tags}
                      onChange={(e) => setPortfolioForm({ ...portfolioForm, tags: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid #d1d5db', fontSize: 13, boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                      URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={portfolioForm.url}
                      onChange={(e) => setPortfolioForm({ ...portfolioForm, url: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid #d1d5db', fontSize: 13, boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                      Image Path (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="/portfolio/app.webp"
                      value={portfolioForm.image}
                      onChange={(e) => setPortfolioForm({ ...portfolioForm, image: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid #d1d5db', fontSize: 13, boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input
                    type="checkbox"
                    id="featProj"
                    checked={portfolioForm.isFeatured}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, isFeatured: e.target.checked })}
                  />
                  <label htmlFor="featProj" style={{ fontSize: 13, cursor: 'pointer' }}>
                    Featured on website
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12, borderTop: '1px solid #e5e7eb', paddingTop: 12 }}>
                  <button
                    type="button"
                    onClick={() => setShowPortfolioModal(false)}
                    style={{
                      background: '#ffffff',
                      color: '#374151',
                      border: '1px solid #d1d5db',
                      padding: '6px 14px',
                      borderRadius: 4,
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      background: '#173d32',
                      color: '#ffffff',
                      border: 0,
                      padding: '6px 16px',
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ToastProvider>
      <AdminContent />
    </ToastProvider>
  );
}
