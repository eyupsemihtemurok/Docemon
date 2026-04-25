import { Pressable, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { ROUTES } from '../constants/routes';

export default function RegisterPage({ onRegister, navigate }) {
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.brandName}>Docemon</Text>
      </View>

      <View style={styles.card}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Kayıt Ol</Text>
          <Text style={styles.subtitle}>Sisteme katılmak için bilgilerinizi eksiksiz doldurun.</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Ad Soyad</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Örn: Ali Yılmaz" 
              placeholderTextColor="#64748b" 
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>TC Kimlik Numarası</Text>
            <TextInput 
              style={styles.input} 
              placeholder="11 haneli kimlik no" 
              placeholderTextColor="#64748b" 
              keyboardType="numeric"
              maxLength={11}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Telefon Numarası</Text>
            <TextInput 
              style={styles.input} 
              placeholder="05XX XXX XX XX" 
              placeholderTextColor="#64748b" 
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>E-posta</Text>
            <TextInput 
              style={styles.input} 
              placeholder="ornek@posta.com" 
              placeholderTextColor="#64748b" 
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Biyometrik Fotoğraf</Text>
            <Pressable style={styles.photoButton}>
              <Text style={styles.photoButtonText}>📷 Fotoğraf Yükle</Text>
            </Pressable>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Şifre</Text>
            <TextInput 
              style={styles.input} 
              placeholder="••••••••" 
              secureTextEntry 
              placeholderTextColor="#64748b" 
            />
          </View>

          <Pressable style={styles.button} onPress={onRegister}>
            <Text style={styles.buttonText}>Kayıt İşlemini Tamamla</Text>
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Zaten hesabınız var mı? </Text>
            <Pressable onPress={() => navigate && navigate(ROUTES.LOGIN)}>
              <Text style={styles.footerLink}>Giriş Yap</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#eef9f0',
    justifyContent: 'center',
  },
  header: {
    marginBottom: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  brandName: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0f766e',
    letterSpacing: 2,
  },
  card: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 10,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#052e16',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#365314',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 18,
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    color: '#15803d',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    color: '#052e16',
    backgroundColor: '#ffffff',
    fontSize: 14,
  },
  photoButton: {
    borderWidth: 1,
    borderColor: '#0f766e',
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
  },
  photoButtonText: {
    color: '#0f766e',
    fontSize: 14,
    fontWeight: '800',
  },
  button: {
    marginTop: 8,
    backgroundColor: '#16a34a',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 4,
  },
  footerText: {
    color: '#475569',
    fontSize: 14,
  },
  footerLink: {
    color: '#0f766e',
    fontSize: 14,
    fontWeight: '800',
  },
});
