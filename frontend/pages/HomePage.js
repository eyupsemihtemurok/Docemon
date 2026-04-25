import { View, Text, StyleSheet } from 'react-native';

export default function HomePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Ana Sayfa</Text>

      <View style={styles.bannerCard}>
        <Text style={styles.bannerTitle}>Afis</Text>
        <Text style={styles.bannerSubtitle}>Haber bolgesi</Text>

        <View style={styles.newsItem}>
          <Text style={styles.newsText}>- Yeni duyurular bu alanda gorunecek.</Text>
        </View>
        <View style={styles.newsItem}>
          <Text style={styles.newsText}>- Kampanya ve etkinlik haberlerini buraya ekleyebilirsin.</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 14,
  },
  bannerCard: {
    width: '92%',
    maxWidth: 380,
    minHeight: 220,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#dbeafe',
    shadowColor: '#0f172a',
    shadowOpacity: 0.09,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  bannerTitle: {
    fontSize: 24,
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
    marginBottom: 10,
  },
  newsText: {
    fontSize: 14,
    color: '#1e293b',
    lineHeight: 19,
  },
});
