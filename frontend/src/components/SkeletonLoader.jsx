export default function SkeletonLoader({ type = 'card', count = 3 }) {
  const items = Array.from({ length: count });

  if (type === 'stats') {
    return (
      <div className="admin-stats">
        {items.map((_, i) => (
          <div key={i} className="admin-stat-card skeleton-pulse" style={{ height: '110px', borderRadius: '16px' }} />
        ))}
      </div>
    );
  }

  if (type === 'testimony') {
    return (
      <>
        {items.map((_, i) => (
          <div
            key={i}
            className="testimony-card skeleton-pulse"
            style={{
              height: '160px',
              borderRadius: '20px',
              margin: '0 16px 16px',
            }}
          />
        ))}
      </>
    );
  }

  return (
    <>
      {items.map((_, i) => (
        <div
          key={i}
          className="prayer-card"
          style={{
            margin: '0 16px 14px',
            borderRadius: '20px',
            padding: '20px',
            background: 'var(--color-surface-card)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div className="skeleton-pulse" style={{ width: '42px', height: '42px', borderRadius: '50%' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div className="skeleton-pulse" style={{ width: '120px', height: '14px', borderRadius: '6px' }} />
              <div className="skeleton-pulse" style={{ width: '80px', height: '10px', borderRadius: '4px' }} />
            </div>
            <div className="skeleton-pulse" style={{ width: '60px', height: '20px', borderRadius: '12px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            <div className="skeleton-pulse" style={{ width: '100%', height: '12px', borderRadius: '4px' }} />
            <div className="skeleton-pulse" style={{ width: '85%', height: '12px', borderRadius: '4px' }} />
          </div>
          <div className="skeleton-pulse" style={{ width: '100%', height: '40px', borderRadius: '12px' }} />
        </div>
      ))}
    </>
  );
}
