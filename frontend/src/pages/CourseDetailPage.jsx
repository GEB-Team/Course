/**
 * CourseDetailPage.jsx  —  Course Detail / Public View Module
 * ============================================================
 * Public-facing (no auth required to VIEW).
 * Auth required only to Enroll or Wishlist.
 *
 * Route: /courses/:id
 * API:   GET /api/v1/courses/:id
 */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './CourseDetailPage.css';

// ── API base (same as existing project) ─────────────────────────
const API_BASE = 'http://localhost:8000/api/v1/courses';
const AUTH_BASE = 'http://localhost:8000/api';

// ── Utility helpers ──────────────────────────────────────────────
function formatDuration(minutes) {
  if (!minutes) return '0m';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

function formatLectureDuration(minutes) {
  if (!minutes) return '0:00';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h) return `${h}:${String(m).padStart(2, '0')}:00`;
  return `${m}:00`;
}

function formatPrice(paise) {
  if (paise === null || paise === undefined) return 'Free';
  if (paise === 0) return 'Free';
  return `₹${(paise / 100).toFixed(0)}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' });
}

function getInitial(name) {
  return name ? name.charAt(0).toUpperCase() : '?';
}

// ── Star component ───────────────────────────────────────────────
function Stars({ rating = 0, size = 'sm' }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="cdp-stars">
      {Array.from({ length: full }).map((_, i) => (
        <span key={`f${i}`} className="cdp-star">★</span>
      ))}
      {half && <span className="cdp-star" style={{ opacity: 0.75 }}>★</span>}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`e${i}`} className="cdp-star-empty">★</span>
      ))}
    </span>
  );
}

// ── Toast ────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div className="cdp-toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`cdp-toast ${t.type}`}>
          {t.type === 'success' && '✓ '}
          {t.type === 'error' && '✕ '}
          {t.type === 'info' && 'ℹ '}
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────
function SkeletonHero() {
  return (
    <div className="cdp-hero" style={{ minHeight: 320 }}>
      <div className="cdp-hero-inner">
        <div style={{ paddingBottom: 48 }}>
          <div className="cdp-skeleton" style={{ width: 100, height: 22, marginBottom: 16 }} />
          <div className="cdp-skeleton" style={{ width: '80%', height: 38, marginBottom: 10 }} />
          <div className="cdp-skeleton" style={{ width: '60%', height: 20, marginBottom: 20 }} />
          <div className="cdp-skeleton" style={{ width: 200, height: 18, marginBottom: 16 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            {[90, 80, 110, 75].map((w, i) => (
              <div key={i} className="cdp-skeleton" style={{ width: w, height: 26, borderRadius: 9999 }} />
            ))}
          </div>
        </div>
        <div>
          <div className="cdp-skeleton" style={{ width: '100%', height: 420, borderRadius: 20 }} />
        </div>
      </div>
    </div>
  );
}

// ── Accordion Section ────────────────────────────────────────────
function AccordionSection({ section, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const totalMin = section.lectures.reduce((s, l) => s + (l.duration_minutes || 0), 0);

  return (
    <div className={`cdp-accordion-item${open ? ' open' : ''}`}>
      <button
        className="cdp-accordion-header"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span className="cdp-accordion-title-row">
          <span>{section.title}</span>
        </span>
        <span className="cdp-accordion-meta">
          {section.lectures.length} lecture{section.lectures.length !== 1 ? 's' : ''} • {formatDuration(totalMin)}
        </span>
        <span className="cdp-accordion-chevron">▼</span>
      </button>
      <div className="cdp-accordion-body">
        <div className="cdp-lecture-list">
          {section.lectures.map(lec => (
            <div className="cdp-lecture-item" key={lec.id}>
              <div className={`cdp-lecture-icon ${lec.is_preview ? 'preview' : 'locked'}`}>
                {lec.is_preview ? '▶' : '🔒'}
              </div>
              <span className="cdp-lecture-title">{lec.title}</span>
              {lec.is_preview && (
                <span className="cdp-lecture-preview-badge">Preview</span>
              )}
              <span className="cdp-lecture-duration">{formatLectureDuration(lec.duration_minutes)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Rating Bars ──────────────────────────────────────────────────
function RatingBars({ reviews }) {
  const counts = [0, 0, 0, 0, 0];
  reviews.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) counts[r.rating - 1]++;
  });
  const total = reviews.length || 1;

  return (
    <div className="cdp-rating-bars">
      {[5, 4, 3, 2, 1].map(star => {
        const count = counts[star - 1];
        const pct = Math.round((count / total) * 100);
        return (
          <div className="cdp-rating-bar-row" key={star}>
            <span className="cdp-rating-bar-label">{star} ★</span>
            <div className="cdp-rating-bar-track">
              <div className="cdp-rating-bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="cdp-rating-bar-pct">{pct}%</span>
          </div>
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Main Component
// ════════════════════════════════════════════════════════════════
const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewsTotal, setReviewsTotal] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [wishlisting, setWishlisting] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [toasts, setToasts] = useState([]);

  // ── Toast helper ────────────────────────────────────────────────
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  // ── Load course detail ──────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    axios.get(`${API_BASE}/${id}`)
      .then(res => {
        setCourse(res.data);
        setAllReviews(res.data.recent_reviews || []);
        setReviewsTotal(res.data.total_reviews || 0);
      })
      .catch(err => {
        if (err.response?.status === 404) {
          setError('Course not found or not yet published.');
        } else {
          setError('Failed to load course. Please try again later.');
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  // ── Load more reviews ───────────────────────────────────────────
  const loadMoreReviews = useCallback(() => {
    setReviewsLoading(true);
    const nextPage = reviewPage + 1;
    axios.get(`${API_BASE}/${id}/reviews`, { params: { page: nextPage, page_size: 10 } })
      .then(res => {
        setAllReviews(prev => [...prev, ...(res.data.reviews || [])]);
        setReviewPage(nextPage);
      })
      .catch(() => addToast('Failed to load more reviews.', 'error'))
      .finally(() => setReviewsLoading(false));
  }, [id, reviewPage, addToast]);

  // ── Enroll ──────────────────────────────────────────────────────
  const handleEnroll = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      addToast('Please log in to enroll in this course.', 'info');
      setTimeout(() => navigate('/'), 1400);
      return;
    }
    setEnrolling(true);
    try {
      const res = await axios.post(
        `${API_BASE}/${id}/enroll`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.status === 'already_enrolled') {
        addToast('You are already enrolled in this course!', 'info');
      } else {
        addToast('🎉 Successfully enrolled! Go to My Courses to start learning.', 'success');
        setEnrolled(true);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        addToast('Session expired. Please log in again.', 'error');
        setTimeout(() => navigate('/'), 1400);
      } else {
        addToast('Enrollment failed. Please try again.', 'error');
      }
    } finally {
      setEnrolling(false);
    }
  }, [id, navigate, addToast]);

  // ── Wishlist toggle ─────────────────────────────────────────────
  const handleWishlist = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      addToast('Please log in to save to wishlist.', 'info');
      return;
    }
    setWishlisting(true);
    try {
      const res = await axios.post(
        `${API_BASE}/${id}/wishlist`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const added = res.data.action === 'added';
      setWishlisted(added);
      addToast(added ? '❤️ Added to wishlist!' : 'Removed from wishlist.', 'success');
    } catch {
      addToast('Could not update wishlist.', 'error');
    } finally {
      setWishlisting(false);
    }
  }, [id, addToast]);

  // ── Error state ─────────────────────────────────────────────────
  if (!loading && error) {
    return (
      <div className="cdp-root">
        <Navbar />
        <div className="cdp-error-state">
          <div className="cdp-error-icon">📭</div>
          <h2 className="cdp-error-title">Course Not Available</h2>
          <p className="cdp-error-desc">{error}</p>
          <Link to="/courses/register" className="cdp-nav-btn cdp-nav-btn-primary" style={{ marginTop: 12, textDecoration: 'none', display: 'inline-flex' }}>
            ← Browse All Courses
          </Link>
        </div>
      </div>
    );
  }

  // ── Loading state ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="cdp-root">
        <Navbar />
        <SkeletonHero />
        <div className="cdp-layout">
          <div>
            {[220, 160, 280, 180].map((h, i) => (
              <div key={i} className="cdp-section-card" style={{ marginBottom: 20 }}>
                <div className="cdp-skeleton" style={{ width: '40%', height: 22, marginBottom: 18 }} />
                <div className="cdp-skeleton" style={{ width: '100%', height: h, borderRadius: 10 }} />
              </div>
            ))}
          </div>
          <div>
            <div className="cdp-skeleton" style={{ width: '100%', height: 460, borderRadius: 20 }} />
          </div>
        </div>
      </div>
    );
  }

  const discountPct = course.price && course.discounted_price
    ? Math.round(((course.price - course.discounted_price) / course.price) * 100)
    : null;

  const displayPrice = course.discounted_price ?? course.price;

  return (
    <div className="cdp-root">
      <Navbar />

      {/* Breadcrumb */}
      <div className="cdp-breadcrumb">
        <a href="/courses/register">Courses</a>
        <span className="cdp-breadcrumb-sep">›</span>
        {course.category && (
          <>
            <a href={`/courses/register?category=${encodeURIComponent(course.category)}`}>{course.category}</a>
            <span className="cdp-breadcrumb-sep">›</span>
          </>
        )}
        <span>{course.name}</span>
      </div>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="cdp-hero">
        <div className="cdp-hero-inner">
          {/* Left: Course Info */}
          <div className="cdp-hero-content">
            {course.category && (
              <div className="cdp-category-badge">
                <span>📚</span> {course.category}
              </div>
            )}

            <h1 className="cdp-hero-title">{course.name}</h1>
            {course.subtitle && (
              <p className="cdp-hero-subtitle">{course.subtitle}</p>
            )}

            {/* Rating row */}
            {course.average_rating && (
              <div className="cdp-rating-row">
                <span className="cdp-rating-score">{course.average_rating}</span>
                <Stars rating={course.average_rating} />
                <span className="cdp-rating-count">
                  ({course.total_reviews?.toLocaleString()} ratings)
                </span>
              </div>
            )}

            {/* Metadata chips */}
            <div className="cdp-meta-chips">
              {course.total_lectures > 0 && (
                <span className="cdp-chip">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 10l4.553-2.069A1 1 0 0121 8.9V15.1a1 1 0 01-1.447.917L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/></svg>
                  {course.total_lectures} lectures
                </span>
              )}
              {course.total_duration_minutes > 0 && (
                <span className="cdp-chip">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {formatDuration(course.total_duration_minutes)}
                </span>
              )}
              {course.level && (
                <span className="cdp-chip">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  {course.level}
                </span>
              )}
              {course.language && (
                <span className="cdp-chip">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                  {course.language}
                </span>
              )}
              {course.last_updated && (
                <span className="cdp-chip">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/></svg>
                  Updated {formatDate(course.last_updated)}
                </span>
              )}
            </div>

            {/* Instructor mini-card */}
            {course.instructor && (
              <div className="cdp-hero-instructor">
                <div className="cdp-hero-instructor-avatar">
                  {getInitial(course.instructor.name)}
                </div>
                <span>Created by{' '}
                  <a href="#instructor">{course.instructor.name}</a>
                </span>
              </div>
            )}
          </div>

          {/* Right: Sticky Sidebar CTA (inside hero grid on desktop) */}
          <div>
            <div className="cdp-sidebar-card">
              {/* Thumbnail */}
              {course.thumbnail_url ? (
                <img
                  src={course.thumbnail_url}
                  alt={course.name}
                  className="cdp-sidebar-thumbnail"
                />
              ) : (
                <div className="cdp-sidebar-thumbnail-placeholder">
                  📘
                </div>
              )}
              {/* Body */}
              <div className="cdp-sidebar-body">
                {/* Price */}
                <div className="cdp-price-row">
                  <span className="cdp-price-main">{formatPrice(displayPrice)}</span>
                  {discountPct !== null && course.price !== course.discounted_price && (
                    <>
                      <span className="cdp-price-original">{formatPrice(course.price)}</span>
                      <span className="cdp-discount-badge">{discountPct}% OFF</span>
                    </>
                  )}
                </div>
                {discountPct && (
                  <p className="cdp-timer-text">⏰ Limited-time offer</p>
                )}

                {/* Enroll Button */}
                <button
                  id="enroll-btn"
                  className="cdp-enroll-btn"
                  onClick={handleEnroll}
                  disabled={enrolling || enrolled}
                >
                  {enrolling ? (
                    <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span> Enrolling…</>
                  ) : enrolled ? (
                    <>✓ Enrolled!</>
                  ) : (
                    <>🎓 Enroll Now</>
                  )}
                </button>

                {/* Wishlist Button */}
                <button
                  id="wishlist-btn"
                  className={`cdp-wishlist-btn${wishlisted ? ' active' : ''}`}
                  onClick={handleWishlist}
                  disabled={wishlisting}
                >
                  {wishlisted ? '❤️ Saved to Wishlist' : '♡ Add to Wishlist'}
                </button>

                {/* What's included */}
                <div className="cdp-sidebar-includes">
                  <h4>This course includes</h4>
                  {course.total_duration_minutes > 0 && (
                    <div className="cdp-include-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {formatDuration(course.total_duration_minutes)} of on-demand content
                    </div>
                  )}
                  {course.total_lectures > 0 && (
                    <div className="cdp-include-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 10l4.553-2.069A1 1 0 0121 8.9V15.1a1 1 0 01-1.447.917L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/></svg>
                      {course.total_lectures} video lectures
                    </div>
                  )}
                  <div className="cdp-include-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    Certificate of completion
                  </div>
                  <div className="cdp-include-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                    Full lifetime access
                  </div>
                  <div className="cdp-include-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                    Mobile & tablet friendly
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT + SIDEBAR ────────────────────────────────── */}
      <div className="cdp-layout">
        <main className="cdp-main">

          {/* ── What You'll Learn ──────────────────────────────────── */}
          {course.what_you_learn?.length > 0 && (
            <div className="cdp-section-card">
              <h2 className="cdp-section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                </svg>
                What You'll Learn
              </h2>
              <div className="cdp-learn-grid">
                {course.what_you_learn.map((item, i) => (
                  <div className="cdp-learn-item" key={i}>
                    <div className="cdp-learn-check">✓</div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Course Description ─────────────────────────────────── */}
          {course.description && (
            <div className="cdp-section-card">
              <h2 className="cdp-section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
                Course Description
              </h2>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.75, color: 'var(--soft-text)', margin: 0, whiteSpace: 'pre-line' }}>
                {course.description}
              </p>
            </div>
          )}

          {/* ── Requirements ───────────────────────────────────────── */}
          {course.requirements?.length > 0 && (
            <div className="cdp-section-card">
              <h2 className="cdp-section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Requirements & Prerequisites
              </h2>
              <ul className="cdp-bullet-list">
                {course.requirements.map((req, i) => (
                  <li key={i}>
                    <div className="cdp-bullet-dot" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Target Audience ────────────────────────────────────── */}
          {course.target_audience?.length > 0 && (
            <div className="cdp-section-card">
              <h2 className="cdp-section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
                </svg>
                Who Is This Course For?
              </h2>
              <ul className="cdp-bullet-list">
                {course.target_audience.map((item, i) => (
                  <li key={i}>
                    <div className="cdp-bullet-dot" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Curriculum ─────────────────────────────────────────── */}
          {course.sections?.length > 0 && (
            <div className="cdp-section-card">
              <h2 className="cdp-section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                </svg>
                Course Curriculum
              </h2>
              <div className="cdp-curriculum-stats">
                <span>📚 {course.sections.length} sections</span>
                <span>🎬 {course.total_lectures} lectures</span>
                <span>⏱ {formatDuration(course.total_duration_minutes)} total length</span>
              </div>
              {course.sections.map((section, i) => (
                <AccordionSection
                  key={section.id}
                  section={section}
                  defaultOpen={i === 0}
                />
              ))}
            </div>
          )}

          {/* ── Instructor ─────────────────────────────────────────── */}
          {course.instructor && (
            <div className="cdp-section-card" id="instructor">
              <h2 className="cdp-section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                Your Instructor
              </h2>
              <div className="cdp-instructor-card">
                <div className="cdp-instructor-avatar">
                  {course.instructor.profile_image ? (
                    <img src={course.instructor.profile_image} alt={course.instructor.name} />
                  ) : (
                    getInitial(course.instructor.name)
                  )}
                </div>
                <div className="cdp-instructor-info">
                  <h3 className="cdp-instructor-name">{course.instructor.name}</h3>
                  <div className="cdp-instructor-stats">
                    {course.instructor.average_rating && (
                      <span className="cdp-instructor-stat">
                        <span style={{ color: 'var(--gold)' }}>★</span>
                        {course.instructor.average_rating} Rating
                      </span>
                    )}
                    {course.instructor.total_courses > 0 && (
                      <span className="cdp-instructor-stat">
                        📚 {course.instructor.total_courses} Courses
                      </span>
                    )}
                  </div>
                  {course.instructor.bio && (
                    <p className="cdp-instructor-bio">{course.instructor.bio}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Ratings & Reviews ──────────────────────────────────── */}
          <div className="cdp-section-card">
            <h2 className="cdp-section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Ratings & Reviews
            </h2>

            {course.average_rating ? (
              <>
                {/* Overview: big score + bar chart */}
                <div className="cdp-ratings-overview">
                  <div className="cdp-rating-big">
                    <div className="cdp-rating-number">{course.average_rating}</div>
                    <div className="cdp-rating-stars-big">
                      <Stars rating={course.average_rating} />
                    </div>
                    <div className="cdp-rating-label">Course Rating</div>
                  </div>
                  <RatingBars reviews={allReviews} />
                </div>

                {/* Individual reviews */}
                {allReviews.length > 0 ? (
                  <>
                    <div className="cdp-review-list">
                      {allReviews.map(review => (
                        <div className="cdp-review-card" key={review.id}>
                          <div className="cdp-review-header">
                            <div className="cdp-reviewer-avatar">
                              {getInitial(review.reviewer_name)}
                            </div>
                            <div>
                              <div className="cdp-reviewer-name">{review.reviewer_name}</div>
                              <div className="cdp-review-date">{formatDate(review.created_at)}</div>
                            </div>
                            <div className="cdp-review-stars">
                              <Stars rating={review.rating} />
                            </div>
                          </div>
                          {review.comment && (
                            <p className="cdp-review-text">"{review.comment}"</p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Load more */}
                    {allReviews.length < reviewsTotal && (
                      <button
                        className="cdp-load-more-btn"
                        onClick={loadMoreReviews}
                        disabled={reviewsLoading}
                      >
                        {reviewsLoading ? '⟳ Loading…' : `Load more reviews (${reviewsTotal - allReviews.length} remaining)`}
                      </button>
                    )}
                  </>
                ) : (
                  <p style={{ color: 'var(--muted-text)', fontSize: '0.88rem', textAlign: 'center', padding: '20px 0' }}>
                    No written reviews yet. Be the first!
                  </p>
                )}
              </>
            ) : (
              <p style={{ color: 'var(--muted-text)', fontSize: '0.88rem', textAlign: 'center', padding: '20px 0' }}>
                No reviews yet for this course.
              </p>
            )}
          </div>

        </main>

        {/* ── Desktop Aside (empty — sidebar is in hero grid) ─────── */}
        <aside className="cdp-aside" />
      </div>

      {/* Toast notifications */}
      <Toast toasts={toasts} />
    </div>
  );
};

// ── Navbar (standalone, no auth dependency) ──────────────────────
function Navbar() {
  const [loggedIn] = useState(() => !!localStorage.getItem('access_token'));
  return (
    <nav className="cdp-navbar">
      <a href="/" className="cdp-navbar-brand">
        <div className="cdp-navbar-logo">G</div>
        GEP Learning
      </a>
      <div className="cdp-navbar-actions">
        {loggedIn ? (
          <>
            <a href="/courses/register" className="cdp-nav-btn cdp-nav-btn-ghost">Browse Courses</a>
            <a href="/employee/dashboard" className="cdp-nav-btn cdp-nav-btn-primary">My Dashboard</a>
          </>
        ) : (
          <>
            <a href="/" className="cdp-nav-btn cdp-nav-btn-ghost">Sign In</a>
            <a href="/employee/register" className="cdp-nav-btn cdp-nav-btn-primary">Join Free</a>
          </>
        )}
      </div>
    </nav>
  );
}

// ── Spin keyframe (inline style for enroll spinner) ──────────────
const style = document.createElement('style');
style.textContent = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
document.head.appendChild(style);

export default CourseDetailPage;
