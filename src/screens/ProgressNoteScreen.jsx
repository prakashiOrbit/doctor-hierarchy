import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  TextInput,
} from 'react-native';
import { T } from '../theme/tokens';
import { initials, nameColor, WARDS } from '../data/mockData';
import { Avatar, BedChip, WardTypeChip } from '../components/Clinical';
import { IconClose, IconMic } from '../components/Icons';

const SOAP_FIELDS_CFG = [
  { key: 'S', label: 'Subjective', color: '#3B82F6', bg: 'rgba(59,130,246,.14)',  placeholder: 'Patient-reported symptoms, complaints, pain score, relevant history…' },
  { key: 'O', label: 'Objective',  color: '#8B5CF6', bg: 'rgba(139,92,246,.14)', placeholder: 'Examination findings, current vitals, lab results, imaging…' },
  { key: 'A', label: 'Assessment', color: '#D97706', bg: 'rgba(217,119,6,.14)',   placeholder: 'Clinical impression, primary diagnosis, differential diagnoses…' },
  { key: 'P', label: 'Plan',       color: '#059669', bg: 'rgba(5,150,105,.14)',   placeholder: 'Management plan, investigations ordered, therapies, next steps…' },
];

export const ProgressNoteScreen = ({ patient, onClose, onSave }) => {
  const [noteType, setNoteType] = useState('SOAP');
  const [soap, setSoap] = useState({ S: '', O: '', A: '', P: '' });
  const [freeText, setFreeText] = useState('');
  const [listening, setListening] = useState(false);
  const ward = WARDS.find(w => w.id === patient.wardId);
  const hasContent = noteType === 'SOAP' ? Object.values(soap).some(v => v.trim()) : freeText.trim().length > 0;
  const NOTE_TYPES = ['SOAP', 'Procedure', 'Summary', 'Handover'];

  useEffect(() => {
    if (!listening) return;
    const phrases = ['Patient reports increased ', 'dyspnoea at rest ', 'and productive cough. ', 'No chest pain or haemoptysis. '];
    let i = 0;
    const id = setInterval(() => {
      if (noteType === 'SOAP') setSoap(s => ({ ...s, S: s.S + phrases[i] }));
      else setFreeText(t => t + phrases[i]);
      i++;
      if (i >= phrases.length) { setListening(false); clearInterval(id); }
    }, 640);
    return () => clearInterval(id);
  }, [listening]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <IconClose size={18} color={T.textDim} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Progress Note</Text>
        <TouchableOpacity 
          onPress={() => hasContent && onSave?.(noteType === 'SOAP' ? soap : freeText)} 
          disabled={!hasContent}
          style={[styles.saveBtn, hasContent && styles.saveBtnActive]}
        >
          <Text style={[styles.saveBtnText, hasContent && styles.saveBtnTextActive]}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Patient Strip */}
      <View style={styles.patientStrip}>
        <Avatar initials={initials(patient.name)} color={nameColor(patient.name)} size={30}/>
        <Text style={styles.patientName} numberOfLines={1}>{patient.name}</Text>
        <BedChip>{patient.bed}</BedChip>
        <WardTypeChip type={ward.type}/>
      </View>

      {/* Note Type Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {NOTE_TYPES.map(nt => (
            <TouchableOpacity 
              key={nt} 
              onPress={() => setNoteType(nt)}
              style={[styles.tab, noteType === nt && styles.tabActive]}
            >
              <Text style={[styles.tabText, noteType === nt && styles.tabTextActive]}>{nt}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main Form */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {noteType === 'SOAP' ? (
          <View style={styles.soapContainer}>
            {SOAP_FIELDS_CFG.map(f => (
              <View key={f.key} style={styles.soapField}>
                <View style={[styles.soapLabelBox, { backgroundColor: f.bg }]}>
                  <View style={[styles.soapKeyCircle, { backgroundColor: f.color }]}>
                    <Text style={styles.soapKeyText}>{f.key}</Text>
                  </View>
                  <Text style={[styles.soapLabelText, { color: f.color }]}>{f.label}</Text>
                </View>
                <TextInput 
                  value={soap[f.key]} 
                  onChangeText={val => setSoap(s => ({ ...s, [f.key]: val }))}
                  placeholder={f.placeholder}
                  maxLength={300}
                  multiline
                  style={[styles.soapInput, soap[f.key] ? { borderColor: f.color + '60' } : null]}
                />
                <Text style={styles.charCount}>{soap[f.key].length}/300</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.freeTextContainer}>
            <Text style={styles.noteTypeDesc}>
              {noteType === 'Procedure' ? 'Describe the procedure performed, technique used, and outcomes.' : noteType === 'Summary' ? 'Write a clinical summary for this admission period, key events and plan.' : 'Write handover notes covering current status, outstanding tasks, and escalation criteria.'}
            </Text>
            <TextInput 
              value={freeText} 
              onChangeText={setFreeText}
              placeholder={`${noteType} note…`}
              maxLength={1000}
              multiline
              style={styles.freeTextInput}
            />
            <Text style={styles.charCount}>{freeText.length}/1000</Text>
          </View>
        )}
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <TouchableOpacity 
          onPress={() => setListening(!listening)} 
          style={[styles.voiceBtn, listening && styles.voiceBtnActive]}
        >
          <IconMic size={16} color={listening ? T.bad : T.text} />
          <Text style={[styles.voiceBtnText, listening && { color: T.bad }]}>
            {listening ? 'Listening…' : 'Voice'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.previewBtn}>
          <Text style={styles.previewBtnText}>Preview</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => hasContent && onSave?.()} 
          disabled={!hasContent}
          style={[styles.mainSaveBtn, hasContent && styles.mainSaveBtnActive]}
        >
          <Text style={[styles.mainSaveBtnText, hasContent && styles.mainSaveBtnTextActive]}>Save Note</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: T.bg,
    zIndex: 45,
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
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: T.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: T.text,
  },
  saveBtn: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 9,
    backgroundColor: T.surface2,
  },
  saveBtnActive: {
    backgroundColor: T.accent,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: T.textFaint,
  },
  saveBtnTextActive: {
    color: '#fff',
  },
  patientStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    paddingHorizontal: 14,
    backgroundColor: T.accent + '08',
    borderBottomWidth: 1,
    borderBottomColor: T.borderSoft,
  },
  patientName: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '600',
    color: T.text,
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: T.borderSoft,
  },
  tabsScroll: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 5,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: T.border,
  },
  tabActive: {
    backgroundColor: T.accent,
    borderColor: 'transparent',
  },
  tabText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: T.textDim,
  },
  tabTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 14,
  },
  soapContainer: {
    gap: 14,
    paddingBottom: 90,
  },
  soapField: {
    gap: 8,
  },
  soapLabelBox: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 7,
    paddingVertical: 4,
    paddingRight: 11,
    paddingLeft: 6,
    borderRadius: 20,
  },
  soapKeyCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  soapKeyText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
  },
  soapLabelText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  soapInput: {
    width: '100%',
    height: 88,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: T.borderSoft,
    backgroundColor: T.surface,
    color: T.text,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 13.5,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 10.5,
    color: T.textFaint,
    textAlign: 'right',
    marginTop: 3,
  },
  freeTextContainer: {
    paddingBottom: 90,
  },
  noteTypeDesc: {
    fontSize: 12.5,
    color: T.textDim,
    marginBottom: 10,
    lineHeight: 18,
  },
  freeTextInput: {
    width: '100%',
    height: 220,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: T.borderSoft,
    backgroundColor: T.surface,
    color: T.text,
    paddingVertical: 12,
    paddingHorizontal: 13,
    fontSize: 13.5,
    textAlignVertical: 'top',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    borderTopWidth: 1,
    borderTopColor: T.borderSoft,
    backgroundColor: T.bg,
  },
  voiceBtn: {
    height: 46,
    paddingHorizontal: 14,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: T.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  voiceBtnActive: {
    backgroundColor: T.bad + '15',
    borderColor: T.bad,
  },
  voiceBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: T.text,
  },
  previewBtn: {
    height: 46,
    flex: 1,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: T.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: T.text,
  },
  mainSaveBtn: {
    height: 46,
    flex: 1.5,
    borderRadius: 11,
    backgroundColor: T.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainSaveBtnActive: {
    backgroundColor: T.accent,
  },
  mainSaveBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: T.textFaint,
  },
  mainSaveBtnTextActive: {
    color: '#fff',
  },
});
