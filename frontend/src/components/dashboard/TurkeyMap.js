import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, Image } from 'react-native';

const PROVINCES_81 = [
  { id: 1, name: 'Adana', x: '55%', y: '75%' }, { id: 6, name: 'Ankara', x: '45%', y: '48%' },
  { id: 34, name: 'İstanbul', x: '22%', y: '25%' }, { id: 35, name: 'İzmir', x: '8%', y: '60%' },
  { id: 46, name: 'K.Maraş', x: '62%', y: '70%', hasDisaster: true },
  { id: 31, name: 'Hatay', x: '60%', y: '88%', hasDisaster: true },
  { id: 27, name: 'Gaziantep', x: '68%', y: '78%' }, { id: 63, name: 'Şanlıurfa', x: '75%', y: '75%' },
  { id: 7, name: 'Antalya', x: '35%', y: '82%' }, { id: 16, name: 'Bursa', x: '25%', y: '38%' },
  { id: 55, name: 'Samsun', x: '58%', y: '25%' }, { id: 61, name: 'Trabzon', x: '78%', y: '30%' },
  { id: 25, name: 'Erzurum', x: '85%', y: '45%' }, { id: 65, name: 'Van', x: '92%', y: '65%' },
  { id: 21, name: 'Diyarbakır', x: '82%', y: '72%' }, { id: 42, name: 'Konya', x: '42%', y: '70%' },
];

// Offline Harita İskeleti (Her durumda görünecek güvenilir görsel)
const TURKEY_BASE_MAP = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Turkey_provinces_blank_gray.svg/1200px-Turkey_provinces_blank_gray.svg.png';

export default function TurkeyMap() {
  const [selectedCity, setSelectedCity] = useState(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.mapTitle}>🇹🇷 TÜRKİYE AFET YÖNETİM HARİTASI</Text>
          <Text style={styles.mapSubTitle}>Gerçek zamanlı il sınırları ve bildirimler</Text>
        </View>
        <View style={styles.legend}>
           <View style={styles.legendItem}>
             <View style={[styles.dot, { backgroundColor: '#ef4444' }]} />
             <Text style={styles.legendText}>Afet</Text>
           </View>
           <View style={styles.legendItem}>
             <View style={[styles.dot, { backgroundColor: '#94a3b8' }]} />
             <Text style={styles.legendText}>Normal</Text>
           </View>
        </View>
      </View>
      
      <View style={styles.mapFrame}>
         {/* Harita Arka Planı */}
         <Image 
            source={{ uri: TURKEY_BASE_MAP }}
            style={styles.mapImage}
            resizeMode="contain"
            onLoadError={() => console.log('Harita yuklenemedi')}
         />
         
         {/* Etkileşim Katmanı */}
         <View style={styles.overlay}>
            {PROVINCES_81.map((city) => (
              <Pressable
                key={city.id}
                style={[
                  styles.cityPoint, 
                  { left: city.x, top: city.y },
                  city.hasDisaster && styles.disasterPoint,
                  selectedCity?.id === city.id && styles.selectedPoint
                ]}
                onPress={() => setSelectedCity(city)}
              >
                {city.hasDisaster && <View style={styles.pulseRing} />}
                {selectedCity?.id === city.id && (
                   <View style={styles.labelContainer}>
                      <Text style={styles.labelText}>{city.name}</Text>
                   </View>
                )}
              </Pressable>
            ))}
         </View>
      </View>

      {selectedCity ? (
        <View style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailTitle}>{selectedCity.name}</Text>
            <Pressable onPress={() => setSelectedCity(null)}>
              <Text style={styles.closeIcon}>✕</Text>
            </Pressable>
          </View>
          {selectedCity.hasDisaster ? (
            <View style={styles.disasterBox}>
              <Text style={styles.alertHeader}>🚨 KRİTİK AFET BİLDİRİMİ</Text>
              <Text style={styles.alertSub}>Bu il sınırları içinde yüksek öncelikli kurtarma çalışmaları mevcuttur.</Text>
              <View style={styles.miniStats}>
                 <View style={styles.miniStatItem}><Text style={styles.miniStatVal}>45</Text><Text style={styles.miniStatLabel}>Ekip</Text></View>
                 <View style={styles.miniStatItem}><Text style={styles.miniStatVal}>12</Text><Text style={styles.miniStatLabel}>Merkez</Text></View>
                 <View style={styles.miniStatItem}><Text style={styles.miniStatVal}>850</Text><Text style={styles.miniStatLabel}>İhbar</Text></View>
              </View>
            </View>
          ) : (
            <View style={styles.safeBox}>
              <Text style={styles.safeText}>✅ Mevcut Durum: GÜVENLİ</Text>
              <Text style={styles.safeSub}>Aktif bir afet kaydı veya tehlike bildirimi bulunmuyor.</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.placeholderBox}>
          <Text style={styles.placeholderText}>Harita üzerindeki noktaları seçerek detaylı bilgi alabilirsiniz.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  mapTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: 0.5,
  },
  mapSubTitle: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 2,
  },
  legend: {
    flexDirection: 'row',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
  },
  mapFrame: {
    width: '100%',
    height: 450,
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  cityPoint: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#cbd5e1',
    borderWidth: 2,
    borderColor: '#ffffff',
    zIndex: 10,
  },
  disasterPoint: {
    backgroundColor: '#ef4444',
    width: 18,
    height: 18,
    borderRadius: 9,
    boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)',
  },
  selectedPoint: {
    backgroundColor: '#0f766e',
    width: 20,
    height: 20,
    borderRadius: 10,
    zIndex: 20,
  },
  pulseRing: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    left: -8,
    top: -8,
  },
  labelContainer: {
    position: 'absolute',
    top: -35,
    left: -20,
    backgroundColor: '#0f766e',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  labelText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },
  detailCard: {
    marginTop: 15,
    padding: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
  },
  closeIcon: {
    fontSize: 20,
    color: '#94a3b8',
  },
  disasterBox: {
    backgroundColor: '#fff1f2',
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  alertHeader: {
    color: '#e11d48',
    fontSize: 14,
    fontWeight: '900',
  },
  alertSub: {
    color: '#475569',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },
  miniStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#fecaca',
  },
  miniStatItem: {
    alignItems: 'center',
  },
  miniStatVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#e11d48',
  },
  miniStatLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '700',
  },
  safeBox: {
    backgroundColor: '#f0fdf4',
    padding: 15,
    borderRadius: 20,
  },
  safeText: {
    color: '#15803d',
    fontSize: 14,
    fontWeight: '900',
  },
  safeSub: {
    color: '#166534',
    fontSize: 12,
    marginTop: 2,
  },
  placeholderBox: {
    marginTop: 15,
    padding: 25,
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 24,
  },
  placeholderText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  }
});
