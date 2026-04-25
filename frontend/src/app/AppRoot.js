import { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import DashboardSidePanel from '../components/dashboard/DashboardSidePanel';
import { DASHBOARD_MENU_ITEMS, ROUTES } from '../constants/routes';
import useWebRouter from '../hooks/useWebRouter';
import DashboardScreen from '../screens/DashboardScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginPage from '../screens/LoginPage';

export default function AppRoot() {
  const { path, navigate, replace } = useWebRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenuItemId, setActiveMenuItemId] = useState(DASHBOARD_MENU_ITEMS[0].id);

  const activeMenuItemLabel = useMemo(() => {
    const active = DASHBOARD_MENU_ITEMS.find((item) => item.id === activeMenuItemId);
    return active ? active.label : DASHBOARD_MENU_ITEMS[0].label;
  }, [activeMenuItemId]);

  const handleLogin = () => {
    setIsAuthenticated(true);
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
      return <LoginPage onLogin={handleLogin} />;
    }

    if (path === ROUTES.DASHBOARD) {
      if (!isAuthenticated) {
        replace(ROUTES.LOGIN);
        return null;
      }

      return (
        <View style={styles.dashboardWrapper}>
          <DashboardNavbar onToggleMenu={() => setIsMenuOpen((prev) => !prev)} />
          <DashboardScreen activeMenuItem={activeMenuItemLabel} />
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

    replace(ROUTES.HOME);
    return null;
  };

  return <SafeAreaView style={styles.root}>{renderPage()}</SafeAreaView>;
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
