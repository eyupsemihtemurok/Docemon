import { Platform, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function DashboardNavbar({ userName = 'Kullanıcı', onToggleMenu }) {
  return (
    <View style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
          </View>
          <View>
            <Text style={styles.welcomeText}>Hoş geldin,</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
        </View>

        <Pressable style={styles.burgerButton} onPress={onToggleMenu}>
          <View style={styles.burgerLine} />
          <View style={[styles.burgerLine, { width: 14 }]} />
          <View style={styles.burgerLine} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: 'transparent',
  },
  container: {
    height: 85,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#d1fae5',
    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.12)',
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 4,
    zIndex: 10,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#15803d',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    boxShadow: '0 4px 10px rgba(21, 128, 61, 0.2)',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  welcomeText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
  userName: {
    color: '#052e16',
    fontSize: 17,
    fontWeight: '900',
    marginTop: -2,
  },
  burgerButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    boxShadow: '0 4px 10px rgba(34, 197, 94, 0.06)',
  },
  burgerLine: {
    width: 20,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: '#15803d',
  },
});

