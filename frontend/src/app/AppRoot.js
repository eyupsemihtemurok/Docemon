import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import DashboardSidePanel from '../components/dashboard/DashboardSidePanel';
import { DASHBOARD_MENU_ITEMS, ROUTES } from '../constants/routes';
import useWebRouter from '../hooks/useWebRouter';
import DashboardScreen from '../screens/DashboardScreen';
import DisasterMapScreen from '../screens/DisasterMapScreen';
import FaceMatchScreen from '../screens/FaceMatchScreen';
import HomeScreen from '../screens/HomeScreen';
import InformationPage from '../screens/InformationPage';
import LoginPage from '../screens/LoginPage';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RescueScannerScreen from '../screens/RescueScannerScreen';
import OperatorDashboardScreen from '../screens/OperatorDashboardScreen';
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
    const selectedItem = DASHBOARD_MENU_ITEMS.find((item) => item.id === itemId);
    setActiveMenuItemId(itemId);
    setIsMenuOpen(false);

    if (selectedItem?.route) {
      navigate(selectedItem.route);
    }
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
            navigate={navigate}
            navigate={navigate}
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

    if (path === ROUTES.DISASTER_MAP) {
      if (!isAuthReady) {
        return null;
      }

      if (!isAuthenticated) {
        replace(ROUTES.LOGIN);
        return null;
      }

      return <DisasterMapScreen navigate={navigate} />;
    }

    if (path === ROUTES.FACE_MATCH) {
      if (!isAuthReady) {
        return null;
      }

      if (!isAuthenticated) {
        replace(ROUTES.LOGIN);
        return null;
      }

      return <FaceMatchScreen navigate={navigate} />;
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

    if (path === ROUTES.BIOMETRIC_REGISTER) {
      return <RegisterScreen navigate={navigate} />;
    }

    if (path === ROUTES.BIOMETRIC_RESCUE) {
      if (!isAuthReady) {
        return null;
      }

      if (!isAuthenticated) {
        replace(ROUTES.LOGIN);
        return null;
      }

      return <RescueScannerScreen navigate={navigate} authToken={authToken} />;
    }

    if (path === ROUTES.BIOMETRIC_OPERATOR) {
      if (!isAuthReady) {
        return null;
      }

      if (!isAuthenticated) {
        replace(ROUTES.LOGIN);
        return null;
      }

      return <OperatorDashboardScreen navigate={navigate} authToken={authToken} />;
    }

    replace(ROUTES.HOME);
    return null;
  };

  return (
    <SafeAreaView style={styles.root}>
      {path !== ROUTES.HOME && path !== ROUTES.LOGIN && path !== ROUTES.BIOMETRIC_REGISTER && (
        <DashboardNavbar
          userName={currentUser?.full_name || currentUser?.fullName || currentUser?.email || 'Kullanıcı'}
          onProfilePress={() => navigate(ROUTES.PROFILE)}
          authToken={authToken}
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
