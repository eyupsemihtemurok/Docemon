import { View, Text, StyleSheet } from 'react-native';

export default function AppointmentsPage() {
  const appointments = [
    { time: '09:30', title: 'Kontrol', note: 'Günlük iş akışı gözden geçirildi.' },
    { time: '13:00', title: 'Görüşme', note: 'Yeni talepler için kısa değerlendirme.' },
    { time: '16:45', title: 'Yedekleme', note: 'Veri ve içerik güncellemeleri tamamlandı.' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Randevular</Text>
      <Text style={styles.description}>Randevu oluşturma, yaklaşan işler ve geçmiş kayıtlar.</Text>

      <View style={styles.card}>
        {appointments.map((appointment) => (
          <View key={appointment.time} style={styles.appointmentItem}>
            <View style={styles.timeBadge}>
              <Text style={styles.timeText}>{appointment.time}</Text>
            </View>
            <View style={styles.appointmentBody}>
              <Text style={styles.appointmentTitle}>{appointment.title}</Text>
              <Text style={styles.appointmentNote}>{appointment.note}</Text>
            </View>
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
  appointmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  timeBadge: {
    width: 64,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
  },
  timeText: {
    color: '#1e3a8a',
    fontWeight: '800',
  },
  appointmentBody: {
    flex: 1,
  },
  appointmentTitle: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  appointmentNote: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 20,
  },
});
