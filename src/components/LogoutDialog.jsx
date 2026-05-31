import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { T } from '../theme/tokens';
import { Btn } from './Shared';
import { IconLogout } from './Icons';

export const LogoutDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.overlay}>
        <View style={styles.dialog}>
          <View style={styles.iconWrapper}>
            <IconLogout size={26} color={T.bad} />
          </View>
          <Text style={styles.title}>Sign Out?</Text>
          <Text style={styles.message}>
            You'll need to sign in again to access your patients and live monitoring.
          </Text>
          <View style={styles.footer}>
            <Btn variant="ghost" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </Btn>
            <Btn variant="primary" danger onClick={onConfirm} style={{ flex: 1 }}>
              Sign Out
            </Btn>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5,8,16,0.62)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: {
    width: '100%',
    backgroundColor: T.surface2,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: T.border,
    padding: 24,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: T.badSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 19,
    fontWeight: '700',
    color: T.text,
  },
  message: {
    fontSize: 13.5,
    color: T.textDim,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 22,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
  },
});
