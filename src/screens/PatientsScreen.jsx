import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { T } from '../theme/tokens';
import { PATIENTS, WARDS } from '../data/mockData';
import { PatientRow } from '../components/Clinical';
import { SearchBar, Chip } from '../components/Shared';
import { IconQR } from '../components/Icons';

export const PatientsScreen = ({ onPatient, onQRScan }) => {
  const [q, setQ] = useState('');
  const [ward, setWard] = useState('all');
  const [mrnMode, setMrnMode] = useState(false);

  const filtered = PATIENTS.filter(p => {
    if (ward !== 'all' && p.wardId !== ward) return false;
    if (!q) return true;
    const ql = q.toLowerCase();
    return mrnMode
      ? p.mrn.toLowerCase().includes(ql)
      : (p.name.toLowerCase().includes(ql) || p.bed.toLowerCase().includes(ql) || p.mrn.toLowerCase().includes(ql));
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <View style={styles.searchWrapper}>
          <SearchBar 
            placeholder={mrnMode ? 'Enter MRN…' : 'Search patients, beds, MRN…'} 
            value={q} 
            onChange={setQ} 
          />
        </View>
        <TouchableOpacity 
          onPress={() => setMrnMode(!mrnMode)} 
          style={[styles.mrnBtn, mrnMode && styles.mrnBtnActive]}
        >
          <Text style={[styles.mrnBtnText, mrnMode && styles.mrnBtnTextActive]}>MRN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onQRScan} style={styles.qrBtn}>
          <IconQR size={20} color={T.textDim} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.wardFilter}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.wardScroll}>
          <Chip on={ward === 'all'} onClick={() => setWard('all')}>All wards</Chip>
          {WARDS.map(w => (
            <Chip key={w.id} on={ward === w.id} onClick={() => setWard(w.id)}>{w.name}</Chip>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.listContainer}>
          {filtered.map(p => (
            <PatientRow key={p.id} patient={p} onClick={() => onPatient(p)} />
          ))}
          {filtered.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No patients match.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.bg,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 4,
  },
  searchWrapper: {
    flex: 1,
  },
  mrnBtn: {
    height: 44,
    paddingHorizontal: 10,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: T.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mrnBtnActive: {
    borderColor: T.accent,
    backgroundColor: T.accent + '15',
  },
  mrnBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: T.textDim,
    fontFamily: 'JetBrains Mono',
  },
  mrnBtnTextActive: {
    color: T.accent,
  },
  qrBtn: {
    width: 44,
    height: 44,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: T.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 40,
  },
  wardFilter: {
    marginHorizontal: 0,
    paddingVertical: 10,
  },
  wardScroll: {
    paddingHorizontal: 14,
    gap: 6,
  },
  listContainer: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.borderSoft,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingTop: 2,
    paddingBottom: 8,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: T.textDim,
    fontSize: 13,
  },
});
