import React, { useRef, useState } from 'react';
import {
  Animated, PanResponder, Platform,
  Pressable, ScrollView, Text, View, StyleSheet
} from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { ROUTES } from '../constants/routes';
import styles from './styles/InformationPage.styles';

// ─── Zoom / Pan sarmalayıcısı ────────────────────────────────────
function ZoomPanWrapper({ children }) {
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const scaleVal = useRef(1);
  const lastScale = useRef(1);
  const initDist = useRef(null);

  const pr = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (e) =>
        e.nativeEvent.touches?.length > 1,
      onMoveShouldSetPanResponder: (e, gs) =>
        (e.nativeEvent.touches?.length > 1) ||
        Math.abs(gs.dx) > 12 || Math.abs(gs.dy) > 12,

      onPanResponderGrant: () => {
        pan.stopAnimation();
        pan.extractOffset();
      },
      onPanResponderMove: (e, gs) => {
        const t = e.nativeEvent.touches;
        if (t && t.length === 2) {
          const d = Math.hypot(t[0].pageX - t[1].pageX, t[0].pageY - t[1].pageY);
          if (!initDist.current) { initDist.current = d; return; }
          let ns = lastScale.current * (d / initDist.current);
          ns = Math.max(0.8, Math.min(4, ns));
          scale.setValue(ns);
          scaleVal.current = ns;
        } else {
          pan.setValue({
            x: gs.dx / scaleVal.current,
            y: gs.dy / scaleVal.current,
          });
        }
      },
      onPanResponderRelease: (e, gs) => {
        pan.flattenOffset();
        lastScale.current = scaleVal.current;
        initDist.current = null;
        
        // Kaydırma bitişinde ivme (momentum) efekti ile daha doğal hareket
        Animated.decay(pan, {
          velocity: { x: gs.vx, y: gs.vy },
          deceleration: 0.995,
          useNativeDriver: false,
        }).start();
      },
      onPanResponderTerminate: () => {
        pan.flattenOffset();
        lastScale.current = scaleVal.current;
        initDist.current = null;
      },
    })
  ).current;

  const onWheel = (e) => {
    if (Platform.OS !== 'web') return;
    e.preventDefault();
    let ns = scaleVal.current + (e.deltaY > 0 ? -0.15 : 0.15);
    ns = Math.max(0.8, Math.min(4, ns));
    scale.setValue(ns);
    scaleVal.current = ns;
    lastScale.current = ns;
  };

  return (
    <View
      style={local.zoomOuter}
      {...pr.panHandlers}
      onWheel={Platform.OS === 'web' ? onWheel : undefined}
    >
      <Animated.View
        style={{
          width: '100%', height: '100%',
          transform: [
            { scale },
            { translateX: pan.x },
            { translateY: pan.y },
          ],
        }}
      >
        {children}
      </Animated.View>
    </View>
  );
}

// ─── Harita Verileri (Vektörel) ──────────────────────────────────
const TURKEY_CITIES = require('turkey-map-react/lib/data').cities;
const DISASTER_CITIES = ['Hatay', 'Kahramanmaraş'];

