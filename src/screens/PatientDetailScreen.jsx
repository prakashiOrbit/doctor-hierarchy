import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { T } from '../theme/tokens';
import { SEV, PSTATUS, WARDS, RANGES, initials, nameColor, vitalStatus } from '../data/mockData';
import {
  Avatar,
  IconBtn,
  Btn,
} from '../components/Shared';
import {
  LiveDot,
  BedChip,
  WardTypeChip,
  VitalCard,
  InstructionCard,
} from '../components/Clinical';
import {
  IconClose,
  IconDots,
  IconActivity,
  IconPhone,
  IconClipboard,
  IconPlus,
} from '../components/Icons';

export const PatientDetailScreen = ({ patient, onClose, onMonitor, onWriteInstruction }) => {
  const p = patient;
  const [tab, setTab] = useState('overview');
  const ward = WARDS.find(w => w.id === p.wardId);
  const v = p.vitals;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'history', label: 'History' },
    { id: 'instructions', label: 'Instructions' },
  ];

  return (
    <View style={styles.container}>
      {/* Header controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={onClose} style={styles.controlBtn}>
          <IconClose size={18} color={T.text} />
        </TouchableOpacity>
        <View style={styles.grabber} />
        <TouchableOpacity style={styles.controlBtn}>
          <IconDots size={18} color={T.textDim} />
        </TouchableOpacity>
      </View>

      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.headerMain}>
          <View style={styles.avatarWrapper}>
            <Avatar initials={initials(p.name)} color={nameColor(p.name)} size={56} />
            <View style={styles.liveDotOverlay}>
              <LiveDot status={p.status} size={10} pulse={p.status !== 'stable'} />
            </View>
          </View>
          <View style={styles.headerInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{p.name}</Text>
              <BedChip>{p.mrn}</BedChip>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>{p.age} yrs · {p.gender === 'F' ? 'Female' : 'Male'} · <Text style={styles.bloodText}>{p.blood}</Text></Text>
            </View>
          </View>
        </View>
        
        <View style={styles.headerRight}>
          <View style={styles.wardRow}>
            <BedChip tone={T.surface2}>{p.bed}</BedChip>
            <WardTypeChip type={ward.type} />
            <Text style={styles.wardName}>{ward.name}</Text>
          </View>
          <View style={styles.admissionStrip}>
            <Text style={styles.admissionText}>
              Admitted <Text style={{ color: T.text }}>{p.admitted}</Text>
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.dxStrip}>
         <Text style={styles.admissionText}>{p.dx}</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {tabs.map(tb => (
          <TouchableOpacity 
            key={tb.id} 
            onPress={() => setTab(tb.id)} 
            style={[styles.tab, tab === tb.id && styles.activeTab]}
          >
            <Text style={[styles.tabLabel, tab === tb.id && styles.activeTabLabel]}>{tb.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {tab === 'overview' && <OverviewTab p={p} v={v} onMonitor={onMonitor} />}
        {tab === 'history' && <HistoryTab p={p} />}
        {tab === 'instructions' && <InstructionsTab p={p} onWrite={onWriteInstruction} />}
      </ScrollView>
    </View>
  );
};

const OverviewTab = ({ p, v, onMonitor }) => {
  const cards = [
    { k: 'hr', label: 'Heart Rate', value: v.hr, unit: 'bpm', status: vitalStatus('hr', v.hr), range: RANGES.hr.full },
    { k: 'spo2', label: 'SpO₂', value: v.spo2, unit: '%', status: vitalStatus('spo2', v.spo2), range: RANGES.spo2.full },
    { k: 'rr', label: 'Resp Rate', value: v.rr, unit: 'brpm', status: vitalStatus('rr', v.rr), range: RANGES.rr.full },
    { k: 'nibp', label: 'NIBP', value: `${v.nibpSys}/${v.nibpDia}`, unit: 'mmHg', status: v.nibpSys > 140 ? 'medium' : 'normal', range: RANGES.nibp.full },
    { k: 'temp', label: 'Temp', value: v.temp, unit: '°C', status: vitalStatus('temp', v.temp), range: RANGES.temp.full },
  ];
  const stat = PSTATUS[p.status];

  return (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.subLabel}>Vital Signs</Text>
        <View style={styles.vitalsGrid}>
          {cards.map(c => <VitalCard key={c.k} {...c} />)}
          <View style={[styles.statusCard, { borderColor: stat.color + '44' }]}>
            <Text style={styles.vitalLabel}>Status</Text>
            <View style={styles.statusRow}>
              <LiveDot status={p.status} size={9} pulse={p.status !== 'stable'} />
              <Text style={[styles.statusText, { color: stat.color }]}>{stat.label}</Text>
            </View>
          </View>
        </View>
      </View>

      <Btn 
        size="lg" 
        onClick={onMonitor} 
        icon={<IconActivity size={19} color="#fff" />}
        style={styles.monitorBtn}
      >
        View Live Monitoring
      </Btn>

      <View style={styles.section}>
        <Text style={styles.subLabel}>Care Team</Text>
        <View style={styles.teamCard}>
          <TeamGroup title="Doctors" people={p.doctors} role="Attending" />
          <View style={styles.divider} />
          <TeamGroup title="Nurses" people={p.nurses} role="Assigned" />
        </View>
      </View>
    </View>
  );
};

const TeamGroup = ({ title, people, role }) => (
  <View style={styles.teamGroup}>
    <Text style={styles.teamTitle}>{title.toUpperCase()}</Text>
    <View style={{ gap: 9 }}>
      {people.map(name => (
        <View key={name} style={styles.memberRow}>
          <Avatar initials={initials(name)} color={nameColor(name)} size={32} />
          <View style={{ flex: 1 }}>
            <Text style={styles.memberName}>{name}</Text>
            <Text style={styles.memberRole}>{role}</Text>
          </View>
          <IconPhone size={16} color={T.textDim} />
        </View>
      ))}
    </View>
  </View>
);

const HistoryTab = ({ p }) => {
  const kindColor = { Admission: T.accent, Procedure: '#8B5CF6', Diagnosis: T.warn, Note: T.textDim };
  return (
    <View style={styles.tabContent}>
      <Text style={styles.subLabel}>Medical History</Text>
      <View style={styles.timeline}>
        {[...p.history].reverse().map((h, i, arr) => (
          <View key={i} style={[styles.timelineItem, i === arr.length - 1 && { paddingBottom: 0 }]}>
            <View style={styles.timelineLeft}>
              <View style={[styles.timelineDot, { backgroundColor: kindColor[h.kind] || T.textDim }]} />
              {i < arr.length - 1 && <View style={styles.timelineLine} />}
            </View>
            <View style={styles.timelineRight}>
              <View style={styles.timelineHeader}>
                <Text style={[styles.timelineKind, { color: kindColor[h.kind] || T.textDim }]}>{h.kind.toUpperCase()}</Text>
                <Text style={styles.timelineDate}>{h.date}</Text>
              </View>
              <Text style={styles.timelineText}>{h.text}</Text>
              <Text style={styles.timelineBy}>— Dr. {h.by}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const InstructionsTab = ({ p, onWrite }) => (
  <View style={[styles.tabContent, { flex: 1 }]}>
    <Text style={styles.subLabel}>Instructions</Text>
    {p.instructions.length === 0 ? (
      <View style={styles.emptyState}>
        <IconClipboard size={32} color={T.textDim} />
        <Text style={styles.emptyTitle}>No instructions yet</Text>
        <Text style={styles.emptySub}>Write the first clinical instruction for this patient.</Text>
      </View>
    ) : (
      <View style={{ gap: 10 }}>
        {p.instructions.map(ins => <InstructionCard key={ins.id} ins={ins} />)}
      </View>
    )}
    <Btn 
      variant="primary" 
      size="lg" 
      onClick={onWrite} 
      icon={<IconPlus size={18} color="#fff" />}
      style={styles.writeBtn}
    >
      Write Instruction
    </Btn>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.bg,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
  },
  controlBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: T.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grabber: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: T.border,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 13,
  },
  headerMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  dxStrip: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  avatarWrapper: {
    position: 'relative',
  },
  liveDotOverlay: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: T.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 21,
    fontWeight: '700',
    color: T.text,
    letterSpacing: -0.1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  metaText: {
    fontSize: 12,
    color: T.textDim,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: T.textFaint,
  },
  bloodText: {
    color: T.bad,
    fontFamily: 'JetBrains Mono',
    fontWeight: '600',
  },
  wardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wardName: {
    fontSize: 11,
    color: T.textFaint,
  },
  admissionStrip: {
    paddingHorizontal: 0,
  },
  admissionText: {
    fontSize: 11.5,
    color: T.textDim,
    lineHeight: 16,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: T.borderSoft,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: T.accent,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: T.textDim,
  },
  activeTabLabel: {
    color: T.accent,
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 40,
  },
  tabContent: {
    gap: 16,
  },
  section: {
    gap: 10,
  },
  subLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: T.textDim,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: T.surface, // Reference had gradient, using surface for now
    borderWidth: 1,
    borderRadius: 12,
    padding: 11,
    justifyContent: 'center',
    gap: 6,
  },
  vitalLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    color: T.textDim,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
  },
  monitorBtn: {
    height: 50,
    shadowColor: T.accent,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 16,
    elevation: 4,
  },
  teamCard: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.borderSoft,
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  divider: {
    height: 1,
    backgroundColor: T.borderSoft,
  },
  teamGroup: {
    gap: 8,
  },
  teamTitle: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.7,
    color: T.textFaint,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  memberName: {
    fontSize: 13,
    fontWeight: '600',
    color: T.text,
  },
  memberRole: {
    fontSize: 11,
    color: T.textDim,
  },
  timeline: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 16,
  },
  timelineLeft: {
    alignItems: 'center',
  },
  timelineDot: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    borderWidth: 2,
    borderColor: T.bg,
    marginTop: 2,
  },
  timelineLine: {
    flex: 1,
    width: 1.5,
    backgroundColor: T.border,
    marginTop: 2,
  },
  timelineRight: {
    flex: 1,
    paddingBottom: 2,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  timelineKind: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontFamily: 'JetBrains Mono',
  },
  timelineDate: {
    fontSize: 10.5,
    color: T.textFaint,
    fontFamily: 'JetBrains Mono',
  },
  timelineText: {
    fontSize: 13,
    color: T.text,
    lineHeight: 18,
  },
  timelineBy: {
    fontSize: 11,
    color: T.textFaint,
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 28,
    paddingHorizontal: 16,
  },
  emptyTitle: {
    fontSize: 13.5,
    fontWeight: '600',
    color: T.text,
  },
  emptySub: {
    fontSize: 12,
    color: T.textDim,
    textAlign: 'center',
  },
  writeBtn: {
    marginTop: 16,
    shadowColor: T.accent,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 16,
    elevation: 4,
  },
});
