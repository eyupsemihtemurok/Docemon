import { useEffect, useMemo, useState } from 'react';
import { ROUTES } from '../constants/routes';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
  fetchActiveDisasters,
  fetchFriendRequests,
  fetchFriends,
  respondFriendRequest,
  sendFriendRequest,
  updateEmergencyContact,
  uploadRescuePhoto,
} from '../services/dashboardApi';
import styles from './styles/DashboardScreen.styles';

function formatDisasterLocation(disaster) {
  return disaster.location_name || disaster.locationName || 'Konum belirtilmedi';
}

function formatDisasterLabel(disaster) {
  const type = disaster.type || 'Bilinmeyen afet';
  const severity = disaster.severity ? ` • ${disaster.severity}` : '';
  return `${type}${severity}`;
}

function getUserDisplayName(user) {
  if (!user) return 'Kullanıcı';
  return user.full_name || user.fullName || user.email || 'Kullanıcı';
}

function SectionHeader({ icon, title, description, isExpanded, onPress, iconBg }) {
  return (
    <Pressable style={styles.sectionHeader} onPress={onPress}>
      <View style={[styles.sectionIconWrap, { backgroundColor: iconBg || '#dcfce7' }]}>
        <Text style={styles.sectionIcon}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.sectionTitleEmbedded}>{title}</Text>
        <Text style={styles.sectionDescription}>{description}</Text>
      </View>
      <View style={[styles.chevronWrap, isExpanded && styles.chevronWrapActive]}>
        <Text style={[styles.accordionChevron, isExpanded && styles.accordionChevronActive]}>
          {isExpanded ? '▲' : '▼'}
        </Text>
      </View>
    </Pressable>
  );
}

