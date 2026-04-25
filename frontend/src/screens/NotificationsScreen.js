import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../services/notificationApi';

const TYPE_META = {
  RESCUE_SUCCESS: { emoji: '🟢', color: '#10b981', bg: '#ecfdf5', label: 'Kurtarıldı' },
  FACE_MATCH:     { emoji: '🔍', color: '#f59e0b', bg: '#fffbeb', label: 'Yüz Eşleşmesi' },
  DISASTER_ALERT: { emoji: '⚠️', color: '#ef4444', bg: '#fef2f2', label: 'Afet Uyarısı'  },
  SAFETY_UPDATE:  { emoji: '🛡️', color: '#3b82f6', bg: '#eff6ff', label: 'Güvenlik'      },
  FRIEND_REQUEST: { emoji: '👤', color: '#8b5cf6', bg: '#f5f3ff', label: 'Arkadaş İsteği' },
  SYSTEM:         { emoji: '⚙️', color: '#64748b', bg: '#f8fafc', label: 'Sistem'         },
  INFO:           { emoji: 'ℹ️', color: '#0ea5e9', bg: '#f0f9ff', label: 'Bilgi'          },
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleString('tr-TR', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

function NotifCard({ notif, onMarkRead }) {
  const meta = TYPE_META[notif.type] || TYPE_META.INFO;

  return (
    <Pressable
      style={[styles.card, { backgroundColor: notif.is_read ? '#f8fafc' : meta.bg }]}
      onPress={() => !notif.is_read && onMarkRead(notif.id)}
    >
      {/* Left color bar */}
      <View style={[styles.cardBar, { backgroundColor: meta.color }]} />

      <View style={styles.cardContent}>
        <View style={styles.cardTopRow}>
          <View style={[styles.pill, { backgroundColor: meta.color + '22' }]}>
            <Text style={[styles.pillText, { color: meta.color }]}>
              {meta.emoji} {meta.label}
            </Text>
          </View>
          <View style={styles.cardTopRight}>
            <Text style={styles.cardTime}>{formatDate(notif.created_at)}</Text>
            {!notif.is_read && <View style={styles.unreadDot} />}
          </View>
        </View>

        <Text style={styles.cardTitle}>{notif.title}</Text>
        <Text style={styles.cardMessage}>{notif.message}</Text>

        {/* Rescue Details */}
        {(notif.health_status || notif.assembly_point || notif.location_details) && (
          <View style={styles.detailBox}>
            {notif.health_status && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>❤️ Sağlık Durumu</Text>
                <Text style={styles.detailValue}>{notif.health_status}</Text>
              </View>
            )}
            {notif.assembly_point && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>🏕️ Toplanma Noktası</Text>
                <Text style={styles.detailValue}>{notif.assembly_point}</Text>
              </View>
            )}
            {notif.location_details && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>📌 Konum</Text>
                <Text style={styles.detailValue}>{notif.location_details}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}

export default function NotificationsScreen({ authToken }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL'); // ALL | UNREAD | RESCUE_SUCCESS | FACE_MATCH | DISASTER_ALERT

  const loadNotifications = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications(authToken, 100);
      setNotifications(data?.notifications || []);
    } catch (err) {
      setError(err?.message || 'Bildirimler yüklenemedi.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [authToken]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(authToken, id);
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
    } catch { /* ignore */ }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead(authToken);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch { /* ignore */ }
  };

  const FILTER_TABS = [
    { id: 'ALL', label: 'Tümü' },
    { id: 'UNREAD', label: 'Okunmamış' },
    { id: 'RESCUE_SUCCESS', label: '🟢 Kurtarıldı' },
    { id: 'FACE_MATCH', label: '🔍 Eşleşme' },
    { id: 'DISASTER_ALERT', label: '⚠️ Afet' },
  ];

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'ALL') return true;
    if (filter === 'UNREAD') return !n.is_read;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <View style={styles.container}>
      {/* Page Header */}
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.pageTitle}>Bildirimler</Text>
          {unreadCount > 0 && (
            <Text style={styles.pageSubtitle}>{unreadCount} okunmamış bildiriminiz var</Text>
          )}
        </View>
        {unreadCount > 0 && (
          <Pressable style={styles.markAllBtn} onPress={handleMarkAllRead}>
            <Text style={styles.markAllText}>Tümünü Okundu İşaretle</Text>
          </Pressable>
        )}
      </View>

      {/* Filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterBar}
        contentContainerStyle={styles.filterBarContent}
      >
        {FILTER_TABS.map((tab) => (
          <Pressable
            key={tab.id}
            style={[styles.filterTab, filter === tab.id && styles.filterTabActive]}
            onPress={() => setFilter(tab.id)}
          >
            <Text style={[styles.filterTabText, filter === tab.id && styles.filterTabTextActive]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Content */}
      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Bildirimler yükleniyor...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerBox}>
          <Text style={styles.errorEmoji}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryBtn} onPress={() => loadNotifications()}>
            <Text style={styles.retryText}>Tekrar Dene</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadNotifications(true)}
              tintColor="#10b981"
            />
          }
        >
          {filteredNotifs.length === 0 ? (
            <View style={styles.centerBox}>
              <Text style={styles.emptyEmoji}>🔕</Text>
              <Text style={styles.emptyTitle}>
                {filter === 'UNREAD' ? 'Tüm bildirimler okundu' : 'Henüz bildirim yok'}
              </Text>
              <Text style={styles.emptyText}>
                {filter === 'UNREAD'
                  ? 'Harika! Tüm bildirimlerinizi okudunuz.'
                  : 'Yakınlarınızla ilgili kurtarma bildirimleri burada görünecek.'}
              </Text>
            </View>
          ) : (
            filteredNotifs.map((notif) => (
              <NotifCard key={notif.id} notif={notif} onMarkRead={handleMarkRead} />
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7ff',
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0f172a',
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#ef4444',
    fontWeight: '600',
    marginTop: 2,
  },
  markAllBtn: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  markAllText: {
    fontSize: 12,
    color: '#15803d',
    fontWeight: '700',
  },
  filterBar: {
    flexGrow: 0,
    paddingBottom: 4,
  },
  filterBarContent: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
  },
  filterTabActive: {
    backgroundColor: '#052e16',
  },
  filterTabText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  filterTabTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    gap: 8,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
  },
  errorEmoji: { fontSize: 40, marginBottom: 12 },
  errorText: { fontSize: 14, color: '#ef4444', textAlign: 'center', marginBottom: 16 },
  retryBtn: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  retryText: { color: '#ef4444', fontWeight: '700' },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#334155', marginBottom: 8 },
  emptyText: { fontSize: 13, color: '#94a3b8', textAlign: 'center', lineHeight: 20 },
  // Card
  card: {
    borderRadius: 18,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 2,
  },
  cardBar: {
    width: 5,
  },
  cardContent: {
    flex: 1,
    padding: 14,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardTopRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTime: {
    fontSize: 11,
    color: '#94a3b8',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 5,
    lineHeight: 20,
  },
  cardMessage: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 8,
  },
  detailBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 10,
    gap: 6,
    marginTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    minWidth: 120,
  },
  detailValue: {
    fontSize: 12,
    color: '#0f172a',
    flex: 1,
    fontWeight: '600',
  },
});
