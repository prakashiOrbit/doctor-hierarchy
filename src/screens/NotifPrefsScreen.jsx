import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Switch,
} from 'react-native';
import { T } from '../theme/tokens';
import { SEV } from '../data/mockData';
import { IconBack } from '../components/Icons';

export const NotifPrefsScreen = ({ onBack }) => {
  const [prefs, setPrefs] = useState({ 
    critical: true, 
    high: true, 
    medium: true, 
    low: false, 
    escalations: true 
  });

  const toggle = (k) => setPrefs(p => ({ ...p, [k]: !p[k] }));

  const rows = [
    { key: 'critical', label: 'Critical alarms', desc: 'Immediate push + sound', color: SEV.critical.color },
    { key: 'high',     label: 'High alarms',     desc: 'Push notification',      color: SEV.high.color    },
    { key: 'medium',   label: 'Medium alarms',   desc: 'Push notification',      color: SEV.medium.color  },
    { key: 'low',      label: 'Low alarms',      desc: 'Silent badge only',      color: SEV.low.color     },
    { key: 'escalations', label: 'Nurse escalations', desc: 'Push + urgent sound', color: T.accent },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <IconBack size={19} color={T.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Preferences</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.listCard}>
          {rows.map((r, i) => (
            <View key={r.key} style={[styles.row, i > 0 && styles.rowBorder]}>
              <View style={[styles.dot, { backgroundColor: r.color }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>{r.label}</Text>
                <Text style={styles.desc}>{r.desc}</Text>
              </View>
              <Switch 
                value={prefs[r.key]} 
                onValueChange={() => toggle(r.key)}
                trackColor={{ false: T.border, true: T.good }}
                thumbColor={Platform.OS === 'ios' ? undefined : '#fff'}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: T.bg,
    zIndex: 40,
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
  scrollContent: {
    padding: 14,
  },
  listCard: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.borderSoft,
    borderRadius: 14,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    minHeight: 56,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: T.borderSoft,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 13.5,
    fontWeight: '600',
    color: T.text,
  },
  desc: {
    fontSize: 11,
    color: T.textDim,
    marginTop: 1,
  },
});
