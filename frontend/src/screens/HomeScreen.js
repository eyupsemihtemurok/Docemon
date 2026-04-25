import { Pressable, Text, View, ScrollView } from 'react-native';
import { ROUTES } from '../constants/routes';
import styles from './styles/HomeScreen.styles';

export default function HomeScreen({ navigate }) {
  return (
    <View style={styles.container}>
      <View style={styles.topGlow} />

      <View style={styles.headerWrap}>
        <Text style={styles.brandEyebrow}>AFET KİŞİ TANIMA PLATFORMU</Text>
        <Text style={styles.brandName}>Docemon</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Afetlere Karsi Hazir misiniz?</Text>
          <Text style={styles.heroSubtitle}>
            Saniyeler hayat kurtarir. Afet aninda dogru bilgiye, acil yardima ve sevdiklerinize aninda ulasin.
          </Text>

          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>7 dk</Text>
              <Text style={styles.metricLabel}>ortalama eslesme</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>24/7</Text>
              <Text style={styles.metricLabel}>canli izleme</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>128+</Text>
              <Text style={styles.metricLabel}>aktif ihbar</Text>
            </View>
          </View>

          <Pressable style={styles.loginButton} onPress={() => navigate(ROUTES.LOGIN)}>
            <Text style={styles.loginButtonText}>Sisteme Kayıt Ol</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>⚠️</Text>
            <Text style={styles.cardTitle}>Afetlerin Gercekligi</Text>
          </View>
          <Text style={styles.cardText}>
            Deprem, sel veya yangin... Dogal afetler beklenmedik anlarda gerceklesir. Hazirliksiz yakalanmak, Sevdiklerimizle aramıza dramatik mesafeler koyar. Sevdiklerimizden haberdar olmak  en buyuk kalkaninizdir.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>🛡️</Text>
            <Text style={styles.cardTitle}>Biz Ne Yapıyoruz?</Text>
          </View>
          <Text style={styles.cardText}>
            Uygulamamiz, afet oncesinde hazirlik seviyenizi artirir; afet aninda ise tek tusla yetkililere ve yakinlariniza konumunuzu iletir. Kriz aninda iletisimi hizli ve kesintisiz kilmayi hedefler.
          </Text>
        </View>

        <View style={styles.warningCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>🔔</Text>
            <Text style={styles.warningCardTitle}>Canli Uyari Sistemi</Text>
          </View>
          <Text style={styles.warningCardText}>
            Bolgenizdeki riskleri ve anlik afet uyarilarini gercek zamanli olarak takip edin. Erken uyari sistemi sayesinde tehlikeden uzak durun.
          </Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      
    </View>
  );
}
