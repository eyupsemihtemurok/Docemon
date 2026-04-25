import { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import DashboardSidePanel from '../components/dashboard/DashboardSidePanel';
import { DASHBOARD_MENU_ITEMS, ROUTES } from '../constants/routes';
import useWebRouter from '../hooks/useWebRouter';
import DashboardScreen from '../screens/DashboardScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginPage from '../screens/LoginPage';
import ProfileScreen from '../screens/ProfileScreen';
import { fetchCurrentUser } from '../services/authApi';
import { clearAuthToken, getAuthToken, setAuthToken } from '../services/authStorage';

export default function AppRoot() {
  const { path, navigate, replace } = useWebRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenuItemId, setActiveMenuItemId] = useState(DASHBOARD_MENU_ITEMS[0].id);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [authToken, setAuthTokenState] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const bootstrapAuth = async () => {
      const storedToken = getAuthToken();

      if (!storedToken) {
        if (isMounted) {
          setIsAuthReady(true);
        }
        return;
      }

      try {
        const profile = await fetchCurrentUser(storedToken);
        if (isMounted) {
          setAuthTokenState(storedToken);
          setIsAuthenticated(true);
          setCurrentUser(profile);
        }
      } catch {
        clearAuthToken();
        if (isMounted) {
          setIsAuthenticated(false);
          setAuthTokenState(null);
          setCurrentUser(null);
        }
      } finally {
        if (isMounted) {
          setIsAuthReady(true);
        }
      }
    };

    bootstrapAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeMenuItemLabel = useMemo(() => {
    const active = DASHBOARD_MENU_ITEMS.find((item) => item.id === activeMenuItemId);
    return active ? active.label : DASHBOARD_MENU_ITEMS[0].label;
  }, [activeMenuItemId]);

  const handleLogin = (authResult) => {
    if (authResult?.token) {
      setAuthToken(authResult.token);
      setAuthTokenState(authResult.token);
    }

    setIsAuthenticated(true);
    setCurrentUser(authResult?.user || null);
    replace(ROUTES.DASHBOARD);
  };

  const handleMenuSelect = (itemId) => {
    setActiveMenuItemId(itemId);
    setIsMenuOpen(false);
  };

  const renderPage = () => {
    if (path === ROUTES.HOME) {
      return <HomeScreen navigate={navigate} />;
    }

    if (path === ROUTES.LOGIN) {
      return <LoginPage onLogin={handleLogin} navigate={navigate} />;
    }

    if (path === ROUTES.DASHBOARD) {
      if (!isAuthReady) {
        return null;
      }

      if (!isAuthenticated) {
        replace(ROUTES.LOGIN);
        return null;
      }

      return (
        <View style={styles.dashboardWrapper}>
          <DashboardScreen
            activeMenuItem={activeMenuItemLabel}
            authToken={authToken}
            currentUser={currentUser}
          />
          <DashboardSidePanel
            visible={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            menuItems={DASHBOARD_MENU_ITEMS}
            activeItemId={activeMenuItemId}
            onSelect={handleMenuSelect}
          />
        </View>
      );
    }

    if (path === ROUTES.PROFILE) {
      if (!isAuthReady) {
        return null;
      }

      if (!isAuthenticated) {
        replace(ROUTES.LOGIN);
        return null;
      }
      return <ProfileScreen navigate={navigate} />;
    }

    replace(ROUTES.HOME);
    return null;
  };

  return (
    <SafeAreaView style={styles.root}>
      {path !== ROUTES.HOME && path !== ROUTES.LOGIN && (
        <DashboardNavbar
          userName={currentUser?.full_name || currentUser?.fullName || currentUser?.email || 'Kullanıcı'}
          onProfilePress={() => navigate(ROUTES.PROFILE)}
        />
      )}
      {renderPage()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f4f7ff',
  },
  dashboardWrapper: {
    flex: 1,
  },
});
