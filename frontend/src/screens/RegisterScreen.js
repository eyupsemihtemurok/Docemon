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
import { registerBiometric } from '../api/biometric';
import styles from './styles/RegisterScreen.styles';

/**
 * Biyometrik Kayıt Ekranı
 * StyleSheet.create ile stilize edilmiş, gerçek kamera/galeri erişimli.
 */
const RegisterScreen = ({ navigate }) => {
  const [form, setForm] = useState({
    NationalId: '',
    FullName: '',
    Email: '',
    Password: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  // Resim sonucunu dinamik olarak state'e yazan ortak fonksiyon
  const handleImageResult = (result) => {
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const fileName = asset.fileName || `upload_${Date.now()}.jpg`;
      const mimeType = asset.mimeType || 'image/jpeg';
      setImage({ uri: asset.uri, name: fileName, type: mimeType });
    }
  };

  // Kamerayı açma (Web'de galeri açılır)
  const takePhoto = async () => {
    try {
      if (Platform.OS === 'web') {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
        handleImageResult(result);
        return;
      }

      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Kamera kullanımı için izin vermeniz gerekmektedir.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      handleImageResult(result);
    } catch (error) {
      console.error('Kamera hatası:', error);
    }
  };

  // Galeri açma
  const pickFromGallery = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('İzin Gerekli', 'Galeri erişimi için izin vermeniz gerekmektedir.');
          return;
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        mediaTypes: ['images'],
      });
      handleImageResult(result);
    } catch (error) {
      console.error('Galeri hatası:', error);
    }
  };

  // Form gönderimi
  const handleRegister = async () => {
    const { NationalId, FullName, Email, Password } = form;
    if (!NationalId || !FullName || !Email || !Password || !image) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun ve bir yüz fotoğrafı ekleyin.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append(
        'userData',
        JSON.stringify({
          nationalId: NationalId,
          fullName: FullName,
          email: Email,
          password: Password,
        })
      );
      formData.append('image', { uri: image.uri, name: image.name, type: image.type });

      await registerBiometric(formData);
      Alert.alert('Başarılı', 'Biyometrik kaydınız oluşturuldu.', [
        { text: 'Tamam', onPress: () => navigate('/loginPage') },
      ]);
    } catch (error) {
      console.error('Kayıt Hatası:', error);
      Alert.alert('Hata', 'Kayıt sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Başlık */}
      <View style={styles.headerBlock}>
        <Text style={styles.headerTitle}>Kayıt Ol</Text>
        <Text style={styles.headerSub}>Biyometrik sistem için profilinizi oluşturun</Text>
      </View>

      {/* Fotoğraf Alanı */}
      <View style={styles.photoSection}>
        <View style={styles.photoCircle}>
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.photoPreview} />
          ) : (
            <Text style={styles.photoPlaceholder}>Yüzünüzü gösteren net bir fotoğraf ekleyin</Text>
          )}
        </View>

        <View style={styles.photoButtonRow}>
          <Pressable onPress={takePhoto} style={styles.cameraButton}>
            <Text style={styles.cameraButtonText}>📷 Kamera</Text>
          </Pressable>
          <Pressable onPress={pickFromGallery} style={styles.galleryButton}>
            <Text style={styles.galleryButtonText}>🖼️ Galeri</Text>
          </Pressable>
        </View>
      </View>

      {/* Form Alanları */}
      <View style={styles.formGroup}>
        <TextInput
          style={styles.input}
          placeholder="T.C. Kimlik No"
          placeholderTextColor="#94a3b8"
          keyboardType="numeric"
          maxLength={11}
          value={form.NationalId}
          onChangeText={(v) => handleChange('NationalId', v)}
        />
        <TextInput
          style={styles.input}
          placeholder="Ad Soyad"
          placeholderTextColor="#94a3b8"
          value={form.FullName}
          onChangeText={(v) => handleChange('FullName', v)}
        />
        <TextInput
          style={styles.input}
          placeholder="E-posta"
          placeholderTextColor="#94a3b8"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.Email}
          onChangeText={(v) => handleChange('Email', v)}
        />
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          value={form.Password}
          onChangeText={(v) => handleChange('Password', v)}
        />
      </View>

      {/* Kayıt Butonu */}
      <Pressable
        onPress={handleRegister}
        disabled={loading}
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.submitButtonText}>Kaydı Tamamla</Text>
        )}
      </Pressable>

      {/* Giriş Yap Linki */}
      <Pressable onPress={() => navigate('/loginPage')} style={styles.backLink}>
        <Text style={styles.backLinkText}>
          Zaten hesabınız var mı? <Text style={styles.backLinkBold}>Giriş Yap</Text>
        </Text>
      </Pressable>
    </ScrollView>
  );
};

export default RegisterScreen;
