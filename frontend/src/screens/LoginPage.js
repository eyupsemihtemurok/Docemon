import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ROUTES } from "../constants/routes";
import { loginUser, registerUser } from "../services/authApi";
import styles from "./styles/LoginPage.styles";

const LOGIN_INITIAL_STATE = {
  email: "",
  password: "",
};

const REGISTER_INITIAL_STATE = {
  nationalId: "",
  fullName: "",
  email: "",
  password: "",
  bloodType: "",
  chronicDiseases: "",
  birthDate: "",
  phone: "",
};

const DEFAULT_IMAGE = null;

export default function LoginPage({ onLogin, navigate }) {
  const [mode, setMode] = useState("login");
  const [loginForm, setLoginForm] = useState(LOGIN_INITIAL_STATE);
  const [registerForm, setRegisterForm] = useState(REGISTER_INITIAL_STATE);
  const [registerImage, setRegisterImage] = useState(DEFAULT_IMAGE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const updateLoginForm = (field, value) => {
    setLoginForm((current) => ({ ...current, [field]: value }));
  };

  const updateRegisterForm = (field, value) => {
    setRegisterForm((current) => ({ ...current, [field]: value }));
  };

  const handleRegisterImageResult = (result) => {
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const fileName = asset.fileName || `upload_${Date.now()}.jpg`;
      const mimeType = asset.mimeType || "image/jpeg";
      setRegisterImage({ uri: asset.uri, name: fileName, type: mimeType });
    }
  };

  const takeRegisterPhoto = async () => {
    try {
      if (Platform.OS === "web") {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
        handleRegisterImageResult(result);
        return;
      }

      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "İzin Gerekli",
          "Kamera kullanımı için izin vermeniz gerekmektedir.",
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      handleRegisterImageResult(result);
    } catch (error) {
      console.error("Register fotoğraf hatası:", error);
    }
  };

  const pickRegisterFromGallery = async () => {
    try {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "İzin Gerekli",
            "Galeri erişimi için izin vermeniz gerekmektedir.",
          );
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        mediaTypes: ["images"],
      });
      handleRegisterImageResult(result);
    } catch (error) {
      console.error("Register galeri hatası:", error);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFeedback(null);

    try {
      if (isLoginMode) {
        const result = await loginUser(loginForm);
        onLogin?.(result);
      } else {
        if (!registerImage) {
          setFeedback({
            type: "error",
            message: "Kayıt için bir yüz fotoğrafı seçmelisiniz.",
          });
          return;
        }

        const formData = new FormData();
        formData.append("userData", JSON.stringify({
          nationalId: registerForm.nationalId,
          fullName: registerForm.fullName,
          email: registerForm.email,
          password: registerForm.password,
          bloodType: registerForm.bloodType || "",
          chronicDiseases: registerForm.chronicDiseases || "",
          birthDate: registerForm.birthDate || "",
          phone: registerForm.phone || ""
        }));

        if (Platform.OS === "web") {
          const res = await fetch(registerImage.uri);
          const blob = await res.blob();
          formData.append("image", blob, registerImage.name || "face.jpg");
        } else {
          formData.append("image", {
            uri: registerImage.uri,
            name: registerImage.name || "face.jpg",
            type: registerImage.type || "image/jpeg",
          });
        }

        await registerUser(formData);

        setLoginForm((current) => ({
          ...current,
          email: registerForm.email,
          password: registerForm.password,
        }));
        setFeedback({
          type: "success",
          message:
            "Kullanıcı kaydı tamamlandı. Şimdi giriş yapabilirsiniz.",
        });
        setMode("login");
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message: error?.message || "İşlem sırasında bir hata oluştu.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoginMode = mode === "login";

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.topGlow} />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>AFET DESTEK PLATFORMU</Text>
          <Text style={styles.brandName}>Docemon</Text>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Canli izleme</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.modeSwitcher}>
            <Pressable
              style={[
                styles.modeButton,
                isLoginMode && styles.modeButtonActive,
              ]}
              onPress={() => {
                setMode("login");
                setFeedback(null);
              }}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  isLoginMode && styles.modeButtonTextActive,
                ]}
              >
                Giriş Yap
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.modeButton,
                !isLoginMode && styles.modeButtonActive,
              ]}
              onPress={() => {
                setMode("register");
                setFeedback(null);
              }}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  !isLoginMode && styles.modeButtonTextActive,
                ]}
              >
                Kayıt Ol
              </Text>
            </Pressable>
          </View>

          <Text style={styles.title}>
            {isLoginMode ? "Hoş Geldiniz" : "Yeni Hesap Oluştur"}
          </Text>
          <Text style={styles.subtitle}>
            {isLoginMode
              ? "Sisteme giriş yapmak için e-posta ve şifrenizi girin."
              : "Hesap oluşturmak için kimlik, iletişim ve sağlık bilgilerinizi doldurun."}
          </Text>

          {feedback && (
            <View
              style={[
                styles.feedbackBox,
                feedback.type === "error"
                  ? styles.feedbackError
                  : styles.feedbackSuccess,
              ]}
            >
              <Text style={styles.feedbackText}>{feedback.message}</Text>
            </View>
          )}

          {isLoginMode ? (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>E-posta</Text>
                <TextInput
                  style={styles.input}
                  placeholder="ornek@eposta.com"
                  placeholderTextColor="#64748b"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={loginForm.email}
                  onChangeText={(value) => updateLoginForm("email", value)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Şifre</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  secureTextEntry
                  placeholderTextColor="#64748b"
                  value={loginForm.password}
                  onChangeText={(value) => updateLoginForm("password", value)}
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.photoSection}>
                <Text style={styles.photoSectionTitle}>Yuz Fotografi</Text>
                <Text style={styles.photoSectionHint}>
                  Kayit icin net ve tek kisilik bir portre secin.
                </Text>

                <View style={styles.photoCircle}>
                  {registerImage ? (
                    <Image
                      source={{ uri: registerImage.uri }}
                      style={styles.photoPreview}
                    />
                  ) : (
                    <Text style={styles.photoPlaceholder}>
                      Yüzünüzü gösteren net bir fotoğraf ekleyin
                    </Text>
                  )}
                </View>

                <View style={styles.photoButtonRow}>
                  <Pressable
                    onPress={takeRegisterPhoto}
                    style={styles.cameraButton}
                  >
                    <View style={styles.photoActionBadge}>
                      <Text style={styles.photoActionBadgeText}>CAM</Text>
                    </View>
                    <Text style={styles.cameraButtonText}>Kamera</Text>
                  </Pressable>
                  <Pressable
                    onPress={pickRegisterFromGallery}
                    style={styles.galleryButton}
                  >
                    <View style={styles.photoActionBadge}>
                      <Text style={styles.photoActionBadgeText}>GAL</Text>
                    </View>
                    <Text style={styles.galleryButtonText}>Galeri</Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>T.C. Kimlik No</Text>
                <TextInput
                  style={styles.input}
                  placeholder="11 haneli kimlik no"
                  placeholderTextColor="#64748b"
                  keyboardType="numeric"
                  maxLength={11}
                  value={registerForm.nationalId}
                  onChangeText={(value) =>
                    updateRegisterForm("nationalId", value)
                  }
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Ad Soyad</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Adınız ve soyadınız"
                  placeholderTextColor="#64748b"
                  value={registerForm.fullName}
                  onChangeText={(value) =>
                    updateRegisterForm("fullName", value)
                  }
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>E-posta</Text>
                <TextInput
                  style={styles.input}
                  placeholder="ornek@eposta.com"
                  placeholderTextColor="#64748b"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={registerForm.email}
                  onChangeText={(value) => updateRegisterForm("email", value)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Şifre</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  secureTextEntry
                  placeholderTextColor="#64748b"
                  value={registerForm.password}
                  onChangeText={(value) =>
                    updateRegisterForm("password", value)
                  }
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Kan Grubu</Text>
                <TextInput
                  style={styles.input}
                  placeholder="A+, 0-, AB+..."
                  placeholderTextColor="#64748b"
                  autoCapitalize="characters"
                  value={registerForm.bloodType}
                  onChangeText={(value) =>
                    updateRegisterForm("bloodType", value)
                  }
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Kronik Rahatsızlıklar</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Varsa kısa açıklama"
                  placeholderTextColor="#64748b"
                  multiline
                  value={registerForm.chronicDiseases}
                  onChangeText={(value) =>
                    updateRegisterForm("chronicDiseases", value)
                  }
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Doğum Tarihi</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-AA-GG"
                  placeholderTextColor="#64748b"
                  value={registerForm.birthDate}
                  onChangeText={(value) =>
                    updateRegisterForm("birthDate", value)
                  }
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Telefon</Text>
                <TextInput
                  style={styles.input}
                  placeholder="05xx xxx xx xx"
                  placeholderTextColor="#64748b"
                  keyboardType="phone-pad"
                  value={registerForm.phone}
                  onChangeText={(value) => updateRegisterForm("phone", value)}
                />
              </View>
            </>
          )}

          <Pressable
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>
                {isLoginMode ? "Giriş Yap" : "Kayıt Ol"}
              </Text>
            )}
          </Pressable>

          <View style={styles.footer}>
            <Pressable onPress={() => navigate && navigate(ROUTES.HOME)}>
              <Text style={styles.footerLink}>Ana sayfa</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setMode(isLoginMode ? "register" : "login");
                setFeedback(null);
              }}
            >
              <Text style={styles.footerLink}>
                {isLoginMode ? "Kayıt Ol" : "Giriş Yap"}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
