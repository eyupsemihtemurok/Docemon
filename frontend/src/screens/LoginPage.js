import { Pressable, Text, TextInput, View } from 'react-native';
import styles from './styles/LoginPage.styles';

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

