import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState('login');

  const [loginTcNo, setLoginTcNo] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [registerTcNo, setRegisterTcNo] = useState('');
  const [registerFullName, setRegisterFullName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPhoto, setRegisterPhoto] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');

  const pickBiometricPhoto = () => {
    setRegisterPhoto(true);
  };

  const handleLogin = () => {
    if (!loginTcNo.trim() || !loginPassword.trim()) {
      Alert.alert('Eksik bilgi', 'Login icin TC no ve sifre zorunludur.');
      return;
    }

    onAuthenticated();
  };

  const handleRegister = () => {
    if (
      !registerTcNo.trim() ||
      !registerFullName.trim() ||
      !registerPhone.trim() ||
      !registerPassword.trim() ||
      !registerPhoto ||
      !registerEmail.trim()
    ) {
      Alert.alert('Eksik bilgi', 'Kayit icin tum alanlar zorunludur.');
      return;
    }

    onAuthenticated();
  };

  return (
    <View style={styles.root}>
      <Text style={styles.brand}>Dokemon</Text>
      <View style={styles.card}>
        <View style={styles.modeSwitch}>
          <Pressable
            onPress={() => setMode('login')}
            style={[styles.modeButton, mode === 'login' && styles.modeButtonActive]}
          >
            <Text style={[styles.modeText, mode === 'login' && styles.modeTextActive]}>Giris</Text>
          </Pressable>
          <Pressable
            onPress={() => setMode('register')}
            style={[styles.modeButton, mode === 'register' && styles.modeButtonActive]}
          >
            <Text style={[styles.modeText, mode === 'register' && styles.modeTextActive]}>Kayit</Text>
          </Pressable>
        </View>

        {mode === 'login' ? (
          <View style={styles.formWrap}>
            <Text style={styles.sectionTitle}>Giris Yap</Text>
            <TextInput
              value={loginTcNo}
              onChangeText={setLoginTcNo}
              placeholder="TC No"
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              value={loginPassword}
              onChangeText={setLoginPassword}
              placeholder="Sifre"
              secureTextEntry
              style={styles.input}
            />
            <Pressable onPress={handleLogin} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Giris Yap</Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView style={styles.formWrap} contentContainerStyle={styles.formContent}>
            <Text style={styles.sectionTitle}>Kayit Ol</Text>
            <TextInput
              value={registerTcNo}
              onChangeText={setRegisterTcNo}
              placeholder="TC No"
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              value={registerFullName}
              onChangeText={setRegisterFullName}
              placeholder="Ad Soyad"
              style={styles.input}
            />
            <TextInput
              value={registerPhone}
              onChangeText={setRegisterPhone}
              placeholder="Telefon"
              keyboardType="phone-pad"
              style={styles.input}
            />
            <TextInput
              value={registerPassword}
              onChangeText={setRegisterPassword}
              placeholder="Sifre"
              secureTextEntry
              style={styles.input}
            />

            <View style={styles.photoSection}>
              <Pressable onPress={pickBiometricPhoto} style={styles.photoButton}>
                <Text style={styles.photoButtonText}>Biyometrik Fotograf Yukle</Text>
              </Pressable>
              <Text style={styles.photoInfo}>
                {registerPhoto ? 'Biyometrik fotograf alani hazir' : 'Biyometrik fotograf secilmedi'}
              </Text>
            </View>

            <TextInput
              value={registerEmail}
              onChangeText={setRegisterEmail}
              placeholder="E-posta"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />

            <Pressable onPress={handleRegister} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Kayit Ol</Text>
            </Pressable>
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  brand: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1e3a8a',
    marginBottom: 14,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    minHeight: 390,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  modeSwitch: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    padding: 4,
    marginBottom: 12,
    gap: 8,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 8,
  },
  modeButtonActive: {
    backgroundColor: '#1e3a8a',
  },
  modeText: {
    color: '#334155',
    fontWeight: '700',
  },
  modeTextActive: {
    color: '#ffffff',
  },
  formWrap: {
    flex: 1,
  },
  formContent: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
  photoSection: {
    marginBottom: 10,
  },
  photoButton: {
    borderRadius: 10,
    backgroundColor: '#dbeafe',
    paddingVertical: 10,
    alignItems: 'center',
  },
  photoButtonText: {
    color: '#1e3a8a',
    fontWeight: '700',
  },
  photoInfo: {
    color: '#475569',
    fontSize: 12,
    marginTop: 6,
  },
  actionButton: {
    marginTop: 8,
    borderRadius: 10,
    backgroundColor: '#1d4ed8',
    paddingVertical: 11,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
});
