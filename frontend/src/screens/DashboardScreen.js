import { useMemo, useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, Text, TextInput, UIManager, View } from 'react-native';
import styles from './styles/DashboardScreen.styles';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// PEOPLE list removed

const NEAR_RELATIVES = [
  { id: 'nr1', initials: 'BT', name: 'Burak Tan', location: 'Adiyaman / Besni', status: 'Enkaz altinda olabilir', accent: '#ef4444', category: 'danger' },
  { id: 'nr2', initials: 'HO', name: 'Hülya Oz', location: 'Malatya / Yesilyurt', status: 'Iletisim kesildi', accent: '#f97316', category: 'danger' },
  { id: 'nr3', initials: 'AS', name: 'Ahmet Sabun', location: 'Adiyaman / Merkez', status: 'Guvenli bolgede', accent: '#22c55e', category: 'safe' },
];

// ACTIONS list removed

const PANELS = [
  { id: 'bildirimler', title: 'Bildirimler', content: 'Henüz yeni bir bildirim bulunmuyor.', isSpecial: true },
];

export default function DashboardScreen({ activeMenuItem }) {
  const [expandedPanel, setExpandedPanel] = useState(null);
  const [isTanimlaVisible, setIsTanimlaVisible] = useState(false);
  const [isFabMenuVisible, setIsFabMenuVisible] = useState(false);
  const [isRelativesExpanded, setIsRelativesExpanded] = useState(true);
  const [isAffectedModalVisible, setIsAffectedModalVisible] = useState(false);
  const [isMissingPersonModalVisible, setIsMissingPersonModalVisible] = useState(false);
  const [reportForm, setReportForm] = useState({
    personId: '',
    reason: '',
    lastContact: ''
  });

  const stats = useMemo(
    () => [
      { value: '128', label: 'aktif ihbar' },
      { value: '24', label: 'kurtarma merkezi' },
      { value: '7 dk', label: 'ortalama eslesme' },
    ],
    []
  );

  const togglePanel = (id) => {
    setExpandedPanel(expandedPanel === id ? null : id);
  };

  const specialPanel = PANELS[0];

  const dangerRelatives = NEAR_RELATIVES.filter(r => r.category === 'danger');
  const safeRelatives = NEAR_RELATIVES.filter(r => r.category === 'safe');

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.eyebrow}>AFET DESTEK PLATFORMU</Text>

              {/* Notification Panel Only */}
              {specialPanel && (
                <Pressable
                  style={[styles.panelCardSpecial]}
                  onPress={() => togglePanel(specialPanel.id)}
                >
                  <Text style={styles.panelTitleSpecial}>{specialPanel.title}</Text>
                  {expandedPanel === specialPanel.id && (
                    <Text style={styles.panelContent}>{specialPanel.content}</Text>
                  )}
                </Pressable>
              )}

              <Text style={styles.title}>Anlık Afet Bölgesi İstatistikleri</Text>

              {/* Statistics Details Grid */}
              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Konum / Şehir</Text>
                  <Text style={styles.detailValue}>Kahramanmaraş / Elbistan</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Anlık Saat</Text>
                  <Text style={styles.detailValue}>17:25</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Afet Türü</Text>
                  <Text style={styles.detailValue}>Deprem (M 7.6)</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Etkilenen Tahmini</Text>
                  <Text style={styles.detailValue}>~12.500 Kişi</Text>
                </View>
              </View>
            </View>

            <View style={styles.liveActionsRow}>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>Canli izleme</Text>
              </View>

              {dangerRelatives.length > 0 && (
                <Pressable
                  style={styles.affectedTrigger}
                  onPress={() => setIsAffectedModalVisible(true)}
                >
                  <Text style={styles.affectedTriggerIcon}>⚠️</Text>
                  <Text style={styles.affectedTriggerText}>Muhtemel Etkilenen Yakınlar ({dangerRelatives.length})</Text>
                </Pressable>
              )}
            </View>
          </View>

          <View style={styles.statsRow}>
            {stats.map((item) => (
              <View key={item.label} style={styles.statCard}>
                <Text style={styles.statValue}>{item.value}</Text>
                <Text style={styles.statLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>


        {/* Tehlikedeki Yakınlarım Section */}
        <View style={styles.heroCard}>
          <Pressable
            style={styles.inlineSectionHeader}
            onPress={() => setIsRelativesExpanded(!isRelativesExpanded)}
          >
            <Text style={[styles.sectionTitleEmbedded, { marginBottom: 0 }]}>Yakınlarım</Text>
            <Text style={{ fontSize: 18, color: '#15803d' }}>
              {isRelativesExpanded ? '▲' : '▼'}
            </Text>
          </Pressable>

          {isRelativesExpanded && (
            <>
              {dangerRelatives.length > 0 && (
                <View style={{ marginTop: 12 }}>
                  <Text style={[styles.categoryTitle, styles.dangerText]}>Potansiyel Tehlike</Text>
                  <View style={styles.peopleGrid}>
                    {dangerRelatives.map((person) => (
                      <View key={person.id} style={[styles.personCard, { borderColor: '#fecaca' }]}>
                        <View style={styles.personPhotoWrap}>
                          <View style={[styles.personPhoto, { backgroundColor: person.accent, width: 50, height: 50 }]}>
                            <Text style={[styles.personPhotoText, { fontSize: 16 }]}>{person.initials}</Text>
                          </View>
                          <View style={[styles.badgeWrap, { borderColor: '#fca5a5' }]}>
                            <Text style={[styles.badgeText, { color: '#dc2626' }]}>TEHLİKEDE</Text>
                          </View>
                        </View>
                        <Text style={styles.personName}>{person.name}</Text>
                        <Text style={styles.personLocation}>{person.location}</Text>
                        <Text style={styles.personStatus}>{person.status}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {safeRelatives.length > 0 && (
                <View style={{ marginTop: 16 }}>
                  <Text style={[styles.categoryTitle, styles.safeText]}>Güvende</Text>
                  <View style={styles.peopleGrid}>
                    {safeRelatives.map((person) => (
                      <View key={person.id} style={[styles.personCard, { borderColor: '#d1fae5' }]}>
                        <View style={styles.personPhotoWrap}>
                          <View style={[styles.personPhoto, { backgroundColor: person.accent, width: 50, height: 50 }]}>
                            <Text style={[styles.personPhotoText, { fontSize: 16 }]}>{person.initials}</Text>
                          </View>
                          <View style={[styles.badgeWrap, { borderColor: '#bbf7d0' }]}>
                            <Text style={[styles.badgeText, { color: '#16a34a' }]}>GÜVENDE</Text>
                          </View>
                        </View>
                        <Text style={styles.personName}>{person.name}</Text>
                        <Text style={styles.personLocation}>{person.location}</Text>
                        <Text style={styles.personStatus}>{person.status}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </>
          )}
        </View>

        <View style={styles.heroCard}>
          <View style={styles.inlineSectionHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitleEmbedded}>Afetzede Tanıla</Text>
              <Text style={styles.sectionDescription}>
                Bulunan afetzedelerin fotoğraflarını çekerek sistemdeki kayıtlı kişilerle hızlıca sorgulanmasını sağlayabilirsiniz.
              </Text>
            </View>
            <Pressable style={styles.tanimlaButton} onPress={() => setIsTanimlaVisible(true)}>
              <Text style={styles.tanimlaButtonText}>Tanımla</Text>
            </Pressable>
          </View>
        </View>

      </ScrollView>

      {/* MODALS */}
      {/* Tanımla Modal */}
      <Modal
        visible={isTanimlaVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsTanimlaVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tanımlama ekranı</Text>

            <Pressable style={styles.modalButtonSecondary}>
              <Text style={styles.modalButtonTextSecondary}>📷 Fotoğraf çek</Text>
            </Pressable>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable
                style={[styles.modalButton, { flex: 1 }]}
                onPress={() => setIsTanimlaVisible(false)}
              >
                <Text style={styles.modalButtonText}>Gönder</Text>
              </Pressable>

              <Pressable
                style={[styles.modalButtonSecondary, { flex: 1 }]}
                onPress={() => setIsTanimlaVisible(false)}
              >
                <Text style={styles.modalButtonTextSecondary}>İptal</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Affected Relatives Modal */}
      <Modal
        visible={isAffectedModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsAffectedModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '80%', padding: 20 }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalTitle}>Muhtemel Etkilenen Yakınlar</Text>
                <Text style={styles.modalSubtitle}>Afet bölgesindeki potansiyel risk altındaki yakınlarınız.</Text>
              </View>
              <Pressable
                style={styles.closeButton}
                onPress={() => setIsAffectedModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </Pressable>
            </View>

            <ScrollView style={styles.modalScroll}>
              {dangerRelatives.map((person) => (
                <View key={person.id} style={styles.modalPersonCard}>
                  <View style={styles.modalPersonInfo}>
                    <View style={[styles.personAvatar, { backgroundColor: person.accent }]}>
                      <Text style={styles.personAvatarText}>{person.initials}</Text>
                    </View>
                    <View>
                      <Text style={styles.modalPersonName}>{person.name}</Text>
                      <Text style={styles.modalPersonStatus}>{person.status}</Text>
                    </View>
                  </View>
                  <View style={styles.modalPersonLocationWrap}>
                    <Text style={styles.modalPersonLocation}>📍 {person.location}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <Pressable
              style={styles.modalButton}
              onPress={() => setIsAffectedModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Kapat</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Missing Person Report Modal */}
      <Modal
        visible={isMissingPersonModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsMissingPersonModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '90%', padding: 24 }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalTitle}>Kayıp Şüphesi Bildir</Text>
                <Text style={styles.modalSubtitle}>Lütfen gerekli bilgileri eksiksiz doldurunuz.</Text>
              </View>
              <Pressable
                style={styles.closeButton}
                onPress={() => setIsMissingPersonModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </Pressable>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>İletişim Kurulamayan Kişi</Text>
                <View style={styles.dropdownWrap}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                    {NEAR_RELATIVES.map((person) => (
                      <Pressable
                        key={person.id}
                        style={[
                          styles.personChip,
                          reportForm.personId === person.id && styles.personChipSelected
                        ]}
                        onPress={() => setReportForm({ ...reportForm, personId: person.id })}
                      >
                        <View style={[styles.chipAvatar, { backgroundColor: person.accent }]}>
                          <Text style={styles.chipAvatarText}>{person.initials}</Text>
                        </View>
                        <Text style={[
                          styles.chipName,
                          reportForm.personId === person.id && styles.chipNameSelected
                        ]}>{person.name}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Bildiri Nedeni</Text>
                <TextInput
                  style={[styles.premiumInput, { height: 80, textAlignVertical: 'top' }]}
                  placeholder="Örn: Telefonuna ulaşılamıyor, konumu değişmiyor..."
                  multiline
                  value={reportForm.reason}
                  onChangeText={(text) => setReportForm({ ...reportForm, reason: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Son İletişim Zamanı ve Şekli</Text>
                <TextInput
                  style={styles.premiumInput}
                  placeholder="Örn: Bugün 14:30, WhatsApp mesajı"
                  value={reportForm.lastContact}
                  onChangeText={(text) => setReportForm({ ...reportForm, lastContact: text })}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooterActions}>
              <Pressable
                style={[styles.modalButton, { flex: 2 }]}
                onPress={() => {
                  alert('Bildiri başarıyla gönderildi.');
                  setIsMissingPersonModalVisible(false);
                  setReportForm({ personId: '', reason: '', lastContact: '' });
                }}
              >
                <Text style={styles.modalButtonText}>Bildiriyi Gönder</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButtonSecondary, { flex: 1 }]}
                onPress={() => setIsMissingPersonModalVisible(false)}
              >
                <Text style={styles.modalButtonTextSecondary}>İptal</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* FAB Overlay Background */}
      {isFabMenuVisible && (
        <Pressable
          style={styles.fabMenuOverlay}
          onPress={() => setIsFabMenuVisible(false)}
        />
      )}

      {/* FAB Menu */}
      {isFabMenuVisible && (
        <View style={styles.fabMenu}>
          <Pressable style={styles.menuItemPill} onPress={() => setIsFabMenuVisible(false)}>
            <Text style={styles.menuItemText}>Bluetooth Mesh</Text>
            <Text style={styles.menuItemIcon}>📶</Text>
          </Pressable>

          <Pressable style={styles.menuItemPill} onPress={() => setIsFabMenuVisible(false)}>
            <Text style={styles.menuItemText}>Bilgilendirme Paneli</Text>
            <Text style={styles.menuItemIcon}>ℹ️</Text>
          </Pressable>

          <Pressable 
            style={[styles.menuItemPill, styles.menuItemPillPrimary]} 
            onPress={() => {
              setIsFabMenuVisible(false);
              setIsMissingPersonModalVisible(true);
            }}
          >
            <Text style={[styles.menuItemText, styles.menuItemTextPrimary]}>Kayıp Şüphesi</Text>
            <Text style={styles.menuItemIcon}>🔍</Text>
          </Pressable>
        </View>
      )}

      {/* Floating Action Button */}
      <Pressable
        style={styles.fab}
        onPress={() => setIsFabMenuVisible(!isFabMenuVisible)}
      >
        <Text style={[styles.fabIcon, isFabMenuVisible && { transform: [{ rotate: '45deg' }] }]}>+</Text>
      </Pressable>
    </View>
  );
}


