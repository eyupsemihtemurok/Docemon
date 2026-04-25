import { StyleSheet, Text, View } from 'react-native';

export default function DashboardScreen({ activeMenuItem }) {
  return (
    <View style={styles.container}>
      <View style={styles.contentCard}>
        <Text style={styles.title}>Hos geldin</Text>
        <Text style={styles.subtitle}>Secili menu: {activeMenuItem}</Text>

        <View style={styles.placeholderBox}>
          <Text style={styles.placeholderText}>Burasi dashboard icerigi icin placeholder alandir.</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: '#f4f7ff',
  },
  contentCard: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dbeafe',
    padding: 18,
    boxShadow: '0 14px 30px rgba(15, 23, 42, 0.10)',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#475569',
    marginBottom: 14,
  },
  placeholderBox: {
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
  },
  placeholderText: {
    color: '#334155',
    lineHeight: 21,
  },
});
