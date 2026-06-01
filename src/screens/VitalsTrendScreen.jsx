import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { T } from '../theme/tokens';
import { 
  vitalTrendConfig, 
  genVitalTrend, 
  vitalStatus, 
} from '../data/mockData';
import { PriorityBadge } from '../components/Clinical';
import { TrendChart } from '../components/TrendChart';
import { IconBack } from '../components/Icons';

export const VitalsTrendScreen = ({ patient, vkey, onBack }) => {
  const [range, setRange] = useState('24H');
  const cfg = vitalTrendConfig(vkey, patient);
  const hours = { '6H': 6, '12H': 12, '24H': 24, '3D': 72, '7D': 168 }[range] || 24;
  
  const series = useMemo(() => genVitalTrend(cfg.base, hours, cfg.noise, cfg.lo, cfg.hi), [range, vkey, patient.id]);
  
  const vals = series.map(p => p.v);
  const minV = Math.min(...vals).toFixed(cfg.base < 10 ? 1 : 0);
  const maxV = Math.max(...vals).toFixed(cfg.base < 10 ? 1 : 0);
  const avgV = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(cfg.base < 10 ? 1 : 0);
  const events = vals.filter(v => v < cfg.lo || v > cfg.hi).length;
  const current = vals[vals.length - 1];
  const currentSt = vitalStatus(vkey, current);
  const recent = series.slice(-8).reverse();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <IconBack size={19} color={T.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{cfg.label}</Text>
          <Text style={styles.headerSub}>{patient.name} · {patient.bed}</Text>
        </View>
        <View style={styles.currentValBox}>
          <Text style={[styles.currentValue, { color: cfg.color }]}>{current}</Text>
          <Text style={styles.unitText}>{cfg.unit}</Text>
        </View>
      </View>

      <View style={styles.rangeBar}>
        {['6H', '12H', '24H', '3D', '7D'].map(r => (
          <TouchableOpacity 
            key={r} 
            onPress={() => setRange(r)}
            style={[styles.rangeBtn, range === r && styles.rangeBtnActive]}
          >
            <Text style={[styles.rangeBtnText, range === r && styles.rangeBtnTextActive]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <PriorityBadge severity={currentSt === 'normal' ? 'normal' : currentSt === 'critical' ? 'critical' : 'medium'} size="sm"/>
          </View>
          <TrendChart series={series} color={cfg.color} normalLow={cfg.lo} normalHigh={cfg.hi} vkey={vkey}/>
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendLine, { backgroundColor: cfg.color }]} />
              <Text style={styles.legendText}>{cfg.label}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendLineDashed]} />
              <Text style={styles.legendText}>Normal range</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsGrid}>
          {[
            { label: 'MIN', value: minV, unit: cfg.unit, color: parseFloat(minV) < cfg.lo ? T.bad : T.textDim },
            { label: 'MAX', value: maxV, unit: cfg.unit, color: parseFloat(maxV) > cfg.hi ? T.bad : T.textDim },
            { label: 'AVG', value: avgV, unit: cfg.unit, color: T.accent },
            { label: 'EVENTS', value: events, unit: 'alerts', color: events > 0 ? T.warn : T.good },
          ].map(s => (
            <View key={s.label} style={styles.statBox}>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statUnit}>{s.unit}</Text>
            </View>
          ))}
        </View>

        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>
            Recent Readings <Text style={styles.sectionCount}>{recent.length}</Text>
          </Text>
          <View style={styles.recentList}>
            {recent.map((r, i) => {
              const st = vitalStatus(vkey, r.v);
              const c = st === 'normal' ? T.text : st === 'critical' ? T.bad : T.warn;
              return (
                <View key={i} style={[styles.recentRow, i === 0 && { borderTopWidth: 0 }]}>
                  <Text style={styles.recentTime}>{r.label}</Text>
                  <Text style={[styles.recentVal, { color: c }]}>{r.v}</Text>
                  <Text style={styles.recentUnit}>{cfg.unit}</Text>
                  {st !== 'normal' && (
                    <View style={{ marginLeft: 8 }}>
                      <PriorityBadge severity={st === 'critical' ? 'critical' : 'medium'} size="sm"/>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0D1117',
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
  headerSub: {
    fontSize: 11,
    color: T.textDim,
    marginTop: 1,
  },
  currentValBox: {
    alignItems: 'flex-end',
  },
  currentValue: {
    fontSize: 28,
    fontWeight: '800',
    fontFamily: 'JetBrains Mono',
    lineHeight: 30,
  },
  unitText: {
    fontSize: 11,
    color: T.textDim,
  },
  rangeBar: {
    flexDirection: 'row',
    gap: 3,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.borderSoft,
  },
  rangeBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rangeBtnActive: {
    backgroundColor: T.accent,
  },
  rangeBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: T.textDim,
    fontFamily: 'JetBrains Mono',
  },
  rangeBtnTextActive: {
    color: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    paddingBottom: 40,
    gap: 12,
  },
  chartCard: {
    backgroundColor: '#0B0F15',
    borderWidth: 1,
    borderColor: T.borderSoft,
    borderRadius: 14,
    padding: 12,
    paddingTop: 8,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingBottom: 6,
  },
  chartLegend: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 10,
    paddingHorizontal: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendLine: {
    width: 14,
    height: 2,
    borderRadius: 1,
  },
  legendLineDashed: {
    width: 14,
    height: 0,
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(16,185,129,0.5)',
    borderStyle: 'dashed',
  },
  legendText: {
    fontSize: 10,
    color: T.textFaint,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.borderSoft,
    borderRadius: 11,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: T.textFaint,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'JetBrains Mono',
    lineHeight: 22,
    marginTop: 4,
  },
  statUnit: {
    fontSize: 9,
    color: T.textFaint,
    marginTop: 2,
  },
  recentSection: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: T.textDim,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  sectionCount: {
    color: T.textFaint,
    fontFamily: 'JetBrains Mono',
    fontSize: 10,
  },
  recentList: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.borderSoft,
    borderRadius: 12,
    overflow: 'hidden',
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderTopColor: T.borderSoft,
  },
  recentTime: {
    flex: 1,
    fontSize: 11.5,
    color: T.textFaint,
    fontFamily: 'JetBrains Mono',
  },
  recentVal: {
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'JetBrains Mono',
  },
  recentUnit: {
    fontSize: 11,
    color: T.textDim,
    marginLeft: 4,
  },
});
