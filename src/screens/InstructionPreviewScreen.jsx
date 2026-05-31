import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import { T } from '../theme/tokens';
import { WARDS } from '../data/mockData';
import { Btn } from '../components/Shared';
import { IconBack, IconEdit, IconSend } from '../components/Icons';

export const InstructionPreviewScreen = ({ patient, draft, onBack, onConfirm, showToast }) => {
  const ward = WARDS.find(w => w.id === patient.wardId);
  const now = new Date();
  const dateStr = '30 May 2026 · ' + now.toTimeString().slice(0, 5);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <IconBack size={19} color={T.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Instruction Preview</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* White Document */}
        <View style={styles.document}>
          {/* Letterhead */}
          <View style={styles.letterhead}>
            <View style={styles.hospitalInfo}>
              <View style={styles.logoPlaceholder} />
              <View>
                <Text style={styles.hospitalName}>St. Mary's Health</Text>
                <Text style={styles.docType}>CLINICAL INSTRUCTION</Text>
              </View>
            </View>
            <Text style={styles.dateText}>{dateStr}</Text>
          </View>

          <View style={styles.docBody}>
            <View style={styles.infoGrid}>
              <DocBlock title="PATIENT" lines={[patient.name, patient.mrn, `${patient.bed} · ${ward?.name}`]} />
              <DocBlock title="ORDERED BY" lines={['Dr. R. Shah', 'Consultant Intensivist', 'GMC 7240118']} />
            </View>
            
            <View style={styles.divider} />
            
            <View>
              <Text style={styles.instructionLabel}>INSTRUCTION · {draft.cat}</Text>
              <Text style={styles.instructionText}>{draft.text}</Text>
            </View>

            <View style={styles.pendingBadge}>
              <View style={styles.pendingDot} />
              <Text style={styles.pendingText}>PENDING NURSE ACKNOWLEDGEMENT</Text>
            </View>

            <View style={styles.footerInfo}>
              <Text style={styles.refText}>REF · INS-{Math.floor(Math.random() * 9000 + 1000)}</Text>
              <Text style={styles.signatureText}>Digitally signed · iTouch</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.actionBar}>
        <Btn variant="ghost" style={{ flex: 1 }} icon={<IconEdit size={16} color={T.text} />} onClick={onBack}>
          Edit
        </Btn>
        <Btn variant="primary" style={{ flex: 1.4 }} icon={<IconSend size={16} color="#fff" />} onClick={() => { showToast('Instruction sent to nursing team', 'good'); onConfirm(); }}>
          Confirm & Send
        </Btn>
      </View>
    </View>
  );
};

const DocBlock = ({ title, lines }) => (
  <View style={styles.docBlock}>
    <Text style={styles.blockTitle}>{title}</Text>
    <Text style={styles.blockLineMain}>{lines[0]}</Text>
    {lines.slice(1).map((l, i) => (
      <Text key={i} style={[styles.blockLineSub, i === 0 && { fontFamily: 'JetBrains Mono' }]}>{l}</Text>
    ))}
  </View>
);

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
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: T.text,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  document: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 40,
    elevation: 12,
  },
  letterhead: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#0F172A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hospitalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoPlaceholder: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: T.accent, // Simplified logo
  },
  hospitalName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.1,
  },
  docType: {
    fontSize: 10,
    color: '#64748B',
    fontFamily: 'JetBrains Mono',
  },
  dateText: {
    fontSize: 10,
    color: '#94A3B8',
    fontFamily: 'JetBrains Mono',
    textAlign: 'right',
  },
  docBody: {
    padding: 20,
    gap: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
  },
  docBlock: {
    flex: 1,
    gap: 2,
  },
  blockTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#94A3B8',
    marginBottom: 4,
  },
  blockLineMain: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  blockLineSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  instructionLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#94A3B8',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14.5,
    color: '#0F172A',
    lineHeight: 23,
  },
  pendingBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 6,
    paddingHorizontal: 11,
    borderRadius: 7,
    backgroundColor: '#FEF3C7',
  },
  pendingDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#F59E0B',
  },
  pendingText: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: '#B45309',
    fontFamily: 'JetBrains Mono',
  },
  footerInfo: {
    borderTopWidth: 1,
    borderTopColor: '#CBD5E1',
    borderStyle: 'dashed',
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  refText: {
    fontSize: 10.5,
    color: '#94A3B8',
    fontFamily: 'JetBrains Mono',
  },
  signatureText: {
    fontSize: 10.5,
    color: '#94A3B8',
  },
  actionBar: {
    flexDirection: 'row',
    gap: 9,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    borderTopWidth: 1,
    borderTopColor: T.borderSoft,
  },
});
