import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const MOCK_RESULTS = [
  {
    id: 'r1',
    name: 'Aylin Yılmaz',
    initials: 'AY',
    confidence: 94,
    status: 'Kurtarıldı',
    statusColor: '#15803d',
    statusBg: '#f0fdf4',
    statusBorder: '#bbf7d0',
    location: 'Kahramanmaraş / Elbistan',
    assemblyPoint: 'Elbistan İlçe Stadyumu',
    healthCondition: 'Stabil - Hafif yaralı',
    healthIcon: '🟡',
    foundTime: '14:32',
    foundDate: '06.02.2023',
    accentColor: '#22c55e',
  },
  {
    id: 'r2',
    name: 'Mert Kaya',
    initials: 'MK',
    confidence: 81,
    status: 'Tedavi Altında',
    statusColor: '#d97706',
    statusBg: '#fffbeb',
    statusBorder: '#fde68a',
    location: 'Hatay / Antakya',
    assemblyPoint: 'Hatay Devlet Hastanesi',
    healthCondition: 'Orta - Omuz kırığı',
    healthIcon: '🟠',
    foundTime: '09:15',
    foundDate: '07.02.2023',
    accentColor: '#f59e0b',
  },
];

const STEPS = [
  { id: 1, label: 'Fotoğraf Yükle', icon: '📷', done: false, active: true },
  { id: 2, label: 'Analiz Et', icon: '🔍', done: false, active: false },
  { id: 3, label: 'Sonuçlar', icon: '✅', done: false, active: false },
];

