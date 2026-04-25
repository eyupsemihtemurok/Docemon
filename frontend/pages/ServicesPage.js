import { View, Text, StyleSheet } from 'react-native';

export default function ServicesPage() {
  const services = [
    { title: 'Online destek', description: 'Hızlı soru-cevap ve yönlendirme.' },
    { title: 'Randevu yönetimi', description: 'İleri tarihli planlama ve takip.' },
    { title: 'Bildirim sistemi', description: 'Önemli güncellemeleri kaçırma.' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hizmetler</Text>
      <Text style={styles.description}>Sunulan hizmetlerin kısa özeti ve erişim noktaları.</Text>

      <View style={styles.card}>
        {services.map((service) => (
          <View key={service.title} style={styles.serviceItem}>
            <Text style={styles.serviceTitle}>{service.title}</Text>
            <Text style={styles.serviceDescription}>{service.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
  },
  description: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#dbeafe',
    boxShadow: '0 12px 24px rgba(15, 23, 42, 0.08)',
    gap: 12,
  },
  serviceItem: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  serviceTitle: {
    color: '#1e3a8a',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  serviceDescription: {
    color: '#334155',
    fontSize: 14,
    lineHeight: 20,
  },
});
