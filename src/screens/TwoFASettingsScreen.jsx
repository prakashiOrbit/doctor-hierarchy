import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
} from 'react-native';
import { T } from '../theme/tokens';
import { Btn } from '../components/Shared';
import { IconBack, IconShield } from '../components/Icons';

export const TwoFASettingsScreen = ({ onBack }) => {
  const [enabled, setEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <IconBack size={19} color={T.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Two-Factor Authentication</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.topRow}>
            <View style={[styles.iconBox, { backgroundColor: enabled ? T.good + '1F' : T.border, color: enabled ? T.good : T.textDim }]}>
              <IconShield size={22} color={enabled ? T.good : T.textDim} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.statusTitle}>2FA is {enabled ? 'enabled' : 'disabled'}</Text>
              <Text style={styles.statusSub}>{enabled ? 'Your account is secured.' : 'Your account is at risk.'}</Text>
            </View>
            <Switch 
              value={enabled} 
              onValueChange={setEnabled}
              trackColor={{ false: T.border, true: T.good }}
              thumbColor={Platform.OS === 'ios' ? undefined : '#fff'}
            />
          </View>
          <Text style={styles.desc}>Two-factor authentication adds an extra layer of security by requiring a verification code when you sign in from a new device.</Text>
        </View>

        {enabled && (
          <Btn full variant="tonal" icon={<IconShield size={17} color={T.accent} />} style={styles.verifyBtn}>
            Re-verify device now
          </Btn>
        )}
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
    gap: 14,
  },
  card: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.borderSoft,
    borderRadius: 14,
    padding: 16,
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: T.text,
  },
  statusSub: {
    fontSize: 11.5,
    color: T.textDim,
    marginTop: 1,
  },
  desc: {
    fontSize: 12.5,
    color: T.textDim,
    lineHeight: 18,
  },
  verifyBtn: {
    marginTop: 4,
  },
});
