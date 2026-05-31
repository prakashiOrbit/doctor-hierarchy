// iTouch Doctor — seeded clinical data: wards, patients, alarms, instructions, presets.

export const SEV = {
  critical: { color: '#EF4444', soft: 'rgba(239,68,68,.14)', label: 'CRITICAL', rank: 4 },
  high:     { color: '#F97316', soft: 'rgba(249,115,22,.14)', label: 'HIGH',     rank: 3 },
  medium:   { color: '#EAB308', soft: 'rgba(234,179,8,.14)',  label: 'MEDIUM',   rank: 2 },
  low:      { color: '#3B82F6', soft: 'rgba(59,130,246,.14)', label: 'LOW',      rank: 1 },
  normal:   { color: '#10B981', soft: 'rgba(16,185,129,.14)', label: 'NORMAL',   rank: 0 },
};

// Status of a patient bed
export const PSTATUS = {
  critical: { color: '#EF4444', label: 'CRITICAL' },
  watch:    { color: '#EAB308', label: 'AT RISK' },
  stable:   { color: '#10B981', label: 'STABLE' },
};

// Avatar color from a name hash
const AVATAR_HUES = ['#3B82F6','#8B5CF6','#EC4899','#F97316','#14B8A6','#06B6D4','#10B981','#F59E0B'];
export function nameColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_HUES[h % AVATAR_HUES.length];
}
export function initials(name) {
  if (!name) return '';
  return name.replace(/^(Mr|Mrs|Ms|Dr)\.?\s+/i, '').split(/\s+/).slice(0, 2).map(s => s[0]).join('').toUpperCase();
}

// ─── Wards ───────────────────────────────────────────────────
export const WARDS = [
  { id: 'icu-a', name: 'ICU-A',  type: 'ICU',     floor: 'Level 4 · East' },
  { id: 'ccu-1', name: 'CCU-1',  type: 'CCU',     floor: 'Level 3 · Cardiac' },
  { id: 'gen-3', name: 'GEN-3W', type: 'GENERAL', floor: 'Level 2 · West' },
];

// ─── Vital reference ranges ──────────────────────────────────
export const RANGES = {
  hr:   { label: 'Heart Rate',  unit: 'bpm',  low: 60,  high: 100, full: 'Normal 60–100' },
  spo2: { label: 'SpO₂',        unit: '%',    low: 95,  high: 100, full: 'Normal 95–100' },
  rr:   { label: 'Resp Rate',   unit: 'brpm', low: 12,  high: 20,  full: 'Normal 12–20' },
  temp: { label: 'Temperature', unit: '°C',   low: 36.1, high: 37.8, full: 'Normal 36.1–37.8' },
  nibp: { label: 'NIBP',        unit: 'mmHg', low: 90,  high: 140, full: 'Normal 90/60–140/90' },
};

export function vitalStatus(key, v) {
  const r = RANGES[key];
  if (!r) return 'normal';
  if (key === 'nibp') return 'normal';
  if (v < r.low) return v < r.low - (r.low * 0.2) ? 'critical' : 'medium';
  if (v > r.high) return v > r.high + (r.high * 0.15) ? 'critical' : 'medium';
  return 'normal';
}

