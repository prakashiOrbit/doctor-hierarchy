import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { T } from '../theme/tokens';
import { PATIENTS, WARDS } from '../data/mockData';
import { Avatar, Btn } from '../components/Shared';
import { MiniStat } from './HomeScreen';
import {
  IconBell,
  IconShield,
  IconActivity,
  IconClock,
  IconChevron,
  IconLogout,
  IconPencil,
} from '../components/Icons';

export const ProfileScreen = ({ onLogout, onNavigate }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('Dr. R. Shah');
  const [role, setRole] = useState('Consultant Intensivist');
  const [gmc, setGmc] = useState('GMC 7240118 · ICU-A');

  const rows = [
    { icon: <IconBell size={18} />, label: 'Notifications', val: 'Critical only', route: 'notif-prefs' },
    { icon: <IconShield size={18} />, label: 'Two-factor auth', val: 'On', route: '2fa-settings' },
    { icon: <IconActivity size={18} />, label: 'Default waveform', val: 'ECG II', route: 'waveform-settings' },
    { icon: <IconClock size={18} />, label: 'Shift', val: 'Day · 08:00–20:00', route: 'oncall' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.container}>
      {/* Doctor ID Card */}
      <View style={styles.profileCard}>
        <TouchableOpacity 
          onPress={() => setEditing(!editing)} 
          style={[styles.editToggle, editing && styles.editToggleActive]}
        >
          <IconPencil size={15} color={editing ? T.accent : T.textDim} />
        </TouchableOpacity>
        
        <View style={styles.profileHeaderMain}>
          <Avatar initials="RS" color={T.accent} size={56} />
          <View style={styles.profileInfo}>
            {editing ? (
              <View style={styles.editForm}>
                <TextInput 
                  value={name} 
                  onChangeText={setName} 
                  style={styles.editInputName} 
                  placeholder="Name"
                />
                <TextInput 
                  value={role} 
                  onChangeText={setRole} 
                  style={styles.editInputRole} 
                  placeholder="Role"
                />
                <TextInput 
                  value={gmc} 
                  onChangeText={setGmc} 
                  style={styles.editInputGmc} 
                  placeholder="GMC / Unit"
                />
              </View>
            ) : (
              <>
                <Text style={styles.doctorName}>{name}</Text>
                <Text style={styles.doctorRole}>{role}</Text>
                <Text style={styles.doctorMeta}>{gmc}</Text>
              </>
            )}
          </View>
        </View>

        {editing && (
          <View style={styles.editActions}>
            <TouchableOpacity style={styles.editCancelBtn} onPress={() => setEditing(false)}>
              <Text style={styles.editCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editSaveBtn} onPress={() => setEditing(false)}>
              <Text style={styles.editSaveText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Quick Stats */}
      <View style={styles.statsGrid}>
        <MiniStat label="PATIENTS" value={PATIENTS.length} color={T.accent} />
        <MiniStat label="WARDS" value={WARDS.length} color="#8B5CF6" />
        <MiniStat label="ON SHIFT" value="11h" color={T.good} />
      </View>

      {/* Settings Rows */}
      <View style={styles.settingsList}>
        {rows.map((r, i) => (
          <TouchableOpacity 
            key={i} 
            onPress={() => r.route && onNavigate?.(r.route)}
            style={[styles.settingRow, i === 0 && { borderTopWidth: 0 }]}
          >
            <View style={styles.settingIcon}>{r.icon}</View>
            <Text style={styles.settingLabel}>{r.label}</Text>
            <Text style={styles.settingVal}>{r.val}</Text>
            <IconChevron size={15} color={T.textFaint} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Sign Out Action */}
      <View style={styles.footer}>
        <Btn 
          variant="tonal" 
          danger 
          full 
          size="lg" 
          icon={<IconLogout size={17} color={T.bad} />} 
          onClick={onLogout}
        >
          Sign Out
        </Btn>
        <Text style={styles.versionText}>iTouch Doctor · v2.1.0 · Powered by iOrbit</Text>
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
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  profileCard: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.borderSoft,
    borderRadius: 16,
    padding: 16,
    position: 'relative',
  },
  profileHeaderMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  profileInfo: {
    flex: 1,
    paddingRight: 32,
  },
  editToggle: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: T.border,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  editToggleActive: {
    borderColor: T.accent,
    backgroundColor: T.accent + '15',
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: T.text,
  },
  doctorRole: {
    fontSize: 12.5,
    color: T.textDim,
    marginTop: 2,
  },
  doctorMeta: {
    fontSize: 10.5,
    color: T.textFaint,
    fontFamily: 'JetBrains Mono',
    marginTop: 4,
  },
  editForm: {
    gap: 6,
  },
  editInputName: {
    backgroundColor: T.bg,
    borderWidth: 1,
    borderColor: T.accent,
    borderRadius: 7,
    color: T.text,
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 15,
    fontWeight: '700',
  },
  editInputRole: {
    backgroundColor: T.bg,
    borderWidth: 1,
    borderColor: T.borderSoft,
    borderRadius: 7,
    color: T.textDim,
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 12,
  },
  editInputGmc: {
    backgroundColor: T.bg,
    borderWidth: 1,
    borderColor: T.borderSoft,
    borderRadius: 7,
    color: T.textFaint,
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 10.5,
    fontFamily: 'JetBrains Mono',
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  editCancelBtn: {
    flex: 1,
    height: 38,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: T.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editCancelText: {
    color: T.textDim,
    fontSize: 13,
    fontWeight: '600',
  },
  editSaveBtn: {
    flex: 1,
    height: 38,
    borderRadius: 9,
    backgroundColor: T.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editSaveText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  settingsList: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.borderSoft,
    borderRadius: 14,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: T.borderSoft,
  },
  settingIcon: {
    color: T.textDim,
  },
  settingLabel: {
    flex: 1,
    fontSize: 13.5,
    color: T.text,
  },
  settingVal: {
    fontSize: 12,
    color: T.textDim,
    fontFamily: 'JetBrains Mono',
  },
  footer: {
    gap: 16,
    marginTop: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 10.5,
    color: T.textFaint,
    fontFamily: 'JetBrains Mono',
  },
});
