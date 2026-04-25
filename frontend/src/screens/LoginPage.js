import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { ROUTES } from '../constants/routes';
import { loginUser, registerUser } from '../services/authApi';
import styles from './styles/LoginPage.styles';

const LOGIN_INITIAL_STATE = {
  email: '',
  password: '',
};

const REGISTER_INITIAL_STATE = {
  nationalId: '',
  fullName: '',
  email: '',
  password: '',
  bloodType: '',
  chronicDiseases: '',
  birthDate: '',
  phone: '',
};

export default function LoginPage({ onLogin, navigate }) {
  const [mode, setMode] = useState('login');
  const [loginForm, setLoginForm] = useState(LOGIN_INITIAL_STATE);
  const [registerForm, setRegisterForm] = useState(REGISTER_INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const updateLoginForm = (field, value) => {
    setLoginForm((current) => ({ ...current, [field]: value }));
  };

  const updateRegisterForm = (field, value) => {
    setRegisterForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFeedback(null);

    try {
      if (mode === 'login') {
        const result = await loginUser(loginForm);
        onLogin?.(result);
        return;
      }

      await registerUser({
        ...registerForm,
        nationalId: '1',
      });
      const result = await loginUser({
        email: registerForm.email,
        password: registerForm.password,
      });

      onLogin?.(result);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error?.message || 'İşlem sırasında bir hata oluştu.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoginMode = mode === 'login';

  return (
    <KeyboardAvoidingView 
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.topGlow} />

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
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
              style={[styles.modeButton, isLoginMode && styles.modeButtonActive]}
              onPress={() => setMode('login')}
            >
              <Text style={[styles.modeButtonText, isLoginMode && styles.modeButtonTextActive]}>Giriş Yap</Text>
            </Pressable>
            <Pressable
              style={[styles.modeButton, !isLoginMode && styles.modeButtonActive]}
              onPress={() => setMode('register')}
            >
              <Text style={[styles.modeButtonText, !isLoginMode && styles.modeButtonTextActive]}>Kayıt Ol</Text>
            </Pressable>
          </View>

          <Text style={styles.title}>{isLoginMode ? 'Hoş Geldiniz' : 'Yeni Hesap Oluştur'}</Text>
          <Text style={styles.subtitle}>
            {isLoginMode
              ? 'Sisteme giriş yapmak için e-posta ve şifrenizi girin.'
              : 'Hesap oluşturmak için bilgilerinizi eksiksiz doldurun.'}
          </Text>

          {feedback && (
            <View style={[styles.feedbackBox, feedback.type === 'error' ? styles.feedbackError : styles.feedbackSuccess]}>
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
                  onChangeText={(value) => updateLoginForm('email', value)}
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
                  onChangeText={(value) => updateLoginForm('password', value)}
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Ad Soyad</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Adınız ve soyadınız"
                  placeholderTextColor="#64748b"
                  value={registerForm.fullName}
                  onChangeText={(value) => updateRegisterForm('fullName', value)}
                />
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
                  onChangeText={(value) => updateRegisterForm('nationalId', value)}
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
                  onChangeText={(value) => updateRegisterForm('email', value)}
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
                  onChangeText={(value) => updateRegisterForm('password', value)}
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
                  onChangeText={(value) => updateRegisterForm('bloodType', value)}
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
                  onChangeText={(value) => updateRegisterForm('chronicDiseases', value)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Doğum Tarihi</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-AA-GG"
                  placeholderTextColor="#64748b"
                  value={registerForm.birthDate}
                  onChangeText={(value) => updateRegisterForm('birthDate', value)}
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
                  onChangeText={(value) => updateRegisterForm('phone', value)}
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
              <Text style={styles.buttonText}>{isLoginMode ? 'Giriş Yap' : 'Kayıt Ol'}</Text>
            )}
          </Pressable>

          <View style={styles.footer}>
            <Pressable onPress={() => navigate && navigate(ROUTES.HOME)}>
              <Text style={styles.footerLink}>Ana sayfa</Text>
            </Pressable>

            <Pressable onPress={() => setMode(isLoginMode ? 'register' : 'login')}>
              <Text style={styles.footerLink}>{isLoginMode ? 'Kayıt Ol' : 'Giriş Yap'}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
