import { View, Text, StyleSheet } from 'react-native';

export default function ProfilePage() {
  const profileFields = [
    { label: 'Kullanıcı', value: 'Mete' },
    { label: 'E-posta', value: 'mekan@example.com' },
    { label: 'Durum', value: 'Aktif' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.iconBadge}>
          <Text style={styles.iconText}>P</Text>
        </View>
        <View>
          <Text style={styles.title}>Profil</Text>
          <Text style={styles.subtitle}>Hesap bilgileri ve ayarlar</Text>
        </View>
      </View>

      <View style={styles.card}>
        {profileFields.map((field) => (
          <View key={field.label} style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            <Text style={styles.fieldValue}>{field.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.noteCard}>
        <Text style={styles.description}>Kullanıcı tercihleri, güvenlik ve bildirim seçenekleri bu bölümden yönetilebilir.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 20px rgba(37, 99, 235, 0.16)',
  },
  iconText: {
    color: '#1e3a8a',
    fontWeight: '700',
    fontSize: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    color: '#475569',
    fontSize: 14,
    marginTop: 2,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#dbeafe',
    boxShadow: '0 12px 24px rgba(15, 23, 42, 0.08)',
    gap: 10,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  fieldLabel: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  fieldValue: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'right',
  },
  noteCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  description: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 22,
  },
});
