// iTouch Doctor v2a — SplashScreenLight + NotificationsScreen

// ─── Notification icon circle ─────────────────────────────────
function NotifIcon({ type, size = 36 }) {
  const m = NOTIF_TYPE_META[type] || NOTIF_TYPE_META.system;
  const icon = {
    alarm:      <IconBell size={17} stroke={1.8}/>,
    escalation: <IconShieldUp size={17}/>,
    system:     <IconInfoCircle size={17}/>,
    ack:        <IconCheck size={17} stroke={2}/>,
  }[type] || <IconInfoCircle size={17}/>;
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: m.bg, color: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {icon}
    </div>
  );
}

// ─── Splash screen (light, v2) ────────────────────────────────
function SplashScreenLight({ onDone }) {
  React.useEffect(() => { const t = setTimeout(() => onDone && onDone(), 2500); return () => clearTimeout(t); }, []);
  return (
    <div style={{ flex: 1, background: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', animation: 'fadeIn .5s ease-out' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 65% 45% at 50% 50%, rgba(59,130,246,.09) 0%, transparent 68%)', pointerEvents: 'none' }}/>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, animation: 'fadeInUp .7s ease-out .15s both' }}>
        <img src={window.__resources?.itouchLogo || 'assets/itouch-logo.png'} alt="" width={76} height={76}
          style={{ borderRadius: 20, boxShadow: '0 14px 36px rgba(59,130,246,.24)' }}/>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 27, fontWeight: 700, letterSpacing: '-.02em', color: '#0F172A', lineHeight: 1 }}>
            iTouch <span style={{ color: '#2563EB' }}>Doctor</span>
          </div>
          <div style={{ fontSize: 14, color: '#94A3B8', marginTop: 8 }}>Clinical monitoring, anywhere.</div>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 82, left: 44, right: 44 }}>
        <div style={{ height: 2.5, borderRadius: 2, background: '#E2E8F0', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 2, background: '#2563EB', animation: 'splashBar 2.5s ease-in-out forwards' }}/>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 52, textAlign: 'center', fontSize: 11.5, color: '#94A3B8' }}>
        Powered by <span style={{ fontWeight: 600, color: '#64748B' }}>iOrbit</span>
      </div>
    </div>
  );
}

// ─── Notifications screen ─────────────────────────────────────
function NotificationsScreen({ onBack }) {
  const [filter, setFilter] = React.useState('all');
  const [notifs, setNotifs] = React.useState(() => NOTIFICATIONS_DATA.map(n => ({ ...n })));
  const unread = notifs.filter(n => !n.read).length;
  const FILTERS = [
    { key: 'all',       label: 'All'         },
    { key: 'alarm',     label: 'Alarms'      },
    { key: 'escalation',label: 'Escalations' },
    { key: 'system',    label: 'System'      },
  ];
  const filtered = notifs.filter(n => filter === 'all' || n.type === filter || (filter === 'system' && n.type === 'ack'));
  const markAllRead = () => setNotifs(ns => ns.map(n => ({ ...n, read: true })));
  const markRead = (id) => setNotifs(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <div style={{ position: 'absolute', inset: 0, background: T.bg, zIndex: 35, display: 'flex', flexDirection: 'column', animation: 'sheetUpFull .26s cubic-bezier(.2,.8,.2,1)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px 12px', borderBottom: `1px solid ${T.borderSoft}` }}>
        <button onClick={onBack} style={{ width: 34, height: 34, borderRadius: 10, border: 'none', background: T.surface, color: T.text, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <IconBack size={19}/>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>Notifications</div>
          {unread > 0 && <div style={{ fontSize: 11, color: T.textDim, marginTop: 1 }}>{unread} unread</div>}
        </div>
        <button onClick={markAllRead} disabled={unread === 0} style={{ background: 'transparent', border: 'none', cursor: unread > 0 ? 'pointer' : 'default', color: unread > 0 ? T.accent : T.textFaint, fontSize: 12.5, fontWeight: 600, padding: 0, fontFamily: 'inherit' }}>
          Mark all read
        </button>
      </div>
      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 6, padding: '10px 14px', overflowX: 'auto', borderBottom: `1px solid ${T.borderSoft}`, flexShrink: 0 }}>
        {FILTERS.map(f => {
          const on = filter === f.key;
          return (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{ padding: '5px 13px', borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', border: `1px solid ${on ? 'transparent' : T.border}`, background: on ? T.accent : 'transparent', color: on ? '#fff' : T.textDim, flexShrink: 0 }}>
              {f.label}
            </button>
          );
        })}
      </div>
      {/* List */}
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 0' }}>
        {NOTIF_DAYS.map(day => {
          const items = filtered.filter(n => n.day === day.key);
          if (!items.length) return null;
          return (
            <div key={day.key}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.08em', color: T.textFaint, textTransform: 'uppercase', padding: '10px 16px 6px' }}>{day.label}</div>
              {items.map(n => (
                <div key={n.id} onClick={() => markRead(n.id)} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px',
                  background: n.read ? 'transparent' : 'rgba(59,130,246,.04)',
                  borderLeft: `3px solid ${n.read ? 'transparent' : T.accent}`,
                  borderBottom: `1px solid ${T.borderSoft}`,
                  cursor: 'pointer', transition: 'background .15s',
                }}>
                  <NotifIcon type={n.type}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: n.read ? 500 : 700, color: T.text, lineHeight: 1.3 }}>{n.title}</span>
                      <span style={{ fontSize: 10.5, color: T.textFaint, fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap', flexShrink: 0 }}>{n.ts}</span>
                    </div>
                    <div style={{ fontSize: 12, color: T.textDim, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{n.body}</div>
                  </div>
                  {!n.read && <span style={{ width: 8, height: 8, borderRadius: '50%', background: T.accent, flexShrink: 0, marginTop: 4 }}/>}
                </div>
              ))}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '64px 24px', textAlign: 'center' }}>
            <IconBellOff size={52} stroke={1.2} color={T.textFaint}/>
            <div style={{ fontSize: 16, fontWeight: 600, color: T.textDim }}>No notifications yet</div>
            <div style={{ fontSize: 13, color: T.textFaint, lineHeight: 1.5 }}>Alarm escalations and system messages will appear here.</div>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { SplashScreenLight, NotificationsScreen, NotifIcon });

