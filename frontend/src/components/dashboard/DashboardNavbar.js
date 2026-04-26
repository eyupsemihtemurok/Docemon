import { Image, Platform, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import NotificationBell from '../notifications/NotificationBell';

export default function DashboardNavbar({ userName = 'Kullanıcı', onProfilePress, authToken, userProfile }) {
  return (
    <View style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <Pressable style={styles.userSection} onPress={onProfilePress}>
          <View style={styles.avatar}>
            {userProfile?.face_data ? (
              <Image 
                source={{ uri: `data:${userProfile.face_mime_type || 'image/jpeg'};base64,${userProfile.face_data}` }} 
                style={{ width: '100%', height: '100%', borderRadius: 14 }} 
              />
            ) : (
              <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
            )}
          </View>
          <View>
            <Text style={styles.welcomeText}>Hoş geldin,</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
        </Pressable>

        {/* Notification Bell */}
        <NotificationBell authToken={authToken} />
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
});