// ─── Patients ────────────────────────────────────────────────
export const PATIENTS = [
  {
    id: 'p1', name: 'Eleanor Whitfield', age: 71, gender: 'F', mrn: 'MRN-48213',
    bed: 'BED-12', wardId: 'icu-a', blood: 'O+', admitted: '14 May 2026', status: 'critical',
    vitals: { hr: 128, spo2: 88, rr: 26, nibpSys: 158, nibpDia: 94, temp: 38.4, etco2: 31 },
    dx: 'Acute respiratory distress · post-op sepsis watch',
    history: [
      { date: '14 May', kind: 'Admission', text: 'Admitted via ED — acute respiratory distress, intubated.', by: 'RS' },
      { date: '15 May', kind: 'Procedure', text: 'Central line placed (R internal jugular).', by: 'MK' },
      { date: '18 May', kind: 'Diagnosis', text: 'ARDS confirmed on CT. Started lung-protective ventilation.', by: 'RS' },
      { date: '24 May', kind: 'Note', text: 'Weaning trial deferred — SpO₂ instability overnight.', by: 'AB' },
    ],
    instructions: [
      { id: 'i1', ts: 'Today · 09:14', text: 'Titrate FiO₂ to maintain SpO₂ ≥ 92%. Reassess ABG in 1h.', cat: 'PROCEDURE', status: 'ACTIVE' },
      { id: 'i2', ts: 'Yesterday · 22:40', text: 'Hold sedation interruption until haemodynamically stable.', cat: 'MEDICATION', status: 'COMPLETED' },
    ],
    nurses: ['Aisha Bello', 'Tom Hale'], doctors: ['Dr. R. Shah', 'Dr. M. Kaur'],
  },
  {
    id: 'p2', name: 'Marcus Doyle', age: 58, gender: 'M', mrn: 'MRN-39120',
    bed: 'BED-08', wardId: 'icu-a', blood: 'A−', admitted: '20 May 2026', status: 'watch',
    vitals: { hr: 104, spo2: 94, rr: 22, nibpSys: 146, nibpDia: 88, temp: 37.9, etco2: 38 },
    dx: 'Post-laparotomy · ileus, monitoring',
    history: [
      { date: '20 May', kind: 'Admission', text: 'Emergency laparotomy for perforated diverticulitis.', by: 'JO' },
      { date: '22 May', kind: 'Note', text: 'Low-grade pyrexia, cultures pending.', by: 'JO' },
    ],
    instructions: [
      { id: 'i3', ts: 'Today · 07:50', text: 'Encourage early mobilisation. PT consult requested.', cat: 'ACTIVITY', status: 'ACTIVE' },
    ],
    nurses: ['Priya Nair'], doctors: ['Dr. J. Owusu'],
  },
  {
    id: 'p3', name: 'Sofia Marchetti', age: 64, gender: 'F', mrn: 'MRN-51002',
    bed: 'BED-03', wardId: 'ccu-1', blood: 'B+', admitted: '23 May 2026', status: 'critical',
    vitals: { hr: 42, spo2: 96, rr: 16, nibpSys: 98, nibpDia: 60, temp: 36.6, etco2: 36 },
    dx: 'Symptomatic bradycardia · pending pacing',
    history: [
      { date: '23 May', kind: 'Admission', text: 'Presented with syncope, complete heart block on ECG.', by: 'LC' },
      { date: '23 May', kind: 'Procedure', text: 'Temporary transvenous pacing wire inserted.', by: 'LC' },
    ],
    instructions: [
      { id: 'i4', ts: 'Today · 06:20', text: 'NPO from midnight — scheduled for permanent PPM insertion.', cat: 'DIET', status: 'ACTIVE' },
    ],
    nurses: ['Grace Lin'], doctors: ['Dr. L. Castro'],
  },
  {
    id: 'p4', name: 'Hiroshi Tanaka', age: 67, gender: 'M', mrn: 'MRN-44781',
    bed: 'BED-05', wardId: 'ccu-1', blood: 'AB+', admitted: '21 May 2026', status: 'watch',
    vitals: { hr: 88, spo2: 97, rr: 18, nibpSys: 134, nibpDia: 82, temp: 36.9, etco2: 37 },
    dx: 'NSTEMI · day 3, stable trend',
    history: [
      { date: '21 May', kind: 'Admission', text: 'NSTEMI — troponin rising, started dual antiplatelet.', by: 'LC' },
      { date: '22 May', kind: 'Procedure', text: 'Coronary angiogram: 80% LAD stenosis, stent placed.', by: 'LC' },
    ],
    instructions: [],
    nurses: ['Grace Lin'], doctors: ['Dr. L. Castro', 'Dr. R. Shah'],
  },
  {
    id: 'p5', name: 'Amara Okafor', age: 34, gender: 'F', mrn: 'MRN-60934',
    bed: 'BED-14', wardId: 'gen-3', blood: 'O−', admitted: '25 May 2026', status: 'stable',
    vitals: { hr: 76, spo2: 99, rr: 15, nibpSys: 118, nibpDia: 74, temp: 36.7, etco2: 38 },
    dx: 'Community-acquired pneumonia · improving',
    history: [
      { date: '25 May', kind: 'Admission', text: 'CAP, started IV co-amoxiclav.', by: 'JO' },
      { date: '27 May', kind: 'Note', text: 'Afebrile 24h, switched to oral antibiotics.', by: 'JO' },
    ],
    instructions: [
      { id: 'i5', ts: 'Today · 08:05', text: 'Step down to oral antibiotics. Plan discharge review tomorrow.', cat: 'MEDICATION', status: 'ACTIVE' },
    ],
    nurses: ['Daniel Ross'], doctors: ['Dr. J. Owusu'],
  },
  {
    id: 'p6', name: 'Robert Niemann', age: 79, gender: 'M', mrn: 'MRN-22518',
    bed: 'BED-16', wardId: 'gen-3', blood: 'A+', admitted: '19 May 2026', status: 'watch',
    vitals: { hr: 92, spo2: 93, rr: 21, nibpSys: 142, nibpDia: 86, temp: 37.6, etco2: 40 },
    dx: 'COPD exacerbation · O₂ dependent',
    history: [
      { date: '19 May', kind: 'Admission', text: 'Infective COPD exacerbation, started steroids + nebs.', by: 'JO' },
      { date: '23 May', kind: 'Note', text: 'Slow responder, continues to need supplemental O₂.', by: 'AB' },
    ],
    instructions: [],
    nurses: ['Daniel Ross'], doctors: ['Dr. J. Owusu'],
  },
  {
    id: 'p7', name: 'Lena Vasquez', age: 45, gender: 'F', mrn: 'MRN-71240',
    bed: 'BED-18', wardId: 'gen-3', blood: 'B−', admitted: '26 May 2026', status: 'stable',
    vitals: { hr: 68, spo2: 98, rr: 14, nibpSys: 112, nibpDia: 70, temp: 36.5, etco2: 37 },
    dx: 'Post-op cholecystectomy · routine',
    history: [
      { date: '26 May', kind: 'Procedure', text: 'Laparoscopic cholecystectomy, uncomplicated.', by: 'JO' },
    ],
    instructions: [],
    nurses: ['Daniel Ross'], doctors: ['Dr. J. Owusu'],
  },
];

