import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import Svg, { Path, Circle, Rect, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { T } from '../theme/tokens';
import { SEV, PSTATUS, initials, nameColor, patientsInWard, WARDS } from '../data/mockData';
import { Avatar, IconBtn } from './Shared';
import { IconChevron, IconDoor, IconCheck } from './Icons';

// ─── Priority badge ──────────────────────────────────────────
export const PriorityBadge = ({ severity, size = 'md' }) => {
  const s = SEV[severity] || SEV.low;
  const fs = size === 'sm' ? 9.5 : 10.5;
  const paddingVertical = size === 'sm' ? 2 : 3;
  const paddingHorizontal = size === 'sm' ? 6 : 8;

  return (
    <View style={[
      styles.priorityBadge,
      { backgroundColor: s.soft, paddingVertical, paddingHorizontal }
    ]}>
      <View style={[styles.priorityDot, { backgroundColor: s.color }]} />
      <Text style={[styles.priorityText, { color: s.color, fontSize: fs }]}>{s.label}</Text>
    </View>
  );
};

// ─── Live status dot (pulsing) ───────────────────────────────
export const LiveDot = ({ status = 'stable', size = 9, pulse = true }) => {
  const c = (PSTATUS[status] || PSTATUS.stable).color;
  const [scale] = useState(new Animated.Value(1));

  React.useEffect(() => {
    if (pulse) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, { toValue: 2.6, duration: 1600, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: 0, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [pulse]);

  return (
    <View style={{ width: size, height: size }}>
      {pulse && (
        <Animated.View style={[
          styles.liveDotPulse,
          { backgroundColor: c, width: size, height: size, borderRadius: size / 2, transform: [{ scale }] }
        ]} />
      )}
      <View style={[
        styles.liveDotSolid,
        { backgroundColor: c, width: size, height: size, borderRadius: size / 2, shadowColor: c }
      ]} />
    </View>
  );
};

// ─── Bed chip (monospace) ────────────────────────────────────
export const BedChip = ({ children, tone }) => {
  return (
    <View style={[
      styles.bedChip,
      { backgroundColor: tone || 'rgba(0,0,0,.05)' }
    ]}>
      <Text style={styles.bedChipText}>{children}</Text>
    </View>
  );
};

// ─── Ward-type chip ──────────────────────────────────────────
export const WardTypeChip = ({ type }) => {
  const map = {
    ICU:     { c: '#EF4444', bg: 'rgba(239,68,68,.12)' },
    CCU:     { c: '#EC4899', bg: 'rgba(236,72,153,.12)' },
    GENERAL: { c: '#3B82F6', bg: 'rgba(59,130,246,.12)' },
  };
  const m = map[type] || map.GENERAL;
  return (
    <View style={[styles.wardTypeChip, { backgroundColor: m.bg }]}>
      <Text style={[styles.wardTypeChipText, { color: m.c }]}>{type}</Text>
    </View>
  );
};

// ─── Alarm card ──────────────────────────────────────────────
export const AlarmCard = ({ alarm, onClick, patient }) => {
  const s = SEV[alarm.severity] || SEV.low;
  const p = patient;
  if (!p) return null;
  const critical = alarm.severity === 'critical';
  const ward = (WARDS || []).find(w => w.id === p.wardId);

  return (
    <TouchableOpacity onPress={onClick} style={styles.alarmCard}>
      <View style={[styles.alarmAccent, { backgroundColor: s.color }]} />
      <View style={styles.alarmContent}>
        <View style={styles.alarmHeader}>
          <View style={{ flex: 1 }}>
            <View style={styles.alarmPatientRow}>
              <Text style={styles.alarmPatientName} numberOfLines={1}>{p.name}</Text>
              <BedChip>{p.bed}</BedChip>
            </View>
            <Text style={styles.alarmPatientSub} numberOfLines={1}>
              {ward?.name} · {p.dx?.split('·')[0].trim()}
            </Text>
          </View>
          <PriorityBadge severity={alarm.severity} size="sm" />
        </View>
        
        <View style={styles.alarmFooter}>
          <View style={[styles.alarmValueBadge, { backgroundColor: s.soft, borderColor: s.color + '33' }]}>
            <Text style={[styles.alarmParam, { color: s.color }]}>{alarm.param}</Text>
            <Text style={[styles.alarmValue, { color: s.color }]}>{alarm.value}</Text>
            <Text style={[styles.alarmUnit, { color: s.color }]}>{alarm.unit}</Text>
          </View>
          <Text style={styles.alarmTime}>{alarm.raisedMin}m ago</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ─── Patient row ─────────────────────────────────────────────
export const PatientRow = ({ patient, onClick }) => {
  const p = patient;
  if (!p) return null;
  return (
    <TouchableOpacity onPress={onClick} style={styles.patientRow}>
      <Avatar initials={typeof initials === 'function' ? initials(p.name) : ''} color={typeof nameColor === 'function' ? nameColor(p.name) : '#ccc'} size={38} />
      <View style={{ flex: 1 }}>
        <View style={styles.patientRowHeader}>
          <Text style={styles.patientName} numberOfLines={1}>{p.name}</Text>
          <Text style={styles.patientMeta}>{p.age}{p.gender}</Text>
        </View>
        <Text style={styles.patientDx} numberOfLines={1}>{p.dx}</Text>
      </View>
      <View style={styles.patientRowEnd}>
        <BedChip>{p.bed}</BedChip>
        <LiveDot status={p.status} size={8} pulse={p.status !== 'stable'} />
      </View>
    </TouchableOpacity>
  );
};

// ─── Ward accordion ──────────────────────────────────────────
export const WardAccordion = ({ ward, patients, defaultOpen = true, onPatient }) => {
  const [open, setOpen] = useState(defaultOpen);
  const crit = patients.filter(p => p.status === 'critical').length;

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity onPress={() => setOpen(!open)} style={styles.accordionHeader}>
        <IconDoor size={18} color={T.text} />
        <Text style={styles.accordionTitle}>{ward.name}</Text>
        <WardTypeChip type={ward.type} />
        <View style={{ flex: 1 }} />
        {crit > 0 && (
          <View style={[styles.critBadge, { backgroundColor: SEV.critical.soft }]}>
            <Text style={styles.critBadgeText}>{crit} CRIT</Text>
          </View>
        )}
        <Text style={styles.patientCount}>{patients.length}</Text>
        <View style={{ transform: [{ rotate: open ? '90deg' : '0deg' }] }}>
          <IconChevron size={16} color={T.textDim} />
        </View>
      </TouchableOpacity>
      {open && (
        <View style={styles.accordionContent}>
          {patients.map(p => (
            <PatientRow key={p.id} patient={p} onClick={() => onPatient(p)} />
          ))}
        </View>
      )}
    </View>
  );
};

// ─── Vital card ──────────────────────────────────────────────
export const VitalCard = ({ vkey, label, value, unit, status = 'normal', range, big = false }) => {
  const s = SEV[status] || SEV.normal;
  return (
    <View style={[
      styles.vitalCard,
      { backgroundColor: status === 'normal' ? T.surface : s.soft, borderColor: status === 'normal' ? T.borderSoft : s.color + '44' },
      big && styles.vitalCardBig
    ]}>
      {status !== 'normal' && (
        <View style={[styles.vitalAccent, { backgroundColor: s.color }]} />
      )}
      <Text style={styles.vitalLabel} numberOfLines={1}>{label}</Text>
      <View style={styles.vitalValueRow}>
        <Text style={[
          styles.vitalValue,
          { color: status === 'normal' ? T.text : s.color },
          big && styles.vitalValueBig
        ]}>{value}</Text>
        <Text style={[styles.vitalUnit, big && styles.vitalUnitBig]}>{unit}</Text>
      </View>
      {range && (
        <View style={styles.vitalRangeRow}>
          <View style={[styles.vitalRangeDot, { backgroundColor: s.color }]} />
          <Text style={styles.vitalRangeText} numberOfLines={1}>{range}</Text>
        </View>
      )}
    </View>
  );
};

// ─── Instruction card ────────────────────────────────────────
export const InstructionCard = ({ ins, onClick }) => {
  const active = ins.status === 'ACTIVE';
  return (
    <TouchableOpacity onPress={onClick} disabled={!onClick} style={styles.insCard}>
      <View style={styles.insHeader}>
        <Text style={styles.insTime}>{ins.ts}</Text>
        <View style={[
          styles.insStatus,
          { backgroundColor: active ? T.accentSoft : 'rgba(16,185,129,.12)' }
        ]}>
          <Text style={[styles.insStatusText, { color: active ? T.accent : T.good }]}>{ins.status}</Text>
        </View>
      </View>
      <Text style={styles.insText}>{ins.text}</Text>
      <View style={styles.insFooter}>
        <View style={styles.insCatBadge}>
          <Text style={styles.insCatText}>{ins.cat}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ─── Alarm trend bar chart (24h, by severity) ────────────────
export const AlarmTrendChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.critical + d.high + d.medium + d.low), 1);
  return (
    <View>
      <View style={styles.trendBarsContainer}>
        {data.map((d, i) => {
          const total = d.critical + d.high + d.medium + d.low;
          return (
            <View key={i} style={styles.trendBarStack}>
              {['critical', 'high', 'medium', 'low'].map(sv => (
                d[sv] > 0 && (
                  <View 
                    key={sv} 
                    style={[
                      styles.trendBarSegment, 
                      { height: `${(d[sv] / max) * 100}%`, backgroundColor: SEV[sv].color }
                    ]} 
                  />
                )
              ))}
            </View>
          );
        })}
      </View>
      <View style={styles.trendLabels}>
        <Text style={styles.trendLabel}>00:00</Text>
        <Text style={styles.trendLabel}>06:00</Text>
        <Text style={styles.trendLabel}>12:00</Text>
        <Text style={styles.trendLabel}>18:00</Text>
        <Text style={styles.trendLabel}>24h</Text>
      </View>
    </View>
  );
};

// ─── Mini vitals trend line (alarm detail) ───────────────────
export const VitalsLineChart = ({ series, color, normalLow, normalHigh, height = 96 }) => {
  const W = 320, H = height, pad = 6;
  const min = Math.min(...series, normalLow ?? Infinity);
  const max = Math.max(...series, normalHigh ?? -Infinity);
  const range = (max - min) || 1;
  const x = i => pad + (i / (series.length - 1)) * (W - pad * 2);
  const y = v => pad + (1 - (v - min) / range) * (H - pad * 2);
  const path = series.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const area = `${path} L${x(series.length - 1)} ${H - pad} L${x(0)} ${H - pad} Z`;

  return (
    <Svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none">
      <Defs>
        <LinearGradient id="vlc" x1="0" x2="0" y1="0" y2="1">
          <Stop offset="0%" stopColor={color} stopOpacity="0.26" />
          <Stop offset="100%" stopColor={color} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      {normalHigh != null && (
        <Path d={`M0 ${y(normalHigh)} L${W} ${y(normalHigh)}`} stroke="rgba(0,0,0,.1)" strokeWidth="1" strokeDasharray="3,3" />
      )}
      {normalLow != null && (
        <Path d={`M0 ${y(normalLow)} L${W} ${y(normalLow)}`} stroke="rgba(0,0,0,.1)" strokeWidth="1" strokeDasharray="3,3" />
      )}
      <Path d={area} fill="url(#vlc)" />
      <Path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <Circle cx={x(series.length - 1)} cy={y(series[series.length - 1])} r="3.5" fill={color} />
    </Svg>
  );
};

const styles = StyleSheet.create({
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 6,
  },
  priorityDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  priorityText: {
    fontWeight: '700',
    letterSpacing: 0.7,
    fontFamily: 'JetBrains Mono',
  },
  liveDotPulse: {
    position: 'absolute',
    opacity: 0.55,
  },
  liveDotSolid: {
    position: 'absolute',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  bedChip: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 6,
  },
  bedChipText: {
    color: T.textDim,
    fontSize: 10.5,
    fontWeight: '600',
    letterSpacing: 0.4,
    fontFamily: 'JetBrains Mono',
  },
  wardTypeChip: {
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 5,
  },
  wardTypeChipText: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.7,
    fontFamily: 'JetBrains Mono',
  },
  alarmCard: {
    flexDirection: 'row',
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.borderSoft,
    borderRadius: 12,
    overflow: 'hidden',
  },
  alarmAccent: {
    width: 4,
  },
  alarmContent: {
    flex: 1,
    padding: 12,
  },
  alarmHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  alarmPatientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  alarmPatientName: {
    fontSize: 14,
    fontWeight: '700',
    color: T.text,
    letterSpacing: -0.1,
  },
  alarmPatientSub: {
    fontSize: 11,
    color: T.textDim,
    marginTop: 3,
  },
  alarmFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  alarmValueBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  alarmParam: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.6,
    fontFamily: 'JetBrains Mono',
  },
  alarmValue: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'JetBrains Mono',
  },
  alarmUnit: {
    fontSize: 10,
    opacity: 0.8,
  },
  alarmTime: {
    fontSize: 11,
    color: T.textFaint,
    fontFamily: 'JetBrains Mono',
  },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    borderTopWidth: 1,
    borderTopColor: T.borderSoft,
    paddingVertical: 11,
    paddingHorizontal: 4,
  },
  patientRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  patientName: {
    fontSize: 13.5,
    fontWeight: '600',
    color: T.text,
  },
  patientMeta: {
    fontSize: 11,
    color: T.textFaint,
    fontFamily: 'JetBrains Mono',
  },
  patientDx: {
    fontSize: 11,
    color: T.textDim,
    marginTop: 2,
  },
  patientRowEnd: {
    alignItems: 'flex-end',
    gap: 6,
  },
  accordionContainer: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.borderSoft,
    borderRadius: 14,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
  },
  accordionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: T.text,
  },
  critBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 5,
  },
  critBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: SEV.critical.color,
    fontFamily: 'JetBrains Mono',
  },
  patientCount: {
    fontSize: 12,
    color: T.textDim,
    fontFamily: 'JetBrains Mono',
  },
  accordionContent: {
    paddingHorizontal: 14,
    paddingBottom: 8,
  },
  vitalCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 11,
    gap: 4,
    minWidth: 0,
    position: 'relative',
    overflow: 'hidden',
  },
  vitalCardBig: {
    padding: 14,
    gap: 6,
  },
  vitalAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.8,
  },
  vitalLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    color: T.textDim,
  },
  vitalValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  vitalValue: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: 'JetBrains Mono',
    letterSpacing: -0.2,
  },
  vitalValueBig: {
    fontSize: 34,
  },
  vitalUnit: {
    fontSize: 11.5,
    color: T.textDim,
    fontWeight: '500',
  },
  vitalUnitBig: {
    fontSize: 13,
  },
  vitalRangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 1,
  },
  vitalRangeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  vitalRangeText: {
    fontSize: 9.5,
    color: T.textFaint,
    fontFamily: 'JetBrains Mono',
  },
  insCard: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.borderSoft,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 13,
    gap: 6,
  },
  insHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 2,
  },
  insTime: {
    fontSize: 10.5,
    color: T.textFaint,
    fontFamily: 'JetBrains Mono',
  },
  insStatus: {
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 5,
  },
  insStatusText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
    fontFamily: 'JetBrains Mono',
  },
  insText: {
    fontSize: 13,
    color: T.text,
    lineHeight: 18,
  },
  insFooter: {
    marginTop: 2,
  },
  insCatBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: T.border,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 5,
  },
  insCatText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: T.textDim,
    fontFamily: 'JetBrains Mono',
  },
  trendBarsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 110,
    paddingVertical: 4,
  },
  trendBarStack: {
    flex: 1,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    gap: 1,
  },
  trendBarSegment: {
    width: '100%',
    borderRadius: 1,
    opacity: 0.9,
  },
  trendLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  trendLabel: {
    fontSize: 9,
    color: T.textFaint,
    fontFamily: 'JetBrains Mono',
  },
});
