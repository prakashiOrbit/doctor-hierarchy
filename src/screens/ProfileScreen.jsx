import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { T } from '../theme/tokens';
import { PATIENTS, WARDS } from '../data/mockData';
import { Avatar, Btn } from '../components/Shared';
import { MiniStat } from './HomeScreen';
import {
  IconBell,
  IconShield,
  IconActivity,
  IconClock,
  IconChevron,
  IconLogout,
} from '../components/Icons';

export const ProfileScreen = ({ onLogout }) => {
  const rows = [
    { icon: <IconBell size={18} />, label: 'Notifications', val: 'Critical only' },
    { icon: <IconShield size={18} />, label: 'Two-factor auth', val: 'On' },
    { icon: <IconActivity size={18} />, label: 'Default waveform', val: 'ECG II' },
    { icon: <IconClock size={18} />, label: 'Shift', val: 'Day · 08:00–20:00' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.container}>
      {/* Doctor ID Card */}
      <View style={styles.profileCard}>
        <Avatar initials="RS" color={T.accent} size={56} />
        <View style={styles.profileInfo}>
          <Text style={styles.doctorName}>Dr. R. Shah</Text>
          <Text style={styles.doctorRole}>Consultant Intensivist</Text>
          <Text style={styles.doctorMeta}>GMC 7240118 · ICU-A</Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsGrid}>
        <MiniStat label="PATIENTS" value={PATIENTS.length} color={T.accent} />
        <MiniStat label="WARDS" value={WARDS.length} color="#8B5CF6" />
        <MiniStat label="ON SHIFT" value="11h" color={T.good} />
      </View>

      {/* Settings Rows */}
      <View style={styles.settingsList}>
        {rows.map((r, i) => (
          <View key={i} style={[styles.settingRow, i === 0 && { borderTopWidth: 0 }]}>
            <View style={styles.settingIcon}>{r.icon}</View>
            <Text style={styles.settingLabel}>{r.label}</Text>
            <Text style={styles.settingVal}>{r.val}</Text>
            <IconChevron size={15} color={T.textFaint} />
          </View>
        ))}
      </View>

      {/* Sign Out Action */}
      <View style={styles.footer}>
        <Btn 
          variant="tonal" 
          danger 
          full 
          size="lg" 
          icon={<IconLogout size={17} color={T.bad} />} 
          onClick={onLogout}
        >
          Sign Out
        </Btn>
        <Text style={styles.versionText}>iTouch Doctor · v2.1.0 · Powered by iOrbit</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.bg,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: T.surface, // Reference had a gradient, using surface for consistency
    borderWidth: 1,
    borderColor: T.borderSoft,
    borderRadius: 16,
    padding: 16,
  },
  profileInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: T.text,
  },
  doctorRole: {
    fontSize: 12.5,
    color: T.textDim,
    marginTop: 2,
  },
  doctorMeta: {
    fontSize: 10.5,
    color: T.textFaint,
    fontFamily: 'JetBrains Mono',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  settingsList: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.borderSoft,
    borderRadius: 14,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: T.borderSoft,
  },
  settingIcon: {
    color: T.textDim,
  },
  settingLabel: {
    flex: 1,
    fontSize: 13.5,
    color: T.text,
  },
  settingVal: {
    fontSize: 12,
    color: T.textDim,
    fontFamily: 'JetBrains Mono',
  },
  footer: {
    gap: 16,
    marginTop: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 10.5,
    color: T.textFaint,
    fontFamily: 'JetBrains Mono',
  },
});
