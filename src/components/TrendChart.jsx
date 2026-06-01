import React from 'react';
import { View, Text } from 'react-native';
import Svg, {
  Path,
  Circle,
  Rect,
  G,
  Defs,
  LinearGradient,
  Stop,
  Line,
  Text as SvgText,
} from 'react-native-svg';

export const TrendChart = ({ series, color, normalLow, normalHigh, vkey, height = 190 }) => {
  const W = 340, H = height;
  const pad = { top: 14, right: 10, bottom: 26, left: 34 };
  const iW = W - pad.left - pad.right, iH = H - pad.top - pad.bottom;
  const vals = series.map(p => p.v);
  const minV = Math.min(...vals, normalLow != null ? normalLow : Infinity);
  const maxV = Math.max(...vals, normalHigh != null ? normalHigh : -Infinity);
  const vRange = (maxV - minV) || 1;
  
  const cx = i => pad.left + (i / (series.length - 1)) * iW;
  const cy = v => pad.top + (1 - (v - minV) / vRange) * iH;
  
  const linePath = vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${cx(i).toFixed(1)} ${cy(v).toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${cx(vals.length - 1).toFixed(1)} ${(pad.top + iH).toFixed(1)} L${cx(0).toFixed(1)} ${(pad.top + iH).toFixed(1)} Z`;
  const gradId = `tca-${vkey || 'v'}`;
  
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(t => +(minV + t * vRange).toFixed(minV < 10 ? 1 : 0));
  const xLabels = [0, 8, 16, 24, 32, 40].filter(i => i < series.length).map(i => ({ i, label: series[i].label }));

  return (
    <Svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ overflow: 'visible' }}>
      <Defs>
        <LinearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <Stop offset="0%" stopColor={color} stopOpacity="0.28"/>
          <Stop offset="100%" stopColor={color} stopOpacity="0"/>
        </LinearGradient>
      </Defs>
      
      {/* Normal range band */}
      {normalLow != null && normalHigh != null && (
        <Rect 
          x={pad.left} 
          y={cy(normalHigh)} 
          width={iW} 
          height={Math.abs(cy(normalLow) - cy(normalHigh))}
          fill="rgba(16,185,129,0.07)" 
          rx="2"
        />
      )}
      
      {/* Grid */}
      {ticks.map((v, i) => (
        <G key={i}>
          <Line 
            x1={pad.left} 
            x2={pad.left + iW} 
            y1={cy(v)} 
            y2={cy(v)} 
            stroke="rgba(255,255,255,0.05)" 
            strokeWidth="1"
          />
          <SvgText 
            x={pad.left - 4} 
            y={cy(v) + 3.5} 
            textAnchor="end" 
            fontSize="8.5" 
            fill="rgba(255,255,255,0.28)" 
            fontFamily="JetBrains Mono"
          >
            {v}
          </SvgText>
        </G>
      ))}
      
      {/* Normal range lines */}
      {normalHigh != null && (
        <Line 
          x1={pad.left} 
          x2={pad.left + iW} 
          y1={cy(normalHigh)} 
          y2={cy(normalHigh)} 
          stroke="rgba(16,185,129,0.45)" 
          strokeWidth="1" 
          strokeDasharray="4 3"
        />
      )}
      {normalLow  != null && (
        <Line 
          x1={pad.left} 
          x2={pad.left + iW} 
          y1={cy(normalLow)}  
          y2={cy(normalLow)}  
          stroke="rgba(16,185,129,0.45)" 
          strokeWidth="1" 
          strokeDasharray="4 3"
        />
      )}
      
      {/* Area + line */}
      <Path d={areaPath} fill={`url(#${gradId})`}/>
      <Path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
      
      {/* End dot */}
      <Circle 
        cx={cx(vals.length - 1)} 
        cy={cy(vals[vals.length - 1])} 
        r="4" 
        fill={color} 
        stroke="#0D1117" 
        strokeWidth="2"
      />
      
      {/* X labels */}
      {xLabels.map(({ i, label }) => (
        <SvgText 
          key={i} 
          x={cx(i)} 
          y={H - pad.bottom + 16} 
          textAnchor="middle" 
          fontSize="8" 
          fill="rgba(255,255,255,0.28)" 
          fontFamily="JetBrains Mono"
        >
          {label}
        </SvgText>
      ))}
    </Svg>
  );
};