export default function FaceMatchScreen() {
  const [phase, setPhase] = useState('upload'); // upload | loading | results
  const [steps, setSteps] = useState(STEPS);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSimulateUpload = () => {
    setSelectedFile({ name: 'kazazede_foto.jpg', size: '2.4 MB' });
    setSteps(prev => prev.map(s => s.id === 1 ? { ...s, done: true, active: false } : s.id === 2 ? { ...s, active: true } : s));
  };

  const handleStartMatch = () => {
    if (!selectedFile) return;
    setPhase('loading');
    setTimeout(() => {
      setPhase('results');
      setSteps(prev => prev.map(s => ({ ...s, done: true, active: false })));
    }, 2800);
  };

  const handleReset = () => {
    setPhase('upload');
    setSelectedFile(null);
    setSteps(STEPS);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Başlık */}
      <View style={styles.headerCard}>
        <Text style={styles.eyebrow}>KAZAZEDE KURTARMA SİSTEMİ</Text>
        <Text style={styles.headerTitle}>Yüz Eşleştirme</Text>
        <Text style={styles.headerSub}>
          Kurtarılan kişinin fotoğrafını yükleyerek kayıt sistemindeki kişilerle eşleştirin.
        </Text>

        {/* Adım göstergesi */}
        <View style={styles.stepsRow}>
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <View style={[
                styles.step,
                step.done && styles.stepDone,
                step.active && styles.stepActive,
              ]}>
                <Text style={[styles.stepIcon, (step.done || step.active) && styles.stepIconActive]}>
                  {step.done ? '✓' : step.icon}
                </Text>
                <Text style={[styles.stepLabel, (step.done || step.active) && styles.stepLabelActive]}>
                  {step.label}
                </Text>
              </View>
              {idx < steps.length - 1 && (
                <View style={[styles.stepLine, steps[idx + 1].done && styles.stepLineDone]} />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Upload Phase */}
      {phase === 'upload' && (
        <>
          <View style={styles.uploadCard}>
            <Text style={styles.sectionTitle}>Fotoğraf Yükle</Text>
            <Pressable style={styles.uploadZone} onPress={handleSimulateUpload}>
              {selectedFile ? (
                <View style={styles.filePreview}>
                  <View style={styles.fileIconCircle}>
                    <Text style={styles.fileIcon}>🖼️</Text>
                  </View>
                  <Text style={styles.fileName}>{selectedFile.name}</Text>
                  <Text style={styles.fileSize}>{selectedFile.size}</Text>
                  <View style={styles.fileReadyBadge}>
                    <Text style={styles.fileReadyText}>✓ Hazır</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Text style={styles.uploadBigIcon}>📷</Text>
                  <Text style={styles.uploadTitle}>Fotoğraf Seç veya Çek</Text>
                  <Text style={styles.uploadSub}>JPG, PNG formatları desteklenir{'\n'}(Maks. 10 MB)</Text>
                  <View style={styles.uploadButton}>
                    <Text style={styles.uploadButtonText}>Galeriden Seç</Text>
                  </View>
                </View>
              )}
            </Pressable>

            <View style={styles.tipBox}>
              <Text style={styles.tipTitle}>📋 Fotoğraf İpuçları</Text>
              {[
                'Yüz net ve aydınlık görünmeli',
                'Önden çekilmiş olmalı',
                'Bulanık veya karanlık fotoğraflardan kaçının',
                'Maske veya engel olmamalı',
              ].map((tip, i) => (
                <Text key={i} style={styles.tipItem}>• {tip}</Text>
              ))}
            </View>
          </View>

          <Pressable
            style={[styles.matchButton, !selectedFile && styles.matchButtonDisabled]}
            onPress={handleStartMatch}
            disabled={!selectedFile}
          >
            <Text style={styles.matchButtonText}>🔍  Eşleştirmeyi Başlat</Text>
          </Pressable>
        </>
      )}

      {/* Loading Phase */}
      {phase === 'loading' && (
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#15803d" />
          <Text style={styles.loadingTitle}>Eşleştirme Yapılıyor...</Text>
          <Text style={styles.loadingSub}>
            Yüz özellikleri analiz ediliyor ve kayıtlar taranıyor.{'\n'}Bu işlem birkaç saniye sürebilir.
          </Text>
          <View style={styles.loadingSteps}>
            {[
              '✓ Yüz algılandı',
              '✓ Özellikler çıkarıldı',
              '⏳ Veritabanı taranıyor...',
            ].map((s, i) => (
              <Text key={i} style={styles.loadingStep}>{s}</Text>
            ))}
          </View>
        </View>
      )}

      {/* Results Phase */}
      {phase === 'results' && (
        <>
          <View style={styles.resultsHeader}>
            <View style={styles.resultsBadge}>
              <Text style={styles.resultsBadgeText}>✅ {MOCK_RESULTS.length} Eşleşme Bulundu</Text>
            </View>
            <Text style={styles.resultsInfo}>
              En yüksek güven skoruna göre sıralandı
            </Text>
          </View>

          {MOCK_RESULTS.map((result) => (
            <View key={result.id} style={styles.resultCard}>
              {/* Kart Başlığı */}
              <View style={styles.resultCardHeader}>
                <View style={[styles.resultAvatar, { backgroundColor: result.accentColor + '22' }]}>
                  <Text style={[styles.resultAvatarText, { color: result.accentColor }]}>
                    {result.initials}
                  </Text>
                </View>
                <View style={styles.resultNameBlock}>
                  <Text style={styles.resultName}>{result.name}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: result.statusBg, borderColor: result.statusBorder }]}>
                    <Text style={[styles.statusText, { color: result.statusColor }]}>{result.status}</Text>
                  </View>
                </View>
                <View style={styles.confidenceBlock}>
                  <Text style={styles.confidenceValue}>{result.confidence}%</Text>
                  <Text style={styles.confidenceLabel}>Güven</Text>
                </View>
              </View>

              {/* Güven çubuğu */}
              <View style={styles.confidenceBar}>
                <View style={[styles.confidenceFill, {
                  width: `${result.confidence}%`,
                  backgroundColor: result.confidence > 90 ? '#15803d' : '#d97706',
                }]} />
              </View>

              {/* Detaylar */}
              <View style={styles.resultGrid}>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>📍 KONUM</Text>
                  <Text style={styles.resultValue}>{result.location}</Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>🏥 TOPLANMA NOKTASI</Text>
                  <Text style={styles.resultValue}>{result.assemblyPoint}</Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>{result.healthIcon} SAĞLIK DURUMU</Text>
                  <Text style={styles.resultValue}>{result.healthCondition}</Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>🕐 BULUNMA ZAMANI</Text>
                  <Text style={styles.resultValue}>{result.foundDate} - {result.foundTime}</Text>
                </View>
              </View>
            </View>
          ))}

          <Pressable style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>🔄  Yeni Eşleştirme Yap</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef9f0' },
  content: { padding: 18, gap: 16, paddingBottom: 40 },

  // Header
  headerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    boxShadow: '0 8px 24px rgba(16,185,129,0.10)',
  },
  eyebrow: {
    color: '#15803d',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#052e16',
  },
  headerSub: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
    lineHeight: 20,
    marginBottom: 16,
  },

  // Steps
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  step: {
    alignItems: 'center',
    gap: 4,
  },
  stepDone: {},
  stepActive: {},
  stepIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    textAlign: 'center',
    lineHeight: 36,
    fontSize: 16,
    color: '#94a3b8',
    overflow: 'hidden',
  },
  stepIconActive: {
    backgroundColor: '#dcfce7',
    color: '#15803d',
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
  },
  stepLabelActive: { color: '#15803d' },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#e2e8f0',
    marginBottom: 14,
    marginHorizontal: 4,
  },
  stepLineDone: { backgroundColor: '#86efac' },

  // Upload
  uploadCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    boxShadow: '0 8px 24px rgba(16,185,129,0.10)',
    gap: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#052e16',
  },
  uploadZone: {
    borderWidth: 2,
    borderColor: '#86efac',
    borderStyle: 'dashed',
    borderRadius: 20,
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    padding: 20,
  },
  uploadPlaceholder: { alignItems: 'center', gap: 8 },
  uploadBigIcon: { fontSize: 48 },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#052e16',
  },
  uploadSub: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
  },
  uploadButton: {
    marginTop: 8,
    backgroundColor: '#15803d',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  uploadButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  filePreview: { alignItems: 'center', gap: 8 },
  fileIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileIcon: { fontSize: 28 },
  fileName: { fontSize: 14, fontWeight: '700', color: '#052e16' },
  fileSize: { fontSize: 12, color: '#64748b' },
  fileReadyBadge: {
    backgroundColor: '#dcfce7',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  fileReadyText: { color: '#15803d', fontWeight: '800', fontSize: 12 },

  tipBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 6,
  },
  tipTitle: { fontSize: 13, fontWeight: '800', color: '#334155', marginBottom: 2 },
  tipItem: { fontSize: 12, color: '#64748b', lineHeight: 18 },

  // Match Button
  matchButton: {
    backgroundColor: '#15803d',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    boxShadow: '0 8px 24px rgba(21,128,61,0.30)',
  },
  matchButtonDisabled: {
    backgroundColor: '#94a3b8',
    boxShadow: 'none',
  },
  matchButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  // Loading
  loadingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    boxShadow: '0 8px 24px rgba(16,185,129,0.10)',
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#052e16',
  },
  loadingSub: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingSteps: { gap: 6, width: '100%' },
  loadingStep: { fontSize: 13, color: '#475569', fontWeight: '600' },

  // Results
  resultsHeader: { alignItems: 'center', gap: 8 },
  resultsBadge: {
    backgroundColor: '#dcfce7',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  resultsBadgeText: {
    color: '#15803d',
    fontWeight: '800',
    fontSize: 14,
  },
  resultsInfo: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },

  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    boxShadow: '0 8px 24px rgba(16,185,129,0.10)',
    gap: 12,
  },
  resultCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resultAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultAvatarText: {
    fontSize: 20,
    fontWeight: '900',
  },
  resultNameBlock: { flex: 1, gap: 6 },
  resultName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#052e16',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusText: { fontSize: 11, fontWeight: '800' },
  confidenceBlock: { alignItems: 'center' },
  confidenceValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#052e16',
  },
  confidenceLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '700',
  },

  confidenceBar: {
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 3,
  },

  resultGrid: {
    gap: 10,
  },
  resultItem: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 4,
  },
  resultLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },

  // Reset Button
  resetButton: {
    backgroundColor: '#f0fdf4',
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#86efac',
  },
  resetButtonText: {
    color: '#15803d',
    fontSize: 15,
    fontWeight: '800',
  },
});
