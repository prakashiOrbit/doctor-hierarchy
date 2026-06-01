import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { T } from '../theme/tokens';
import { SEV, PATIENTS, WARDS, patientsInWard, patientById } from '../data/mockData';
import { AlarmCard, WardAccordion } from '../components/Clinical';
import { IconCheckCircle, IconClipboardList } from '../components/Icons';

const PulsingDot = () => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 2.5,
          duration: 1600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.dotContainer}>
      <Animated.View
        style={[
          styles.pulsingRing,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      />
      <View style={styles.solidDot} />
    </View>
  );
};

export const MiniStat = ({ label, value, color }) => {
  return (
    <View style={styles.miniStat}>
      <Text style={[styles.miniStatValue, { color }]}>{value}</Text>
      <Text style={styles.miniStatLabel}>{label}</Text>
    </View>
  );
};

export const HomeScreen = ({ alarms, onAlarm, onPatient, onOnCall, onRounds }) => {
  const sorted = [...alarms].sort((a, b) => SEV[b.severity].rank - SEV[a.severity].rank || a.raisedMin - b.raisedMin);
  const critCount = alarms.filter(a => a.severity === 'critical').length;
  const criticalPatients = PATIENTS.filter(p => p.status === 'critical').length;

  return (
    <View style={styles.container}>
      {/* Greeting strip */}
      <View style={styles.greetingStripOuter}>
        <View style={styles.greetingStrip}>
          <View>
            <Text style={styles.greetingText}>Good morning,</Text>
            <View style={styles.nameRow}>
              <Text style={styles.doctorName}>Dr. Shah</Text>
              <TouchableOpacity onPress={onOnCall} style={styles.onCallChip}>
                <PulsingDot />
                <Text style={styles.onCallText}>ON CALL</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.statsRow}>
            <MiniStat label="ALARMS" value={alarms.length} color={alarms.length ? SEV.high.color : T.good} />
            <MiniStat label="PATIENTS" value={PATIENTS.length} color={T.accent} />
            <MiniStat label="CRITICAL" value={criticalPatients} color={SEV.critical.color} />
          </View>
        </View>
      </View>

      <View style={styles.mainContent}>
        {/* Left: Active alarms */}
        <View style={styles.column}>
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

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.columnScroll}>
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
          </ScrollView>
        </View>

        {/* Right: My patients by ward */}
        <View style={[styles.column, { borderLeftWidth: 1, borderLeftColor: T.borderSoft }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Patients</Text>
            <Text style={styles.patientTotal}>{PATIENTS.length}</Text>
            <View style={{ flex: 1 }} />
            <TouchableOpacity onPress={onRounds} style={styles.roundsButton}>
              <IconClipboardList size={14} color={T.textDim} />
              <Text style={styles.roundsButtonText}>Rounds</Text>
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.columnScroll}>
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
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.bg,
  },
  greetingStripOuter: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
  },
  greetingStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.borderSoft,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  columnScroll: {
    paddingBottom: 30,
    gap: 12,
  },
  greetingText: {
    fontSize: 12,
    color: T.textDim,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  doctorName: {
    fontSize: 17,
    fontWeight: '700',
    color: T.text,
    letterSpacing: -0.1,
  },
  onCallChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 99,
    backgroundColor: T.good + '22', // rgba equivalent
    borderWidth: 1,
    borderColor: T.good + '55',
  },
  onCallText: {
    fontSize: 10,
    fontWeight: '700',
    color: T.good,
    letterSpacing: 0.5,
  },
  dotContainer: {
    width: 6,
    height: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  solidDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: T.good,
  },
  pulsingRing: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: T.good,
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 2,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.9,
    color: T.textDim,
    textTransform: 'uppercase',
  },
  roundsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: T.borderSoft,
    backgroundColor: 'transparent',
  },
  roundsButtonText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: T.textDim,
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