export default function DashboardScreen({ activeMenuItem, authToken, currentUser }) {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeDisasters, setActiveDisasters] = useState([]);
  const [receiverIdentifier, setReceiverIdentifier] = useState('');
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardMessage, setDashboardMessage] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [healthDetails, setHealthDetails] = useState('');
  const [locationDetails, setLocationDetails] = useState('');
  const [rescueLoading, setRescueLoading] = useState(false);
  const [rescueMessage, setRescueMessage] = useState(null);
  const [isFabMenuVisible, setIsFabMenuVisible] = useState(false);

  // Accordion States — all closed by default
  const [isDisastersExpanded, setIsDisastersExpanded] = useState(false);
  const [isFriendManagementExpanded, setIsFriendManagementExpanded] = useState(false);
  const [isFriendsExpanded, setIsFriendsExpanded] = useState(false);
  const [isRescueExpanded, setIsRescueExpanded] = useState(false);

  const loadDashboard = async () => {
    if (!authToken) {
      setDashboardLoading(false);
      return;
    }

    setDashboardLoading(true);
    setDashboardMessage(null);

    try {
      const [friendList, requestList, disasterList] = await Promise.all([
        fetchFriends(authToken),
        fetchFriendRequests(authToken),
        fetchActiveDisasters(authToken),
      ]);

      setFriends(Array.isArray(friendList) ? friendList : []);
      setPendingRequests(Array.isArray(requestList) ? requestList : []);
      setActiveDisasters(Array.isArray(disasterList) ? disasterList : []);
    } catch (error) {
      setDashboardMessage({
        type: 'error',
        text: error?.message || 'Dashboard verileri alınamadı.',
      });
    } finally {
      setDashboardLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [authToken]);

  const summaryCards = useMemo(
    () => [
      { value: activeDisasters.length, label: 'Aktif Afet', tone: 'warning', icon: '🚨' },
      { value: friends.length, label: 'Yakın Kişi', tone: 'success', icon: '👥' },
      { value: pendingRequests.length, label: 'Bekleyen İstek', tone: 'primary', icon: '📨' },
    ],
    [activeDisasters.length, friends.length, pendingRequests.length]
  );

  const handleSendRequest = async () => {
    if (!receiverIdentifier.trim()) {
      setDashboardMessage({ type: 'error', text: 'Arkadaş eklemek için e-posta veya kullanıcı ID girin.' });
      return;
    }

    setActionLoading(true);
    setDashboardMessage(null);

    try {
      await sendFriendRequest(authToken, receiverIdentifier.trim());
      setReceiverIdentifier('');
      setDashboardMessage({ type: 'success', text: 'Arkadaş isteği gönderildi.' });
      await loadDashboard();
    } catch (error) {
      setDashboardMessage({
        type: 'error',
        text: error?.message || 'Arkadaş isteği gönderilemedi.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRespondRequest = async (requestId, status) => {
    console.log('[Dashboard] handleRespondRequest called with:', { requestId, status });
    setActionLoading(true);
    setDashboardMessage(null);

    try {
      await respondFriendRequest(authToken, requestId, status);
      setDashboardMessage({ type: 'success', text: 'Arkadaş isteği güncellendi.' });
      await loadDashboard();
    } catch (error) {
      setDashboardMessage({
        type: 'error',
        text: error?.message || 'İstek yanıtlanamadı.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleEmergency = async (friendshipId, currentValue) => {
    setActionLoading(true);
    setDashboardMessage(null);

    try {
      await updateEmergencyContact(authToken, friendshipId, !currentValue);
      setDashboardMessage({ type: 'success', text: 'Acil durum kişisi güncellendi.' });
      await loadDashboard();
    } catch (error) {
      setDashboardMessage({
        type: 'error',
        text: error?.message || 'Acil kişi ayarı değiştirilemedi.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      setRescueMessage({
        type: 'error',
        text: 'Kamera izni verilmedi. Lütfen kamera erişimine izin verin.',
      });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.9,
      cameraType: ImagePicker.CameraType.back,
    });

    if (!result.canceled && result.assets?.length) {
      setSelectedImage(result.assets[0]);
      setRescueMessage(null);
    }
  };

  const handleRescueSubmit = async () => {
    if (!selectedImage) {
      setRescueMessage({ type: 'error', text: 'Lütfen önce bir fotoğraf seçin.' });
      return;
    }

    setRescueLoading(true);
    setRescueMessage(null);

    try {
      const result = await uploadRescuePhoto(authToken, {
        imageAsset: selectedImage,
        healthDetails,
        locationDetails,
      });

      setRescueMessage({
        type: 'success',
        text: result?.message || `${result?.matchCount || 0} potansiyel eşleşme bulundu.`,
      });
      setSelectedImage(null);
      setHealthDetails('');
      setLocationDetails('');
    } catch (error) {
      setRescueMessage({
        type: 'error',
        text: error?.message || 'Fotoğraf gönderilemedi.',
      });
    } finally {
      setRescueLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#eef9f0' }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── HERO HEADER ── */}
        <View style={styles.heroCard}>
          <View style={styles.heroGradientBand} />
          <View style={styles.heroTopRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.eyebrowRow}>
                <View style={styles.liveDot} />
                <Text style={styles.eyebrow}>AFET DESTEK PLATFORMU</Text>
              </View>
              <Text style={styles.title}>Kontrol Paneli</Text>
              <Text style={styles.subtitle}>
                Hoş geldin, <Text style={styles.subtitleBold}>{getUserDisplayName(currentUser)}</Text> 👋
              </Text>
            </View>
            <View style={styles.heroBadgeCol}>
              <View style={styles.liveBadge}>
                <View style={styles.livePulse} />
                <Text style={styles.liveText}>Canlı</Text>
              </View>
              <Text style={styles.colorCaption}>{activeMenuItem || 'Dashboard'}</Text>
            </View>
          </View>

          {/* Summary Stats */}
          <View style={styles.summaryGrid}>
            {summaryCards.map((item) => (
              <View key={item.label} style={[styles.summaryCard, styles[`summaryCard${item.tone}`]]}>
                <Text style={styles.summaryCardIcon}>{item.icon}</Text>
                <Text style={styles.summaryValue}>{item.value}</Text>
                <Text style={styles.summaryLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── 1. AFETZEDEYİ TANILA ── */}
        <View style={styles.heroCard}>
          <SectionHeader
            icon="🔍"
            iconBg="#fef9c3"
            title="Afetzede Tanıla"
            description="Fotoğraf çek, sağlık ve konum bilgisi ekle; sistem eşleşme üretsin."
            isExpanded={isRescueExpanded}
            onPress={() => setIsRescueExpanded(!isRescueExpanded)}
          />

          {isRescueExpanded && (
            <View style={styles.accordionBody}>
              <View style={styles.rescuePanel}>
                <Pressable style={styles.rescuePicker} onPress={handlePickImage}>
                  <Text style={styles.rescuePickerIcon}>📸</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rescuePickerTitle}>Kamerayı Aç</Text>
                    <Text style={styles.rescuePickerText}>
                      Afetzedeyi anlık olarak çekin ve eşleştirmeyi başlatın.
                    </Text>
                  </View>
                  <Text style={styles.rescuePickerArrow}>›</Text>
                </Pressable>

                {selectedImage && (
                  <View style={styles.rescuePreview}>
                    <Image source={{ uri: selectedImage.uri }} style={styles.rescuePreviewImage} />
                    <View style={styles.rescuePreviewFooter}>
                      <Text style={styles.rescuePreviewIcon}>🖼️</Text>
                      <Text style={styles.rescuePreviewText} numberOfLines={1}>
                        {selectedImage.fileName || 'Fotoğraf seçildi'}
                      </Text>
                    </View>
                  </View>
                )}

                <View style={styles.inputGroup}>
                  <View style={styles.inputLabelRow}>
                    <Text style={styles.inputLabelIcon}>🏥</Text>
                    <Text style={styles.inputLabel}>Sağlık Bilgisi</Text>
                  </View>
                  <TextInput
                    style={[styles.premiumInput, styles.premiumTextArea]}
                    placeholder="Örn: Bilinci açık, hafif yaralı"
                    placeholderTextColor="#94a3b8"
                    multiline
                    value={healthDetails}
                    onChangeText={setHealthDetails}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.inputLabelRow}>
                    <Text style={styles.inputLabelIcon}>📍</Text>
                    <Text style={styles.inputLabel}>Konum Notu</Text>
                  </View>
                  <TextInput
                    style={styles.premiumInput}
                    placeholder="Örn: Elbistan merkez, okul binası"
                    placeholderTextColor="#94a3b8"
                    value={locationDetails}
                    onChangeText={setLocationDetails}
                  />
                </View>

                {rescueMessage && (
                  <View style={[styles.feedbackBox, rescueMessage.type === 'error' ? styles.feedbackError : styles.feedbackSuccess]}>
                    <Text style={styles.feedbackIcon}>{rescueMessage.type === 'error' ? '⚠️' : '✅'}</Text>
                    <Text style={styles.feedbackText}>{rescueMessage.text}</Text>
                  </View>
                )}

                <Pressable style={[styles.rescueButton, rescueLoading && styles.rescueButtonLoading]} onPress={handleRescueSubmit} disabled={rescueLoading}>
                  {rescueLoading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <>
                      <Text style={styles.rescueButtonIcon}>🚀</Text>
                      <Text style={styles.rescueButtonText}>Tanımlamayı Başlat</Text>
                    </>
                  )}
                </Pressable>
              </View>
            </View>
          )}
        </View>

        {/* ── 2. YAKINLARIM ── */}
        <View style={styles.heroCard}>
          <SectionHeader
            icon="👥"
            iconBg="#dcfce7"
            title="Yakınlarım"
            description="Arkadaşlarınız ve acil durum kişileriniz."
            isExpanded={isFriendsExpanded}
            onPress={() => setIsFriendsExpanded(!isFriendsExpanded)}
          />

          {isFriendsExpanded && (
            <View style={styles.accordionBody}>
              {friends.length > 0 ? (
                <View style={styles.peopleGrid}>
                  {friends.map((person) => (
                    <View key={person.friendshipId} style={styles.personCard}>
                      <View style={styles.personPhotoWrap}>
                        <View style={[styles.personPhoto, { backgroundColor: person.isEmergencyContact ? '#dc2626' : '#0f766e' }]}>
                          <Text style={styles.personPhotoText}>
                            {(person.fullName || person.name || '?').charAt(0).toUpperCase()}
                          </Text>
                        </View>
                        <View style={[styles.badgeWrap, person.isEmergencyContact ? styles.badgeWrapActive : styles.badgeWrapInactive]}>
                          <Text style={styles.badgeIcon}>{person.isEmergencyContact ? '🚨' : '🤝'}</Text>
                          <Text style={[styles.badgeText, person.isEmergencyContact ? styles.badgeTextActive : styles.badgeTextInactive]}>
                            {person.isEmergencyContact ? 'Acil Kişi' : 'Arkadaş'}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.personName}>{person.fullName || 'İsimsiz kişi'}</Text>
                      <View style={styles.personDetailRow}>
                        <Text style={styles.personDetailIcon}>✉️</Text>
                        <Text style={styles.personLocation}>{person.email || 'E-posta yok'}</Text>
                      </View>
                      <View style={styles.personDetailRow}>
                        <Text style={styles.personDetailIcon}>🟢</Text>
                        <Text style={styles.personStatus}>{person.safetyStatus || 'Durum bilgisi yok'}</Text>
                      </View>

                      <View style={styles.friendCardFooter}>
                        <Pressable
                          style={[styles.friendActionButton, person.isEmergencyContact ? styles.friendActionButtonNeutral : styles.friendActionButtonPrimary]}
                          onPress={() => handleToggleEmergency(person.friendshipId, Boolean(person.isEmergencyContact))}
                          disabled={actionLoading}
                        >
                          <Text style={styles.friendActionButtonIcon}>
                            {person.isEmergencyContact ? '➖' : '🚨'}
                          </Text>
                          <Text style={[styles.friendActionButtonText, person.isEmergencyContact && styles.friendActionButtonTextDark]}>
                            {person.isEmergencyContact ? 'Acil Kişiden Çıkar' : 'Acil Kişi Yap'}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateEmoji}>👤</Text>
                  <Text style={styles.emptyStateTitle}>Henüz yakın kişi eklenmedi</Text>
                  <Text style={styles.emptyStateText}>Arkadaş yönetimi bölümünden yeni kişi ekleyebilirsiniz.</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* ── 3. AKTİF AFETLER ── */}
        <View style={styles.heroCard}>
          <SectionHeader
            icon="🚨"
            iconBg="#fee2e2"
            title="Aktif Afetler"
            description="Backend'den gelen canlı afet listesi."
            isExpanded={isDisastersExpanded}
            onPress={() => setIsDisastersExpanded(!isDisastersExpanded)}
          />

          {isDisastersExpanded && (
            <View style={styles.accordionBody}>
              {dashboardLoading ? (
                <View style={styles.loadingBox}>
                  <ActivityIndicator color="#0f766e" size="small" />
                  <Text style={styles.loadingText}>Veriler yükleniyor...</Text>
                </View>
              ) : activeDisasters.length > 0 ? (
                <View style={styles.disasterList}>
                  {activeDisasters.slice(0, 3).map((disaster) => (
                    <View key={disaster.id} style={styles.disasterCard}>
                      <View style={styles.disasterCardHeader}>
                        <View style={styles.disasterIconWrap}>
                          <Text style={styles.disasterIcon}>⚡</Text>
                        </View>
                        <Text style={styles.disasterTitle}>{formatDisasterLabel(disaster)}</Text>
                        <View style={styles.disasterBadge}>
                          <View style={styles.disasterBadgeDot} />
                          <Text style={styles.disasterBadgeText}>CANLI</Text>
                        </View>
                      </View>
                      <View style={styles.disasterLocationRow}>
                        <Text style={styles.disasterLocationIcon}>📍</Text>
                        <Text style={styles.disasterLocation}>{formatDisasterLocation(disaster)}</Text>
                      </View>
                      <Text style={styles.disasterDescription} numberOfLines={2}>
                        {disaster.description || 'Açıklama bulunmuyor.'}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateEmoji}>✅</Text>
                  <Text style={styles.emptyStateTitle}>Aktif afet bulunmuyor</Text>
                  <Text style={styles.emptyStateText}>Yeni afet kaydı oluştuğunda burada canlı olarak görünecek.</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* ── 4. ARKADAŞ YÖNETİMİ ── */}
        <View style={styles.heroCard}>
          <SectionHeader
            icon="🤝"
            iconBg="#dcfce7"
            title="Arkadaş Yönetimi"
            description="İstek gönder, gelen istekleri onayla veya reddet."
            isExpanded={isFriendManagementExpanded}
            onPress={() => setIsFriendManagementExpanded(!isFriendManagementExpanded)}
          />

          {isFriendManagementExpanded && (
            <View style={styles.accordionBody}>
              <View style={styles.inlineForm}>
                <View style={styles.receiverInputWrap}>
                  <Text style={styles.receiverInputIcon}>🔎</Text>
                  <TextInput
                    style={styles.receiverInput}
                    placeholder="E-posta veya kullanıcı ID"
                    placeholderTextColor="#94a3b8"
                    value={receiverIdentifier}
                    onChangeText={setReceiverIdentifier}
                    autoCapitalize="none"
                  />
                </View>
                <Pressable style={styles.sendButton} onPress={handleSendRequest} disabled={actionLoading}>
                  <Text style={styles.sendButtonIcon}>➕</Text>
                  <Text style={styles.sendButtonText}>{actionLoading ? 'Bekleyin' : 'İstek Gönder'}</Text>
                </Pressable>
              </View>

              {dashboardMessage && (
                <View style={[styles.feedbackBox, dashboardMessage.type === 'error' ? styles.feedbackError : styles.feedbackSuccess]}>
                  <Text style={styles.feedbackIcon}>{dashboardMessage.type === 'error' ? '⚠️' : '✅'}</Text>
                  <Text style={styles.feedbackText}>{dashboardMessage.text}</Text>
                </View>
              )}

              <View style={styles.requestList}>
                {pendingRequests.length > 0 ? (
                  pendingRequests.map((request) => {
                    const isIncoming = request.direction === 'incoming';
                    const displayName = isIncoming ? request.senderName : request.receiverName;

                    return (
                      <View key={request.requestId} style={styles.requestCard}>
                        <View style={styles.requestCardTop}>
                          <View style={styles.requestAvatar}>
                            <Text style={styles.requestAvatarText}>
                              {(displayName || '?').charAt(0).toUpperCase()}
                            </Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.requestName}>{displayName || 'Bilinmeyen kullanıcı'}</Text>
                            <Text style={styles.requestMeta}>
                              {isIncoming ? request.senderEmail : request.receiverEmail}
                            </Text>
                          </View>
                          <View style={[styles.requestStatusPill, isIncoming ? styles.requestStatusIncoming : styles.requestStatusOutgoing]}>
                            <Text style={styles.requestStatusIcon}>{isIncoming ? '📥' : '📤'}</Text>
                            <Text style={styles.requestStatusText}>{isIncoming ? 'Gelen' : 'Giden'}</Text>
                          </View>
                        </View>

                        <View style={styles.requestActions}>
                          {isIncoming ? (
                            <>
                              <Pressable
                                style={[styles.requestButton, styles.requestButtonPrimary]}
                                onPress={() => {
                                  console.log('[Dashboard] Request object:', request);
                                  handleRespondRequest(request.requestId, 'ACCEPTED');
                                }}
                                disabled={actionLoading}
                              >
                                <Text style={styles.requestButtonIcon}>✅</Text>
                                <Text style={styles.requestButtonPrimaryText}>Kabul Et</Text>
                              </Pressable>
                              <Pressable
                                style={[styles.requestButton, styles.requestButtonSecondary]}
                                onPress={() => {
                                  console.log('[Dashboard] Request object:', request);
                                  handleRespondRequest(request.requestId, 'REJECTED');
                                }}
                                disabled={actionLoading}
                              >
                                <Text style={styles.requestButtonIcon}>❌</Text>
                                <Text style={styles.requestButtonSecondaryText}>Reddet</Text>
                              </Pressable>
                            </>
                          ) : (
                            <View style={styles.requestPendingRow}>
                              <Text style={styles.requestPendingIcon}>⏳</Text>
                              <Text style={styles.requestPendingText}>Karşı tarafın yanıtı bekleniyor.</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    );
                  })
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateEmoji}>📭</Text>
                    <Text style={styles.emptyStateTitle}>Bekleyen arkadaş isteği yok</Text>
                    <Text style={styles.emptyStateText}>Yeni bir istek gönderdiğinizde veya geldiğinde burada görünecek.</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>

      </ScrollView>

      {isFabMenuVisible && (
        <Pressable
          style={styles.fabMenuOverlay}
          onPress={() => setIsFabMenuVisible(false)}
        />
      )}

      {isFabMenuVisible && (
        <View style={styles.fabMenu}>
          <Pressable
            style={styles.menuItemPill}
            onPress={() => {
              setIsFabMenuVisible(false);
              navigate(ROUTES.BIOMETRIC_OPERATOR);
            }}
          >
            <Text style={styles.menuItemText}>Operatör Paneli</Text>
            <Text style={styles.menuItemIcon}>🖥️</Text>
          </Pressable>

          <Pressable
            style={styles.menuItemPill}
            onPress={() => {
              setIsFabMenuVisible(false);
              navigate(ROUTES.DISASTER_MAP);
            }}
          >
            <Text style={styles.menuItemText}>Afet Haritası</Text>
            <Text style={styles.menuItemIcon}>🗺️</Text>
          </Pressable>
        </View>
      )}

      <Pressable
        style={styles.fab}
        onPress={() => setIsFabMenuVisible(!isFabMenuVisible)}
      >
        <Text style={[styles.fabIcon, isFabMenuVisible && styles.fabIconRotated]}>+</Text>
      </Pressable>
    </View>
  );
}