import { useState, useEffect } from 'react';
import TopHeader from '../components/TopHeader';
import TestimonyCard from '../components/TestimonyCard';
import api from '../api';

export default function CelebratePage() {
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
      <TopHeader title="Testimonies" />

      <div className="celebrate-hero">
        <h1>Sacred Stories</h1>
        <p>Witness the beauty of God's faithfulness in the lives of our community.</p>
      </div>

      {loading ? (
        <div className="empty-state">
          <div className="empty-state-icon">✨</div>
          <p className="empty-state-text">Loading testimonies...</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🙌</div>
          <p className="empty-state-title">No testimonies yet</p>
          <p className="empty-state-text">When prayers are answered and testimonies shared, they'll appear here.</p>
        </div>
      ) : (
        testimonials.map(t => (
          <TestimonyCard key={t.id} testimony={t} />
        ))
      )}
    </>
  );
}
