import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  fetchNotifications,
  fetchUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../services/notificationApi';

const POLL_INTERVAL_MS = 30000; // 30 saniyede bir kontrol

const TYPE_META = {
  RESCUE_SUCCESS: { emoji: '🟢', color: '#10b981', label: 'Kurtarıldı' },
  FACE_MATCH:     { emoji: '🔍', color: '#f59e0b', label: 'Yüz Eşleşmesi' },
  DISASTER_ALERT: { emoji: '⚠️', color: '#ef4444', label: 'Afet Uyarısı'  },
  SAFETY_UPDATE:  { emoji: '🛡️', color: '#3b82f6', label: 'Güvenlik'      },
  FRIEND_REQUEST: { emoji: '👤', color: '#8b5cf6', label: 'Arkadaş İsteği' },
  SYSTEM:         { emoji: '⚙️', color: '#64748b', label: 'Sistem'         },
  INFO:           { emoji: 'ℹ️', color: '#0ea5e9', label: 'Bilgi'          },
};

function formatRelativeTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Az önce';
  if (diffMin < 60) return `${diffMin} dk önce`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} saat önce`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay} gün önce`;
}

export default function NotificationBell({ authToken }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const triggerShake = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -4, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 4, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }, [shakeAnim]);

  const loadUnreadCount = useCallback(async () => {
    if (!authToken) return;
    try {
      const data = await fetchUnreadCount(authToken);
      const newCount = data?.unreadCount ?? 0;
      if (newCount > unreadCount && unreadCount > 0) {
        triggerShake();
      }
      setUnreadCount(newCount);
    } catch {
      // Sessizce hata yut
    }
  }, [authToken, unreadCount, triggerShake]);

  // Polling
  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [loadUnreadCount]);

  const openPanel = async () => {
    setIsOpen(true);
    setLoading(true);
    try {
      const data = await fetchNotifications(authToken, 50);
      setNotifications(data?.notifications || []);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead(authToken);
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {
      // ignore
    }
  };

  const handleMarkRead = async (notifId) => {
    try {
      await markNotificationRead(authToken, notifId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, is_read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      // ignore
    }
  };

  const typeMeta = (type) => TYPE_META[type] || TYPE_META.INFO;

  return (
    <>
      {/* Bell Button */}
      <Pressable style={styles.bellButton} onPress={openPanel} accessibilityLabel="Bildirimler">
        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          <Text style={styles.bellIcon}>🔔</Text>
        </Animated.View>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
          </View>
        )}
      </Pressable>

      {/* Notification Panel Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setIsOpen(false)} />
        <View style={styles.panel}>
          {/* Panel Header */}
          <View style={styles.panelHeader}>
            <View>
              <Text style={styles.panelTitle}>Bildirimler</Text>
              {unreadCount > 0 && (
                <Text style={styles.panelSubtitle}>{unreadCount} okunmamış bildirim</Text>
              )}
            </View>
            <View style={styles.headerActions}>
              {unreadCount > 0 && (
                <TouchableOpacity style={styles.readAllBtn} onPress={handleMarkAllRead}>
                  <Text style={styles.readAllText}>Tümünü Oku</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.closeBtn} onPress={() => setIsOpen(false)}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          <ScrollView style={styles.notifList} showsVerticalScrollIndicator={false}>
            {loading ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>⏳</Text>
                <Text style={styles.emptyText}>Yükleniyor...</Text>
              </View>
            ) : notifications.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🔕</Text>
                <Text style={styles.emptyTitle}>Henüz bildirim yok</Text>
                <Text style={styles.emptyText}>
                  Yakınlarınızla ilgili kurtarma bildirimleri burada görünecek.
                </Text>
              </View>
            ) : (
              notifications.map((notif) => {
                const meta = typeMeta(notif.type);
                return (
                  <Pressable
                    key={notif.id}
                    style={[styles.notifCard, !notif.is_read && styles.notifCardUnread]}
                    onPress={() => !notif.is_read && handleMarkRead(notif.id)}
                  >
                    {/* Left accent */}
                    <View style={[styles.notifAccent, { backgroundColor: meta.color }]} />

                    <View style={styles.notifBody}>
                      <View style={styles.notifTopRow}>
                        <View style={[styles.notifTypePill, { backgroundColor: meta.color + '20' }]}>
                          <Text style={[styles.notifTypeText, { color: meta.color }]}>
                            {meta.emoji} {meta.label}
                          </Text>
                        </View>
                        <Text style={styles.notifTime}>{formatRelativeTime(notif.created_at)}</Text>
                      </View>

                      <Text style={styles.notifTitle} numberOfLines={2}>
                        {notif.title}
                      </Text>
                      <Text style={styles.notifMessage} numberOfLines={4}>
                        {notif.message}
                      </Text>

                      {/* Rescue detail chips */}
                      {(notif.health_status || notif.assembly_point || notif.location_details) && (
                        <View style={styles.detailRow}>
                          {notif.health_status && (
                            <View style={styles.chip}>
                              <Text style={styles.chipText}>❤️ {notif.health_status}</Text>
                            </View>
                          )}
                          {notif.assembly_point && (
                            <View style={styles.chip}>
                              <Text style={styles.chipText}>🏕️ {notif.assembly_point}</Text>
                            </View>
                          )}
                          {notif.location_details && (
                            <View style={styles.chip}>
                              <Text style={styles.chipText}>📌 {notif.location_details}</Text>
                            </View>
                          )}
                        </View>
                      )}

                      {!notif.is_read && (
                        <View style={styles.unreadDot} />
                      )}
                    </View>
                  </Pressable>
                );
              })
            )}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const PANEL_WIDTH = Platform.OS === 'web' ? 420 : '92%';

const styles = StyleSheet.create({
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#bbf7d0',
    position: 'relative',
  },
  bellIcon: {
    fontSize: 20,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  // Modal backdrop
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  // Panel
  panel: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 80 : 90,
    right: Platform.OS === 'web' ? 20 : '4%',
    width: PANEL_WIDTH,
    maxHeight: 560,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#fafafa',
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  panelSubtitle: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  readAllBtn: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  readAllText: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '700',
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '700',
  },
  notifList: {
    flex: 1,
  },
  // Empty state
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 18,
  },
  // Notification card
  notifCard: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginVertical: 5,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  notifCardUnread: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  notifAccent: {
    width: 4,
    alignSelf: 'stretch',
  },
  notifBody: {
    flex: 1,
    padding: 12,
    paddingLeft: 10,
  },
  notifTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  notifTypePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  notifTypeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  notifTime: {
    fontSize: 11,
    color: '#94a3b8',
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
    lineHeight: 18,
  },
  notifMessage: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    marginBottom: 6,
  },
  detailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  chip: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  chipText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  unreadDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
});
