import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { T } from '../theme/tokens';
import { 
  initials, 
  nameColor, 
  WARDS, 
  patientById,
  REFERRALS_INCOMING_DATA 
} from '../data/mockData';
import { BedChip, WardTypeChip } from '../components/Clinical';
import { Avatar } from '../components/Shared';
import { 
  IconClose, 
  IconCheck, 
  IconHandshake,
} from '../components/Icons';

const URGENCY_OPTS = [
  { key: 'routine',   label: 'Routine',   color: '#94A3B8',  bg: 'rgba(148,163,184,0.12)' },
  { key: 'urgent',    label: 'Urgent',    color: '#D97706',  bg: 'rgba(217,119,6,0.13)'   },
  { key: 'emergency', label: 'Emergency', color: '#EF4444',  bg: 'rgba(239,68,68,0.13)'   },
];

const SPECIALTIES = ['Cardiology', 'Nephrology', 'Neurology', 'Pulmonology', 'Surgery', 'Other'];

export const ReferralScreen = ({ patient, onClose, onSave }) => {
  const [tab, setTab] = useState('send');
  const [specialty, setSpecialty] = useState('');
  const [doctor, setDoctor] = useState('');
  const [urgency, setUrgency] = useState('routine');
  const [reason, setReason] = useState('');
  const [relevant, setRelevant] = useState(patient.dx);
  const [accepted, setAccepted] = useState({});
  
  const ward = WARDS.find(w => w.id === patient.wardId);
  const canSend = specialty && reason.trim().length >= 20;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <IconClose size={18} color={T.textDim} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Referral & Consultation</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {[
          { id: 'send', lbl: 'Send Referral' },
          { id: 'incoming', lbl: `Incoming (${REFERRALS_INCOMING_DATA.length})` }
        ].map(t => (
          <TouchableOpacity 
            key={t.id} 
            onPress={() => setTab(t.id)} 
            style={[styles.tab, tab === t.id && styles.tabActive]}
          >
            <Text style={[styles.tabText, tab === t.id && styles.tabTextActive]}>{t.lbl}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {tab === 'send' ? (
          <View style={styles.form}>
            {/* Patient Header */}
            <View style={styles.patientContext}>
              <Avatar initials={initials(patient.name)} color={nameColor(patient.name)} size={30}/>
              <Text style={styles.contextName} numberOfLines={1}>{patient.name}</Text>
              <BedChip>{patient.bed}</BedChip>
              <WardTypeChip type={ward.type}/>
            </View>

            {/* Specialty Selection */}
            <View style={styles.fieldSection}>
              <Text style={styles.fieldLabel}>Referring to specialty *</Text>
              <View style={styles.listCard}>
                {SPECIALTIES.map((s, i) => (
                  <TouchableOpacity 
                    key={s} 
                    onPress={() => setSpecialty(s)} 
                    style={[styles.listItem, specialty === s && styles.listItemActive, i > 0 && styles.itemBorder]}
                  >
                    <Text style={[styles.listItemText, specialty === s && styles.listItemTextActive]}>{s}</Text>
                    {specialty === s && <IconCheck size={16} stroke={2.4} color={T.accent} />}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Specific Doctor */}
            <View style={styles.fieldSection}>
              <Text style={styles.fieldLabel}>Specific doctor <Text style={styles.optionalText}>(optional)</Text></Text>
              <TextInput 
                value={doctor} 
                onChangeText={setDoctor} 
                placeholder="e.g. Dr. Campbell"
                style={styles.input}
                placeholderTextColor={T.textFaint}
              />
            </View>

            {/* Urgency */}
            <View style={styles.fieldSection}>
              <Text style={styles.fieldLabel}>Urgency</Text>
              <View style={styles.urgencyRow}>
                {URGENCY_OPTS.map(u => (
                  <TouchableOpacity 
                    key={u.key} 
                    onPress={() => setUrgency(u.key)}
                    style={[
                      styles.urgencyBtn, 
                      urgency === u.key ? { backgroundColor: u.bg, borderColor: u.color } : null
                    ]}
                  >
                    <Text style={[styles.urgencyText, urgency === u.key ? { color: u.color } : null]}>{u.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Reason */}
            <View style={styles.fieldSection}>
              <Text style={styles.fieldLabel}>Reason for referral * <Text style={styles.optionalText}>(min 20 chars)</Text></Text>
              <TextInput 
                value={reason} 
                onChangeText={setReason} 
                placeholder="Describe the clinical reason and key findings requiring specialist input…"
                maxLength={500}
                multiline
                style={styles.textArea}
                placeholderTextColor={T.textFaint}
              />
              <Text style={styles.charCount}>{reason.length}/500</Text>
            </View>

            {/* History */}
            <View style={styles.fieldSection}>
              <Text style={styles.fieldLabel}>Relevant history <Text style={styles.optionalText}>(optional)</Text></Text>
              <TextInput 
                value={relevant} 
                onChangeText={setRelevant} 
                maxLength={300}
                multiline
                style={[styles.textArea, { height: 76 }]}
                placeholderTextColor={T.textFaint}
              />
            </View>
          </View>
        ) : (
          <View style={styles.incomingList}>
            {REFERRALS_INCOMING_DATA.length === 0 ? (
              <View style={styles.emptyState}>
                <IconHandshake size={50} color={T.textFaint} />
                <Text style={styles.emptyTitle}>No referral requests</Text>
                <Text style={styles.emptySub}>Incoming referrals from colleagues will appear here.</Text>
              </View>
            ) : (
              REFERRALS_INCOMING_DATA.map(r => {
                const rp = patientById(r.patientId);
                const rw = rp ? WARDS.find(w => w.id === rp.wardId) : null;
                const urgOpt = URGENCY_OPTS.find(u => u.key === r.urgency) || URGENCY_OPTS[0];
                const isAcc = accepted[r.id];
                return (
                  <View key={r.id} style={styles.incomingCard}>
                    <View style={styles.cardHeader}>
                      <View>
                        <Text style={styles.fromDoc}>{r.fromDoc}</Text>
                        <Text style={styles.fromSpec}>{r.fromSpecialty}</Text>
                      </View>
                      <View style={[styles.urgBadge, { backgroundColor: urgOpt.bg }]}>
                        <Text style={[styles.urgBadgeText, { color: urgOpt.color }]}>{r.urgency.toUpperCase()}</Text>
                      </View>
                    </View>
                    
                    {rp && (
                      <View style={styles.cardPatient}>
                        <Avatar initials={initials(rp.name)} color={nameColor(rp.name)} size={22}/>
                        <Text style={styles.cardPatientName}>{rp.name}</Text>
                        <BedChip>{rp.bed}</BedChip>
                        {rw && <WardTypeChip type={rw.type}/>}
                      </View>
                    )}
                    
                    <Text style={styles.cardReason} numberOfLines={2}>{r.reason}</Text>
                    
                    <View style={styles.cardFooter}>
                      <Text style={styles.receivedTime}>{r.received}</Text>
                      {!isAcc ? (
                        <View style={styles.actionRow}>
                          <TouchableOpacity 
                            onPress={() => setAccepted(a => ({ ...a, [r.id]: 'declined' }))}
                            style={styles.declineBtn}
                          >
                            <Text style={styles.declineText}>Decline</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            onPress={() => setAccepted(a => ({ ...a, [r.id]: 'accepted' }))}
                            style={styles.acceptBtn}
                          >
                            <Text style={styles.acceptText}>Accept</Text>
                          </TouchableOpacity>
                        </View>
                      ) : isAcc === 'accepted' ? (
                        <TouchableOpacity style={styles.viewBtn}>
                          <Text style={styles.viewBtnText}>View Patient</Text>
                        </TouchableOpacity>
                      ) : (
                        <Text style={styles.declinedStatus}>DECLINED</Text>
                      )}
                    </View>
                  </View>
                );
              })
            )}
          </View>
        )}
      </ScrollView>

      {tab === 'send' && (
        <View style={styles.footer}>
          <TouchableOpacity 
            onPress={() => canSend && onSave?.()} 
            disabled={!canSend}
            style={[styles.sendBtn, canSend && styles.sendBtnActive]}
          >
            <Text style={[styles.sendBtnText, canSend && styles.sendBtnTextActive]}>Send Referral</Text>
          </TouchableOpacity>
        </View>
      )}
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
    fontSize: 15,
    fontWeight: '700',
    color: T.text,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: T.borderSoft,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginBottom: -1,
  },
  tabActive: {
    borderBottomColor: T.accent,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: T.textDim,
  },
  tabTextActive: {
    color: T.accent,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    paddingBottom: 100,
  },
  form: {
    gap: 14,
  },
  patientContext: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    backgroundColor: T.accent + '0F',
    borderRadius: 11,
    borderWidth: 1,
    borderColor: T.borderSoft,
  },
  contextName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: T.text,
  },
  fieldSection: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: T.textDim,
  },
  optionalText: {
    fontWeight: '400',
    color: T.textFaint,
  },
  listCard: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.borderSoft,
    borderRadius: 12,
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  listItemActive: {
    backgroundColor: T.accent + '15',
  },
  itemBorder: {
    borderTopWidth: 1,
    borderTopColor: T.borderSoft,
  },
  listItemText: {
    fontSize: 13.5,
    color: T.text,
  },
  listItemTextActive: {
    fontWeight: '600',
    color: T.accent,
  },
  input: {
    height: 46,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: T.borderSoft,
    backgroundColor: T.surface,
    color: T.text,
    paddingHorizontal: 13,
    fontSize: 13.5,
  },
  urgencyRow: {
    flexDirection: 'row',
    gap: 7,
  },
  urgencyBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: T.border,
    alignItems: 'center',
  },
  urgencyText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: T.textDim,
  },
  textArea: {
    height: 100,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: T.borderSoft,
    backgroundColor: T.surface,
    color: T.text,
    padding: 12,
    fontSize: 13.5,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 10.5,
    color: T.textFaint,
    textAlign: 'right',
    marginTop: 3,
  },
  incomingList: {
    gap: 12,
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
    lineHeight: 18,
  },
  incomingCard: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.borderSoft,
    borderRadius: 13,
    padding: 14,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  fromDoc: {
    fontSize: 13.5,
    fontWeight: '700',
    color: T.text,
  },
  fromSpec: {
    fontSize: 11.5,
    color: T.textDim,
    marginTop: 1,
  },
  urgBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  urgBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    fontFamily: 'JetBrains Mono',
  },
  cardPatient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  cardPatientName: {
    fontSize: 13,
    fontWeight: '600',
    color: T.text,
  },
  cardReason: {
    fontSize: 12.5,
    color: T.textDim,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 4,
  },
  receivedTime: {
    fontSize: 11,
    color: T.textFaint,
    fontFamily: 'JetBrains Mono',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 7,
  },
  declineBtn: {
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: T.bad,
  },
  declineText: {
    fontSize: 12,
    fontWeight: '600',
    color: T.bad,
  },
  acceptBtn: {
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: T.good,
  },
  acceptText: {
    fontSize: 12,
    fontWeight: '600',
    color: T.good,
  },
  viewBtn: {
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: T.accent,
    backgroundColor: T.accent + '15',
  },
  viewBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: T.accent,
  },
  declinedStatus: {
    fontSize: 11.5,
    color: T.textFaint,
    fontFamily: 'JetBrains Mono',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    borderTopWidth: 1,
    borderTopColor: T.borderSoft,
    backgroundColor: T.bg,
  },
  sendBtn: {
    height: 50,
    borderRadius: 12,
    backgroundColor: T.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnActive: {
    backgroundColor: T.accent,
  },
  sendBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: T.textFaint,
  },
  sendBtnTextActive: {
    color: '#fff',
  },
});
