import { StyleSheet, Text, View, Pressable } from 'react-native';

export default function ProfileScreen({ navigate }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profilim</Text>
        <Text style={styles.subtitle}>Mete Kaya</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Ad Soyad</Text>
          <Text style={styles.infoValue}>Mete Kaya</Text>
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Unvan</Text>
          <Text style={styles.infoValue}>Saha Koordinatörü</Text>
        </View>

        <Pressable 
          style={styles.backButton} 
          onPress={() => navigate('/dashboard')}
        >
          <Text style={styles.backButtonText}>Dashboard'a Geri Dön</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 24,
  },
  header: {
    marginBottom: 32,
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  content: {
    gap: 16,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
  },
  backButton: {
    marginTop: 24,
    backgroundColor: '#15803d',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
