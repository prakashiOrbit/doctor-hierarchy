import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { T } from '../theme/tokens';
import { IconBack, IconCheck, IconActivity } from '../components/Icons';

export const WaveformSettingsScreen = ({ onBack }) => {
  const [selected, setSelected] = useState('ecg2');

  const options = [
    { id: 'ecg2', label: 'ECG II (Standard)', desc: 'Standard 3-lead monitoring view.' },
    { id: 'ecg1', label: 'ECG I', desc: 'Alternative limb lead monitoring.' },
    { id: 'spo2', label: 'SpO₂ Pleth', desc: 'Pulse oximetry plethysmograph waveform.' },
    { id: 'art', label: 'Art Line', desc: 'Invasive arterial pressure waveform (if available).' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <IconBack size={19} color={T.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Waveform Settings</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionLabel}>PRIMARY MONITORING VIEW</Text>
        <View style={styles.listCard}>
          {options.map((o, i) => (
            <TouchableOpacity 
              key={o.id} 
              onPress={() => setSelected(o.id)}
              style={[styles.row, i > 0 && styles.rowBorder]}
            >
              <View style={styles.info}>
                <Text style={styles.label}>{o.label}</Text>
                <Text style={styles.desc}>{o.desc}</Text>
              </View>
              {selected === o.id && <IconCheck size={18} color={T.accent} />}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoBox}>
          <IconActivity size={16} color={T.textDim} />
          <Text style={styles.infoText}>This setting determines which waveform is shown by default in the patient monitoring strips and detail views.</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: T.borderSoft,
    backgroundColor: T.surface,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: T.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: T.text,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  sectionLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: T.textFaint,
    marginBottom: 4,
  },
  listCard: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.borderSoft,
    borderRadius: 14,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: T.borderSoft,
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: T.text,
  },
  desc: {
    fontSize: 11.5,
    color: T.textDim,
    marginTop: 2,
  },
  infoBox: {
    marginTop: 10,
    padding: 14,
    backgroundColor: T.surface2,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: T.textDim,
    lineHeight: 18,
  },
});
