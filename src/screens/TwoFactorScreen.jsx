import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { T } from '../theme/tokens';
import {
  Btn,
  OTPInput,
  GlowIcon,
  useCountdown,
} from '../components/Shared';
import { IconBack, IconShield } from '../components/Icons';

export const TwoFactorScreen = ({ onVerify, onBack }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [s, fmt, reset] = useCountdown(45);
  const full = otp.every(d => d);

  const verify = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onVerify();
    }, 600);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <IconBack size={16} color={T.textDim} />
        <Text style={styles.backBtnText}>Back to login</Text>
      </TouchableOpacity>

      <View style={styles.mainLayout}>
        {/* Left Side: Illustration & Title */}
        <View style={styles.leftSide}>
          <GlowIcon icon={<IconShield />} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Secure Verification</Text>
            <Text style={styles.subtitle}>Enter the 6-digit code sent to your device.</Text>
          </View>
        </View>

        {/* Right Side: Input & Action */}
        <View style={styles.rightSide}>
          <View style={styles.otpWrapper}>
            <OTPInput value={otp} onChange={setOtp} autoFocus />
          </View>

          <View style={styles.resendContainer}>
            {s > 0 ? (
              <Text style={styles.resendText}>
                Resend code in <Text style={styles.countdownText}>{fmt}</Text>
              </Text>
            ) : (
              <TouchableOpacity onPress={reset}>
                <Text style={styles.resendAction}>Resend code</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.footer}>
            <Btn
              size="lg"
              full
              onClick={verify}
              disabled={!full || loading}
              loading={loading}
              style={!full && styles.disabledBtn}
            >
              Verify & Continue
            </Btn>
          </View>
        </View>
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
    padding: 30,
    flexGrow: 1,
    justifyContent: 'center',
  },
  mainLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 40,
    marginTop: 10,
  },
  leftSide: {
    flex: 1,
    alignItems: 'center',
    gap: 20,
  },
  rightSide: {
    flex: 1.2,
    backgroundColor: T.surface,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: T.borderSoft,
    gap: 16,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 10,
  },
  backBtnText: {
    fontSize: 13,
    color: T.textDim,
  },
  headerTextContainer: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: T.text,
    letterSpacing: -0.1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: T.textDim,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 240,
  },
  otpWrapper: {
    width: '100%',
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: 12.5,
    color: T.textDim,
  },
  countdownText: {
    color: T.text,
    fontFamily: 'JetBrains Mono',
  },
  resendAction: {
    fontSize: 12.5,
    color: T.accent,
    fontWeight: '600',
  },
  footer: {
    width: '100%',
  },
  disabledBtn: {
    backgroundColor: T.surface2,
  },
});
