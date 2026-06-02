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
import { BedChip, WardTypeChip } from '../components/Clinical';
import { Avatar } from '../components/Shared';
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
  const [previewOpen, setPreviewOpen] = useState(false);
  
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
  }, [listening, noteType]);

  const handleSave = () => {
    const content = noteType === 'SOAP' ? soap : freeText;
    onSave?.(content);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <IconClose size={18} color={T.textDim} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Progress Note</Text>
        <TouchableOpacity 
          onPress={handleSave} 
          disabled={!hasContent}
          style={[styles.saveBtn, hasContent && styles.saveBtnActive]}
        >
          <Text style={[styles.saveBtnText, hasContent && styles.saveBtnTextActive]}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Patient Strip */}
      <View style={styles.patientStrip}>
        <Avatar initials={initials(patient.name)} color={nameColor(patient.name)} size={30}/>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.patientName} numberOfLines={1}>{patient.name}</Text>
          <Text style={styles.patientMeta}>{patient.mrn} · {patient.bed}</Text>
        </View>
        <WardTypeChip type={ward?.type}/>
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

      {/* Main Form Content */}
      <View style={{ flex: 1 }}>
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
                    placeholderTextColor={T.textFaint}
                    multiline={true}
                    style={[styles.soapInput, soap[f.key] ? { borderColor: f.color + '60' } : null]}
                    textAlignVertical="top"
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
                placeholder={`${noteType} note content…`}
                placeholderTextColor={T.textFaint}
                multiline={true}
                style={styles.freeTextInput}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{freeText.length}/1000</Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <TouchableOpacity 
          onPress={() => setListening(!listening)} 
          style={[styles.voiceBtn, listening && styles.voiceBtnActive]}
        >
          <IconMic size={18} color={listening ? T.bad : T.text} />
          <Text style={[styles.voiceBtnText, listening && { color: T.bad }]}>
            {listening ? 'Listening…' : 'Voice'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.previewBtn, !hasContent && { opacity: 0.5 }]} 
          disabled={!hasContent}
          onPress={() => setPreviewOpen(true)}
        >
          <Text style={styles.previewBtnText}>Preview</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={handleSave} 
          disabled={!hasContent}
          style={[styles.mainSaveBtn, hasContent && styles.mainSaveBtnActive]}
        >
          <Text style={[styles.mainSaveBtnText, hasContent && styles.mainSaveBtnTextActive]}>Save Note</Text>
        </TouchableOpacity>
      </View>

      {/* Preview Modal */}
      {previewOpen && (
        <View style={styles.previewOverlay}>
          <View style={styles.previewSheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>Note Preview</Text>
              <TouchableOpacity onPress={() => setPreviewOpen(false)} style={styles.closeBtnSmall}>
                <IconClose size={16} color={T.textDim} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.previewBody} showsVerticalScrollIndicator={false}>
              <View style={styles.previewDoc}>
                <View style={styles.previewDocHeader}>
                  <Text style={styles.previewDocType}>{noteType.toUpperCase()} NOTE</Text>
                  <Text style={styles.previewDocDate}>30 May 2026 · 14:20</Text>
                </View>

                {noteType === 'SOAP' ? (
                  SOAP_FIELDS_CFG.map(f => soap[f.key].trim() ? (
                    <View key={f.key} style={styles.previewSoapSection}>
                      <Text style={[styles.previewSoapLabel, { color: f.color }]}>{f.label}</Text>
                      <Text style={styles.previewTextContent}>{soap[f.key]}</Text>
                    </View>
                  ) : null)
                ) : (
                  <Text style={styles.previewTextContent}>{freeText}</Text>
                )}

                <View style={styles.previewDocFooter}>
                  <Text style={styles.previewSigner}>Signed: Dr. R. Shah</Text>
                  <Text style={styles.previewHospital}>St. Mary's Health · iTouch</Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.previewActions}>
              <TouchableOpacity style={styles.editBtn} onPress={() => setPreviewOpen(false)}>
                <Text style={styles.editBtnText}>Edit Note</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={handleSave}>
                <Text style={styles.confirmBtnText}>Confirm & Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
    backgroundColor: T.bg,
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
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: T.surface,
    borderBottomWidth: 1,
    borderBottomColor: T.borderSoft,
  },
  patientName: {
    fontSize: 14,
    fontWeight: '700',
    color: T.text,
  },
  patientMeta: {
    fontSize: 11,
    color: T.textFaint,
    marginTop: 1,
  },
  tabsContainer: {
    backgroundColor: T.bg,
    borderBottomWidth: 1,
    borderBottomColor: T.borderSoft,
  },
  tabsScroll: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 6,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: T.surface,
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
    gap: 16,
    paddingBottom: 20,
  },
  soapField: {
    gap: 8,
  },
  soapLabelBox: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    paddingVertical: 5,
    paddingRight: 12,
    paddingLeft: 6,
    borderRadius: 20,
  },
  soapKeyCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
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
    minHeight: 100,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.border,
    backgroundColor: T.surface,
    color: T.text,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  charCount: {
    fontSize: 10.5,
    color: T.textFaint,
    textAlign: 'right',
    marginTop: 2,
    fontFamily: 'JetBrains Mono',
  },
  freeTextContainer: {
    gap: 12,
    paddingBottom: 20,
  },
  noteTypeDesc: {
    fontSize: 13,
    color: T.textDim,
    lineHeight: 19,
  },
  freeTextInput: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.border,
    backgroundColor: T.surface,
    color: T.text,
    paddingVertical: 14,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  footer: {
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
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: T.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  voiceBtnActive: {
    backgroundColor: T.bad + '10',
    borderColor: T.bad,
  },
  voiceBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: T.text,
  },
  previewBtn: {
    height: 48,
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: T.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: T.text,
  },
  mainSaveBtn: {
    height: 48,
    flex: 1.5,
    borderRadius: 12,
    backgroundColor: T.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainSaveBtnActive: {
    backgroundColor: T.accent,
  },
  mainSaveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: T.textFaint,
  },
  mainSaveBtnTextActive: {
    color: '#fff',
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.56)',
    zIndex: 100,
    justifyContent: 'flex-end',
  },
  previewSheet: {
    height: '85%',
    backgroundColor: T.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: T.border,
    alignSelf: 'center',
    marginVertical: 12,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: T.borderSoft,
  },
  previewTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: T.text,
  },
  closeBtnSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: T.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewBody: {
    padding: 16,
  },
  previewDoc: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    gap: 16,
  },
  previewDocHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: T.borderSoft,
    paddingBottom: 10,
  },
  previewDocType: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1,
    color: T.textFaint,
  },
  previewDocDate: {
    fontSize: 10.5,
    color: T.textFaint,
    fontFamily: 'JetBrains Mono',
  },
  previewSoapSection: {
    gap: 4,
  },
  previewSoapLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  previewTextContent: {
    fontSize: 14.5,
    color: T.text,
    lineHeight: 22,
  },
  previewDocFooter: {
    marginTop: 10,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: T.borderSoft,
    borderStyle: 'dashed',
    gap: 4,
  },
  previewSigner: {
    fontSize: 13,
    fontWeight: '600',
    color: T.text,
  },
  previewHospital: {
    fontSize: 11,
    color: T.textFaint,
  },
  previewActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: T.borderSoft,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  editBtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: T.textDim,
  },
  confirmBtn: {
    flex: 1.5,
    height: 50,
    borderRadius: 12,
    backgroundColor: T.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
});


