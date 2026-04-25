import { SafeAreaView, View, Text, Pressable, StyleSheet, Animated, Easing, Modal } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import AppointmentsPage from './pages/AppointmentsPage';
import ProfilePage from './pages/ProfilePage';

const PROFILE_OPTION = { id: 'profile', label: 'Profil', icon: 'P' };

const MENU_OPTIONS = [
  { id: 'home', label: 'Ana Sayfa', icon: 'AS' },
  { id: 'services', label: 'Hizmetler', icon: 'HZ' },
  { id: 'appointments', label: 'Randevular', icon: 'RN' },
];

export default function App() {
  const [active, setActive] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuAnim = useRef(new Animated.Value(0)).current;

  const PAGES = {
    home: HomePage,
    services: ServicesPage,
    appointments: AppointmentsPage,
    profile: ProfilePage,
  };

  const ActivePage = PAGES[active] || HomePage;

  useEffect(() => {
    Animated.timing(menuAnim, {
      toValue: menuOpen ? 1 : 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [menuAnim, menuOpen]);

  const topLineTransform = {
    transform: [
      {
        translateY: menuAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 6],
        }),
      },
      {
        rotate: menuAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '45deg'],
        }),
      },
    ],
  };

  const middleLineTransform = {
    opacity: menuAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
  };

  const bottomLineTransform = {
    transform: [
      {
        translateY: menuAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -6],
        }),
      },
      {
        rotate: menuAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '-45deg'],
        }),
      },
    ],
  };

  const drawerTransform = {
    opacity: menuAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.7, 1],
    }),
    transform: [
      {
        translateX: menuAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [320, 0],
        }),
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navbar}>
        <View style={styles.navTopRow}>
          <Text style={styles.navTitle}>Dokemon</Text>
          <Pressable
            onPress={() => setMenuOpen((prev) => !prev)}
            style={styles.burgerButton}
          >
            <Animated.View style={[styles.burgerLine, topLineTransform]} />
            <Animated.View style={[styles.burgerLine, middleLineTransform]} />
            <Animated.View style={[styles.burgerLine, bottomLineTransform]} />
          </Pressable>
        </View>

      </View>

      <Modal
        visible={menuOpen}
        transparent
        animationType="none"
        onRequestClose={() => setMenuOpen(false)}
      >
        <View style={styles.overlayRoot}>
          <Pressable style={styles.backdrop} onPress={() => setMenuOpen(false)} />

          <Animated.View style={[styles.sideDrawer, drawerTransform]}>
            <Pressable
              accessibilityRole="link"
              onPress={() => {
                setActive(PROFILE_OPTION.id);
                setMenuOpen(false);
              }}
              style={[styles.profileLink, active === PROFILE_OPTION.id && styles.profileLinkActive]}
            >
              <View style={styles.profileCircle}>
                <Text style={styles.profileCircleText}>{PROFILE_OPTION.icon}</Text>
              </View>
              <Text style={styles.profileLabel}>{PROFILE_OPTION.label}</Text>
            </Pressable>

            <View style={styles.menuGroup}>
              {MENU_OPTIONS.map((option) => {
                const isActive = option.id === active;
                return (
                  <Pressable
                    key={option.id}
                    accessibilityRole="link"
                    onPress={() => {
                      setActive(option.id);
                      setMenuOpen(false);
                    }}
                    style={[styles.menuItem, isActive && styles.menuItemActive]}
                  >
                    <View style={styles.menuItemIcon}>
                      <Text style={styles.menuItemIconText}>{option.icon}</Text>
                    </View>
                    <Text style={[styles.menuItemText, isActive && styles.menuItemTextActive]}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>
        </View>
      </Modal>

      <View style={styles.content}>
        <ActivePage />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  navbar: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#1e3a8a',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    position: 'relative',
  },
  navTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'left',
  },
  burgerButton: {
    width: 40,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#3057bb',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  burgerLine: {
    width: 18,
    height: 2,
    borderRadius: 2,
    backgroundColor: '#ffffff',
    marginVertical: 2,
  },
  overlayRoot: {
    flex: 1,
    position: 'relative',
  },
  sideDrawer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '82%',
    backgroundColor: '#ffffff',
    paddingTop: 62,
    paddingHorizontal: 14,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: '#0f172a',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: -4, height: 0 },
    elevation: 12,
  },
  backdrop: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(2, 6, 23, 0.12)',
  },
  profileLink: {
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 14,
    marginBottom: 14,
  },
  profileLinkActive: {
    backgroundColor: '#e0e7ff',
  },
  profileCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  profileCircleText: {
    color: '#1e3a8a',
    fontWeight: '700',
    fontSize: 28,
  },
  profileLabel: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '700',
  },
  menuGroup: {
    gap: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10,
    borderRadius: 12,
  },
  menuItemActive: {
    backgroundColor: '#e0e7ff',
  },
  menuItemIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemIconText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1e3a8a',
  },
  menuItemText: {
    color: '#1e293b',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  menuItemTextActive: {
    color: '#1e3a8a',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});
