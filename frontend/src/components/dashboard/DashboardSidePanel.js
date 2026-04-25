import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

export default function DashboardSidePanel({ visible, onClose, menuItems, activeItemId, onSelect }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.panel}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>KS</Text>
            </View>
            <Text style={styles.nameText}>Kullanici Soyad</Text>
          </View>

          <View style={styles.menuList}>
            {menuItems.map((item) => {
              const isActive = item.id === activeItemId;
              return (
                <Pressable
                  key={item.id}
                  style={[styles.menuButton, isActive && styles.menuButtonActive]}
                  onPress={() => onSelect(item.id)}
                >
                  <Text style={[styles.menuButtonText, isActive && styles.menuButtonTextActive]}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.25)',
  },
  panel: {
    width: 280,
    backgroundColor: '#ffffff',
    paddingTop: 64,
    paddingHorizontal: 14,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    boxShadow: '0 12px 30px rgba(15, 23, 42, 0.20)',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: '#1e3a8a',
    fontSize: 24,
    fontWeight: '800',
  },
  nameText: {
    fontWeight: '700',
    color: '#0f172a',
    fontSize: 16,
  },
  menuList: {
    gap: 8,
  },
  menuButton: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
  },
  menuButtonActive: {
    backgroundColor: '#dbeafe',
  },
  menuButtonText: {
    color: '#1f2937',
    fontSize: 15,
    fontWeight: '600',
  },
  menuButtonTextActive: {
    color: '#1e3a8a',
  },
});
