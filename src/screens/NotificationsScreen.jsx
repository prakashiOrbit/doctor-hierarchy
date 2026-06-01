import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { T } from '../theme/tokens';
import { NOTIFICATIONS_DATA, NOTIF_DAYS, NOTIF_TYPE_META } from '../data/mockData';
import {
  IconBack,
  IconBell,
  IconShieldUp,
  IconInfoCircle,
  IconCheck,
  IconBellOff,
} from '../components/Icons';

const NotifIcon = ({ type, size = 36 }) => {
  const m = NOTIF_TYPE_META[type] || NOTIF_TYPE_META.system;
  const icon = {
    alarm: <IconBell size={17} />,
    escalation: <IconShieldUp size={17} />,
    system: <IconInfoCircle size={17} />,
    ack: <IconCheck size={17} stroke={2} />,
  }[type] || <IconInfoCircle size={17} />;

  return (
    <View style={[styles.iconCircle, { width: size, height: size, backgroundColor: m.bg, borderRadius: size / 2 }]}>
      {React.cloneElement(icon, { color: m.color })}
    </View>
  );
};

export const NotificationsScreen = ({ onBack }) => {
  const [filter, setFilter] = useState('all');
  const [notifs, setNotifs] = useState(() => NOTIFICATIONS_DATA.map(n => ({ ...n })));
  const unread = notifs.filter(n => !n.read).length;
  const FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'alarm', label: 'Alarms' },
    { key: 'escalation', label: 'Escalations' },
    { key: 'system', label: 'System' },
  ];

  const filtered = notifs.filter(n => filter === 'all' || n.type === filter || (filter === 'system' && n.type === 'ack'));
  
  const markAllRead = () => setNotifs(ns => ns.map(n => ({ ...n, read: true })));
  const markRead = (id) => setNotifs(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <IconBack size={19} color={T.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unread > 0 && <Text style={styles.headerSub}>{unread} unread</Text>}
        </View>
        <TouchableOpacity onPress={markAllRead} disabled={unread === 0}>
          <Text style={[styles.markAllText, unread === 0 && { color: T.textFaint }]}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      {/* Filter chips */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTERS.map(f => {
            const on = filter === f.key;
            return (
              <TouchableOpacity 
                key={f.key} 
                onPress={() => setFilter(f.key)}
                style={[styles.filterChip, on && styles.filterChipActive]}
              >
                <Text style={[styles.filterLabel, on && styles.filterLabelActive]}>{f.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* List */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {NOTIF_DAYS.map(day => {
          const items = filtered.filter(n => n.day === day.key);
          if (!items.length) return null;
          return (
            <View key={day.key}>
              <Text style={styles.dayLabel}>{day.label}</Text>
              {items.map(n => (
                <TouchableOpacity 
                  key={n.id} 
                  onPress={() => markRead(n.id)} 
                  style={[styles.notifItem, !n.read && styles.notifItemUnread]}
                >
                  <NotifIcon type={n.type} />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <View style={styles.notifHeader}>
                      <Text style={[styles.notifTitle, !n.read && { fontWeight: '700' }]}>{n.title}</Text>
                      <Text style={styles.notifTime}>{n.ts}</Text>
                    </View>
                    <Text style={styles.notifBody} numberOfLines={2}>{n.body}</Text>
                  </View>
                  {!n.read && <View style={styles.unreadDot} />}
                </TouchableOpacity>
              ))}
            </View>
          );
        })}
        {filtered.length === 0 && (
          <View style={styles.emptyContainer}>
            <IconBellOff size={52} color={T.textFaint} />
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptySub}>Alarm escalations and system messages will appear here.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: T.bg,
    zIndex: 35,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: T.borderSoft,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: T.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: T.text,
  },
  headerSub: {
    fontSize: 11,
    color: T.textDim,
    marginTop: 1,
  },
  markAllText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: T.accent,
  },
  filterBar: {
    borderBottomWidth: 1,
    borderBottomColor: T.borderSoft,
  },
  filterScroll: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 6,
  },
  filterChip: {
    paddingVertical: 5,
    paddingHorizontal: 13,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: T.border,
  },
  filterChipActive: {
    backgroundColor: T.accent,
    borderColor: 'transparent',
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: T.textDim,
  },
  filterLabelActive: {
    color: '#fff',
  },
  dayLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: T.textFaint,
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: T.borderSoft,
  },
  notifItemUnread: {
    backgroundColor: T.accent + '08',
    borderLeftWidth: 3,
    borderLeftColor: T.accent,
  },
  iconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 3,
  },
  notifTitle: {
    flex: 1,
    fontSize: 13,
    color: T.text,
    lineHeight: 18,
  },
  notifTime: {
    fontSize: 10.5,
    color: T.textFaint,
    fontFamily: 'JetBrains Mono',
  },
  notifBody: {
    fontSize: 12,
    color: T.textDim,
    lineHeight: 18,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: T.accent,
    marginTop: 4,
  },
  emptyContainer: {
    padding: 64,
    alignItems: 'center',
    gap: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: T.textDim,
  },
  emptySub: {
    fontSize: 13,
    color: T.textFaint,
    textAlign: 'center',
    lineHeight: 18,
  },
});
