import { useMemo, useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, Text, TextInput, UIManager, View } from 'react-native';
import styles from './styles/DashboardScreen.styles';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PEOPLE = [
  {
    id: 'p1',
    initials: 'AY',
    name: 'Aylin Yilmaz',
    location: 'Hatay / Merkez',
    status: 'Son gorulme: enkaz alani',
    accent: '#22c55e',
    badge: 'YENI',
  },
  {
    id: 'p2',
    initials: 'MK',
    name: 'Mert Kaya',
    location: 'Kahramanmaras / Dulkadiroglu',
    status: 'Aile bildirimi bekleniyor',
    accent: '#16a34a',
    badge: 'ACIL',
  },
  {
    id: 'p3',
    initials: 'SE',
    name: 'Seda Erdem',
    location: 'Gaziantep / Sehitkamil',
    status: 'Goruntulu eslesme araniyor',
    accent: '#15803d',
    badge: 'TAKIP',
  },
];

const NEAR_RELATIVES = [
  { id: 'nr1', initials: 'BT', name: 'Burak Tan', location: 'Adiyaman / Besni', status: 'Enkaz altinda olabilir', accent: '#ef4444', category: 'danger' },
  { id: 'nr2', initials: 'HO', name: 'Hülya Oz', location: 'Malatya / Yesilyurt', status: 'Iletisim kesildi', accent: '#f97316', category: 'danger' },
  { id: 'nr3', initials: 'AS', name: 'Ahmet Sabun', location: 'Adiyaman / Merkez', status: 'Guvenli bolgede', accent: '#22c55e', category: 'safe' },
];

const ACTIONS = [
  { title: 'Kisi bildir', description: 'Yeni kayip kisi kaydi olustur.' },
  { title: 'Eslestir', description: 'Benzer bilgiler ile hizli kontrol yap.' },
  { title: 'Konum paylas', description: 'Gecici konum ve kurtarma bilgisi ekle.' },
];

const PANELS = [
  { id: 'bildirimler', title: 'Bildirimler', content: 'Henüz yeni bir bildirim bulunmuyor.', isSpecial: true },
];

export default function DashboardScreen({ activeMenuItem }) {
  const [expandedPanel, setExpandedPanel] = useState(null);
  const [isTanimlaVisible, setIsTanimlaVisible] = useState(false);
  const [isFabMenuVisible, setIsFabMenuVisible] = useState(false);

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

            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Canli izleme</Text>
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
          <Text style={styles.sectionTitleEmbedded}>Yakınlarım</Text>

          {dangerRelatives.length > 0 && (
            <View>
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
        </View>

        <View style={styles.heroCard}>
          <View style={styles.inlineSectionHeader}>
            <Text style={styles.sectionTitleEmbedded}>Oncelikli kayip listesi</Text>
            <Pressable style={styles.tanimlaButton} onPress={() => setIsTanimlaVisible(true)}>
              <Text style={styles.tanimlaButtonText}>Tanımla</Text>
            </Pressable>
          </View>

          <View style={styles.peopleGrid}>
            {PEOPLE.map((person) => (
              <View key={person.id} style={styles.personCard}>
                <View style={styles.personPhotoWrap}>
                  <View style={[styles.personPhoto, { backgroundColor: person.accent }]}>
                    <Text style={styles.personPhotoText}>{person.initials}</Text>
                  </View>
                  <View style={styles.badgeWrap}>
                    <Text style={styles.badgeText}>{person.badge}</Text>
                  </View>
                </View>

                <Text style={styles.personName}>{person.name}</Text>
                <Text style={styles.personLocation}>{person.location}</Text>
                <Text style={styles.personStatus}>{person.status}</Text>
              </View>
            ))}
          </View>
        </View>

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

        <View style={styles.actionRow}>
          {ACTIONS.map((action) => (
            <Pressable key={action.title} style={styles.actionCard}>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionDescription}>{action.description}</Text>
            </Pressable>
          ))}
        </View>

      </ScrollView>

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

          <Pressable style={styles.menuItemPill} onPress={() => setIsFabMenuVisible(false)}>
            <Text style={styles.menuItemText}>Kayıp Şüphesi</Text>
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


