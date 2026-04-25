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
    backgroundColor: '#eef9f0',
  },
  header: {
    paddingTop: 64,
    paddingBottom: 24,
    paddingHorizontal: 24,
    backgroundColor: '#eef9f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#bbf7d0',
  },
  brandName: {
    fontSize: 46,
    fontWeight: '900',
    color: '#0f766e',
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
    color: '#052e16',
    lineHeight: 52,
    marginBottom: 16,
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#365314',
    lineHeight: 28,
    marginBottom: 32,
  },
  loginButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
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
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    boxShadow: '0 18px 34px rgba(16, 185, 129, 0.12)',
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
    color: '#052e16',
  },
  cardText: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
  },
  warningCard: {
    backgroundColor: '#fffbeb',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#fde68a',
    boxShadow: '0 10px 15px rgba(245, 158, 11, 0.1)',
  },
  warningCardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#92400e',
  },
  warningCardText: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 36,
    backgroundColor: 'rgba(238, 249, 240, 0.85)',
  },
  emergencyButton: {
    backgroundColor: '#dc2626',
    borderRadius: 16,
    paddingVertical: 22,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#b91c1c',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
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
