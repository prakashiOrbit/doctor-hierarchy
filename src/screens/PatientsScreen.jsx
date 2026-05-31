import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { T } from '../theme/tokens';
import { PATIENTS, WARDS } from '../data/mockData';
import { PatientRow } from '../components/Clinical';
import { SearchBar, Chip } from '../components/Shared';

export const PatientsScreen = ({ onPatient }) => {
  const [q, setQ] = useState('');
  const [ward, setWard] = useState('all');

  const filtered = PATIENTS.filter(p =>
    (ward === 'all' || p.wardId === ward) &&
    (q === '' || 
     p.name.toLowerCase().includes(q.toLowerCase()) || 
     p.bed.toLowerCase().includes(q.toLowerCase()) || 
     p.mrn.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.container}>
      <SearchBar placeholder="Search patients, beds, MRN…" value={q} onChange={setQ} />
      
      <View style={styles.wardFilter}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.wardScroll}>
          <Chip on={ward === 'all'} onClick={() => setWard('all')}>All wards</Chip>
          {WARDS.map(w => (
            <Chip key={w.id} on={ward === w.id} onClick={() => setWard(w.id)}>{w.name}</Chip>
          ))}
        </ScrollView>
      </View>

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
    gap: 12,
  },
  wardFilter: {
    marginHorizontal: -14,
    paddingVertical: 2,
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
