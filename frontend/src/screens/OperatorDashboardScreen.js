import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { getPendingVerifications, approveVerification } from '../api/biometric';
import styles from './styles/OperatorDashboardScreen.styles';

/**
 * Operatör Onay Paneli
 * StyleSheet.create ile stilize edilmiş, bekleyen eşleşmeleri listeleyen ekran.
 */
const OperatorDashboardScreen = ({ navigate }) => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Bekleyen doğrulamaları API'den çekme
  const loadData = async () => {
    try {
      const response = await getPendingVerifications();
      setVerifications(response.data || []);
    } catch (error) {
      console.error('Veri Yükleme Hatası:', error);
      Alert.alert('Hata', 'Bekleyen doğrulamalar alınamadı.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Onay veya Red işlemi
  const handleAction = async (verificationId, status) => {
    try {
      await approveVerification({ verificationId, status });
      // Başarılıysa listeden sil
      setVerifications(verifications.filter((v) => v.id !== verificationId));
      const msg = status === 'APPROVED' ? 'Eşleşme onaylandı.' : 'Eşleşme reddedildi.';
      Alert.alert('Başarılı', msg);
    } catch (error) {
      console.error('İşlem Hatası:', error);
      Alert.alert('Hata', 'İşlem gerçekleştirilemedi.');
    }
  };

  // Eşleşme kartı render fonksiyonu
  const renderVerificationCard = ({ item }) => (
    <View style={styles.card}>
      {/* Üst Satır: İsim + Skor */}
      <View style={styles.cardTopRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardName}>{item.FullName}</Text>
          <Text style={styles.cardNationalId}>TC: {item.NationalId}</Text>
        </View>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreText}>%{item.MatchingScore} Benzerlik</Text>
        </View>
      </View>

      {/* Detaylar */}
      <View style={styles.detailBlock}>
        <View>
          <Text style={styles.detailLabel}>SAĞLIK DURUMU</Text>
          <Text style={styles.detailValue}>{item.HealthDetails || 'Bilgi yok'}</Text>
        </View>
        <View>
          <Text style={styles.detailLabel}>KONUM NOTU</Text>
          <Text style={styles.detailValue}>{item.LocationDetails || 'Bilgi yok'}</Text>
        </View>
      </View>

      {/* Aksiyon Butonları */}
      <View style={styles.actionRow}>
        <Pressable
          onPress={() => handleAction(item.id, 'APPROVED')}
          style={styles.approveButton}
        >
          <Text style={styles.approveButtonText}>ONAYLA</Text>
        </Pressable>
        <Pressable
          onPress={() => handleAction(item.id, 'REJECTED')}
          style={styles.rejectButton}
        >
          <Text style={styles.rejectButtonText}>REDDET</Text>
        </Pressable>
      </View>
    </View>
  );

  // Yükleme durumu
  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color="#15803d" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Üst Bar: Geri + Başlık */}
      <View style={styles.topBar}>
        <Pressable onPress={() => navigate('/dashboard')} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Geri</Text>
        </Pressable>
      </View>

      {/* Başlık */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Operatör Onay Paneli</Text>
        <Text style={styles.headerSub}>Bekleyen {verifications.length} adet eşleşme var</Text>
      </View>

      {/* Liste */}
      <FlatList
        data={verifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderVerificationCard}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>🎉</Text>
            <Text style={styles.emptyText}>Tebrikler! Bekleyen doğrulama kaydı bulunmuyor.</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadData();
            }}
          />
        }
      />
    </View>
  );
};

export default OperatorDashboardScreen;
