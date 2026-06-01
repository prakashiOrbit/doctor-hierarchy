import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
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
} from '../components/Icons';

export const ConsentViewerScreen = ({ patient, onBack }) => {
  const [selected, setSelected] = useState(null);
  const consents = consentsForPatient(patient.id);
  const statusColor = { SIGNED: T.good, PENDING: T.warn, DECLINED: T.bad };

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
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {consents.length === 0 ? (
          <View style={styles.emptyState}>
            <IconFileDoc size={50} color={T.textFaint} />
            <Text style={styles.emptyTitle}>No consent forms</Text>
            <Text style={styles.emptySub}>Consent documents will appear here when captured.</Text>
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
                  <Text style={styles.consentType}>{c.type}</Text>
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
    paddingTop: 54,
    alignItems: 'center',
    gap: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: T.textDim,
  },
  emptySub: {
    fontSize: 12.5,
    color: T.textFaint,
    textAlign: 'center',
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
});