export function patientById(id) { return PATIENTS.find(p => p.id === id); }
export function patientsInWard(wardId) { return PATIENTS.filter(p => p.wardId === wardId); }

// ─── Active alarms ───────────────────────────────────────────
// Built off the critical/watch patients above so the data stays coherent.
export const ALARMS = [
  {
    id: 'a1', patientId: 'p1', severity: 'critical', param: 'SpO2',
    value: 88, unit: '%', normal: 'Normal 95–100', raisedMin: 2,
    desc: 'SpO₂ critically low (88%)', dir: 'down', deviation: 7,
  },
  {
    id: 'a2', patientId: 'p3', severity: 'critical', param: 'HR',
    value: 42, unit: 'bpm', normal: 'Normal 60–100', raisedMin: 4,
    desc: 'Severe bradycardia (42 bpm)', dir: 'down', deviation: 18,
  },
  {
    id: 'a3', patientId: 'p1', severity: 'high', param: 'HR',
    value: 128, unit: 'bpm', normal: 'Normal 60–100', raisedMin: 6,
    desc: 'Tachycardia (128 bpm)', dir: 'up', deviation: 28,
  },
  {
    id: 'a4', patientId: 'p2', severity: 'medium', param: 'TEMP',
    value: 37.9, unit: '°C', normal: 'Normal 36.1–37.8', raisedMin: 14,
    desc: 'Pyrexia (37.9 °C)', dir: 'up', deviation: 0.1,
  },
  {
    id: 'a5', patientId: 'p6', severity: 'medium', param: 'RR',
    value: 21, unit: 'brpm', normal: 'Normal 12–20', raisedMin: 19,
    desc: 'Elevated respiratory rate (21 brpm)', dir: 'up', deviation: 1,
  },
  {
    id: 'a6', patientId: 'p2', severity: 'low', param: 'NIBP',
    value: '146/88', unit: 'mmHg', normal: 'Normal ≤140/90', raisedMin: 31,
    desc: 'Mild hypertension (146/88)', dir: 'up', deviation: 6,
  },
];

