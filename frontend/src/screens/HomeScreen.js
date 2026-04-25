import { Pressable, Text, View } from 'react-native';
import { ROUTES } from '../constants/routes';
import styles from './styles/HomeScreen.styles';

export default function HomeScreen({ navigate }) {
  return (
    <View style={styles.container}>
      <View style={styles.todoCard}>
        <Text style={styles.title}>Yapilacaklar</Text>
        <View style={styles.todoItem}>
          <Text style={styles.todoText}>- Gunun islerini planla</Text>
        </View>
        <View style={styles.todoItem}>
          <Text style={styles.todoText}>- Oncelikli gorevleri bitir</Text>
        </View>
        <View style={styles.todoItem}>
          <Text style={styles.todoText}>- Takip notlarini guncelle</Text>
        </View>

        <View style={styles.adBox}>
          <Text style={styles.adText}>Reklam icerir</Text>
        </View>

        <Pressable style={styles.primaryButton} onPress={() => navigate(ROUTES.LOGIN)}>
          <Text style={styles.primaryButtonText}>Kayit ol</Text>
        </Pressable>
      </View>
    </View>
  );
}


