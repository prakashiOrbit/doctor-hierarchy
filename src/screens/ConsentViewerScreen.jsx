import React, { useState } from 'react';
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
import { 
  consentsForPatient,
} from '../data/mockData';
import { 
  IconBack, 
  IconFileDoc,
  IconSignature,
  IconDownload,
  IconPlus,
  IconClose,
  IconChevron,
} from '../components/Icons';

export const ConsentViewerScreen = ({ patient, onBack }) => {
  const [selected, setSelected] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const [captureStep, setCaptureStep] = useState(1);
  const [newType, setNewType] = useState(null);
  const [signName, setSignName] = useState('');
  
  const consents = consentsForPatient(patient.id);
  const statusColor = { SIGNED: T.good, PENDING: T.warn, DECLINED: T.bad };

  const CAPTURE_TEMPLATES = [
    { id: 't1', type: 'ICU Admission Consent', text: 'Standard consent for ICU admission, treatment, and invasive monitoring.' },
    { id: 't2', type: 'Procedure Consent', text: 'General consent for clinical procedures including central lines and arterial access.' },
    { id: 't3', type: 'Blood Products', text: 'Consent for administration of blood and blood components.' },
    { id: 't4', type: 'Surgery Consent', text: 'General surgical and anaesthesia consent form.' },
  ];

  const handleCapture = () => {
    // In a real app, this would save to a database
    setCapturing(false);
    setCaptureStep(1);
    setNewType(null);
    setSignName('');
    // For demo, we just close
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <IconBack size={19} color={T.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Consents & Forms</Text>
          <Text style={styles.headerSub}>{patient.name}</Text>
        </View>
        <TouchableOpacity onPress={() => setCapturing(true)} style={styles.addBtn}>
          <IconPlus size={18} color={T.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {consents.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconBox}>
              <IconFileDoc size={42} color={T.textFaint} />
            </View>
            <Text style={styles.emptyTitle}>No consent forms</Text>
            <Text style={styles.emptySub}>Digital consent documents will appear here when captured for this patient.</Text>
            <TouchableOpacity onPress={() => setCapturing(true)} style={styles.emptyAction}>
              <Text style={styles.emptyActionText}>Capture New Consent</Text>
            </TouchableOpacity>
          </View>
        ) : (
          consents.map(c => (
            <TouchableOpacity 
              key={c.id} 
              onPress={() => setSelected(c)} 
              style={styles.consentCard}
            >
              <View style={styles.iconBox}>
                <IconFileDoc size={20} color={T.accent} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <View style={styles.cardHeader}>
                  <Text style={styles.consentType} numberOfLines={1}>{c.type}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: (statusColor[c.status] || T.textDim) + '18' }]}>
                    <Text style={[styles.statusText, { color: statusColor[c.status] || T.textDim }]}>{c.status}</Text>
                  </View>
                </View>
                {c.signedBy ? (
                  <Text style={styles.signedInfo}>Signed by {c.signedBy} · {c.date}</Text>
                ) : (
                  <Text style={[styles.signedInfo, { color: T.warn }]}>Awaiting signature</Text>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Detail Overlay */}
      {selected && (
        <View style={styles.overlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setSelected(null)} />
          <View style={styles.detailSheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.detailHeader}>
              <Text style={styles.detailTitle}>{selected.type}</Text>
              <View style={[styles.statusBadge, { backgroundColor: (statusColor[selected.status] || T.textDim) + '18' }]}>
                <Text style={[styles.statusText, { color: statusColor[selected.status] || T.textDim }]}>{selected.status}</Text>
              </View>
            </View>
            
            <ScrollView style={styles.detailBody} showsVerticalScrollIndicator={false}>
              <View style={styles.metaGrid}>
                {[
                  { label: 'PATIENT',    value: patient.name },
                  { label: 'DATE',       value: selected.date || 'Pending' },
                  { label: 'SIGNED BY',  value: selected.signedBy || 'Awaiting' },
                  { label: 'WITNESS',    value: selected.witness || 'Pending' },
                ].map(m => (
                  <View key={m.label} style={styles.metaItem}>
                    <Text style={styles.metaLabel}>{m.label}</Text>
                    <Text style={styles.metaValue}>{m.value}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.contentTextCard}>
                <Text style={styles.contentText}>{selected.text}</Text>
              </View>

              <View style={styles.signatureBox}>
                {selected.signedBy ? (
                  <>
                    <IconSignature size={22} color={T.good} />
                    <Text style={styles.signatureCaptured}>Signature captured digitally</Text>
                    <Text style={styles.signatureDate}>{selected.date}</Text>
                  </>
                ) : (
                  <>
                    <IconSignature size={22} color={T.textFaint} />
                    <Text style={styles.signatureAwaiting}>No signature yet · Awaiting patient or NOK</Text>
                  </>
                )}
              </View>

              <TouchableOpacity style={styles.downloadBtn}>
                <IconDownload size={16} color={T.text} />
                <Text style={styles.downloadBtnText}>Download PDF</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      )}

      {/* Capture Flow Overlay */}
      {capturing && (
        <View style={styles.overlay}>
          <View style={[styles.detailSheet, { height: '88%' }]}>
            <View style={styles.sheetHandle} />
            <View style={styles.detailHeader}>
              <View>
                <Text style={styles.detailTitle}>{captureStep === 1 ? 'New Consent Form' : 'Sign Document'}</Text>
                <Text style={styles.headerSub}>{captureStep === 1 ? 'Select template' : newType?.type}</Text>
              </View>
              <TouchableOpacity onPress={() => setCapturing(false)} style={styles.closeBtnSmall}>
                <IconClose size={16} color={T.textDim} />
              </TouchableOpacity>
            </View>

            {captureStep === 1 ? (
              <ScrollView style={styles.detailBody}>
                <Text style={styles.sectionLabel}>CHOOSE TEMPLATE</Text>
                <View style={{ gap: 10, marginTop: 10 }}>
                  {CAPTURE_TEMPLATES.map(t => (
                    <TouchableOpacity 
                      key={t.id} 
                      onPress={() => { setNewType(t); setCaptureStep(2); }}
                      style={styles.templateCard}
                    >
                      <View style={styles.templateIcon}>
                        <IconPlus size={18} color={T.accent} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.templateName}>{t.type}</Text>
                        <Text style={styles.templateDesc}>{t.text}</Text>
                      </View>
                      <IconChevron size={14} color={T.textFaint} />
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <View style={[styles.detailBody, { flex: 1 }]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={styles.formPreview}>
                    <Text style={styles.formPreviewTitle}>{newType?.type}</Text>
                    <Text style={styles.formPreviewText}>
                      I, the undersigned, hereby consent to the clinical management as described. 
                      I have been informed of the risks, benefits, and alternatives...
                    </Text>
                    <View style={styles.formPreviewDivider} />
                    <Text style={styles.formPreviewText}>
                      Patient: {patient.name}{"\n"}
                      MRN: {patient.mrn}{"\n"}
                      Ward: {patient.wardId.toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.signatureInputSection}>
                    <Text style={styles.inputLabel}>SIGNED BY (NAME)</Text>
                    <TextInput 
                      value={signName}
                      onChangeText={setSignName}
                      placeholder="Enter full name..."
                      style={styles.signatureInput}
                    />
                    <View style={styles.drawingArea}>
                      <IconSignature size={30} color={T.textFaint} />
                      <Text style={styles.drawingText}>Sign here on device</Text>
                    </View>
                  </View>
                </ScrollView>
                
                <View style={styles.captureActions}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setCaptureStep(1)}>
                    <Text style={styles.cancelBtnText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.confirmBtn, !signName && { opacity: 0.5 }]} 
                    disabled={!signName}
                    onPress={handleCapture}
                  >
                    <Text style={styles.confirmBtnText}>Finalize & Sign</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: T.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: T.accent + '12',
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
    marginTop: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    paddingBottom: 40,
    gap: 10,
  },
  emptyState: {
    paddingTop: 64,
    alignItems: 'center',
    gap: 12,
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: T.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
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
    paddingHorizontal: 40,
    lineHeight: 19,
  },
  emptyAction: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: T.accent,
    borderRadius: 10,
  },
  emptyActionText: {
    color: '#fff',
    fontSize: 13.5,
    fontWeight: '600',
  },
  consentCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.borderSoft,
    borderRadius: 13,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: T.accent + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 5,
  },
  consentType: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '700',
    color: T.text,
    lineHeight: 18,
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 5,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'JetBrains Mono',
  },
  signedInfo: {
    fontSize: 11.5,
    color: T.textDim,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.56)',
    zIndex: 50,
    justifyContent: 'flex-end',
  },
  detailSheet: {
    height: '78%',
    backgroundColor: T.bg,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: T.border,
    alignSelf: 'center',
    marginVertical: 12,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: T.borderSoft,
  },
  detailTitle: {
    flex: 1,
    paddingRight: 12,
    fontSize: 15.5,
    fontWeight: '700',
    color: T.text,
    lineHeight: 20,
  },
  closeBtnSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: T.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailBody: {
    padding: 18,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 14,
  },
  metaItem: {
    width: '48%',
  },
  metaLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: T.textFaint,
    marginBottom: 3,
  },
  metaValue: {
    fontSize: 13,
    color: T.text,
    fontWeight: '500',
  },
  contentTextCard: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.borderSoft,
    borderRadius: 11,
    padding: 13,
    marginBottom: 14,
  },
  contentText: {
    fontSize: 13,
    color: T.textDim,
    lineHeight: 21,
  },
  signatureBox: {
    borderWidth: 1,
    borderColor: T.border,
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  signatureCaptured: {
    fontSize: 12,
    color: T.good,
    fontFamily: 'JetBrains Mono',
  },
  signatureDate: {
    fontSize: 10.5,
    color: T.textFaint,
  },
  signatureAwaiting: {
    fontSize: 12,
    color: T.textFaint,
    textAlign: 'center',
  },
  downloadBtn: {
    height: 44,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: T.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 30,
  },
  downloadBtnText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: T.text,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: T.textFaint,
    marginBottom: 8,
  },
  templateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.borderSoft,
    borderRadius: 12,
  },
  templateIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: T.accent + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateName: {
    fontSize: 13,
    fontWeight: '700',
    color: T.text,
  },
  templateDesc: {
    fontSize: 11,
    color: T.textFaint,
    marginTop: 2,
  },
  formPreview: {
    backgroundColor: T.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    marginBottom: 16,
  },
  formPreviewTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: T.text,
    marginBottom: 8,
  },
  formPreviewText: {
    fontSize: 12,
    color: T.textDim,
    lineHeight: 18,
  },
  formPreviewDivider: {
    height: 1,
    backgroundColor: T.borderSoft,
    marginVertical: 10,
  },
  signatureInputSection: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: T.textFaint,
  },
  signatureInput: {
    height: 44,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: T.text,
  },
  drawingArea: {
    height: 120,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    borderStyle: 'dashed',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  drawingText: {
    fontSize: 12,
    color: T.textFaint,
  },
  captureActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    paddingBottom: 20,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: T.textDim,
  },
  confirmBtn: {
    flex: 2,
    height: 48,
    borderRadius: 12,
    backgroundColor: T.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});

