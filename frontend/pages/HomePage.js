import { View, Text, StyleSheet } from 'react-native';

export default function HomePage() {
  const highlights = [
    { title: 'Yeni duyurular', value: 'Hazır', tone: '#2563eb' },
    { title: 'Kampanyalar', value: 'Aktif', tone: '#0f766e' },
    { title: 'Takip', value: 'Canlı', tone: '#7c3aed' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Ana Sayfa</Text>
      <Text style={styles.pageSubtitle}>
        Uygulamanın özetini, duyuruları ve hızlı bilgileri bu sayfada takip edebilirsin.
      </Text>

      <View style={styles.bannerCard}>
        <Text style={styles.bannerTitle}>Öne çıkan içerik</Text>
        <Text style={styles.bannerSubtitle}>Bugün için hazırlanan kısa yayın alanı.</Text>

        <View style={styles.newsItem}>
          <Text style={styles.newsText}>• Yeni duyurular bu alanda görünür.</Text>
        </View>
        <View style={styles.newsItem}>
          <Text style={styles.newsText}>• Kampanya ve etkinlik notları burada listelenir.</Text>
        </View>
      </View>

      <View style={styles.highlightGrid}>
        {highlights.map((item) => (
          <View key={item.title} style={styles.highlightCard}>
            <Text style={[styles.highlightValue, { color: item.tone }]}>{item.value}</Text>
            <Text style={styles.highlightTitle}>{item.title}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f172a',
  },
  pageSubtitle: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 21,
  },
  bannerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#dbeafe',
    boxShadow: '0 12px 24px rgba(15, 23, 42, 0.08)',
    elevation: 4,
    gap: 10,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e3a8a',
  },
  bannerSubtitle: {
    fontSize: 16,
    color: '#334155',
    marginTop: 2,
    marginBottom: 14,
  },
  newsItem: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  newsText: {
    fontSize: 14,
    color: '#1e293b',
    lineHeight: 19,
  },
  highlightGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  highlightCard: {
    flexGrow: 1,
    minWidth: 100,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  highlightValue: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  highlightTitle: {
    color: '#475569',
    fontSize: 13,
  },
});
