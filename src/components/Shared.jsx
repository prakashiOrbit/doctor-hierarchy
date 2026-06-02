import React from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle, Rect } from 'react-native-svg';
import { T } from '../theme/tokens';
import { IconAlert, IconCheck, IconBack, IconSearch, IconX, IconChevron, IconInfoCircle } from './Icons';

export const Field = ({ label, hint, error, children, optional, mono }) => (
  <View style={styles.fieldContainer}>
    <View style={styles.fieldHeader}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {optional && <Text style={styles.fieldOptional}>OPTIONAL</Text>}
    </View>
    {children}
    {error ? (
      <View style={styles.fieldErrorContainer}>
        <IconAlert size={12} color={T.bad} />
        <Text style={styles.fieldErrorText}>{error}</Text>
      </View>
    ) : hint ? (
      <Text style={[styles.fieldHint, mono && styles.mono]}>{hint}</Text>
    ) : null}
  </View>
);

export const TextInput = ({
  value,
  onChange,
  placeholder,
  secureTextEntry,
  leading,
  trailing,
  mono,
  error,
  autoFocus,
  keyboardType,
  multiline,
  style,
}) => (
  <View style={[styles.inputContainer, error && styles.inputError, multiline && styles.inputMultiline, style]}>
    {leading && <View style={styles.inputLeading}>{leading}</View>}
    <RNTextInput
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor={T.textFaint}
      secureTextEntry={secureTextEntry}
      autoFocus={autoFocus}
      keyboardType={keyboardType}
      multiline={multiline}
      style={[
        styles.input,
        mono && styles.mono,
        multiline && { textAlignVertical: 'top', paddingTop: 10 },
        { color: T.text }
      ]}
    />
    {trailing && <View style={styles.inputTrailing}>{trailing}</View>}
  </View>
);

