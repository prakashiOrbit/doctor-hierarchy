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
  Field,
  TextInput,
  OTPInput,
  GlowIcon,
  useCountdown,
  PasswordStrengthBar,
  scorePassword,
  IconBtn,
} from '../components/Shared';
import {
  IconBack,
  IconMail,
  IconLock,
  IconEye,
  IconEyeOff,
} from '../components/Icons';

export const ForgotPasswordScreen = ({
  onBack,
  onDone,
  showToast,
}) => {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('r.shah@stmarys-health.org');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [s, fmt, reset] = useCountdown(45);

  const masked = (() => {
    const [u, d] = email.split('@');
    return `${u[0]}${'*'.repeat(Math.max(2, u.length - 1))}@${d || 'hospital.com'}`;
  })();

  const renderBackBtn = (label, fn) => (
    <TouchableOpacity onPress={fn} style={styles.backBtn}>
      <IconBack size={16} color={T.textDim} />
      <Text style={styles.backBtnText}>{label}</Text>
    </TouchableOpacity>
  );

  if (step === 'email') {
    return (
      <ScrollView contentContainerStyle={styles.scrollContent} style={styles.container}>
        {renderBackBtn('Back to login', onBack)}
        <View style={styles.content}>
          <GlowIcon icon={<IconMail />} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>Enter your work email and we'll send a reset code.</Text>
          </View>
          <View style={styles.form}>
            <Field label="Work email">
              <TextInput
                value={email}
                onChange={setEmail}
                leading={<IconMail size={16} color={T.textDim} />}
                placeholder="you@hospital.org"
                keyboardType="email-address"
              />
            </Field>
          </View>
        </View>
        <View style={styles.footer}>
          <Btn size="lg" full onClick={() => { setStep('otp'); reset(); }}>
            Send Reset Code
          </Btn>
        </View>
      </ScrollView>
    );
  }

  if (step === 'otp') {
    const full = otp.every(d => d);
    return (
      <ScrollView contentContainerStyle={styles.scrollContent} style={styles.container}>
        {renderBackBtn('Back', () => setStep('email'))}
        <View style={styles.content}>
          <GlowIcon icon={<IconMail />} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Check your email</Text>
            <Text style={styles.subtitle}>
              We sent a 6-digit code to{'\n'}
              <Text style={styles.maskedText}>{masked}</Text>
            </Text>
          </View>
          <View style={styles.otpWrapper}>
            <OTPInput value={otp} onChange={setOtp} autoFocus />
          </View>
          <View style={styles.resendContainer}>
            {s > 0 ? (
              <Text style={styles.resendText}>
                Resend in <Text style={styles.countdownText}>{fmt}</Text>
              </Text>
            ) : (
              <TouchableOpacity onPress={reset}>
                <Text style={styles.resendAction}>Resend code</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.footer}>
          <Btn size="lg" full disabled={!full} onClick={() => setStep('newpw')}>
            Verify Code
          </Btn>
        </View>
      </ScrollView>
    );
  }

  // step === 'newpw'
  const match = pw && pw === pw2;
  const ok = match && scorePassword(pw) >= 2;

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.container}>
      {renderBackBtn('Back', () => setStep('otp'))}
      <View style={styles.content}>
        <GlowIcon icon={<IconLock />} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Create New Password</Text>
          <Text style={styles.subtitle}>Choose a strong password you haven't used before.</Text>
        </View>
        <View style={styles.form}>
          <Field label="New password">
            <TextInput
              value={pw}
              onChange={setPw}
              secureTextEntry={!showPw}
              leading={<IconLock size={16} color={T.textDim} />}
              placeholder="new password"
              trailing={
                <IconBtn
                  icon={showPw ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                  onClick={() => setShowPw(!showPw)}
                  style={styles.eyeBtn}
                />
              }
            />
          </Field>
          <PasswordStrengthBar password={pw} />
          <Field label="Confirm password" error={pw2 && !match ? 'Passwords do not match' : null}>
            <TextInput
              value={pw2}
              onChange={setPw2}
              secureTextEntry={!showPw}
              leading={<IconLock size={16} color={T.textDim} />}
              placeholder="confirm password"
              error={!!(pw2 && !match)}
            />
          </Field>
        </View>
      </View>
      <View style={styles.footer}>
        <Btn
          size="lg"
          full
          disabled={!ok}
          onClick={() => {
            showToast('Password updated', 'good');
            onDone();
          }}
        >
          Set New Password
        </Btn>
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
    padding: 26,
    flexGrow: 1,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  backBtnText: {
    fontSize: 13,
    color: T.textDim,
  },
  content: {
    alignItems: 'center',
    marginTop: 40,
    gap: 24,
  },
  headerTextContainer: {
    alignItems: 'center',
    textAlign: 'center',
    gap: 8,
  },
  title: {
    fontSize: 23,
    fontWeight: '700',
    color: T.text,
    letterSpacing: -0.1,
  },
  subtitle: {
    fontSize: 13.5,
    color: T.textDim,
    lineHeight: 20,
    textAlign: 'center',
  },
  maskedText: {
    color: T.text,
    fontFamily: 'JetBrains Mono',
  },
  form: {
    width: '100%',
    gap: 14,
  },
  otpWrapper: {
    width: '100%',
    marginTop: 6,
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
  eyeBtn: {
    width: 28,
    height: 28,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 10,
    marginTop: 20,
  },
});
