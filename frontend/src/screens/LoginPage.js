import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginPage({ onLogin }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Kayit ol / Giris yap</Text>
        <Text style={styles.subtitle}>Bu alan su an placeholder veriler ile calisir.</Text>

        <TextInput style={styles.input} placeholder="E-posta" placeholderTextColor="#64748b" />
        <TextInput style={styles.input} placeholder="Sifre" secureTextEntry placeholderTextColor="#64748b" />

        <Pressable style={styles.button} onPress={onLogin}>
          <Text style={styles.buttonText}>Giris Yap</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f7ff',
  },
  card: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    padding: 20,
    borderWidth: 1,
    borderColor: '#dbeafe',
    boxShadow: '0 14px 30px rgba(15, 23, 42, 0.10)',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 14,
    fontSize: 14,
    color: '#475569',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 12,
    marginBottom: 10,
    color: '#0f172a',
    backgroundColor: '#ffffff',
  },
  button: {
    marginTop: 4,
    backgroundColor: '#0f766e',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
