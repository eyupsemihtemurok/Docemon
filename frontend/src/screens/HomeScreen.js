import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { ROUTES } from '../constants/routes';

export default function HomeScreen({ navigate }) {
  return (
    <View style={styles.container}>
      {/* App Header */}
      <View style={styles.header}>
        <Text style={styles.brandName}>Docemon</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Afetlere Karşı{"\n"}Hazır Mısınız?</Text>
          <Text style={styles.heroSubtitle}>
            Saniyeler hayat kurtarır. Afet anında doğru bilgiye, acil yardıma ve sevdiklerinize anında ulaşın.
          </Text>
          <Pressable style={styles.loginButton} onPress={() => navigate(ROUTES.LOGIN)}>
            <Text style={styles.loginButtonText}>Sisteme Kayıt Ol</Text>
          </Pressable>
        </View>

        {/* Info Section 1: Tehlike */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>⚠️</Text>
            <Text style={styles.cardTitle}>Afetlerin Gerçekliği</Text>
          </View>
          <Text style={styles.cardText}>
            Deprem, sel veya yangın... Doğal afetler beklenmedik anlarda gerçekleşir. Hazırlıksız yakalanmak, can ve mal kaybı riskini dramatik şekilde artırır. Bilgi en büyük kalkanınızdır.
          </Text>
        </View>

        {/* Info Section 2: Mantık */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>🛡️</Text>
            <Text style={styles.cardTitle}>Biz Ne Yapıyoruz?</Text>
          </View>
          <Text style={styles.cardText}>
            Uygulamamız, afet öncesinde hazırlık seviyenizi artırır, afet anında ise tek tuşla yetkililere ve yakınlarınıza konumunuzu iletir. Kriz anında iletişimi kesintisiz ve hızlı kılar.
          </Text>
        </View>

        {/* Info Section 3: Uyarılar */}
        <View style={styles.warningCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>🔔</Text>
            <Text style={styles.warningCardTitle}>Canlı Uyarı Sistemi</Text>
          </View>
          <Text style={styles.warningCardText}>
            Bölgenizdeki riskleri ve anlık afet uyarılarını gerçek zamanlı olarak takip edin. Erken uyarı sistemi sayesinde tehlikeden uzak durun.
          </Text>
        </View>

        {/* Spacer for bottom button */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Fixed Emergency Button */}
      <View style={styles.bottomContainer}>
        <Pressable style={styles.emergencyButton} onPress={() => { }}>
          <Text style={styles.emergencyButtonText}>🚨 ACİL DURUM 🚨</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingTop: 64,
    paddingBottom: 24,
    paddingHorizontal: 24,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  brandName: {
    fontSize: 46,
    fontWeight: '900',
    color: '#3b82f6',
    letterSpacing: 2,
    textAlign: 'center',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 32,
  },
  heroSection: {
    marginBottom: 40,
  },
  heroTitle: {
    fontSize: 46,
    fontWeight: '900',
    color: '#f8fafc',
    lineHeight: 52,
    marginBottom: 16,
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#94a3b8',
    lineHeight: 28,
    marginBottom: 32,
  },
  loginButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    fontSize: 26,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#e2e8f0',
  },
  cardText: {
    fontSize: 16,
    color: '#cbd5e1',
    lineHeight: 24,
  },
  warningCard: {
    backgroundColor: '#451a03',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#b45309',
  },
  warningCardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fde68a',
  },
  warningCardText: {
    fontSize: 16,
    color: '#fcd34d',
    lineHeight: 24,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 36,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
  },
  emergencyButton: {
    backgroundColor: '#dc2626',
    borderRadius: 16,
    paddingVertical: 22,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f87171',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
  emergencyButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
