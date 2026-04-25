import { View, Text, StyleSheet } from 'react-native';

export default function ServicesPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hizmetler</Text>
      <Text style={styles.description}>Sunulan hizmetlerin listesi bu sayfada yer alir.</Text>
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
