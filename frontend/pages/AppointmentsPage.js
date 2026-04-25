import { View, Text, StyleSheet } from 'react-native';

export default function AppointmentsPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Randevular</Text>
      <Text style={styles.description}>Randevu olusturma ve gecmis kayitlari bu alanda olacak.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#334155',
    textAlign: 'center',
  },
});
