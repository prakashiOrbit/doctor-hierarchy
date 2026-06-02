import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  LayoutAnimation,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { T } from '../theme/tokens';
import { SHIFTS_DATA, WARDS } from '../data/mockData';
import { WardTypeChip } from '../components/Clinical';
import {
  IconBack,
  IconCalendar,
  IconInfoCircle,
} from '../components/Icons';

export const OnCallScreen = ({ onBack }) => {
  const [active, setActive] = useState(true);

  const toggleActive = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActive(!active);
  };

  const radius = 23;
  const circumference = 2 * Math.PI * radius;
  const progress = 0.37; // 4h of 12h elapsed
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <IconBack size={19} color={T.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Availability</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Toggle card */}
        <View style={[styles.card, active && { borderColor: T.good + '66' }]}>
          <TouchableOpacity onPress={toggleActive} activeOpacity={0.9} style={styles.toggleContainer}>
            <View style={[styles.toggleBg, active ? { backgroundColor: T.good + '1A', borderColor: T.good } : { backgroundColor: T.border + '1A', borderColor: T.border }]}>
               <View style={[styles.toggleThumb, active ? { left: 4, backgroundColor: T.good, shadowColor: T.good } : { left: 97, backgroundColor: '#475569' }]} />
               <Text style={[styles.toggleLabel, { left: 0, color: active ? T.good : T.textFaint }]}>ON CALL</Text>
               <Text style={[styles.toggleLabel, { right: 0, color: !active ? '#94A3B8' : T.textFaint }]}>OFF DUTY</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.toggleDesc}>
            {active ? 'You are currently available for escalations.' : 'You will not receive escalation alerts.'}
          </Text>
        </View>

        {/* Current shift */}
        <View style={styles.shiftCard}>
          <Text style={styles.sectionTitle}>Current Shift</Text>
          <View style={styles.shiftMain}>
            <View>
              <Text style={styles.shiftName}>Day Shift</Text>
              <Text style={styles.shiftTime}>08:00 — 20:00</Text>
            </View>
            <View style={styles.progressBox}>
              <Svg width={58} height={58} viewBox="0 0 58 58" style={{ transform: [{ rotate: '-90deg' }] }}>
                <Circle cx="29" cy="29" r={radius} fill="none" stroke={T.border} strokeWidth="5" />
                <Circle 
                  cx="29" 
                  cy="29" 
                  r={radius} 
                  fill="none" 
                  stroke={T.good} 
                  strokeWidth="5"
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </Svg>
              <View style={styles.progressInner}>
                <Text style={styles.progressVal}>4h</Text>
                <Text style={styles.progressLabel}>elapsed</Text>
              </View>
            </View>
          </View>
          <View style={styles.wardRow}>
            {WARDS.map(w => <WardTypeChip key={w.id} type={w.type} />)}
          </View>
        </View>

        {/* History */}
        <View style={styles.historySection}>
          <View style={styles.sectionHeader}>
            <IconCalendar size={15} color={T.textDim} />
            <Text style={styles.sectionTitle}>Recent Shifts</Text>
          </View>
          <View style={styles.historyList}>
            {SHIFTS_DATA.map((s, i) => (
              <View key={i} style={[styles.historyRow, i === 0 && { borderTopWidth: 0 }]}>
                <Text style={styles.historyDate}>{s.date}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.historyName}>{s.name}</Text>
                  {s.start ? <Text style={styles.historyTime}>{s.start}–{s.end}</Text> : null}
                </View>
                <View style={[styles.statusBadge, s.status === 'oncall' ? styles.statusOnCall : styles.statusOffDuty]}>
                  <Text style={[styles.statusBadgeText, s.status === 'oncall' ? { color: T.good } : { color: T.textFaint }]}>
                    {s.status === 'oncall' ? 'ON CALL' : 'OFF DUTY'}
                  </Text>
                </View>
                {s.hours > 0 && <Text style={styles.historyHours}>{s.hours}h</Text>}
              </View>
            ))}
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoBox}>
          <IconInfoCircle size={16} color={T.accent} />
          <Text style={styles.infoText}>Nurses and the system use this status to route emergency escalations. Update it when you go on break or hand over to a colleague.</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.bg,
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
    backgroundColor: T.surface,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: T.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: T.text,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingVertical: 16,
    paddingBottom: 40,
    gap: 14,
  },
  card: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.borderSoft,
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 16,
  },
  toggleContainer: {
    width: 196,
    height: 52,
  },
  toggleBg: {
    flex: 1,
    borderRadius: 26,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    position: 'relative',
  },
  toggleThumb: {
    position: 'absolute',
    top: 4,
    width: 95,
    height: 42,
    borderRadius: 22,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.38,
    shadowRadius: 12,
  },
  toggleLabel: {
    width: 98,
    textAlign: 'center',
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 0.4,
    zIndex: 1,
  },
  toggleDesc: {
    fontSize: 13,
    color: T.textDim,
    textAlign: 'center',
    lineHeight: 18,
  },
  shiftCard: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.borderSoft,
    borderRadius: 14,
    padding: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: T.textDim,
    textTransform: 'uppercase',
  },
  shiftMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shiftName: {
    fontSize: 16,
    fontWeight: '700',
    color: T.text,
  },
  shiftTime: {
    fontSize: 12.5,
    color: T.textDim,
    fontFamily: 'JetBrains Mono',
    marginTop: 3,
  },
  progressBox: {
    position: 'relative',
    width: 58,
    height: 58,
  },
  progressInner: {
    position: 'absolute',
    inset: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressVal: {
    fontSize: 11,
    fontWeight: '700',
    color: T.good,
    fontFamily: 'JetBrains Mono',
    lineHeight: 11,
  },
  progressLabel: {
    fontSize: 8.5,
    color: T.textFaint,
    marginTop: 1,
  },
  wardRow: {
    flexDirection: 'row',
    gap: 6,
  },
  historySection: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyList: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.borderSoft,
    borderRadius: 14,
    overflow: 'hidden',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: T.borderSoft,
    minHeight: 56,
  },
  historyDate: {
    minWidth: 52,
    fontSize: 10.5,
    color: T.textFaint,
    fontFamily: 'JetBrains Mono',
  },
  historyName: {
    fontSize: 13,
    color: T.text,
    fontWeight: '500',
  },
  historyTime: {
    fontSize: 10.5,
    color: T.textDim,
    fontFamily: 'JetBrains Mono',
    marginTop: 1,
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  statusOnCall: {
    backgroundColor: T.good + '1F',
  },
  statusOffDuty: {
    backgroundColor: T.border,
  },
  statusBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.6,
    fontFamily: 'JetBrains Mono',
  },
  historyHours: {
    fontSize: 11,
    color: T.textFaint,
    fontFamily: 'JetBrains Mono',
    minWidth: 24,
    textAlign: 'right',
  },
  infoBox: {
    backgroundColor: T.accent + '12',
    borderWidth: 1,
    borderColor: T.accent + '33',
    borderRadius: 12,
    padding: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    gap: 10,
  },
  infoText: {
    fontSize: 12.5,
    color: T.textDim,
    lineHeight: 18,
    flex: 1,
  },
});