function InteractiveMap() {
  const [selectedCity, setSelectedCity] = useState(null);

  return (
    <View style={local.mapContainer}>
      <View style={local.mapHeader}>
        <View>
          <Text style={local.mapTitle}>🇹🇷 TÜRKİYE AFET YÖNETİM HARİTASI</Text>
          <Text style={local.mapSubTitle}>Gerçek zamanlı il sınırları ve bildirimler</Text>
        </View>
        <View style={local.legend}>
          <View style={local.legendItem}>
            <View style={[local.dot, { backgroundColor: '#ef4444' }]} />
            <Text style={local.legendText}>Afet</Text>
          </View>
          <View style={local.legendItem}>
            <View style={[local.dot, { backgroundColor: '#94a3b8' }]} />
            <Text style={local.legendText}>Normal</Text>
          </View>
        </View>
      </View>

      <View style={local.mapFrame}>
        <ZoomPanWrapper>
          <View style={{ width: '100%', height: '100%', aspectRatio: 1010 / 450 }}>
            <Svg viewBox="20 140 1010 450" style={{ width: '100%', height: '100%' }}>
              <G>
                {/* Seçili olan ilin en üstte çizilmesi için diziyi sıralıyoruz */}
                {[...TURKEY_CITIES]
                  .sort((a, b) => (a.id === selectedCity?.id ? 1 : b.id === selectedCity?.id ? -1 : 0))
                  .map((city) => {
                    const hasDisaster = DISASTER_CITIES.includes(city.name);
                    const isSelected = selectedCity?.id === city.id;
                    
                    let fillColor = hasDisaster ? '#ef4444' : '#22c55e'; // Kırmızı : Yeşil
                    if (isSelected) {
                      fillColor = hasDisaster ? '#991b1b' : '#15803d'; // Seçiliyse daha koyu
                    }

                    return (
                      <Path
                        key={city.id}
                        d={city.path}
                        fill={fillColor}
                        stroke={isSelected ? "#facc15" : "#ffffff"} // Seçiliyse sarı sınır
                        strokeWidth={isSelected ? 2.5 : 1}
                        onPress={() => setSelectedCity({ ...city, hasDisaster })}
                        onPressIn={() => setSelectedCity({ ...city, hasDisaster })}
                        onClick={() => setSelectedCity({ ...city, hasDisaster })}
                      />
                    );
                })}
              </G>
            </Svg>
          </View>
        </ZoomPanWrapper>
      </View>

      {/* Selected City Details */}
      {selectedCity ? (
        <View style={local.detailCard}>
          <View style={local.detailHeader}>
            <Text style={local.detailTitle}>{selectedCity.name}</Text>
            <Pressable onPress={() => setSelectedCity(null)}>
              <Text style={local.closeIcon}>✕</Text>
            </Pressable>
          </View>
          {selectedCity.hasDisaster ? (
            <View style={local.disasterBox}>
              <Text style={local.alertHeader}>🚨 KRİTİK AFET BİLDİRİMİ</Text>
              <Text style={local.alertSub}>Bu il sınırları içinde yüksek öncelikli kurtarma çalışmaları mevcuttur.</Text>
            </View>
          ) : (
            <View style={local.safeBox}>
              <Text style={local.safeText}>✅ Mevcut Durum: GÜVENLİ</Text>
              <Text style={local.safeSub}>Aktif bir afet kaydı veya tehlike bildirimi bulunmuyor.</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={local.placeholderBox}>
          <Text style={local.placeholderText}>Harita üzerindeki noktaları seçerek detaylı bilgi alabilirsiniz.</Text>
        </View>
      )}
    </View>
  );
}

// ─── İstatistik verileri ─────────────────────────────────────────
const STATS = [
  { id: '1', metric: 'Aktif Afet Kaydı',        value: '12',   trend: '+3 son 24 saat' },
  { id: '2', metric: 'Acil Müdahale Ekibi',      value: '45',   trend: '+5 hazır ekip' },
  { id: '3', metric: 'Toplanan İhbar',            value: '850',  trend: '+126 yeni ihbar' },
  { id: '4', metric: 'Güvenli Alan Kapasitesi',   value: '%78',  trend: 'Ortalama doluluk' },
  { id: '5', metric: 'Doğrulanan Kimlik',         value: '231',  trend: 'Yüz eşleştirme ile' },
];

// ─── Sayfa ───────────────────────────────────────────────────────
export default function InformationPage({ navigate }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

      {/* 1) Bildirim Paneli */}
      <View style={styles.headerCard}>
        <Text style={styles.eyebrow}>BİLGİLENDİRME PANELİ</Text>
        <Text style={styles.title}>Afet Bilgi Merkezi</Text>
        <Text style={styles.subtitle}>
          Türkiye genelindeki afet durumlarını, operasyon metriklerini ve
          genel istatistikleri bu sayfada tek görünümde inceleyebilirsiniz.
        </Text>

        <Pressable
          style={styles.backButton}
          onPress={() => navigate?.(ROUTES.DASHBOARD)}
        >
          <Text style={styles.backButtonText}>← Dashboard'a Dön</Text>
        </Pressable>
      </View>

      {/* 2) Türkiye Afet Yönetim Haritası */}
      <InteractiveMap />

      {/* 3) Genel İstatistik Tablosu */}
      <View style={styles.tableCard}>
        <Text style={styles.tableTitle}>Genel Afet İstatistikleri</Text>

        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.colMetric]}>Metrik</Text>
          <Text style={[styles.headerCell, styles.colValue]}>Değer</Text>
          <Text style={[styles.headerCell, styles.colTrend]}>Durum</Text>
        </View>

        {STATS.map((row, i) => (
          <View
            key={row.id}
            style={[
              styles.tableRow,
              i === STATS.length - 1 && { borderBottomWidth: 0 },
            ]}
          >
            <Text style={[styles.rowCell, styles.colMetric]}>{row.metric}</Text>
            <Text style={[styles.rowCell, styles.colValue, styles.valueCell]}>
              {row.value}
            </Text>
            <Text style={[styles.rowCell, styles.colTrend]}>{row.trend}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// ─── Yerel stiller ────────────────────
const local = StyleSheet.create({
  zoomOuter: {
    flex: 1,
    overflow: 'hidden',
  },
  mapContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  mapTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0f172a',
  },
  mapSubTitle: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 2,
  },
  legend: { flexDirection: 'row', gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  legendText: { fontSize: 10, fontWeight: '700', color: '#64748b' },
  mapFrame: {
    width: '100%',
    aspectRatio: 624 / 468,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  labelContainer: {
    position: 'absolute',
    top: 14,
    left: -10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  labelText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0f172a',
  },
  detailCard: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailTitle: { fontSize: 20, fontWeight: '900', color: '#0f172a' },
  closeIcon: { fontSize: 18, color: '#94a3b8', padding: 4 },
  disasterBox: {
    backgroundColor: '#fff1f2',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  alertHeader: { color: '#e11d48', fontSize: 14, fontWeight: '900' },
  alertSub: { color: '#475569', fontSize: 12, marginTop: 4 },
  safeBox: {
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  safeText: { color: '#15803d', fontSize: 14, fontWeight: '900' },
  safeSub: { color: '#166534', fontSize: 12, marginTop: 2 },
  placeholderBox: {
    marginTop: 16,
    padding: 20,
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 16,
  },
  placeholderText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