export function alarmById(id) { return ALARMS.find(a => a.id === id); }

// ─── Preset instructions ─────────────────────────────────────
export const PRESETS = [
  { id: 'pr1', name: 'Hourly neuro observations', cat: 'PROCEDURE', text: 'Perform GCS and pupillary observations hourly. Escalate any drop ≥2 points immediately.' },
  { id: 'pr2', name: 'Fluid restriction 1.5 L/day', cat: 'DIET', text: 'Restrict total fluid intake to 1.5 L per 24h. Strict input/output charting.' },
  { id: 'pr3', name: 'Titrate oxygen to target', cat: 'PROCEDURE', text: 'Titrate supplemental O₂ to maintain SpO₂ 94–98% (88–92% if COPD). Wean as tolerated.' },
  { id: 'pr4', name: 'Early mobilisation', cat: 'ACTIVITY', text: 'Encourage mobilisation as tolerated with physiotherapy. Sit out for meals.' },
  { id: 'pr5', name: 'VTE prophylaxis', cat: 'MEDICATION', text: 'Commence LMWH prophylaxis unless contraindicated. Apply TED stockings.' },
  { id: 'pr6', name: 'Sliding-scale insulin', cat: 'MEDICATION', text: 'Initiate variable-rate insulin infusion. Check capillary glucose hourly.' },
  { id: 'pr7', name: 'NPO from midnight', cat: 'DIET', text: 'Nil by mouth from 00:00 in preparation for procedure. IV maintenance fluids.' },
  { id: 'pr8', name: 'Repeat bloods in AM', cat: 'PROCEDURE', text: 'Repeat FBC, U&E and CRP with morning round bloods. Review trend.' },
];

// ─── 24h alarm trend (per severity, hourly buckets) ──────────
function buildTrend() {
  const buckets = [];
  for (let h = 0; h < 24; h++) {
    const base = h >= 6 && h <= 9 ? 1.6 : h >= 0 && h <= 4 ? 1.4 : 1;
    buckets.push({
      hour: h,
      critical: Math.max(0, Math.round((Math.sin(h / 3) + 1) * base * 0.7)),
      high:     Math.max(0, Math.round((Math.cos(h / 4) + 1.2) * base)),
      medium:   Math.max(0, Math.round((Math.sin(h / 2 + 1) + 1.4) * base * 1.3)),
      low:      Math.max(0, Math.round((Math.cos(h / 5 + 2) + 1.3) * base * 1.1)),
    });
  }
  return buckets;
}
export const ALARM_TREND = buildTrend();

// Mini 30-min vitals trend for alarm detail (shows the drop/spike)
export function alarmTrendSeries(alarm) {
  const pts = [];
  const target = typeof alarm.value === 'number' ? alarm.value : 120;
  const baseline = alarm.dir === 'down' ? target + alarm.deviation + (alarm.param === 'HR' ? 30 : 8)
                                        : target - alarm.deviation - (alarm.param === 'HR' ? 24 : 6);
  for (let i = 0; i < 30; i++) {
    const t = i / 29;
    // stable baseline, then deviation event in last third
    let v = baseline + (Math.random() - 0.5) * (alarm.param === 'HR' ? 4 : 1.2);
    if (t > 0.62) {
      const k = (t - 0.62) / 0.38;
      v = baseline + (target - baseline) * Math.min(1, k * 1.15) + (Math.random() - 0.5) * 2;
    }
    pts.push(+v.toFixed(1));
  }
  pts[29] = target;
  return pts;
}
