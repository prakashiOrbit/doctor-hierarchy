import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { T } from '../theme/tokens';
import { SEV, PATIENTS, WARDS, patientsInWard, patientById } from '../data/mockData';
import { AlarmCard, WardAccordion } from '../components/Clinical';
import { IconCheckCircle } from '../components/Icons';

export const MiniStat = ({ label, value, color }) => {
  return (
    <View style={styles.miniStat}>
      <Text style={[styles.miniStatValue, { color }]}>{value}</Text>
      <Text style={styles.miniStatLabel}>{label}</Text>
    </View>
  );
};

export const HomeScreen = ({ alarms, onAlarm, onPatient }) => {
  const sorted = [...alarms].sort((a, b) => SEV[b.severity].rank - SEV[a.severity].rank || a.raisedMin - b.raisedMin);
  const critCount = alarms.filter(a => a.severity === 'critical').length;
  const criticalPatients = PATIENTS.filter(p => p.status === 'critical').length;

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.container}>
      {/* Greeting strip */}
      <View style={styles.greetingStrip}>
        <View>
          <Text style={styles.greetingText}>Good morning,</Text>
          <Text style={styles.doctorName}>Dr. Shah</Text>
        </View>
        <View style={styles.statsRow}>
          <MiniStat label="ALARMS" value={alarms.length} color={alarms.length ? SEV.high.color : T.good} />
          <MiniStat label="PATIENTS" value={PATIENTS.length} color={T.accent} />
          <MiniStat label="CRITICAL" value={criticalPatients} color={SEV.critical.color} />
        </View>
      </View>

      {/* Active alarms */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Alarms</Text>
          {alarms.length > 0 && (
            <View style={[styles.alarmCountBadge, { backgroundColor: SEV.critical.color }]}>
              <Text style={styles.alarmCountText}>{alarms.length}</Text>
            </View>
          )}
          <View style={{ flex: 1 }} />
          {critCount > 0 && <Text style={styles.critSubText}>{critCount} critical</Text>}
        </View>

        {alarms.length === 0 ? (
          <View style={styles.emptyAlarms}>
            <View style={styles.checkCircleWrapper}>
              <IconCheckCircle size={28} color={T.good} />
            </View>
            <Text style={styles.emptyTitle}>All patients stable</Text>
            <Text style={styles.emptySub}>No active alarms across your wards.</Text>
          </View>
        ) : (
          <View style={styles.alarmList}>
            {sorted.map(a => (
              <AlarmCard 
                key={a.id} 
                alarm={a} 
                patient={patientById(a.patientId)} 
                onClick={() => onAlarm(a)} 
              />
            ))}
          </View>
        )}
      </View>

      {/* My patients by ward */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Patients</Text>
          <Text style={styles.patientTotal}>{PATIENTS.length}</Text>
        </View>
        <View style={styles.wardList}>
          {WARDS.map(w => (
            <WardAccordion 
              key={w.id} 
              ward={w} 
              patients={patientsInWard(w.id)}
              defaultOpen={w.type !== 'GENERAL'} 
              onPatient={onPatient}
            />
          ))}
        </View>
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
    padding: 14,
    paddingBottom: 40,
    gap: 20,
  },
  greetingStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: T.surface, // RN doesn't support easy complex gradients without extra libs, using surface for now
    borderWidth: 1,
    borderColor: T.borderSoft,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  greetingText: {
    fontSize: 12,
    color: T.textDim,
  },
  doctorName: {
    fontSize: 17,
    fontWeight: '700',
    color: T.text,
    letterSpacing: -0.1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  miniStat: {
    alignItems: 'center',
    minWidth: 46,
  },
  miniStatValue: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'JetBrains Mono',
    lineHeight: 22,
  },
  miniStatLabel: {
    fontSize: 8.5,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: T.textFaint,
    marginTop: 3,
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 2,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.9,
    color: T.textDim,
    textTransform: 'uppercase',
  },
  alarmCountBadge: {
    paddingVertical: 1,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  alarmCountText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'JetBrains Mono',
  },
  critSubText: {
    fontSize: 10.5,
    color: SEV.critical.color,
    fontFamily: 'JetBrains Mono',
  },
  emptyAlarms: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.good + '33',
    borderRadius: 14,
  },
  checkCircleWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: T.good + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: T.text,
  },
  emptySub: {
    fontSize: 12.5,
    color: T.textDim,
    textAlign: 'center',
  },
  alarmList: {
    gap: 10,
  },
  patientTotal: {
    fontSize: 11,
    color: T.textFaint,
    fontFamily: 'JetBrains Mono',
  },
  wardList: {
    gap: 10,
  },
});
