import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { T } from '../theme/tokens';
import { SEV, patientById, WARDS } from '../data/mockData';
import { AlarmCard } from '../components/Clinical';
import { IconCheckCircle, IconFilter, IconX, IconCheck } from '../components/Icons';

export const AlarmsScreen = ({ alarms, onAlarm, onBulkAcknowledge }) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [fWards, setFWards] = useState([]);
  const [fParams, setFParams] = useState([]);

  const PARAMS = ['HR', 'SpO2', 'RR', 'NIBP', 'TEMP'];

  const displayed = alarms.filter(a => {
    const p = patientById(a.patientId);
    if (fWards.length && !fWards.includes(p?.wardId)) return false;
    if (fParams.length && !fParams.includes(a.param)) return false;
    return true;
  });

  const sorted = [...displayed].sort((a, b) => SEV[b.severity].rank - SEV[a.severity].rank || a.raisedMin - b.raisedMin);
  const groups = ['critical', 'high', 'medium', 'low'];
  const activeFilters = fWards.length + fParams.length;

  const toggleWard = (id) => setFWards(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);
  const toggleParam = (p) => setFParams(ps => ps.includes(p) ? ps.filter(x => x !== p) : [...ps, p]);
  const toggleSelect = (id) => setSelectedIds(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.header}>
        {selectMode ? (
          <>
            <Text style={styles.headerTitle}>{selectedIds.length} selected</Text>
            <View style={{ flex: 1 }} />
            {selectedIds.length > 0 && (
              <TouchableOpacity 
                onPress={() => { onBulkAcknowledge?.(selectedIds); setSelectMode(false); setSelectedIds([]); }}
                style={styles.bulkAckBtn}
              >
                <Text style={styles.bulkAckText}>Acknowledge All</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              onPress={() => { setSelectMode(false); setSelectedIds([]); }}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.headerTitle}>Active Alarms</Text>
            <Text style={styles.headerCount}>{sorted.length}</Text>
            <View style={{ flex: 1 }} />
            {sorted.length > 0 && (
              <TouchableOpacity onPress={() => setSelectMode(true)} style={styles.selectBtn}>
                <Text style={styles.selectText}>Select</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              onPress={() => setFilterOpen(true)} 
              style={[styles.filterBtn, activeFilters > 0 && styles.filterBtnActive]}
            >
              <IconFilter size={16} color={activeFilters > 0 ? T.accent : T.textDim} />
              {activeFilters > 0 && <View style={styles.filterDot} />}
            </TouchableOpacity>
          </>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {sorted.length === 0 ? (
          <View style={styles.emptyAlarms}>
            <View style={styles.checkCircleWrapper}>
              <IconCheckCircle size={32} color={T.good} />
            </View>
            <Text style={styles.emptyTitle}>All patients stable</Text>
            <Text style={styles.emptySub}>No active alarms matching your filters.</Text>
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
                  {list.map(a => {
                    const isSelected = selectedIds.includes(a.id);
                    return (
                      <TouchableOpacity 
                        key={a.id} 
                        onPress={() => selectMode ? toggleSelect(a.id) : onAlarm(a)}
                        style={[styles.alarmItem, isSelected && styles.alarmItemSelected]}
                      >
                        <AlarmCard 
                          alarm={a} 
                          patient={typeof patientById === 'function' ? patientById(a.patientId) : null} 
                          onClick={() => selectMode ? toggleSelect(a.id) : onAlarm(a)} 
                        />
                        {selectMode && (
                          <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                            {isSelected && <IconCheck size={12} color="#fff" />}
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Filter Modal */}
      <Modal visible={filterOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Alarms</Text>
              <TouchableOpacity onPress={() => setFilterOpen(false)}>
                <IconX size={20} color={T.textDim} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalSectionTitle}>Wards</Text>
              <View style={styles.filterGrid}>
                {WARDS.map(w => (
                  <TouchableOpacity 
                    key={w.id} 
                    onPress={() => toggleWard(w.id)}
                    style={[styles.filterOption, fWards.includes(w.id) && styles.filterOptionSelected]}
                  >
                    <Text style={[styles.filterOptionText, fWards.includes(w.id) && styles.filterOptionTextSelected]}>{w.id}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.modalSectionTitle, { marginTop: 20 }]}>Parameters</Text>
              <View style={styles.filterGrid}>
                {PARAMS.map(p => (
                  <TouchableOpacity 
                    key={p} 
                    onPress={() => toggleParam(p)}
                    style={[styles.filterOption, fParams.includes(p) && styles.filterOptionSelected]}
                  >
                    <Text style={[styles.filterOptionText, fParams.includes(p) && styles.filterOptionTextSelected]}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.resetBtn} 
                onPress={() => { setFWards([]); setFParams([]); }}
              >
                <Text style={styles.resetText}>Reset All</Text>
              </TouchableOpacity>
              <Btn 
                variant="primary" 
                style={{ flex: 1 }} 
                onClick={() => setFilterOpen(false)}
              >
                Apply
              </Btn>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Internal components to avoid import issues
const Btn = ({ children, onClick, variant = 'default', style }) => (
  <TouchableOpacity 
    onPress={onClick} 
    style={[
      styles.btn, 
      variant === 'primary' && styles.btnPrimary,
      style
    ]}
  >
    <Text style={[styles.btnText, variant === 'primary' && styles.btnTextPrimary]}>{children}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    gap: 8,
  },
  headerTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.9,
    color: T.textDim,
    textTransform: 'uppercase',
  },
  headerCount: {
    fontSize: 11,
    color: T.textFaint,
    fontFamily: 'JetBrains Mono',
  },
  selectBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: T.border,
  },
  selectText: {
    fontSize: 11,
    fontWeight: '600',
    color: T.textDim,
  },
  bulkAckBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 9,
    backgroundColor: T.good,
  },
  bulkAckText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  cancelBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: T.border,
  },
  cancelText: {
    color: T.textDim,
    fontSize: 12,
    fontWeight: '600',
  },
  filterBtn: {
    width: 34,
    height: 34,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: T.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterBtnActive: {
    borderColor: T.accent,
    backgroundColor: T.accent + '15',
  },
  filterDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: T.accent,
  },
  scrollContent: {
    paddingHorizontal: 14,
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
  alarmItem: {
    position: 'relative',
  },
  alarmItemSelected: {
    // maybe a border?
  },
  checkbox: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: T.border,
    backgroundColor: T.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: T.accent,
    borderColor: T.accent,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: T.surface,
    borderRadius: 16,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: T.borderSoft,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: T.text,
  },
  modalBody: {
    padding: 16,
  },
  modalSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: T.textDim,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: T.border,
  },
  filterOptionSelected: {
    backgroundColor: T.accent + '15',
    borderColor: T.accent,
  },
  filterOptionText: {
    fontSize: 13,
    color: T.text,
  },
  filterOptionTextSelected: {
    color: T.accent,
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: T.borderSoft,
    gap: 12,
  },
  resetBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  resetText: {
    color: T.textDim,
    fontSize: 14,
    fontWeight: '600',
  },
  btn: {
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: T.surface2,
  },
  btnPrimary: {
    backgroundColor: T.accent,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '700',
    color: T.text,
  },
  btnTextPrimary: {
    color: '#fff',
  },
});
