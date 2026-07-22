import { useState, useEffect } from 'react';
import TopHeader from '../components/TopHeader';
import TestimonyCard from '../components/TestimonyCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { useLang } from '../context/LanguageContext';
import api from '../api';

export default function CelebratePage() {
  const { t } = useLang();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await api.getTestimonials();
        setTestimonials(data.testimonials);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <>
      <TopHeader title={t('testimonies')} />

      <div className="celebrate-hero" style={{
        background: 'linear-gradient(135deg, rgba(254, 240, 138, 0.5) 0%, rgba(253, 224, 71, 0.3) 50%, rgba(254, 215, 170, 0.5) 100%)',
        borderRadius: '0 0 28px 28px',
        padding: '32px 20px 24px',
        marginBottom: '16px',
        borderBottom: '1.5px solid rgba(234, 179, 8, 0.3)',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🎊✨</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: '#713f12' }}>{t('sacredStories')}</h1>
        <p style={{ color: '#854d0e', fontWeight: 500 }}>{t('celebrateDesc')}</p>
      </div>

      {loading ? (
        <div style={{ paddingTop: '12px' }}>
          <SkeletonLoader type="testimony" count={3} />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🙌</div>
          <p className="empty-state-title">{t('noTestimonies')}</p>
          <p className="empty-state-text">{t('noTestimoniesDesc')}</p>
        </div>
      ) : (
        testimonials.map(testimony => (
          <TestimonyCard key={testimony.id} testimony={testimony} />
        ))
      )}
    </>
  );
}

