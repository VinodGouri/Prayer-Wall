import { useLang } from '../context/LanguageContext';

export default function TestimonyCard({ testimony }) {
  const { t } = useLang();
  const initial = testimony.user?.name?.[0]?.toUpperCase() || '?';

  return (
    <div className="testimony-card" id={`testimony-card-${testimony.id}`}>
      <div className="testimony-header">
        <div className="testimony-avatar">{initial}</div>
        <div className="testimony-user-info">
          <div className="testimony-user-name">{testimony.user?.name || t('anonymous')}</div>
          <span className="testimony-user-category">
            {testimony.prayer?.category || t('general')}
          </span>
        </div>
        <span className="testimony-badge">{t('godAnswered')}</span>
      </div>

      <div className="testimony-prayer-text">
        "{testimony.prayer?.prayerText}"
      </div>

      <p className="testimony-text">{testimony.testimonyText}</p>
    </div>
  );
}
