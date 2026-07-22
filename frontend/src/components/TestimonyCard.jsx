import { motion } from 'framer-motion';
import { useLang } from '../context/LanguageContext';

export default function TestimonyCard({ testimony }) {
  const { t } = useLang();
  const initial = testimony.user?.name?.[0]?.toUpperCase() || '?';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="testimony-card glass-card"
      id={`testimony-card-${testimony.id}`}
      style={{
        border: '1.5px solid #fde047',
        boxShadow: '0 10px 30px rgba(234, 179, 8, 0.15)',
        background: 'linear-gradient(180deg, rgba(254, 252, 232, 0.7) 0%, rgba(255, 255, 255, 0.85) 100%)',
      }}
    >
      <div className="testimony-header">
        <div className="testimony-avatar" style={{ background: 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)', color: '#854d0e', fontWeight: 700 }}>
          {initial}
        </div>
        <div className="testimony-user-info">
          <div className="testimony-user-name">{testimony.user?.name || t('anonymous')}</div>
          <span className="testimony-user-category" style={{ background: '#fef3c7', color: '#b45309' }}>
            {testimony.prayer?.category || t('general')}
          </span>
        </div>
        <span className="testimony-badge" style={{ background: 'linear-gradient(135deg, #fef08a 0%, #facc15 100%)', color: '#713f12', border: 'none', boxShadow: '0 2px 8px rgba(250, 204, 21, 0.4)' }}>
          🎉 {t('godAnswered')}
        </span>
      </div>

      <div className="testimony-prayer-text" style={{ background: '#fef9c3', borderLeftColor: '#eab308', color: '#713f12' }}>
        "{testimony.prayer?.prayerText}"
      </div>

      <p className="testimony-text">{testimony.testimonyText}</p>
    </motion.div>
  );
}


