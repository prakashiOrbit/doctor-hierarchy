import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { T } from '../theme/tokens';
import { PATIENTS } from '../data/mockData';
import { IconCheck } from '../components/Icons';

export const QRScanOverlay = ({ onClose, onScan }) => {
  const [scanning, setScanning] = useState(false);
  const [found, setFound] = useState(false);
  const [scanAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Phase 1: Preparation (1.6s)
    const t1 = setTimeout(() => setScanning(true), 1600);
    
    // Phase 2: Finding (1.2s later)
    const t2 = setTimeout(() => setFound(true), 2800);
    
    // Phase 3: Completion (0.6s later)
    const t3 = setTimeout(() => {
      onScan && onScan(PATIENTS[4]); // Simulated finding Amara Okafor
    }, 3400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  useEffect(() => {
    if (scanning && !found) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
          Animated.timing(scanAnim, { toValue: 0, duration: 1400, useNativeDriver: true }),
        ])
      ).start();
    } else {
      scanAnim.stopAnimation();
    }
  }, [scanning, found]);

  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 192],
  });

  return (
    <View style={styles.container}>
      <View style={styles.scannerWrapper}>
        {/* Corner Borders */}
        <View style={[styles.corner, styles.topLeft, found && styles.cornerFound]} />
        <View style={[styles.corner, styles.topRight, found && styles.cornerFound]} />
        <View style={[styles.corner, styles.bottomLeft, found && styles.cornerFound]} />
        <View style={[styles.corner, styles.bottomRight, found && styles.cornerFound]} />
        
        {/* Animated Scan Line */}
        {scanning && !found && (
          <Animated.View style={[styles.scanLine, { transform: [{ translateY }] }]} />
        )}
        
        {/* Success Icon */}
        {found && (
          <View style={styles.successIconBox}>
            <IconCheck size={60} stroke={1.8} color={T.good} />
          </View>
        )}
      </View>

      <View style={styles.infoBox}>
        <Text style={[styles.infoTitle, found && { color: T.good }]}>
          {found ? 'Patient found!' : 'Scan patient wristband QR'}
        </Text>
        {found && (
          <Text style={styles.infoSub}>Amara Okafor · BED-14</Text>
        )}
      </View>

      {!found && (
        <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.96)',
    zIndex: 55,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
  },
  scannerWrapper: {
    position: 'relative',
    width: 200,
    height: 200,
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: T.accent,
    borderWidth: 0,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 6,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 6,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 6,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 6,
  },
  cornerFound: {
    borderColor: T.good,
  },
  scanLine: {
    position: 'absolute',
    left: 8,
    right: 8,
    height: 2,
    backgroundColor: T.accent,
    shadowColor: T.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    zIndex: 1,
  },
  successIconBox: {
    position: 'absolute',
    inset: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBox: {
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  infoSub: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 6,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
});
