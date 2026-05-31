import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, View, Text, Animated, SafeAreaView, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { T } from './src/theme/tokens';
import { ALARMS as INITIAL_ALARMS, PATIENTS, SEV } from './src/data/mockData';
import { LoginScreen } from './src/screens/LoginScreen';
import { TwoFactorScreen } from './src/screens/TwoFactorScreen';
import { ForgotPasswordScreen } from './src/screens/ForgotPasswordScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { PatientsScreen } from './src/screens/PatientsScreen';
import { AlarmsScreen } from './src/screens/AlarmsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { PatientDetailScreen } from './src/screens/PatientDetailScreen';
import { MonitoringScreen } from './src/screens/MonitoringScreen';
import { InstructionsScreen } from './src/screens/InstructionsScreen';
import { InstructionPreviewScreen } from './src/screens/InstructionPreviewScreen';
import { AlarmDetailScreen } from './src/screens/AlarmDetailScreen';
import { LogoutDialog } from './src/components/LogoutDialog';
import { DocLogo, Toast, TopBar, BottomNav, Avatar } from './src/components/Shared';
import { IconDashboard, IconUsers, IconBell, IconUser } from './src/components/Icons';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={T.bg} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function SplashScreen({ onDone }) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [progressAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    Animated.timing(progressAnim, { toValue: 1, duration: 2300, useNativeDriver: false }).start(() => onDone());
  }, []);

  return (
    <View style={styles.splashContainer}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        <DocLogo size={78} stacked />
      </Animated.View>
      <View style={styles.progressWrapper}>
        <View style={styles.progressBar}>
          <Animated.View 
            style={[
              styles.progressFill, 
              { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }
            ]} 
          />
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered by <Text style={styles.footerBrand}>iOrbit</Text></Text>
        </View>
      </View>
    </View>
  );
}