export const Btn = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  onClick,
  full,
  danger,
  disabled,
  loading,
  style,
}) => {
  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';
  const isTonal = variant === 'tonal';

  const containerStyle = [
    styles.btn,
    size === 'sm' && styles.btnSm,
    size === 'lg' && styles.btnLg,
    isPrimary && { backgroundColor: danger ? T.bad : T.accent },
    isGhost && { backgroundColor: 'transparent', borderWidth: 1, borderColor: T.border },
    isTonal && { backgroundColor: danger ? T.badSoft : T.accentSoft },
    full && { width: '100%' },
    disabled && { opacity: 0.5 },
    style,
  ];

  const textStyle = [
    styles.btnText,
    size === 'sm' && styles.btnTextSm,
    size === 'lg' && styles.btnTextLg,
    isPrimary && { color: '#fff' },
    isGhost && { color: danger ? T.bad : T.text },
    isTonal && { color: danger ? T.bad : T.accent },
  ];

  return (
    <TouchableOpacity
      onPress={onClick}
      disabled={disabled || loading}
      style={containerStyle}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#fff' : T.accent} size="small" />
      ) : (
        <>
          {icon && <View style={{ marginRight: 7 }}>{icon}</View>}
          <Text style={textStyle}>{children}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export const IconBtn = ({ icon, onClick, color, style }) => (
  <TouchableOpacity onPress={onClick} style={[styles.iconBtn, style]}>
    {React.isValidElement(icon) ? React.cloneElement(icon, { color: color || T.text }) : icon}
  </TouchableOpacity>
);

export const CheckRow = ({ checked, onToggle, label }) => (
  <TouchableOpacity onPress={onToggle} style={styles.checkRow}>
    <View style={[styles.checkbox, checked && { backgroundColor: T.accent, borderColor: T.accent }]}>
      {checked && <IconCheck size={13} color="#fff" stroke={2.4} />}
    </View>
    <Text style={styles.checkLabel}>{label}</Text>
  </TouchableOpacity>
);

export const DocLogo = ({ size = 40, stacked = false, sub = true }) => (
  <View style={[styles.logoContainer, stacked && { flexDirection: 'column' }]}>
    <View style={[styles.logoPlaceholder, { width: size, height: size, borderRadius: size * 0.22 }]}>
      <Text style={{ color: '#fff', fontSize: size * 0.5, fontWeight: '700' }}>iT</Text>
    </View>
    <View style={stacked && { alignItems: 'center' }}>
      <Text style={[styles.logoText, { fontSize: size * 0.55 }]}>
        iTouch <Text style={{ color: T.accent }}>Doctor</Text>
      </Text>
      {sub && <Text style={styles.logoSub}>CLINICAL · IoMT</Text>}
    </View>
  </View>
);

export const OTPInput = ({ value, onChange, autoFocus }) => {
  const refs = React.useRef([]);
  const set = (i, v) => {
    const d = v.replace(/\D/g, '');
    const next = [...value];
    if (d.length > 1) {
      d.split('').slice(0, 6).forEach((ch, k) => { if (i + k < 6) next[i + k] = ch; });
      onChange(next);
      const last = Math.min(5, i + d.length - 1);
      refs.current[last]?.focus();
      return;
    }
    next[i] = d.slice(-1);
    onChange(next);
    if (d && i < 5) refs.current[i + 1]?.focus();
  };
  const handleKeyPress = (i, key) => {
    if (key === 'Backspace' && !value[i] && i > 0) refs.current[i - 1]?.focus();
  };

  return (
    <View style={styles.otpContainer}>
      {value.map((v, i) => (
        <RNTextInput
          key={i}
          ref={el => { refs.current[i] = el; }}
          value={v}
          onChangeText={text => set(i, text)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(i, nativeEvent.key)}
          keyboardType="numeric"
          maxLength={1}
          autoFocus={autoFocus && i === 0}
          style={[
            styles.otpInput,
            { borderColor: v ? T.accent : T.borderSoft, backgroundColor: v ? T.accentSoft : T.surface }
          ]}
        />
      ))}
    </View>
  );
};

export const GlowIcon = ({ icon, color = T.accent }) => (
  <View style={styles.glowIconWrapper}>
    <View style={[styles.glowRing, { backgroundColor: color }]} />
    <View style={[styles.glowRing2, { backgroundColor: color }]} />
    <View style={[styles.iconCircle, { backgroundColor: color + '22', borderColor: color + '44' }]}>
      {React.isValidElement(icon) ? React.cloneElement(icon, { size: 28, color }) : icon}
    </View>
  </View>
);

export const useCountdown = (start) => {
  const [s, setS] = React.useState(start);
  React.useEffect(() => {
    if (s <= 0) return;
    const t = setTimeout(() => setS(s - 1), 1000);
    return () => clearTimeout(t);
  }, [s]);
  const reset = () => setS(start);
  const fmt = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  return [s, fmt, reset];
};

export function scorePassword(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s; // 0..4
}

export const PasswordStrengthBar = ({ password }) => {
  const s = scorePassword(password || '');
  const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = [T.bad, T.bad, T.warn, '#84CC16', T.good];
  return (
    <View style={styles.strengthContainer}>
      <View style={styles.strengthBars}>
        {[0, 1, 2, 3].map(i => (
          <View key={i} style={[
            styles.strengthBar,
            { backgroundColor: i < s ? colors[s] : T.border }
          ]} />
        ))}
      </View>
      {password ? (
        <Text style={[styles.strengthLabel, { color: colors[s] }]}>{labels[s]}</Text>
      ) : null}
    </View>
  );
};

export const Toast = ({ message, kind = 'info' }) => {
  const [anim] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (message) {
      Animated.sequence([
        Animated.spring(anim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
        Animated.delay(2600),
        Animated.timing(anim, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [message]);

  if (!message) return null;

  const map = {
    info:  { color: T.accent, bg: '#fff', icon: <IconInfoCircle size={18} /> },
    good:  { color: T.good,   bg: '#fff', icon: <IconCheck size={18} /> },
    bad:   { color: T.bad,    bg: '#fff', icon: <IconAlert size={18} /> },
  }[kind];

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-60, 0],
  });

  return (
    <Animated.View 
      style={[
        styles.toastWrapper, 
        { 
          opacity: anim,
          transform: [{ translateY }]
        }
      ]}
    >
      <View style={[styles.toastContent, { backgroundColor: map.bg }]}>
        <View style={[styles.toastAccent, { backgroundColor: map.color }]} />
        <View style={styles.toastInner}>
          <View style={[styles.toastIconBox, { backgroundColor: map.color + '12' }]}>
            {React.cloneElement(map.icon, { color: map.color })}
          </View>
          <Text style={styles.toastText}>{message}</Text>
        </View>
      </View>
    </Animated.View>
  );
};


export const TopBar = ({ title, subtitle, leading, trailing, onBack, onLeadingClick }) => {
  const handleClick = onBack || onLeadingClick;
  return (
    <View style={styles.topBar}>
      <View style={styles.topBarLeft}>
        {handleClick || leading ? (
          <TouchableOpacity onPress={handleClick} style={styles.topBarAction}>
            {leading || <IconBack size={20} color={T.text} />}
          </TouchableOpacity>
        ) : null}
        <View>
          <Text style={styles.topBarTitle} numberOfLines={1}>{title}</Text>
          {subtitle ? <Text style={styles.topBarSubtitle} numberOfLines={1}>{subtitle}</Text> : null}
        </View>
      </View>
      <View style={{ flex: 1 }} />
      {trailing}
    </View>
  );
};

export const BottomNav = ({ items, active, onChange }) => {
  return (
    <View style={styles.bottomNav}>
      {items.map(it => {
        const on = it.id === active;
        return (
          <TouchableOpacity key={it.id} onPress={() => onChange(it.id)} style={styles.navItem}>
            <View style={[styles.navIconWrapper, on && { backgroundColor: T.accentSoft }]}>
              {React.cloneElement(it.icon, { size: 19, color: on ? T.accent : T.textDim })}
            </View>
            <Text style={[styles.navLabel, { color: on ? T.text : T.textDim, fontWeight: on ? '600' : '500' }]}>
              {it.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export const Avatar = ({ initials, color = T.accent, size = 36 }) => {
  return (
    <View style={[
      styles.avatar,
      { width: size, height: size, borderRadius: size * 0.32, backgroundColor: color }
    ]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.36 }]}>{initials}</Text>
    </View>
  );
};

export const SearchBar = ({ value, onChange, placeholder = 'Search…' }) => (
  <View style={styles.searchBar}>
    <IconSearch size={16} color={T.textDim} />
    <RNTextInput
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor={T.textFaint}
      style={styles.searchInput}
    />
    {value ? (
      <TouchableOpacity onPress={() => onChange('')}>
        <IconX size={16} color={T.textDim} />
      </TouchableOpacity>
    ) : null}
  </View>
);

export const Chip = ({ children, on, onClick }) => (
  <TouchableOpacity
    onPress={onClick}
    style={[styles.chip, on && { backgroundColor: T.accent, borderColor: T.accent }]}
  >
    <Text style={[styles.chipText, on && { color: '#fff' }]}>{children}</Text>
  </TouchableOpacity>
);

export const Select = ({ value, options, onChange }) => (
  <View style={styles.selectContainer}>
    {options.map(o => {
      const on = o.value === value;
      return (
        <TouchableOpacity 
          key={o.value} 
          onPress={() => onChange(o.value)} 
          style={[styles.selectOption, on && { backgroundColor: T.accentSoft, borderColor: T.accent }]}
        >
          <Text style={[styles.selectOptionText, on && { color: T.accent, fontWeight: '700' }]}>{o.label}</Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

export const Sparkline = ({ data, color = '#3B82F6', height = 28, width = 76, fill = true }) => {
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const pts = data.map((v, i) => [i * stepX, height - ((v - min) / range) * (height - 2) - 1]);
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = `${path} L${width} ${height} L0 ${height} Z`;

  return (
    <Svg width={width} height={height}>
      {fill && (
        <Defs>
          <LinearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <Stop offset="100%" stopColor={color} stopOpacity="0" />
          </LinearGradient>
        </Defs>
      )}
      {fill && <Path d={area} fill={`url(#sg-${color.replace('#', '')})`} />}
      <Path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
};

export const StatCard = ({ icon, label, value, delta, spark, sparkColor, accent }) => (
  <View style={styles.statCard}>
    <View style={styles.statHeader}>
      <View style={[styles.statIconWrapper, { backgroundColor: accent || T.accentSoft }]}>
        {React.cloneElement(icon, { size: 16, color: T.accent })}
      </View>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
    <View style={styles.statFooter}>
      <View>
        <Text style={styles.statValue}>{value}</Text>
        {delta != null && (
          <Text style={[styles.statDelta, { color: delta >= 0 ? T.good : T.bad }]}>
            {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}%
          </Text>
        )}
      </View>
      {spark && <Sparkline data={spark} color={sparkColor || T.accent} />}
    </View>
  </View>
);

export const EmptyState = ({ icon, title, hint, action }) => (
  <View style={styles.emptyState}>
    <View style={styles.emptyIconWrapper}>
      {React.cloneElement(icon, { size: 26, color: T.textDim })}
    </View>
    <Text style={styles.emptyTitle}>{title}</Text>
    <Text style={styles.emptyHint}>{hint}</Text>
    {action && <View style={{ marginTop: 4 }}>{action}</View>}
  </View>
);

export const BottomSheet = ({ open, onClose, title, children, height }) => (
  <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
    <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.modalOverlay}>
      <TouchableOpacity activeOpacity={1} onPress={() => {}} style={[styles.sheetContent, { maxHeight: height || '80%' }]}>
        <View style={styles.sheetHandle} />
        {title && <Text style={styles.sheetTitle}>{title}</Text>}
        <ScrollView>{children}</ScrollView>
      </TouchableOpacity>
    </TouchableOpacity>
  </Modal>
);

export const ConfirmDialog = ({ open, onClose, onConfirm, title, body, confirmLabel = 'Confirm', danger }) => (
  <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
    <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.modalOverlay}>
      <TouchableOpacity activeOpacity={1} onPress={() => {}} style={styles.dialogContent}>
        <View style={styles.dialogHeader}>
          <View style={[styles.dialogIcon, { backgroundColor: danger ? T.badSoft : T.accentSoft }]}>
            <IconAlert size={20} color={danger ? T.bad : T.accent} />
          </View>
          <Text style={styles.dialogTitle}>{title}</Text>
        </View>
        <Text style={styles.dialogBody}>{body}</Text>
        <View style={styles.dialogFooter}>
          <Btn variant="ghost" onClick={onClose} style={{ flex: 1 }}>Cancel</Btn>
          <Btn variant="primary" danger={danger} onClick={onConfirm} style={{ flex: 1 }}>{confirmLabel}</Btn>
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  </Modal>
);

export const RoleBadge = ({ status }) => {
  const map = {
    CRIT:      { color: T.bad,    bg: T.badSoft,    label: 'CRIT'      },
    WARN:      { color: T.warn,   bg: 'rgba(245,158,11,.12)', label: 'WARN'   },
    IDLE:      { color: T.textDim, bg: 'rgba(138,149,165,.1)', label: 'IDLE' },
    OCCUPIED:  { color: T.accent, bg: T.accentSoft, label: 'OCCUPIED' },
    AVAILABLE: { color: T.good,   bg: T.goodSoft,   label: 'AVAILABLE' },
    CLEANING:  { color: T.warn,   bg: 'rgba(245,158,11,.12)', label: 'CLEANING' },
  };
  const s = map[status] || { color: T.textDim, bg: 'rgba(138,149,165,.1)', label: status };
  return (
    <View style={[styles.roleBadge, { backgroundColor: s.bg }]}>
      <Text style={[styles.roleBadgeText, { color: s.color }]}>{s.label}</Text>
    </View>
  );
};

export const SignalBars = ({ strength = 3 }) => (
  <View style={styles.signalBars}>
    {[1, 2, 3, 4].map(i => (
      <View key={i} style={[
        styles.signalBar,
        { height: 3 + i * 2, backgroundColor: i <= strength ? T.accent : T.border }
      ]} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  fieldContainer: { gap: 6, marginBottom: 14 },
  fieldHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  fieldLabel: { fontSize: 11, color: T.textDim, fontWeight: '500', letterSpacing: 0.2 },
  fieldOptional: { fontSize: 10, color: T.textFaint, fontFamily: 'JetBrains Mono' },
  fieldErrorContainer: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  fieldErrorText: { fontSize: 11, color: T.bad },
  fieldHint: { fontSize: 11, color: T.textFaint },
  mono: { fontFamily: 'JetBrains Mono' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: T.surface, borderWidth: 1, borderColor: T.borderSoft, borderRadius: 12, paddingHorizontal: 12, height: 42 },
  inputMultiline: { height: 'auto', minHeight: 120, alignItems: 'flex-start' },
  inputError: { borderColor: T.bad },
  inputLeading: { justifyContent: 'center', alignItems: 'center' },
  input: { flex: 1, fontSize: 14, padding: 0 },
  inputTrailing: {},
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 12, height: 42, paddingHorizontal: 16 },
  btnSm: { height: 32, paddingHorizontal: 12 },
  btnLg: { height: 52, paddingHorizontal: 18 },
  btnText: { fontSize: 14, fontWeight: '600', letterSpacing: 0.1 },
  btnTextSm: { fontSize: 12.5 },
  btnTextLg: { fontSize: 15 },
  iconBtn: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: { width: 18, height: 18, borderRadius: 5, borderWidth: 1.5, borderColor: T.border, alignItems: 'center', justifyContent: 'center' },
  checkLabel: { fontSize: 12.5, color: T.textDim },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoPlaceholder: { backgroundColor: T.accent, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontWeight: '700', letterSpacing: -0.2, color: T.text },
  logoSub: { fontSize: 10, color: T.textFaint, fontFamily: 'JetBrains Mono', letterSpacing: 0.8, marginTop: 4 },
  otpContainer: { flexDirection: 'row', gap: 8, justifyContent: 'space-between' },
  otpInput: { width: 46, height: 56, textAlign: 'center', borderRadius: 12, borderWidth: 1.5, color: T.text, fontSize: 24, fontWeight: '700', fontFamily: 'JetBrains Mono' },
  glowIconWrapper: { width: 72, height: 72, alignItems: 'center', justifyContent: 'center' },
  glowRing: { position: 'absolute', width: 72, height: 72, borderRadius: 36, opacity: 0.12 },
  glowRing2: { position: 'absolute', width: 50, height: 50, borderRadius: 25, opacity: 0.08 },
  iconCircle: { width: 60, height: 60, borderRadius: 30, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  strengthContainer: { gap: 6, marginVertical: 4 },
  strengthBars: { flexDirection: 'row', gap: 5 },
  strengthBar: { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: { fontSize: 11, fontWeight: '500' },
  toastWrapper: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 32,
    left: 16,
    right: 16,
    zIndex: 9999,
    alignItems: 'center',
  },
  toastContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  toastAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  toastInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
  },
  toastIconBox: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastText: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '600',
    color: T.text,
  },
  topBar: { height: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: T.borderSoft, backgroundColor: T.bg },
  topBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  topBarAction: { width: 36, height: 36, borderRadius: 10, backgroundColor: T.surface, alignItems: 'center', justifyContent: 'center' },
  topBarTitle: { fontSize: 16.5, fontWeight: '700', color: T.text, letterSpacing: -0.2 },
  topBarSubtitle: { fontSize: 11, color: T.textDim, marginTop: 1 },
  bottomNav: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: T.borderSoft, backgroundColor: T.bg, paddingBottom: Platform.OS === 'ios' ? 12 : 6, paddingTop: 6, paddingHorizontal: '15%' },
  navItem: { flex: 1, alignItems: 'center', gap: 3, paddingVertical: 6 },
  navIconWrapper: { paddingVertical: 3, paddingHorizontal: 14, borderRadius: 999 },
  navLabel: { fontSize: 9.5, letterSpacing: 0.2 },
  avatar: { alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '600', letterSpacing: 0.2 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: T.surface, borderWidth: 1, borderColor: T.borderSoft, borderRadius: 12, paddingHorizontal: 12, height: 42 },
  searchInput: { flex: 1, fontSize: 14, color: T.text, padding: 0 },
  chip: { paddingVertical: 6, paddingHorizontal: 13, borderRadius: 999, borderWidth: 1, borderColor: T.border },
  chipText: { fontSize: 11.5, fontWeight: '600', color: T.textDim, letterSpacing: 0.4 },
  selectContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  selectOption: { paddingVertical: 7, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: T.border },
  selectOptionText: { fontSize: 12.5, color: T.textDim },
  statCard: { backgroundColor: T.surface, borderWidth: 1, borderColor: T.borderSoft, borderRadius: 14, padding: 12, flex: 1 },
  statHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  statIconWrapper: { width: 26, height: 26, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  statLabel: { fontSize: 10.5, color: T.textDim, fontWeight: '500', letterSpacing: 0.2, flex: 1 },
  statFooter: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 },
  statValue: { fontSize: 24, fontWeight: '600', color: T.text, letterSpacing: -0.1 },
  statDelta: { fontSize: 10, fontFamily: 'JetBrains Mono', marginTop: 2 },
  emptyState: { paddingVertical: 36, paddingHorizontal: 24, alignItems: 'center', gap: 10 },
  emptyIconWrapper: { width: 56, height: 56, borderRadius: 16, backgroundColor: T.surface, borderWidth: 1, borderColor: T.borderSoft, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 15, fontWeight: '600', color: T.text },
  emptyHint: { fontSize: 12.5, color: T.textDim, maxWidth: 240, textAlign: 'center', lineHeight: 18 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheetContent: { width: '100%', backgroundColor: T.surface2, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderTopWidth: 1, borderTopColor: T.border, padding: 18 },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: T.border, alignSelf: 'center', marginBottom: 14 },
  sheetTitle: { fontSize: 16, fontWeight: '600', color: T.text, marginBottom: 14 },
  dialogContent: { width: '90%', backgroundColor: T.surface2, borderRadius: 16, borderWidth: 1, borderColor: T.border, padding: 20, alignSelf: 'center', marginBottom: 'auto', marginTop: 'auto' },
  dialogHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  dialogIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  dialogTitle: { fontSize: 16, fontWeight: '600', color: T.text },
  dialogBody: { fontSize: 13, color: T.textDim, lineHeight: 20, marginBottom: 18 },
  dialogFooter: { flexDirection: 'row', gap: 8 },
  roleBadge: { paddingVertical: 2, paddingHorizontal: 7, borderRadius: 4 },
  roleBadgeText: { fontSize: 9.5, fontWeight: '700', letterSpacing: 0.6, fontFamily: 'JetBrains Mono' },
  signalBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  signalBar: { width: 3, borderRadius: 1 },
});
