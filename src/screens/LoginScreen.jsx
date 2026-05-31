import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { T } from '../theme/tokens';
import {
  DocLogo,
  Field,
  TextInput,
  CheckRow,
  Btn,
  IconBtn,
} from '../components/Shared';
import {
  IconStethoscope,
  IconLock,
  IconEye,
  IconEyeOff,
  IconGoogle,
} from '../components/Icons';

export const LoginScreen = ({ onSignIn, onForgot }) => {
  const [user, setUser] = useState('dr.shah');
  const [pw, setPw] = useState('clinical2026');
  const [showPw, setShowPw] = useState(false);
  const [keep, setKeep] = useState(true);
  const [loading, setLoading] = useState(false);

  const submit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSignIn();
    }, 750);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.mainLayout}>
          {/* Left Side: Branding & Welcome */}
          <View style={styles.leftSide}>
            <View style={styles.header}>
              <DocLogo size={48} sub={false} />
            </View>
            <View style={styles.welcomeSection}>
              <Text style={styles.title}>Welcome, Doctor</Text>
              <Text style={styles.subtitle}>Sign in to your clinical workspace.</Text>
            </View>
            <View style={styles.brandingFooter}>
               <Text style={styles.footerText}>
                Powered by <Text style={styles.footerBrand}>iOrbit</Text>
              </Text>
            </View>
          </View>

          {/* Right Side: Form */}
          <View style={styles.rightSide}>
            <View style={styles.form}>
              <Field label="Username">
                <TextInput
                  value={user}
                  onChange={setUser}
                  leading={<IconStethoscope size={16} color={T.textDim} />}
                  placeholder="your.username"
                />
              </Field>

              <Field label="Password">
                <TextInput
                  value={pw}
                  onChange={setPw}
                  secureTextEntry={!showPw}
                  leading={<IconLock size={16} color={T.textDim} />}
                  placeholder="password"
                  trailing={
                    <IconBtn
                      icon={showPw ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                      onClick={() => setShowPw(!showPw)}
                      style={styles.eyeBtn}
                    />
                  }
                />
              </Field>

              <View style={styles.formExtra}>
                <CheckRow
                  checked={keep}
                  onToggle={() => setKeep(!keep)}
                  label="Keep me signed in"
                />
                <Text onPress={onForgot} style={styles.forgotText}>
                  Forgot password?
                </Text>
              </View>
            </View>

            <Btn
              size="lg"
              full
              onClick={submit}
              loading={loading}
              style={styles.signInBtn}
            >
              Sign In
            </Btn>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.divider} />
            </View>

            <Btn
              variant="ghost"
              full
              onClick={submit}
              icon={<IconGoogle size={18} />}
              style={styles.googleBtn}
            >
              Google
            </Btn>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.bg,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 30,
  },
  mainLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 40,
  },
  leftSide: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 20,
  },
  rightSide: {
    flex: 1.2,
    backgroundColor: T.surface,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: T.borderSoft,
  },
  header: {
    marginBottom: 0,
  },
  welcomeSection: {
    marginBottom: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: T.text,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 15,
    color: T.textDim,
    marginTop: 10,
    maxWidth: 240,
  },
  brandingFooter: {
    marginTop: 20,
  },
  form: {
    gap: 12,
  },
  eyeBtn: {
    width: 28,
    height: 28,
  },
  formExtra: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  forgotText: {
    color: T.accent,
    fontSize: 12.5,
    fontWeight: '500',
  },
  signInBtn: {
    marginTop: 16,
    shadowColor: T.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.34,
    shadowRadius: 18,
    elevation: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: T.borderSoft,
  },
  dividerText: {
    fontSize: 11,
    color: T.textFaint,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 0.4,
  },
  googleBtn: {
    height: 48,
  },
  footerText: {
    fontSize: 11,
    color: T.textFaint,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  footerBrand: {
    color: T.textDim,
    fontWeight: '600',
  },
});
