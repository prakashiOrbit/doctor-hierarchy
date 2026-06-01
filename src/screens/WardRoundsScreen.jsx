import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  LayoutAnimation,
} from 'react-native';
import { T } from '../theme/tokens';
import { 
  WARDS, 
  patientsInWard, 
  INITIAL_ROUNDS, 
  initials, 
  nameColor 
} from '../data/mockData';
import { Avatar, BedChip, WardTypeChip } from '../components/Clinical';
import { 
  IconBack, 
  IconCheck, 
  IconDoor, 
  IconClipboardList 
} from '../components/Icons';

export const WardRoundsScreen = ({ onBack, onPatient }) => {
  const [rounds, setRounds] = useState(() => INITIAL_ROUNDS.map(r => ({ ...r })));
  const [showEnd, setShowEnd] = useState(false);
  
  const checked = rounds.filter(r => r.checked).length;
  const total = rounds.length;
  const pct = total ? (checked / total) * 100 : 0;
  
  const toggle = (pid) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setRounds(rs => rs.map(r => r.patientId === pid ? { ...r, checked: !r.checked } : r));
  };
  
  const wardChecked = (wardId) => patientsInWard(wardId).every(p => rounds.find(r => r.patientId === p.id)?.checked);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <IconBack size={19} color={T.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Today's Rounds</Text>
            <Text style={styles.headerSub}>Monday, 1 Jun 2026</Text>
          </View>
          <Text style={styles.headerCounter}>{checked}/{total}</Text>
        </View>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${pct}%`, backgroundColor: pct === 100 ? T.good : T.accent }]} />
        </View>
        <Text style={styles.progressText}>{checked} of {total} patients reviewed</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {WARDS.map(w => {
          const pts = patientsInWard(w.id);
          const done = wardChecked(w.id);
          return (
            <View key={w.id} style={[styles.wardCard, done && { borderColor: T.good + '55' }]}>
              <View style={[styles.wardHeader, done && { backgroundColor: T.good + '0A' }]}>
                <IconDoor size={17} color={done ? T.good : T.textDim} />
                <Text style={styles.wardName}>{w.name}</Text>
                <WardTypeChip type={w.type} />
                <View style={{ flex: 1 }} />
                {done && (
                  <View style={styles.reviewedBadge}>
                    <IconCheck size={11} stroke={2.5} color={T.good} />
                    <Text style={styles.reviewedText}>Reviewed</Text>
                  </View>
                )}
              </View>
              <View style={styles.patientList}>
                {pts.map((p, i) => {
                  const item = rounds.find(r => r.patientId === p.id);
                  const prioColor = item?.priority === 'urgent' ? T.bad : item?.priority === 'routine' ? T.warn : T.good;
                  return (
                    <View key={p.id} style={[styles.patientRow, i > 0 && styles.rowBorder, item?.checked && { backgroundColor: T.good + '06' }]}>
                      <TouchableOpacity 
                        onPress={() => toggle(p.id)} 
                        style={[styles.checkbox, item?.checked && { backgroundColor: T.good, borderColor: T.good }]}
                      >
                        {item?.checked && <IconCheck size={11} stroke={2.8} color="#fff" />}
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => onPatient?.(p)} style={styles.patientInfo}>
                        <View style={styles.nameRow}>
                          <Avatar initials={initials(p.name)} color={nameColor(p.name)} size={24} />
                          <Text style={[styles.patientName, item?.checked && styles.textStrikethrough]} numberOfLines={1}>
                            {p.name}
                          </Text>
                        </View>
                        <View style={styles.metaRow}>
                          <BedChip>{p.bed}</BedChip>
                          <Text style={styles.dayText}>Day {item?.dayAdmitted}</Text>
                        </View>
                        {!item?.checked && item?.toCheck && (
                          <View style={styles.tagRow}>
                            {item.toCheck.slice(0, 2).map((tc, j) => (
                              <View key={j} style={styles.tag}>
                                <Text style={styles.tagText}>{tc}</Text>
                              </View>
                            ))}
                          </View>
                        )}
                      </TouchableOpacity>
                      <View style={[styles.prioDot, { backgroundColor: prioColor, shadowColor: prioColor }]} />
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.fabContainer}>
        <TouchableOpacity onPress={() => setShowEnd(true)} style={[styles.fab, { backgroundColor: pct === 100 ? T.good : T.accent }]}>
          <IconClipboardList size={17} color="#fff" />
          <Text style={styles.fabText}>End Rounds</Text>
        </TouchableOpacity>
      </View>

      {showEnd && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowEnd(false)} />
          <View style={styles.modalSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.modalTitle}>End Rounds</Text>
            <Text style={styles.modalSub}>Summary for today's round · 1 Jun 2026</Text>
            
            <View style={styles.summaryGrid}>
              {[
                { label: 'Patients seen',  value: checked,         color: T.accent  },
                { label: 'Pending',        value: total - checked, color: (total - checked) > 0 ? T.warn : T.good },
                { label: 'Notes written',  value: 1,               color: '#8B5CF6' },
                { label: 'Instructions',   value: 2,               color: T.good    },
              ].map(s => (
                <View key={s.label} style={styles.summaryBox}>
                  <Text style={[styles.summaryVal, { color: s.color }]}>{s.value}</Text>
                  <Text style={styles.summaryLabel}>{s.label}</Text>
                </View>
              ))}
            </View>
            
            <TouchableOpacity onPress={() => setShowEnd(false)} style={styles.completeBtn}>
              <Text style={styles.completeBtnText}>Complete Rounds</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: T.borderSoft,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
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
    fontSize: 15,
    fontWeight: '700',
    color: T.text,
  },
  headerSub: {
    fontSize: 11,
    color: T.textDim,
  },
  headerCounter: {
    fontSize: 13,
    color: T.textDim,
    fontFamily: 'JetBrains Mono',
  },
  progressContainer: {
    height: 4,
    borderRadius: 2,
    backgroundColor: T.border,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    color: T.textDim,
    marginTop: 5,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    paddingBottom: 100,
    gap: 11,
  },
  wardCard: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.borderSoft,
    borderRadius: 14,
    overflow: 'hidden',
  },
  wardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
  },
  wardName: {
    fontSize: 14,
    fontWeight: '700',
    color: T.text,
  },
  reviewedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: T.good + '1F',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  reviewedText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: T.good,
    fontFamily: 'JetBrains Mono',
  },
  patientList: {
    borderTopWidth: 1,
    borderTopColor: T.borderSoft,
  },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
    padding: 14,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: T.borderSoft,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: T.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  patientInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 4,
  },
  patientName: {
    fontSize: 13.5,
    fontWeight: '600',
    color: T.text,
  },
  textStrikethrough: {
    textDecorationLine: 'line-through',
    color: T.textDim,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 7,
  },
  dayText: {
    fontSize: 10.5,
    color: T.textFaint,
    fontFamily: 'JetBrains Mono',
  },
  tagRow: {
    flexDirection: 'row',
    gap: 5,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: T.border,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 10.5,
    color: T.textDim,
  },
  prioDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    marginTop: 5,
    elevation: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 22,
    right: 18,
  },
  fab: {
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 20,
  },
  fabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.52)',
    zIndex: 50,
  },
  modalSheet: {
    backgroundColor: T.bg,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: T.border,
    alignSelf: 'center',
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: T.text,
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 13,
    color: T.textDim,
    marginBottom: 18,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  summaryBox: {
    width: '48%',
    backgroundColor: T.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: T.borderSoft,
  },
  summaryVal: {
    fontSize: 24,
    fontWeight: '800',
    fontFamily: 'JetBrains Mono',
  },
  summaryLabel: {
    fontSize: 12,
    color: T.textDim,
    marginTop: 3,
  },
  completeBtn: {
    height: 50,
    backgroundColor: T.accent,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});
