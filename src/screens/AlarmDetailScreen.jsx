import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { T } from '../theme/tokens';
import { SEV, patientById, WARDS, RANGES, alarmTrendSeries, initials, nameColor } from '../data/mockData';
import {
  Avatar,
  Btn,
} from '../components/Shared';
import {
  VitalsLineChart,
  BedChip,
} from '../components/Clinical';
import {
  IconAlert,
  IconClose,
  IconClock,
  IconArrowUp,
  IconArrowDown,
  IconUser,
  IconEdit,
  IconCheck,
} from '../components/Icons';

const PARAM_NAMES = {
  HR:   { full: 'Heart Rate', vkey: 'hr' },
  SpO2: { full: 'Oxygen Saturation', vkey: 'spo2' },
  RR:   { full: 'Respiratory Rate', vkey: 'rr' },
  NIBP: { full: 'Blood Pressure', vkey: 'nibp' },
  TEMP: { full: 'Temperature', vkey: 'temp' },
};

export const AlarmDetailScreen = ({ alarm, onClose, onViewPatient, onWriteInstruction, onAcknowledge, showToast }) => {
  const s = SEV[alarm.severity];
  const p = patientById(alarm.patientId);
  const ward = WARDS.find(w => w.id === p.wardId);
  const meta = PARAM_NAMES[alarm.param] || { full: alarm.param };
  const series = useMemo(() => alarmTrendSeries(alarm), [alarm.id]);
  const r = RANGES[meta.vkey] || {};
  const up = alarm.dir === 'up';

  return (
    <View style={styles.overlay}>
      <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.backdrop} />
      <View style={[styles.sheet, { borderTopColor: s.color + '55' }]}>
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        <View style={styles.mainLayout}>
          {/* Left Side: Info & Violation */}
          <View style={styles.leftCol}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.leftScroll}>
              <View style={styles.header}>
                <View style={{ flex: 1 }}>
                  <View style={[styles.severityBadge, { backgroundColor: s.soft, borderColor: s.color + '44' }]}>
                    <IconAlert size={16} color={s.color} />
                    <Text style={[styles.severityText, { color: s.color }]}>{s.label}</Text>
                  </View>
                  <View style={styles.patientRow}>
                    <Avatar initials={initials(p.name)} color={nameColor(p.name)} size={34} />
                    <View>
                      <Text style={styles.patientName}>{p.name}</Text>
                      <Text style={styles.patientMeta}>{p.bed} · {ward?.name}</Text>
                    </View>
                  </View>
                </View>
              </View>
              
              <View style={styles.timeRow}>
                <IconClock size={13} color={T.textFaint} />
                <Text style={styles.timeText}>Raised {alarm.raisedMin} minute{alarm.raisedMin === 1 ? '' : 's'} ago</Text>
              </View>

              <View style={[styles.violationCard, { borderColor: s.color + '33' }]}>
                <Text style={styles.paramLabel}>{meta.full}</Text>
                <View style={styles.valueRow}>
                  <Text style={[styles.valueText, { color: s.color }]}>{alarm.value}</Text>
                  <Text style={[styles.unitText, { color: s.color }]}>{alarm.unit}</Text>
                </View>
                <View style={styles.rangeRow}>
                  <Text style={styles.rangeNormal}>{alarm.normal}</Text>
                  <View style={styles.deviationBadge}>
                    {up ? <IconArrowUp size={14} color={s.color} /> : <IconArrowDown size={14} color={s.color} />}
                    <Text style={[styles.deviationText, { color: s.color }]}>{alarm.deviation}</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>

          {/* Right Side: Chart & Actions */}
          <View style={styles.rightCol}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtnOverlay}>
              <IconClose size={17} color={T.textDim} />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.rightScroll}>
              <View style={styles.historySection}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyTitle}>Last 30 min</Text>
                  <View style={styles.historyLegend}>
                    <View style={[styles.legendDot, { backgroundColor: s.color }]} />
                    <Text style={[styles.legendText, { color: s.color }]}>alarm window</Text>
                  </View>
                </View>
                <View style={styles.chartWrapper}>
                  <VitalsLineChart series={series} color={s.color} normalLow={r.low} normalHigh={r.high} height={80} />
                  <View style={styles.chartLabels}>
                    <Text style={styles.chartLabel}>−30m</Text>
                    <Text style={[styles.chartLabel, { color: s.color }]}>now</Text>
                  </View>
                </View>
              </View>

              <View style={styles.actions}>
                <Btn full size="lg" icon={<IconCheck size={18} color="#fff" />} onClick={() => { showToast('Alarm acknowledged', 'good'); onAcknowledge(alarm); }}>
                  Acknowledge
                </Btn>
                <View style={styles.actionRow}>
                  <Btn variant="ghost" style={{ flex: 1 }} icon={<IconUser size={16} color={T.text} />} onClick={() => onViewPatient(p)}>
                    Patient
                  </Btn>
                  <Btn variant="ghost" style={{ flex: 1 }} icon={<IconEdit size={15} color={T.text} />} onClick={() => onWriteInstruction(p)}>
                    Instruction
                  </Btn>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 42,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    backgroundColor: T.bg,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderTopWidth: 1,
    height: '92%',
  },
  handleContainer: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: T.border,
  },
  mainLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  leftCol: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: T.borderSoft,
  },
  rightCol: {
    flex: 1.1,
    position: 'relative',
  },
  leftScroll: {
    padding: 16,
    gap: 12,
  },
  rightScroll: {
    padding: 16,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  severityBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  severityText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
    fontFamily: 'JetBrains Mono',
  },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: T.text,
  },
  patientMeta: {
    fontSize: 11.5,
    color: T.textDim,
  },
  closeBtnOverlay: {
    position: 'absolute',
    top: 0,
    right: 14,
    zIndex: 20,
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: T.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 11,
    color: T.textFaint,
    fontFamily: 'JetBrains Mono',
  },
  violationCard: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  paramLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: T.textDim,
    textTransform: 'uppercase',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginVertical: 4,
  },
  valueText: {
    fontSize: 44,
    fontWeight: '800',
    fontFamily: 'JetBrains Mono',
    letterSpacing: -1,
  },
  unitText: {
    fontSize: 14,
    opacity: 0.8,
  },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rangeNormal: {
    fontSize: 11,
    color: T.textDim,
    fontFamily: 'JetBrains Mono',
  },
  deviationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  deviationText: {
    fontSize: 11,
    fontWeight: '700',
  },
  historySection: {
    gap: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyTitle: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: T.textDim,
    textTransform: 'uppercase',
  },
  historyLegend: {
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
    fontFamily: 'JetBrains Mono',
  },
  chartWrapper: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.borderSoft,
    borderRadius: 12,
    padding: 10,
    paddingBottom: 4,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  chartLabel: {
    fontSize: 9,
    color: T.textFaint,
    fontFamily: 'JetBrains Mono',
  },
  actions: {
    gap: 8,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
});
