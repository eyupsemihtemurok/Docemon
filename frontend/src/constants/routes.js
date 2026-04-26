export const ROUTES = {
  HOME: '/home',
  LOGIN: '/loginPage',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  BIOMETRIC_REGISTER: '/biometric/register',
  BIOMETRIC_RESCUE: '/biometric/rescue',
  BIOMETRIC_OPERATOR: '/biometric/operator',
  DISASTER_MAP: '/disaster-map',
  FACE_MATCH: '/face-match',
  INFORMATION: '/information',
};

export const DASHBOARD_MENU_ITEMS = [
  { id: 'page-1', label: 'Afet Kontrol', route: ROUTES.DASHBOARD },
  { id: 'page-6', label: 'Afet Haritası', route: ROUTES.DISASTER_MAP },
  { id: 'page-7', label: 'Yüz Eşleştirme', route: ROUTES.FACE_MATCH },
  { id: 'page-2', label: 'Biyometrik Kayıt', route: ROUTES.BIOMETRIC_REGISTER },
  { id: 'page-3', label: 'Kurtarma Tarama', route: ROUTES.BIOMETRIC_RESCUE },
  { id: 'page-4', label: 'Operatör Paneli', route: ROUTES.BIOMETRIC_OPERATOR },
  { id: 'page-5', label: 'Profil', route: ROUTES.PROFILE },
];

