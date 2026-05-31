import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { T } from '../theme/tokens';
import { SEV, patientById } from '../data/mockData';
import { AlarmCard } from '../components/Clinical';
import { IconCheckCircle } from '../components/Icons';

export const AlarmsScreen = ({ alarms, onAlarm }) => {
  const sorted = [...alarms].sort((a, b) => SEV[b.severity].rank - SEV[a.severity].rank || a.raisedMin - b.raisedMin);
  const groups = ['critical', 'high', 'medium', 'low'];

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.container}>
      {alarms.length === 0 ? (
        <View style={styles.emptyAlarms}>
          <View style={styles.checkCircleWrapper}>
            <IconCheckCircle size={32} color={T.good} />
          </View>
          <Text style={styles.emptyTitle}>All patients stable</Text>
          <Text style={styles.emptySub}>No active alarms across ICU-A, CCU-1 and GEN-3W.</Text>
        </View>
      ) : (
        groups.map(g => {
          const list = sorted.filter(a => a.severity === g);
          if (!list.length) return null;
          return (
            <View key={g} style={styles.group}>
              <View style={styles.groupHeader}>
                <View style={[styles.severityDot, { backgroundColor: SEV[g].color }]} />
                <Text style={styles.groupTitle}>{SEV[g].label}</Text>
                <Text style={styles.groupCount}>{list.length}</Text>
              </View>
              <View style={styles.alarmList}>
                {list.map(a => (
                  <AlarmCard 
                    key={a.id} 
                    alarm={a} 
                    patient={patientById(a.patientId)} 
                    onClick={() => onAlarm(a)} 
                  />
                ))}
              </View>
            </View>
          );
        })
      )}
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
    gap: 18,
  },
  emptyAlarms: {
    alignItems: 'center',
    gap: 10,
    paddingTop: 54,
    paddingHorizontal: 20,
  },
  checkCircleWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: T.good + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: T.text,
  },
  emptySub: {
    fontSize: 13,
    color: T.textDim,
    textAlign: 'center',
  },
  group: {
    gap: 10,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 2,
    marginBottom: 2,
  },
  severityDot: {
    width: 9,
    height: 9,
    borderRadius: 2,
  },
  groupTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.9,
    color: T.textDim,
    textTransform: 'uppercase',
  },
  groupCount: {
    fontSize: 11,
    color: T.textFaint,
    fontFamily: 'JetBrains Mono',
  },
  alarmList: {
    gap: 10,
  },
});
