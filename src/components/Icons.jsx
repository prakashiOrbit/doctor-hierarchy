import React from 'react';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';

const I = ({ children, size = 20, stroke = 1.6, color = 'currentColor' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <G
      stroke={color === 'currentColor' ? undefined : color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </G>
  </Svg>
);

export const IconDashboard = (p) => (
  <I {...p}>
    <Rect x="3" y="3" width="7" height="9" rx="1.5" />
    <Rect x="14" y="3" width="7" height="5" rx="1.5" />
    <Rect x="14" y="12" width="7" height="9" rx="1.5" />
    <Rect x="3" y="16" width="7" height="5" rx="1.5" />
  </I>
);

export const IconStethoscope = (p) => (
  <I {...p}>
    <Path d="M6 3v6a4 4 0 0 0 8 0V3" />
    <Path d="M6 3h2M12 3h2" />
    <Path d="M10 13v3a5 5 0 0 0 10 0v-1" />
    <Circle cx="20" cy="13" r="2" />
  </I>
);

export const IconLock = (p) => (
  <I {...p}>
    <Rect x="4" y="11" width="16" height="10" rx="2" />
    <Path d="M8 11V8a4 4 0 1 1 8 0v3" />
  </I>
);

export const IconEye = (p) => (
  <I {...p}>
    <Path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <Circle cx="12" cy="12" r="3" />
  </I>
);

export const IconEyeOff = (p) => (
  <I {...p}>
    <Path d="M2 12s3.5-7 10-7c2 0 3.8.6 5.3 1.5M22 12s-3.5 7-10 7c-2 0-3.8-.6-5.3-1.5" />
    <Path d="M3 3l18 18" />
  </I>
);

export const IconCheck = (p) => (
  <I {...p}>
    <Path d="M5 12l5 5L20 7" />
  </I>
);

export const IconBack = (p) => (
  <I {...p}>
    <Path d="M15 6l-6 6 6 6" />
  </I>
);

export const IconShield = (p) => (
  <I {...p}>
    <Path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
    <Path d="M9 12l2 2 4-4" />
  </I>
);

export const IconMail = (p) => (
  <I {...p}>
    <Rect x="3" y="5" width="18" height="14" rx="2" />
    <Path d="M3 7l9 7 9-7" />
  </I>
);

export const IconBell = (p) => (
  <I {...p}>
    <Path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <Path d="M10 21a2 2 0 0 0 4 0" />
  </I>
);

export const IconSearch = (p) => (
  <I {...p}>
    <Circle cx="11" cy="11" r="7" />
    <Path d="M21 21l-4.3-4.3" />
  </I>
);

export const IconAlert = (p) => (
  <I {...p}>
    <Path d="M12 3l10 18H2L12 3z" />
    <Path d="M12 10v4M12 18h0" />
  </I>
);

export const IconGoogle = (p) => (
  <I {...p}>
    <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" stroke="none" />
    <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" stroke="none" />
    <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" stroke="none" />
    <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" stroke="none" />
  </I>
);

export const IconUsers = (p) => (
  <I {...p}>
    <Circle cx="9" cy="8" r="3.2" />
    <Path d="M3 20c0-3 2.7-5.5 6-5.5s6 2.5 6 5.5" />
    <Circle cx="17" cy="9" r="2.4" />
    <Path d="M15 14.5c3 .2 5.5 2.4 5.5 5" />
  </I>
);

export const IconUser = (p) => (
  <I {...p}>
    <Circle cx="12" cy="8" r="4" />
    <Path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
  </I>
);

export const IconCheckCircle = (p) => (
  <I {...p}>
    <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <Path d="M22 4L12 14.01l-3-3" />
  </I>
);

export const IconDoor = (p) => (
  <I {...p}>
    <Path d="M5 21V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v17" />
    <Path d="M3 21h18" />
    <Circle cx="15" cy="12" r="1" />
  </I>
);

export const IconChevron = (p) => (
  <I {...p}>
    <Path d="M9 6l6 6-6 6" />
  </I>
);

export const IconClose = (p) => (
  <I {...p}>
    <Path d="M18 6L6 18M6 6l12 12" />
  </I>
);

export const IconDots = (p) => (
  <I {...p}>
    <Circle cx="5" cy="12" r="1" />
    <Circle cx="12" cy="12" r="1" />
    <Circle cx="19" cy="12" r="1" />
  </I>
);

export const IconActivity = (p) => (
  <I {...p}>
    <Path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </I>
);

export const IconPhone = (p) => (
  <I {...p}>
    <Path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </I>
);

export const IconClipboard = (p) => (
  <I {...p}>
    <Path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <Rect x="8" y="2" width="8" height="4" rx="1" />
  </I>
);

export const IconPlus = (p) => (
  <I {...p}>
    <Path d="M12 5v14M5 12h14" />
  </I>
);

export const IconMic = (p) => (
  <I {...p}>
    <Path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <Path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
  </I>
);

export const IconSend = (p) => (
  <I {...p}>
    <Path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
  </I>
);

export const IconEdit = (p) => (
  <I {...p}>
    <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </I>
);

export const IconSearch = (p) => (
  <I {...p}>
    <Circle cx="11" cy="11" r="8" />
    <Path d="M21 21l-4.35-4.35" />
  </I>
);

export const IconX = (p) => (
  <I {...p}>
    <Path d="M18 6L6 18M6 6l12 12" />
  </I>
);

export const IconArrowUp = (p) => (
  <I {...p}>
    <Path d="M12 19V5M5 12l7-7 7 7" />
  </I>
);

export const IconArrowDown = (p) => (
  <I {...p}>
    <Path d="M12 5v14M5 12l7 7 7-7" />
  </I>
);

export const IconChart = (p) => (
  <I {...p}>
    <Path d="M18 20V10M12 20V4M6 20v-6" />
  </I>
);

export const IconShare = (p) => (
  <I {...p}>
    <Path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v13" />
  </I>
);

export const IconHeart = (p) => (
  <I {...p}>
    <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </I>
);
