import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { T } from '../theme/tokens';
import { WARDS, RANGES, ALARM_TREND, vitalStatus } from '../data/mockData';
import {
  LiveDot,
  BedChip,
  VitalCard,
  AlarmTrendChart,
} from '../components/Clinical';
import {
  IconBack,
  IconAlert,
  IconChart,
  IconChevron,
  IconClipboard,
  IconShare,
} from '../components/Icons';
import { WaveformView } from '../components/WaveformView';

export const MonitoringScreen = ({ patient, fromAlarm, onBack, onInstructions, speed = 1 }) => {
  const p = patient;
  const ward = WARDS.find(w => w.id === p.wardId);
  const base = p.vitals;
  const [live, setLive] = useState(base);
  const [range, setRange] = useState('6s');
  const [showTrend, setShowTrend] = useState(false);

  useEffect(() => {
    const j = (v, amt, lo, hi) => Math.max(lo, Math.min(hi, +(v + (Math.random() - 0.5) * amt).toFixed(v < 50 ? 1 : 0)));
    const id = setInterval(() => {
      setLive({
        hr: Math.round(j(base.hr, 4, 30, 180)),
        spo2: Math.round(j(base.spo2, 1.6, 80, 100)),
        rr: Math.round(j(base.rr, 2, 8, 40)),
        nibpSys: Math.round(j(base.nibpSys, 3, 70, 200)),
        nibpDia: Math.round(j(base.nibpDia, 2, 40, 120)),
        temp: +j(base.temp, 0.2, 34, 41).toFixed(1),
        etco2: Math.round(j(base.etco2, 2, 20, 55)),
      });
    }, 1400);
    return () => clearInterval(id);
  }, [p.id]);

  const cards = [
    { label: 'Heart Rate', value: live.hr, unit: 'bpm', status: vitalStatus('hr', live.hr), range: RANGES.hr.full },
    { label: 'SpO₂', value: live.spo2, unit: '%', status: vitalStatus('spo2', live.spo2), range: RANGES.spo2.full },
    { label: 'Resp Rate', value: live.rr, unit: 'brpm', status: vitalStatus('rr', live.rr), range: RANGES.rr.full },
    { label: 'NIBP', value: `${live.nibpSys}/${live.nibpDia}`, unit: 'mmHg', status: live.nibpSys > 140 ? 'medium' : 'normal', range: RANGES.nibp.full },
    { label: 'Temp', value: live.temp, unit: '°C', status: vitalStatus('temp', live.temp), range: RANGES.temp.full },
    { label: 'EtCO₂', value: live.etco2, unit: 'mmHg', status: 'normal', range: 'Normal 35–45' },
  ];

  return (
    <View style={styles.container}>
      {/* Patient header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <IconBack size={19} color={T.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <View style={styles.patientRow}>
              <Text style={styles.patientName} numberOfLines={1}>{p.name}</Text>
              <BedChip>{p.bed}</BedChip>
            </View>
            <Text style={styles.wardInfo}>{ward?.name} · {ward?.type}</Text>
          </View>
          {fromAlarm ? (
            <View style={[styles.statusBadge, { backgroundColor: T.badSoft, borderColor: T.bad + '44' }]}>
              <Text style={[styles.statusBadgeText, { color: T.bad }]}>FROM ALARM</Text>
            </View>
          ) : (
            <View style={[styles.statusBadge, { backgroundColor: 'rgba(16,185,129,.12)' }]}>
              <LiveDot status="stable" size={7} />
              <Text style={[styles.statusBadgeText, { color: T.good, marginLeft: 6 }]}>LIVE</Text>
            </View>
          )}
        </View>
        {fromAlarm && (
          <View style={[styles.alarmBar, { backgroundColor: T.badSoft, borderColor: T.bad + '33' }]}>
            <IconAlert size={15} color={T.bad} />
            <Text style={[styles.alarmText, { color: T.bad }]}>CRITICAL: {fromAlarm.desc}</Text>
          </View>
        )}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
        {/* Waveforms */}
        <View style={styles.waveforms}>
          <WaveformView type="ecg"  color="#22D38B" label="ECG · II" value={live.hr} unit="bpm" speed={speed} height={94} />
          <WaveformView type="spo2" color="#22D3EE" label="SpO₂ · Pleth" value={live.spo2} unit="%" speed={speed * 0.85} height={78} />
          <WaveformView type="resp" color="#60A5FA" label="RESP" value={live.rr} unit="brpm" speed={speed * 0.5} height={70} />
        </View>

        {/* Vital cards grid */}
        <View style={styles.vitalsGrid}>
          {cards.map((c, i) => (
            <View key={i} style={styles.gridItem}>
              <VitalCard {...c} big />
            </View>
          ))}
        </View>

        {/* Alarm trend */}
        <View style={styles.trendSection}>
          <TouchableOpacity onPress={() => setShowTrend(!showTrend)} style={styles.trendHeader}>
            <IconChart size={17} color={T.text} />
            <Text style={styles.trendTitle}>Alarm Trend · 24h</Text>
            <View style={{ flex: 1 }} />
            <View style={{ transform: [{ rotate: showTrend ? '90deg' : '0deg' }] }}>
              <IconChevron size={16} color={T.textDim} />
            </View>
          </TouchableOpacity>
          {showTrend && (
            <View style={styles.trendContent}>
              <AlarmTrendChart data={ALARM_TREND} />
              <View style={styles.legend}>
                {['critical', 'high', 'medium', 'low'].map(s => (
                  <View key={s} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: T[s] || (s === 'high' ? '#F97316' : s === 'medium' ? '#EAB308' : T.bad) }]} />
                    <Text style={styles.legendText}>{s}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom controls */}
      <View style={styles.footer}>
        <View style={styles.rangeBar}>
          {['6s', '30s', '1m', '5m'].map(r => (
            <TouchableOpacity 
              key={r} 
              onPress={() => setRange(r)} 
              style={[styles.rangeBtn, range === r && styles.rangeBtnActive]}
            >
              <Text style={[styles.rangeBtnText, range === r && styles.rangeBtnTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.actionRow}>
          <CtrlBtn icon={<IconChart size={17} />} label="Trend" onClick={() => setShowTrend(!showTrend)} active={showTrend} />
          <CtrlBtn icon={<IconClipboard size={17} />} label="Instructions" onClick={onInstructions} />
          <CtrlBtn icon={<IconShare size={17} />} label="Share" />
        </View>
      </View>
    </View>
  );
};

const CtrlBtn = ({ icon, label, onClick, active }) => (
  <TouchableOpacity 
    onPress={onClick} 
    style={[
      styles.ctrlBtn, 
      active && { borderColor: T.accent, backgroundColor: T.accentSoft }
    ]}
  >
    {React.cloneElement(icon, { color: active ? T.accent : T.text })}
    <Text style={[styles.ctrlBtnLabel, { color: active ? T.accent : T.text }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
  },
  header: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: T.borderSoft,
    gap: 8,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  patientName: {
    fontSize: 15,
    fontWeight: '700',
    color: T.text,
    letterSpacing: -0.1,
  },
  wardInfo: {
    fontSize: 11,
    color: T.textDim,
    marginTop: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    fontFamily: 'JetBrains Mono',
  },
  alarmBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 9,
    borderWidth: 1,
  },
  alarmText: {
    fontSize: 12,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 30,
    gap: 10,
  },
  waveforms: {
    gap: 10,
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  gridItem: {
    width: '48.5%',
  },
  trendSection: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.borderSoft,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 4,
  },
  trendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    padding: 14,
  },
  trendTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: T.text,
  },
  trendContent: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  legend: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 10,
    color: T.textDim,
    textTransform: 'capitalize',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: T.borderSoft,
    backgroundColor: '#0D1117',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    gap: 9,
  },
  rangeBar: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: T.surface,
    borderRadius: 10,
    padding: 3,
  },
  rangeBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
  },
  rangeBtnActive: {
    backgroundColor: T.accent,
  },
  rangeBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: T.textDim,
    fontFamily: 'JetBrains Mono',
  },
  rangeBtnTextActive: {
    color: '#fff',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  ctrlBtn: {
    flex: 1,
    height: 44,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: T.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  ctrlBtnLabel: {
    fontSize: 12.5,
    fontWeight: '600',
  },
});
