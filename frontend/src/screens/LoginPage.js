import { Pressable, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform } from 'react-native';
import { ROUTES } from '../constants/routes';

export default function LoginPage({ onLogin, navigate }) {
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.brandName}>Docemon</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Hoş Geldiniz</Text>
        <Text style={styles.subtitle}>Sisteme giriş yapmak için bilgilerinizi girin.</Text>

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
          <Text style={styles.label}>Şifre</Text>
          <TextInput 
            style={styles.input} 
            placeholder="••••••••" 
            secureTextEntry 
            placeholderTextColor="#64748b" 
          />
        </View>

        <Pressable style={styles.button} onPress={onLogin}>
          <Text style={styles.buttonText}>Giriş Yap</Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Hesabınız yok mu? </Text>
          <Pressable onPress={() => navigate && navigate(ROUTES.REGISTER)}>
            <Text style={styles.footerLink}>Kayıt Ol</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#0f172a',
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  brandName: {
    fontSize: 40,
    fontWeight: '900',
    color: '#3b82f6',
    letterSpacing: 2,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 18,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    color: '#f8fafc',
    backgroundColor: '#0f172a',
    fontSize: 14,
  },
  button: {
    marginTop: 8,
    backgroundColor: '#3b82f6',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
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
    marginTop: 20,
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  footerLink: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '700',
  },
});
