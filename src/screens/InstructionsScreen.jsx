import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { T } from '../theme/tokens';
import { PRESETS } from '../data/mockData';
import {
  Btn,
  Field,
  TextInput,
  SearchBar,
  Chip,
  Select,
} from '../components/Shared';
import { IconClose, IconMic, IconCheck } from '../components/Icons';

const INS_CATS = ['ALL', 'MEDICATION', 'PROCEDURE', 'DIET', 'ACTIVITY'];

export const InstructionsScreen = ({ patient, onClose, onPreview, showToast }) => {
  const [tab, setTab] = useState('preset');
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('ALL');
  const [selected, setSelected] = useState(null);
  const [text, setText] = useState('');
  const [customCat, setCustomCat] = useState('PROCEDURE');
  const [listening, setListening] = useState(false);

  const filtered = PRESETS.filter(pr =>
    (cat === 'ALL' || pr.cat === cat) &&
    (q === '' || pr.name.toLowerCase().includes(q.toLowerCase()) || pr.text.toLowerCase().includes(q.toLowerCase()))
  );

  const draft = tab === 'preset'
    ? (selected ? { text: PRESETS.find(p => p.id === selected).text, cat: PRESETS.find(p => p.id === selected).cat } : null)
    : (text.trim() ? { text: text.trim(), cat: customCat } : null);

  useEffect(() => {
    if (!listening) return;
    const phrases = ['Administer ', 'paracetamol 1g ', 'PO every 6 hours ', 'as required for pyrexia. '];
    let i = 0;
    const id = setInterval(() => {
      setText(t => t + phrases[i]);
      i++;
      if (i >= phrases.length) { setListening(false); clearInterval(id); }
    }, 600);
    return () => clearInterval(id);
  }, [listening]);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.overlay}
    >
      <View style={styles.sheet}>
        <View style={styles.sheetHandleContainer}>
          <View style={styles.sheetHandle} />
        </View>
        
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Write Instruction</Text>
            <Text style={styles.subtitle}>{patient.name} · {patient.bed}</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <IconClose size={17} color={T.textDim} />
          </TouchableOpacity>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabBar}>
          {[['preset', 'Preset'], ['custom', 'Custom']].map(([id, lbl]) => (
            <TouchableOpacity 
              key={id} 
              onPress={() => setTab(id)} 
              style={[styles.tab, tab === id && styles.activeTab]}
            >
              <Text style={[styles.tabLabel, tab === id && styles.activeTabLabel]}>{lbl}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.content}>
          {tab === 'preset' ? (
            <View style={{ flex: 1 }}>
              <SearchBar placeholder="Search preset instructions…" value={q} onChange={setQ} />
              <View style={styles.catRow}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
                  {INS_CATS.map(c => (
                    <Chip key={c} on={cat === c} onClick={() => setCat(c)}>{c}</Chip>
                  ))}
                </ScrollView>
              </View>
              <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.presetList}>
                {filtered.map(pr => {
                  const on = selected === pr.id;
                  return (
                    <TouchableOpacity 
                      key={pr.id} 
                      onPress={() => setSelected(pr.id)} 
                      style={[styles.presetCard, on && styles.presetCardActive]}
                    >
                      <View style={styles.presetHeader}>
                        <Text style={styles.presetName}>{pr.name}</Text>
                        <View style={styles.presetCatBadge}>
                          <Text style={styles.presetCatText}>{pr.cat}</Text>
                        </View>
                      </View>
                      <Text style={styles.presetText} numberOfLines={2}>{pr.text}</Text>
                    </TouchableOpacity>
                  );
                })}
                {filtered.length === 0 && <Text style={styles.emptyText}>No matching presets.</Text>}
              </ScrollView>
            </View>
          ) : (
            <View style={{ flex: 1, gap: 12 }}>
              <View>
                <TextInput
                  value={text}
                  onChange={setText}
                  placeholder="Write clinical instruction…"
                  multiline
                  style={styles.customInput}
                />
                <View style={styles.customActions}>
                  <TouchableOpacity 
                    onPress={() => setListening(!listening)} 
                    style={[styles.voiceBtn, listening && styles.voiceBtnActive]}
                  >
                    <IconMic size={15} color={listening ? T.bad : T.textDim} />
                    <Text style={[styles.voiceBtnText, listening && { color: T.bad }]}>
                      {listening ? 'Listening…' : 'Voice to text'}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.charCount}>{text.length}/500</Text>
                </View>
              </View>
              <Field label="Category">
                <Select 
                  value={customCat} 
                  onChange={setCustomCat} 
                  options={INS_CATS.filter(c => c !== 'ALL').map(c => ({ value: c, label: c.charAt(0) + c.slice(1).toLowerCase() }))}
                />
              </Field>
            </View>
          )}
        </View>

        <View style={styles.actionBar}>
          <Btn variant="ghost" style={{ flex: 1 }} disabled={!draft} onClick={() => onPreview(draft)}>
            Preview
          </Btn>
          <Btn variant="primary" style={{ flex: 1.4 }} disabled={!draft} icon={<IconCheck size={17} color="#fff" />} onClick={() => { if (draft) { showToast('Instruction saved', 'good'); onClose(); } }}>
            Save Instruction
          </Btn>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    zIndex: 40,
  },
  sheet: {
    backgroundColor: T.surface2,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderTopWidth: 1,
    borderTopColor: T.border,
    height: '92%',
  },
  sheetHandleContainer: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: T.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: T.text,
  },
  subtitle: {
    fontSize: 11.5,
    color: T.textDim,
    marginTop: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: T.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: T.border,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: T.accent,
    borderColor: 'transparent',
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: T.textDim,
  },
  activeTabLabel: {
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  catRow: {
    marginHorizontal: -16,
    paddingVertical: 12,
  },
  catScroll: {
    paddingHorizontal: 16,
    gap: 6,
  },
  presetList: {
    gap: 9,
    paddingBottom: 20,
  },
  presetCard: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.borderSoft,
    borderRadius: 12,
    padding: 12,
  },
  presetCardActive: {
    backgroundColor: T.accentSoft,
    borderColor: T.accent,
  },
  presetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 5,
  },
  presetName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: T.text,
  },
  presetCatBadge: {
    borderWidth: 1,
    borderColor: T.border,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 5,
  },
  presetCatText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: T.textDim,
    fontFamily: 'JetBrains Mono',
  },
  presetText: {
    fontSize: 12,
    color: T.textDim,
    lineHeight: 18,
  },
  emptyText: {
    textAlign: 'center',
    color: T.textDim,
    fontSize: 12.5,
    padding: 24,
  },
  customInput: {
    minHeight: 150,
  },
  customActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  voiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: T.surface,
  },
  voiceBtnActive: {
    backgroundColor: T.badSoft,
    borderColor: T.bad,
  },
  voiceBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: T.text,
  },
  charCount: {
    fontSize: 11,
    color: T.textFaint,
    fontFamily: 'JetBrains Mono',
  },
  actionBar: {
    flexDirection: 'row',
    gap: 9,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    borderTopWidth: 1,
    borderTopColor: T.borderSoft,
  },
});
