import { SafeAreaView, View, Text, Pressable, StyleSheet, Animated, Easing, Modal, ScrollView } from 'react-native';
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
  const activeLabel = MENU_OPTIONS.find((option) => option.id === active)?.label || 'Ana Sayfa';

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
      useNativeDriver: false,
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
      <View style={styles.orbTop} />
      <View style={styles.orbBottom} />
      <View style={styles.navbar}>
        <View style={styles.navTopRow}>
          <View>
            <Text style={styles.navEyebrow}>hackathon26</Text>
            <Text style={styles.navTitle}>Dokemon</Text>
          </View>
          <View style={styles.navStatusPill}>
            <View style={styles.navStatusDot} />
            <Text style={styles.navStatusText}>Docker Ready</Text>
          </View>
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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.heroKicker}>Canlı önizleme</Text>
          <Text style={styles.heroTitle}>{activeLabel}</Text>
          <Text style={styles.heroSubtitle}>
            Sayfalar artık Docker içinde de aynı içerikle render ediliyor. Menüden bölümler arasında geçiş yapabilirsin.
          </Text>

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatCard}>
              <Text style={styles.heroStatValue}>4</Text>
              <Text style={styles.heroStatLabel}>Bölüm</Text>
            </View>
            <View style={styles.heroStatCard}>
              <Text style={styles.heroStatValue}>19006</Text>
              <Text style={styles.heroStatLabel}>Web Portu</Text>
            </View>
            <View style={styles.heroStatCard}>
              <Text style={styles.heroStatValue}>OK</Text>
              <Text style={styles.heroStatLabel}>Compose</Text>
            </View>
          </View>
        </View>

        <View style={styles.contentCard}>
          <ActivePage />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9efff',
  },
  orbTop: {
    position: 'absolute',
    top: -70,
    right: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(96, 165, 250, 0.20)',
  },
  orbBottom: {
    position: 'absolute',
    bottom: -90,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
  },
  navbar: {
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#0f2b6d',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    position: 'relative',
    zIndex: 2,
    boxShadow: '0 12px 28px rgba(15, 23, 42, 0.18)',
  },
  navTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  navEyebrow: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 12,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  navTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'left',
  },
  navStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    gap: 8,
  },
  navStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34d399',
  },
  navStatusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
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
    boxShadow: '0 16px 40px rgba(15, 23, 42, 0.24)',
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
    boxShadow: '0 10px 20px rgba(37, 99, 235, 0.18)',
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
  },
  menuItemTextActive: {
    color: '#1e3a8a',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
    gap: 16,
  },
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    boxShadow: '0 14px 36px rgba(15, 23, 42, 0.10)',
    gap: 10,
  },
  heroKicker: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#0f172a',
    fontSize: 24,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: '#334155',
    fontSize: 15,
    lineHeight: 21,
  },
  heroStatsRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    marginTop: 6,
  },
  heroStatCard: {
    flexGrow: 1,
    minWidth: 92,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  heroStatValue: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '800',
  },
  heroStatLabel: {
    color: '#475569',
    fontSize: 12,
    marginTop: 2,
  },
  contentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 16,
    boxShadow: '0 16px 34px rgba(15, 23, 42, 0.10)',
    marginBottom: 6,
  },
});
