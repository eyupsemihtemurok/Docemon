import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import styles from './styles/ProfileScreen.styles';
import { fetchCurrentUser, fetchEmergencyContacts, fetchFriends } from '../services/authApi';
import { getAuthToken } from '../services/authStorage';

const STATUS_LABELS = {
  SAFE: 'Guvende',
  IN_DANGER: 'Tehlikede',
  UNREACHABLE: 'Ulasilamiyor',
  UNDER_DEBRIS: 'Enkaz altinda',
  UNKNOWN: 'Bilinmiyor',
};

function splitName(fullName = '') {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) {
    return { name: '-', surname: '-' };
  }

  if (parts.length === 1) {
    return { name: parts[0], surname: '-' };
  }

  return {
    name: parts[0],
    surname: parts.slice(1).join(' '),
  };
}

function mapSafetyStatus(status) {
  return STATUS_LABELS[status] || 'Bilinmiyor';
}

export default function ProfileScreen({ navigate }) {
  const [isStatsExpanded, setIsStatsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState({
    name: '-',
    surname: '-',
    phone: '-',
    friendsCount: 0,
    relativesCount: 0,
    faceData: null,
    faceMime: null,
  });
  const [friends, setFriends] = useState([]);
  const [relatives, setRelatives] = useState([]);

  async function fetchProfileData() {
    const token = getAuthToken();

    if (!token) {
      throw new Error('Oturum bulunamadi. Lutfen tekrar giris yapin.');
    }

    const [profile, friendsResponse, emergencyContactsResponse] = await Promise.all([
      fetchCurrentUser(token),
      fetchFriends(token),
      fetchEmergencyContacts(token),
    ]);

    const nameParts = splitName(profile?.full_name);

    const normalizedFriends = (friendsResponse || []).map((person) => ({
      id: person.friendshipId,
      name: person.fullName || '-',
      status: mapSafetyStatus(person.safetyStatus),
    }));

    const normalizedRelatives = (emergencyContactsResponse || []).map((person) => ({
      id: person.friendshipId,
      name: person.fullName || '-',
      status: mapSafetyStatus(person.safetyStatus),
    }));

    return {
      user: {
        name: nameParts.name,
        surname: nameParts.surname,
        phone: profile?.phone || '-',
        friendsCount: normalizedFriends.length,
        relativesCount: normalizedRelatives.length,
        faceData: profile?.face_data,
        faceMime: profile?.face_mime_type,
      },
      friends: normalizedFriends,
      relatives: normalizedRelatives,
    };
  }

  function applyProfileData(payload) {
    setUserData(payload.user);
    setFriends(payload.friends);
    setRelatives(payload.relatives);
  }

  useEffect(() => {
    let isMounted = true;

    async function loadProfileData() {
      setIsLoading(true);
      setError('');

      try {
        const payload = await fetchProfileData();

        if (!isMounted) {
          return;
        }

        applyProfileData(payload);
      } catch (err) {
        if (isMounted) {
          setError(err?.message || 'Profil verileri yuklenemedi.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProfileData();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleRefresh() {
    setIsRefreshing(true);
    setError('');

    try {
      const payload = await fetchProfileData();
      applyProfileData(payload);
    } catch (err) {
      setError(err?.message || 'Profil verileri yenilenemedi.');
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#15803d"
            colors={['#15803d']}
          />
        }
      >
        {/* Centered Avatar */}
        <View style={styles.headerTop}>
          <View style={styles.largeAvatar}>
            {userData.faceData ? (
              <Image 
                source={{ uri: `data:${userData.faceMime || 'image/jpeg'};base64,${userData.faceData}` }} 
                style={{ width: '100%', height: '100%', borderRadius: 60 }} 
              />
            ) : (
              <Text style={styles.avatarText}>{userData.name.charAt(0)}</Text>
            )}
          </View>
        </View>

        {/* Expandable Stats Panel */}
        <Pressable 
          style={styles.statsPanel} 
          onPress={() => setIsStatsExpanded(!isStatsExpanded)}
        >
          <View style={styles.statsRow}>
            <View style={styles.statsMain}>
              <Text style={styles.statsIcon}>👥</Text>
              <View>
                <Text style={styles.statsTitle}>Arkadaşlar ve Yakınlar</Text>
                <Text style={styles.statsCount}>{userData.friendsCount + userData.relativesCount} Toplam</Text>
              </View>
            </View>
            <Text style={styles.expandIcon}>{isStatsExpanded ? '▲' : '▼'}</Text>
          </View>

          {isLoading && (
            <View style={styles.expandedContent}>
              <ActivityIndicator size="small" color="#15803d" />
              <Text style={styles.personStatus}>Veriler yukleniyor...</Text>
            </View>
          )}

          {!!error && !isLoading && (
            <View style={styles.expandedContent}>
              <Text style={styles.personStatus}>{error}</Text>
            </View>
          )}

          {isStatsExpanded && !isLoading && !error && (
            <View style={styles.expandedContent}>
              <Text style={styles.listSectionTitle}>Yakınlar</Text>
              {relatives.map(person => (
                <View key={person.id} style={styles.personItem}>
                  <View style={styles.personAvatar}>
                    <Text style={styles.personAvatarText}>{person.name.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text style={styles.personName}>{person.name}</Text>
                    <Text style={styles.personStatus}>{person.status}</Text>
                  </View>
                </View>
              ))}
              {relatives.length === 0 && (
                <Text style={styles.personStatus}>Kayitli yakin bulunamadi.</Text>
              )}

              <Text style={[styles.listSectionTitle, { marginTop: 8 }]}>Arkadaşlar</Text>
              {friends.map(person => (
                <View key={person.id} style={styles.personItem}>
                  <View style={styles.personAvatar}>
                    <Text style={styles.personAvatarText}>{person.name.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text style={styles.personName}>{person.name}</Text>
                    <Text style={styles.personStatus}>{person.status}</Text>
                  </View>
                </View>
              ))}
              {friends.length === 0 && (
                <Text style={styles.personStatus}>Kayitli arkadas bulunamadi.</Text>
              )}
            </View>
          )}
        </Pressable>

        {/* Personal Info Grid */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>İsim</Text>
            <Text style={styles.infoValue}>{userData.name}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Soyisim</Text>
            <Text style={styles.infoValue}>{userData.surname}</Text>
          </View>
          <View style={[styles.infoCard, { width: '100%', flexBasis: '100%' }]}>
            <Text style={styles.infoLabel}>Numara</Text>
            <Text style={styles.infoValue}>{userData.phone}</Text>
          </View>
        </View>

        {/* Footer Settings & Terms */}
        <View style={styles.footer}>
          <View style={styles.footerLinks}>
            <Pressable>
              <Text style={styles.footerLink}>Ayarlar</Text>
            </Pressable>
            <Pressable>
              <Text style={styles.footerLink}>Kullanım Koşulları</Text>
            </Pressable>
          </View>

          <Pressable 
            style={styles.backButton} 
            onPress={() => navigate('/dashboard')}
          >
            <Text style={styles.backButtonText}>Dashboard'a Geri Dön</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
