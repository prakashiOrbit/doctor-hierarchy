import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, G, Line } from 'react-native-svg';
import { T } from '../theme/tokens';

function ecgSample(ph) {
  const g = (c, w, a) => a * Math.exp(-((ph - c) ** 2) / (2 * w * w));
  return g(0.18, 0.024, 0.13) - g(0.30, 0.013, 0.16) + g(0.335, 0.012, 1.0)
       - g(0.365, 0.016, 0.30) + g(0.58, 0.045, 0.34);
}

function plethSample(ph) {
  return Math.exp(-((ph - 0.20) ** 2) / (2 * 0.10 * 0.10))
       + 0.34 * Math.exp(-((ph - 0.50) ** 2) / (2 * 0.08 * 0.08));
}

function respSample(ph) {
  return 0.5 * (1 + Math.sin(ph * 2 * Math.PI - Math.PI / 2));
}

export const WaveformView = ({ type = 'ecg', color = '#22D38B', height = 92, speed = 1, label, value, unit }) => {
  const [width, setWidth] = useState(0);
  const [pathData, setPathData] = useState('');
  const offsetRef = useRef(0);
  const rafRef = useRef(0);

  const cfg = {
    ecg:  { beat: 150, amp: 0.42, fn: ecgSample,  base: 0.55 },
    spo2: { beat: 120, amp: 0.50, fn: plethSample, base: 0.72 },
    resp: { beat: 280, amp: 0.40, fn: respSample,  base: 0.5 },
  }[type];

  useEffect(() => {
    if (width === 0) return;

    const draw = () => {
      offsetRef.current += speed * 1.6;
      const off = offsetRef.current;
      const mid = height * cfg.base;
      const amp = height * cfg.amp;

      let d = '';
      for (let x = 0; x <= width; x += 2) { // Step by 2 for performance
        const ph = (((x + off) % cfg.beat) / cfg.beat);
        const y = mid - cfg.fn(ph) * amp;
        if (x === 0) d += `M${x},${y}`; else d += ` L${x},${y}`;
      }

      setPathData(d);
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [width, speed, type]);

  const onLayout = (e) => {
    setWidth(e.nativeEvent.layout.width);
  };

  const gridRows = [];
  for (let y = 0; y <= height; y += 22) gridRows.push(y);
  const gridCols = [];
  if (width > 0) {
    for (let x = 0; x <= width; x += 26) gridCols.push(x);
  }

  return (
    <View style={[styles.container, { height }]} onLayout={onLayout}>
      <Svg width="100%" height={height}>
        <G stroke="rgba(255,255,255,.045)" strokeWidth="1">
          {gridRows.map(y => <Line key={`r${y}`} x1="0" y1={y} x2="100%" y2={y} />)}
          {gridCols.map(x => <Line key={`c${x}`} x1={x} y1="0" x2={x} y2={height} />)}
        </G>
        <Path
          d={pathData}
          stroke={color}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color }]}>{label}</Text>
        </View>
      )}
      {value != null && (
        <View style={styles.valueContainer}>
          <Text style={[styles.value, { color }]}>{value}</Text>
          <Text style={[styles.unit, { color }]}>{unit}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#070B10',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.06)',
  },
  labelContainer: {
    position: 'absolute',
    top: 7,
    left: 10,
  },
  label: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    fontFamily: 'JetBrains Mono',
  },
  valueContainer: {
    position: 'absolute',
    top: 6,
    right: 10,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'JetBrains Mono',
    lineHeight: 24,
  },
  unit: {
    fontSize: 10,
    opacity: 0.7,
  },
});
