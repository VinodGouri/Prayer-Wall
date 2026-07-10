export default function TestimonyCard({ testimony }) {
  const initial = testimony.user?.name?.[0]?.toUpperCase() || '?';

  return (
    <div className="testimony-card" id={`testimony-card-${testimony.id}`}>
      <div className="testimony-header">
        <div className="testimony-avatar">{initial}</div>
        <div className="testimony-user-info">
          <div className="testimony-user-name">{testimony.user?.name || 'Anonymous'}</div>
          <span className="testimony-user-category">
            {testimony.prayer?.category || 'General'}
          </span>
        </div>
        <span className="testimony-badge">🎉 GOD ANSWERED</span>
      </div>

      <div className="testimony-prayer-text">
        "{testimony.prayer?.prayerText}"
      </div>

      <p className="testimony-text">{testimony.testimonyText}</p>
    </div>
  );
}
