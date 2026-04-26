import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadRescuePhoto } from '../api/biometric';
import styles from './styles/RescueScannerScreen.styles';

/**
 * Sahadan Tanılama Ekranı
 * StyleSheet.create ile stilize edilmiş, kamera öncelikli akış.
 */
const RescueScannerScreen = ({ navigate }) => {
  const [healthDetails, setHealthDetails] = useState('');
  const [locationDetails, setLocationDetails] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Resim sonucunu yakalayıp dinamik verileri state'e yazan ortak fonksiyon
  const processImage = (result) => {
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const uriParts = asset.uri.split('/');
      const fileName = asset.fileName || uriParts[uriParts.length - 1] || `rescue_${Date.now()}.jpg`;
      const mimeType = asset.mimeType || 'image/jpeg';
      setImage({ uri: asset.uri, name: fileName, type: mimeType });
    }
  };

  // Akıllı kamera (Web'de galeri, mobilde gerçek kamera)
  const openCamera = async () => {
    try {
      if (Platform.OS === 'web') {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          quality: 0.7,
        });
        processImage(result);
        return;
      }

      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Kamera izni vermelisiniz.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.7,
        allowsEditing: false,
      });
      processImage(result);
    } catch (error) {
      console.error('Kamera hatası:', error);
      Alert.alert('Hata', 'Kamera açılamadı.');
    }
  };

  // Galeri açma
  const openGallery = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('İzin Gerekli', 'Galeri izni vermelisiniz.');
          return;
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 0.7,
        mediaTypes: ['images'],
      });
      processImage(result);
    } catch (error) {
      console.error('Galeri hatası:', error);
    }
  };

  // Sunucuya gönderme
  const handleStartScanning = async () => {
    if (!image) {
      Alert.alert('Hata', 'Lütfen önce bir fotoğraf çekin veya seçin.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', { uri: image.uri, name: image.name, type: image.type });
      formData.append('healthDetails', healthDetails || 'Bilinmiyor');
      formData.append('locationDetails', locationDetails || 'Belirtilmedi');

      await uploadRescuePhoto(formData);

      setImage(null);
      setHealthDetails('');
      setLocationDetails('');
      Alert.alert('Başarılı', 'Eşleşme analizi başlatıldı ve onay için Operatör ekranına iletildi.');
    } catch (error) {
      console.error('Gönderim Hatası:', error);
      Alert.alert('Hata', 'Veriler sunucuya gönderilemedi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Geri Dönme Butonu */}
      <Pressable onPress={() => navigate('/dashboard')} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Geri Dön</Text>
      </Pressable>

      {/* Başlık */}
      <View style={styles.headerBlock}>
        <Text style={styles.headerTitle}>Saha Tanılama</Text>
        <Text style={styles.headerSub}>Kayıp kişileri yapay zeka ile eşleştirin</Text>
      </View>

      {/* Kamera / Önizleme Alanı */}
      <View style={styles.photoCard}>
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.photoPreview} resizeMode="cover" />
        ) : (
          <Pressable onPress={openCamera} style={styles.photoTouchable}>
            <View style={styles.photoIconWrap}>
              <Text style={styles.photoIconText}>📷</Text>
            </View>
            <Text style={styles.photoLabel}>Kamerayı Aç</Text>
            <Text style={styles.photoHint}>Afetzede fotoğrafı çekin</Text>
          </Pressable>
        )}

        {image && (
          <View style={styles.photoOverlayButtons}>
            <Pressable onPress={openCamera} style={styles.retakeButton}>
              <Text style={styles.retakeButtonText}>Yeniden Çek</Text>
            </Pressable>
            <Pressable onPress={() => setImage(null)} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>Kaldır</Text>
            </Pressable>
          </View>
        )}
      </View>

      {!image && (
        <Pressable onPress={openGallery} style={styles.galleryLink}>
          <Text style={styles.galleryLinkText}>Galeriden bir fotoğraf seç</Text>
        </Pressable>
      )}

      {/* Form Alanları */}
      <View style={styles.formSection}>
        <View>
          <Text style={styles.inputLabel}>Sağlık Durumu Notu</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Örn: Bilinci kapalı, sol kolda kırık şüphesi"
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={2}
            value={healthDetails}
            onChangeText={setHealthDetails}
          />
        </View>

        <View>
          <Text style={styles.inputLabel}>Konum Detayı</Text>
          <TextInput
            style={styles.input}
            placeholder="Örn: Kahramanmaraş / Onikişubat - A Blok"
            placeholderTextColor="#94a3b8"
            value={locationDetails}
            onChangeText={setLocationDetails}
          />
        </View>
      </View>

      {/* Ana Aksiyon Butonu */}
      <Pressable
        onPress={handleStartScanning}
        disabled={loading}
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.submitButtonText}>Tanımlamayı Başlat ⚡</Text>
        )}
      </Pressable>
    </ScrollView>
  );
};

export default RescueScannerScreen;