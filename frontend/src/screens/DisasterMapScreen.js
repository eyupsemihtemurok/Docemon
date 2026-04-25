import React, { useState, useEffect, useCallback } from 'react';
import {
  ActivityIndicator, Modal, Pressable, ScrollView,
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import TurkeyMapWebView from '../components/dashboard/TurkeyMapWebView';
import { getApiBaseUrl, requestJson } from '../services/httpClient';

async function apiFetch(path, opts = {}) {
  return requestJson(path, opts);
}

const DISASTER_TYPES = ['Deprem', 'Sel', 'Yangın', 'Fırtına', 'Heyelan', 'Tsunami', 'Çığ'];

function pad2(n) { return String(Number(n)).padStart(2, '0'); }

export default function DisasterMapScreen({ navigate }) {
  const [disasters,      setDisasters]      = useState([]);
  const [loadingMap,     setLoadingMap]     = useState(true);
  const [provinces,      setProvinces]      = useState([]);
  const [districts,      setDistricts]      = useState([]);
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [detailVisible,  setDetailVisible]  = useState(false);
  const [addVisible,     setAddVisible]     = useState(false);

  // Form
  const [formType,        setFormType]        = useState('Deprem');
  const [formSeverity,    setFormSeverity]    = useState('');
  const [formDesc,        setFormDesc]        = useState('');
  const [formProvinceId,  setFormProvinceId]  = useState(null);
  const [formDistrictIds, setFormDistrictIds] = useState([]);
  const [saving,          setSaving]          = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  const fetchDisasters = useCallback(async () => {
    setLoadingMap(true);
    try {
      const data = await apiFetch('/api/disaster/active');
      setDisasters(Array.isArray(data) ? data : []);
    } catch {
      setDisasters([]);
    } finally {
      setLoadingMap(false);
    }
  }, []);

  useEffect(() => { fetchDisasters(); }, [fetchDisasters]);

  useEffect(() => {
    apiFetch('/api/geography/provinces')
      .then(data => setProvinces(Array.isArray(data) ? data : []))
      .catch(() => setProvinces([]));
  }, []);

  const handleProvinceSelect = async (id) => {
    setFormProvinceId(id);
    setFormDistrictIds([]);
    setDistricts([]);
    setLoadingDistricts(true);
    try {
      const data = await apiFetch(`/api/geography/provinces/${id}/districts`);
      setDistricts(Array.isArray(data) ? data : []);
    } catch {
      setDistricts([]);
    } finally {
      setLoadingDistricts(false);
    }
  };

  const toggleDistrict = (id) => {
    setFormDistrictIds(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!formProvinceId)           { alert('Lütfen il seçiniz.');           return; }
    if (formDistrictIds.length === 0) { alert('En az bir ilçe seçiniz.'); return; }
    setSaving(true);
    try {
      let token = null;
      try { token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null; } catch {}
      await apiFetch('/api/disaster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          type:          formType,
          severity:      formSeverity,
          description:   formDesc,
          province_id:   formProvinceId,
          districtIds:   formDistrictIds,
          location_name: provinces.find(p => p.id === formProvinceId)?.name || '',
        }),
      });
      setAddVisible(false);
      setFormProvinceId(null);
      setFormDistrictIds([]);
      setFormSeverity('');
      setFormDesc('');
      fetchDisasters();
    } catch (e) {
      alert('Afet kaydedilemedi: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  // Build { plateCode: "afet" } for the map
  const disasterStatus = {};
  disasters.forEach(d => {
    const code = pad2(d.plate_code ?? d.province_id);
    if (code && code !== '00') disasterStatus[code] = 'afet';
  });

  const selectedProvinceName = provinces.find(p => p.id === formProvinceId)?.name;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={s.container} contentContainerStyle={s.content}>

        {/* ── Header Card ── */}
        <View style={s.card}>
          <View style={s.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={s.eyebrow}>AFET YÖNETİM SİSTEMİ</Text>
              <Text style={s.title}>Türkiye Afet Takip Haritası</Text>
              <Text style={s.sub}>Veritabanındaki aktif afet bölgeleri haritaya yansır</Text>
              <Pressable onPress={() => navigate('/dashboard')} style={{ marginTop: 8 }}>
                <Text style={{ color: '#15803d', fontWeight: '700' }}>← Dashboard'a Dön</Text>
              </Pressable>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 8 }}>
              <View style={s.liveBadge}><View style={s.liveDot}/><Text style={s.liveText}>CANLI</Text></View>
              <Pressable style={s.addBtn} onPress={() => setAddVisible(true)}>
                <Text style={s.addBtnText}>+ Afet Ekle</Text>
              </Pressable>
            </View>
          </View>

          <View style={s.statsRow}>
            {[
              { icon: '🔴', val: loadingMap ? '…' : String(disasters.length),                                              label: 'Aktif Afet' },
              { icon: '📍', val: loadingMap ? '…' : String(new Set(disasters.map(d => d.province_id)).size),               label: 'İl Etkilendi' },
              { icon: '🏘️', val: loadingMap ? '…' : String(disasters.reduce((a,d) => a+(d.districts?.length||0),0)),      label: 'İlçe Etkilendi' },
            ].map(item => (
              <View key={item.label} style={s.statCard}>
                <Text style={s.statIcon}>{item.icon}</Text>
                <Text style={s.statVal}>{item.val}</Text>
                <Text style={s.statLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Map Card ── */}
        <View style={s.card}>
          <View style={s.mapHeader}>
            <Text style={s.mapTitle}>🗺️ İl Sınırları Haritası</Text>
            <View style={{ flexDirection:'row', gap:10 }}>
              <View style={s.legendItem}><View style={[s.dot,{backgroundColor:'#ef4444'}]}/><Text style={s.legendText}>Afet</Text></View>
              <View style={s.legendItem}><View style={[s.dot,{backgroundColor:'#4b7c59'}]}/><Text style={s.legendText}>Normal</Text></View>
            </View>
          </View>
          <TurkeyMapWebView disasterStatus={disasterStatus} style={s.map}/>
          <Text style={s.hint}>💡 İller üzerine tıklayarak detay görüntüleyebilirsiniz</Text>
        </View>

        {/* ── Active List Card ── */}
        <View style={s.card}>
          <Text style={s.sectionTitle}>Aktif Afet Bölgeleri</Text>
          {loadingMap && <ActivityIndicator color="#15803d" style={{ marginVertical:20 }}/>}
          {!loadingMap && disasters.length === 0 && (
            <View style={s.emptyBox}>
              <Text style={s.emptyText}>Henüz aktif afet kaydı bulunmuyor.</Text>
              <Text style={s.emptySub}>"+ Afet Ekle" butonuyla yeni afet oluşturabilirsiniz.</Text>
            </View>
          )}
          {disasters.map((d, i) => (
            <Pressable key={d.id || i} style={s.disasterRow}
              onPress={() => { setSelectedDisaster(d); setDetailVisible(true); }}>
              <View style={s.disasterLeft}>
                <View style={s.plateBadge}>
                  <Text style={s.plateText}>{pad2(d.plate_code ?? d.province_id)}</Text>
                </View>
                <View style={{ flex:1 }}>
                  <Text style={s.cityText}>{d.province_name || d.location_name || '—'}</Text>
                  <Text style={s.typeText}>{d.type}{d.severity ? ` — ${d.severity}` : ''}</Text>
                  {d.districts?.length > 0 && (
                    <Text style={s.districtText} numberOfLines={2}>
                      📍 {d.districts.map(x => x.name).join(', ')}
                    </Text>
                  )}
                </View>
              </View>
              <Text style={s.arrow}>›</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* ── Detail Modal ── */}
      <Modal visible={detailVisible} transparent animationType="slide"
        onRequestClose={() => setDetailVisible(false)}>
        <View style={s.overlay}>
          <View style={s.modal}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{selectedDisaster?.province_name || selectedDisaster?.location_name || 'Detay'}</Text>
              <Pressable onPress={() => setDetailVisible(false)}><Text style={s.closeX}>✕</Text></Pressable>
            </View>
            <View style={s.gridTwo}>
              <View style={s.gridItem}><Text style={s.gridLabel}>AFET TÜRÜ</Text><Text style={s.gridVal}>{selectedDisaster?.type}</Text></View>
              <View style={s.gridItem}><Text style={s.gridLabel}>ŞİDDET</Text><Text style={s.gridVal}>{selectedDisaster?.severity || '—'}</Text></View>
              <View style={s.gridItem}><Text style={s.gridLabel}>BAŞLANGIÇ</Text><Text style={s.gridVal}>{selectedDisaster?.start_time ? new Date(selectedDisaster.start_time).toLocaleString('tr-TR') : '—'}</Text></View>
              <View style={s.gridItem}><Text style={s.gridLabel}>PLAKA</Text><Text style={s.gridVal}>{pad2(selectedDisaster?.plate_code ?? selectedDisaster?.province_id)}</Text></View>
            </View>
            {selectedDisaster?.districts?.length > 0 && (
              <View style={s.districtBlock}>
                <Text style={s.gridLabel}>ETKİLENEN İLÇELER</Text>
                <View style={s.chipWrap}>
                  {selectedDisaster.districts.map(d => (
                    <View key={d.id} style={s.distChip}><Text style={s.distChipText}>{d.name}</Text></View>
                  ))}
                </View>
              </View>
            )}
            {!!selectedDisaster?.description && (
              <View style={s.descBox}>
                <Text style={s.gridLabel}>AÇIKLAMA</Text>
                <Text style={s.descText}>{selectedDisaster.description}</Text>
              </View>
            )}
            <Pressable style={s.closeBtn} onPress={() => setDetailVisible(false)}>
              <Text style={s.closeBtnText}>Kapat</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ── Add Disaster Modal ── */}
      <Modal visible={addVisible} transparent animationType="slide"
        onRequestClose={() => setAddVisible(false)}>
        <View style={s.overlay}>
          <ScrollView contentContainerStyle={{ flexGrow:1, justifyContent:'flex-end' }} keyboardShouldPersistTaps="handled">
            <View style={s.modal}>
              <View style={s.modalHeader}>
                <Text style={s.modalTitle}>⚠️ Yeni Afet Ekle</Text>
                <Pressable onPress={() => setAddVisible(false)}><Text style={s.closeX}>✕</Text></Pressable>
              </View>

              {/* Tür */}
              <Text style={s.formLabel}>AFET TÜRÜ</Text>
              <View style={s.chipWrap}>
                {DISASTER_TYPES.map(t => (
                  <Pressable key={t} style={[s.typeChip, formType===t && s.typeChipActive]}
                    onPress={() => setFormType(t)}>
                    <Text style={[s.typeChipText, formType===t && s.typeChipTextActive]}>{t}</Text>
                  </Pressable>
                ))}
              </View>

              {/* Şiddet */}
              <Text style={s.formLabel}>ŞİDDET / BÜYÜKLÜK (isteğe bağlı)</Text>
              <TextInput
                style={s.textInput}
                placeholder="Örn: M 7.6"
                placeholderTextColor="#94a3b8"
                value={formSeverity}
                onChangeText={setFormSeverity}
              />

              {/* İl */}
              <Text style={s.formLabel}>İL SEÇİMİ</Text>
              {selectedProvinceName && (
                <View style={s.selectedBadge}>
                  <Text style={s.selectedBadgeText}>✓ {selectedProvinceName}</Text>
                </View>
              )}
              <ScrollView style={s.listBox} nestedScrollEnabled>
                {provinces.length === 0 && (
                  <Text style={[s.emptySub,{padding:12}]}>İller yükleniyor…</Text>
                )}
                {provinces.map(p => (
                  <Pressable key={p.id}
                    style={[s.listItem, formProvinceId===p.id && s.listItemActive]}
                    onPress={() => handleProvinceSelect(p.id)}>
                    <Text style={[s.listItemText, formProvinceId===p.id && s.listItemTextActive]}>
                      {p.name}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              {/* İlçe */}
              <Text style={s.formLabel}>ETKİLENEN İLÇELER (çoklu seçim)</Text>
              {!formProvinceId && <Text style={s.emptySub}>Önce il seçiniz.</Text>}
              {loadingDistricts && <ActivityIndicator color="#15803d" />}
              {!loadingDistricts && formProvinceId && districts.length === 0 && (
                <Text style={s.emptySub}>Bu ile ait ilçe bulunamadı.</Text>
              )}
              <View style={s.chipWrap}>
                {districts.map(d => (
                  <Pressable key={d.id}
                    style={[s.typeChip, formDistrictIds.includes(d.id) && s.typeChipActive]}
                    onPress={() => toggleDistrict(d.id)}>
                    <Text style={[s.typeChipText, formDistrictIds.includes(d.id) && s.typeChipTextActive]}>
                      {d.name}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Açıklama */}
              <Text style={s.formLabel}>AÇIKLAMA (isteğe bağlı)</Text>
              <TextInput
                style={[s.textInput, { minHeight:60, textAlignVertical:'top' }]}
                placeholder="Afet hakkında ek bilgi..."
                placeholderTextColor="#94a3b8"
                value={formDesc}
                onChangeText={setFormDesc}
                multiline
              />

              <View style={{ flexDirection:'row', gap:10, marginTop:4 }}>
                <Pressable style={[s.closeBtn,{flex:1}]} onPress={handleSave} disabled={saving}>
                  <Text style={s.closeBtnText}>{saving ? 'Kaydediliyor…' : '✓ Afeti Kaydet'}</Text>
                </Pressable>
                <Pressable style={[s.cancelBtn,{flex:1}]} onPress={() => setAddVisible(false)}>
                  <Text style={s.cancelBtnText}>Vazgeç</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex:1, backgroundColor:'#eef9f0' },
  content:   { padding:16, gap:14, paddingBottom:40 },
  card:      { backgroundColor:'#fff', borderRadius:22, padding:18, borderWidth:1, borderColor:'#bbf7d0', boxShadow:'0 6px 20px rgba(16,185,129,0.09)' },
  headerRow: { flexDirection:'row', alignItems:'flex-start', marginBottom:14 },
  eyebrow:   { color:'#15803d', fontSize:11, fontWeight:'800', letterSpacing:1.1, marginBottom:3 },
  title:     { fontSize:19, fontWeight:'900', color:'#052e16' },
  sub:       { fontSize:12, color:'#64748b', marginTop:2 },
  liveBadge: { flexDirection:'row', alignItems:'center', gap:5, backgroundColor:'#dcfce7', paddingVertical:5, paddingHorizontal:10, borderRadius:999 },
  liveDot:   { width:7, height:7, borderRadius:4, backgroundColor:'#16a34a' },
  liveText:  { color:'#166534', fontSize:10, fontWeight:'800' },
  addBtn:    { backgroundColor:'#15803d', paddingVertical:7, paddingHorizontal:14, borderRadius:12 },
  addBtnText:{ color:'#fff', fontSize:13, fontWeight:'800' },
  statsRow:  { flexDirection:'row', gap:8 },
  statCard:  { flex:1, backgroundColor:'#f8fafc', borderRadius:14, padding:10, alignItems:'center', borderWidth:1, borderColor:'#e2e8f0' },
  statIcon:  { fontSize:18, marginBottom:2 },
  statVal:   { fontSize:16, fontWeight:'900', color:'#052e16' },
  statLabel: { fontSize:10, color:'#64748b', textAlign:'center', marginTop:1 },
  mapHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:10 },
  mapTitle:  { fontSize:14, fontWeight:'900', color:'#0f172a' },
  legendItem:{ flexDirection:'row', alignItems:'center', gap:4 },
  dot:       { width:9, height:9, borderRadius:5 },
  legendText:{ fontSize:10, fontWeight:'700', color:'#64748b' },
  map:       { height:420, borderRadius:14 },
  hint:      { fontSize:11, color:'#94a3b8', textAlign:'center', marginTop:8, fontWeight:'600' },
  sectionTitle:{ fontSize:16, fontWeight:'900', color:'#052e16', marginBottom:10 },
  emptyBox:  { padding:24, alignItems:'center', borderStyle:'dashed', borderWidth:1, borderColor:'#bbf7d0', borderRadius:16 },
  emptyText: { color:'#64748b', fontWeight:'700', fontSize:14 },
  emptySub:  { color:'#94a3b8', fontSize:12, marginTop:4 },
  disasterRow:{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', backgroundColor:'#f8fafc', borderRadius:14, padding:12, borderWidth:1, borderColor:'#e2e8f0', marginBottom:8 },
  disasterLeft:{ flexDirection:'row', alignItems:'flex-start', gap:10, flex:1 },
  plateBadge:{ width:38, height:38, borderRadius:10, backgroundColor:'#fff1f2', borderWidth:1, borderColor:'#fecaca', alignItems:'center', justifyContent:'center' },
  plateText: { fontSize:13, fontWeight:'900', color:'#dc2626' },
  cityText:  { fontSize:15, fontWeight:'800', color:'#0f172a' },
  typeText:  { fontSize:12, color:'#64748b', marginTop:1 },
  districtText:{ fontSize:11, color:'#94a3b8', marginTop:2 },
  arrow:     { fontSize:22, color:'#94a3b8' },
  overlay:   { flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'flex-end' },
  modal:     { backgroundColor:'#fff', borderTopLeftRadius:28, borderTopRightRadius:28, padding:22, gap:12, maxHeight:'92%' },
  modalHeader:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  modalTitle:{ fontSize:20, fontWeight:'900', color:'#052e16' },
  closeX:    { fontSize:22, color:'#94a3b8' },
  gridTwo:   { flexDirection:'row', flexWrap:'wrap', gap:10 },
  gridItem:  { width:'47%', backgroundColor:'#f8fafc', borderRadius:12, padding:10, borderWidth:1, borderColor:'#e2e8f0' },
  gridLabel: { fontSize:10, fontWeight:'800', color:'#94a3b8', letterSpacing:0.4, marginBottom:3 },
  gridVal:   { fontSize:14, fontWeight:'700', color:'#0f172a' },
  districtBlock:{ gap:6 },
  chipWrap:  { flexDirection:'row', flexWrap:'wrap', gap:7 },
  distChip:  { backgroundColor:'#fff1f2', paddingVertical:4, paddingHorizontal:10, borderRadius:999, borderWidth:1, borderColor:'#fecaca' },
  distChipText:{ color:'#dc2626', fontSize:12, fontWeight:'700' },
  descBox:   { backgroundColor:'#f8fafc', borderRadius:12, padding:12, borderWidth:1, borderColor:'#e2e8f0', gap:4 },
  descText:  { fontSize:13, color:'#475569', lineHeight:19 },
  closeBtn:  { backgroundColor:'#15803d', paddingVertical:13, borderRadius:14, alignItems:'center' },
  closeBtnText:{ color:'#fff', fontSize:15, fontWeight:'800' },
  cancelBtn: { backgroundColor:'#f1f5f9', paddingVertical:13, borderRadius:14, alignItems:'center', borderWidth:1, borderColor:'#e2e8f0' },
  cancelBtnText:{ color:'#475569', fontSize:15, fontWeight:'700' },
  formLabel: { fontSize:11, fontWeight:'800', color:'#64748b', letterSpacing:0.5 },
  typeChip:  { backgroundColor:'#f1f5f9', paddingVertical:6, paddingHorizontal:12, borderRadius:999, borderWidth:1, borderColor:'#e2e8f0' },
  typeChipActive:{ backgroundColor:'#dc2626', borderColor:'#dc2626' },
  typeChipText:{ fontSize:12, fontWeight:'700', color:'#475569' },
  typeChipTextActive:{ color:'#fff' },
  listBox:   { height:120, backgroundColor:'#f8fafc', borderRadius:12, borderWidth:1, borderColor:'#e2e8f0' },
  listItem:  { paddingVertical:9, paddingHorizontal:14, borderBottomWidth:1, borderBottomColor:'#f1f5f9' },
  listItemActive:{ backgroundColor:'#dcfce7' },
  listItemText:{ fontSize:14, color:'#334155', fontWeight:'600' },
  listItemTextActive:{ color:'#15803d', fontWeight:'800' },
  textInput: { backgroundColor:'#f8fafc', borderRadius:12, borderWidth:1, borderColor:'#e2e8f0', paddingVertical:11, paddingHorizontal:14, fontSize:14, color:'#0f172a' },
  selectedBadge:{ backgroundColor:'#dcfce7', paddingVertical:5, paddingHorizontal:12, borderRadius:999, alignSelf:'flex-start', marginBottom:4 },
  selectedBadgeText:{ color:'#15803d', fontSize:12, fontWeight:'800' },
});