function MainApp({ onLogoutPhase, showToast }) {
  const [tab, setTab] = useState('home');
  const [alarms, setAlarms] = useState(INITIAL_ALARMS);
  const [stack, setStack] = useState([]); // { t, data }
  const [logoutOpen, setLogoutOpen] = useState(false);

  const push = (t, data = {}) => setStack(s => [...s, { t, data }]);
  const pop = () => setStack(s => s.slice(0, -1));
  const resetStack = () => setStack([]);

  const top = stack[stack.length - 1];

  const acknowledge = (al) => {
    setAlarms(curr => curr.filter(x => x.id !== al.id));
    pop();
  };

  const NAV_ITEMS = [
    { id: 'home',     label: 'Home',     icon: <IconDashboard /> },
    { id: 'patients', label: 'Patients', icon: <IconUsers /> },
    { id: 'alarms',   label: 'Alarms',   icon: <IconBell /> },
    { id: 'me',       label: 'Me',       icon: <IconUser /> },
  ];

  const TAB_TITLE = {
    home:     { title: 'Dashboard',     sub: "St. Mary's · ICU · CCU · GEN" },
    alarms:   { title: 'Active Alarms', sub: 'Across your wards' },
    patients: { title: 'My Patients',   sub: 'Admitted · live monitored' },
    me:       { title: 'Profile',       sub: 'Account & preferences' },
  };

  const tt = TAB_TITLE[tab];

  const renderTop = () => {
    if (!top) return null;
    switch (top.t) {
      case 'alarm':
        return (
          <AlarmDetailScreen 
            alarm={top.data.alarm} 
            onClose={pop}
            onViewPatient={p => push('patient', { patient: p })}
            onWriteInstruction={p => push('instructions', { patient: p })}
            onAcknowledge={acknowledge}
            showToast={showToast}
          />
        );
      case 'patient':
        return (
          <PatientDetailScreen 
            patient={top.data.patient} 
            onClose={pop}
            onMonitor={() => push('monitoring', { patient: top.data.patient })}
            onWriteInstruction={() => push('instructions', { patient: top.data.patient })}
          />
        );
      case 'monitoring':
        return (
          <MonitoringScreen 
            patient={top.data.patient} 
            fromAlarm={top.data.fromAlarm}
            onBack={pop}
            onInstructions={() => push('instructions', { patient: top.data.patient })}
          />
        );
      case 'instructions':
        return (
          <InstructionsScreen 
            patient={top.data.patient} 
            onClose={pop}
            onPreview={(draft) => push('preview', { patient: top.data.patient, draft })}
            showToast={showToast}
          />
        );
      case 'preview':
        return (
          <InstructionPreviewScreen 
            patient={top.data.patient} 
            draft={top.data.draft}
            onBack={pop}
            onConfirm={resetStack}
            showToast={showToast}
          />
        );
      default: return null;
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      {top ? renderTop() : (
        <>
          <TopBar 
            title={tt.title} subtitle={tt.sub}
            trailing={
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                <TouchableOpacity onPress={() => setTab('alarms')} style={styles.headerAction}>
                  <IconBell size={20} color={tab === 'alarms' ? T.accent : T.textDim} />
                  {alarms.length > 0 && (
                    <View style={styles.alarmBadge}><Text style={styles.alarmBadgeText}>{alarms.length}</Text></View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setTab('me')} style={{ marginLeft: 4 }}>
                  <Avatar initials="RS" color={T.accent} size={30} />
                </TouchableOpacity>
              </View>
            }
          />
          <View style={{ flex: 1 }}>
            {tab === 'home' && (
              <HomeScreen 
                alarms={alarms} 
                onAlarm={a => push('alarm', { alarm: a })} 
                onPatient={p => push('patient', { patient: p })} 
              />
            )}
            {tab === 'patients' && <PatientsScreen onPatient={p => push('patient', { patient: p })} />}
            {tab === 'alarms' && <AlarmsScreen alarms={alarms} onAlarm={a => push('alarm', { alarm: a })} />}
            {tab === 'me' && <ProfileScreen onLogout={() => setLogoutOpen(true)} />}
          </View>
          <BottomNav items={NAV_ITEMS} active={tab} onChange={setTab} />
        </>
      )}
      <LogoutDialog 
        open={logoutOpen} 
        onClose={() => setLogoutOpen(false)} 
        onConfirm={() => { setLogoutOpen(false); onLogoutPhase(); }} 
      />
    </SafeAreaView>
  );
}

function AppContent() {
  const [phase, setPhase] = useState('splash');
  const [toast, setToast] = useState(null);

  const showToast = (message, kind = 'info') => {
    setToast({ message, kind });
    setTimeout(() => setToast(null), 2400);
  };

  if (phase === 'splash') return <SplashScreen onDone={() => setPhase('login')} />;
  if (phase === 'login') return <LoginScreen onSignIn={() => setPhase('2fa')} onForgot={() => setPhase('forgot')} />;
  if (phase === '2fa') return <TwoFactorScreen onVerify={() => { showToast('Signed in successfully', 'good'); setPhase('app'); }} onBack={() => setPhase('login')} />;
  if (phase === 'forgot') return <ForgotPasswordScreen onBack={() => setPhase('login')} onDone={() => setPhase('login')} showToast={showToast} />;

  return (
    <View style={styles.container}>
      <MainApp onLogoutPhase={() => setPhase('login')} showToast={showToast} />
      <Toast message={toast?.message} kind={toast?.kind} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  mainContainer: { flex: 1 },
  splashContainer: { flex: 1, backgroundColor: '#0D1117', alignItems: 'center', justifyContent: 'center' },
  progressWrapper: { position: 'absolute', bottom: 64, left: 48, right: 48 },
  progressBar: { height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: T.accent },
  footer: { alignItems: 'center', marginTop: 18 },
  footerText: { fontSize: 10, color: T.textFaint, fontFamily: 'monospace' },
  footerBrand: { color: T.textDim, fontWeight: '600' },
  headerAction: { position: 'relative', width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  alarmBadge: { position: 'absolute', top: 6, right: 6, minWidth: 15, height: 15, paddingHorizontal: 3, borderRadius: 999, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center' },
  alarmBadgeText: { color: '#fff', fontSize: 9, fontWeight: '700', fontFamily: 'JetBrains Mono' },
});

export default App;
