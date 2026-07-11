import { useState, useEffect } from 'react';
import TopHeader from '../components/TopHeader';
import TestimonyCard from '../components/TestimonyCard';
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

      <div className="celebrate-hero">
        <h1>{t('sacredStories')}</h1>
        <p>{t('celebrateDesc')}</p>
      </div>

      {loading ? (
        <div className="empty-state">
          <div className="empty-state-icon">✨</div>
          <p className="empty-state-text">{t('loadingTestimonies')}</p>
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
