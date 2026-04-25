import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import styles from './styles/DashboardScreen.styles';

const NEAR_RELATIVES = [
  { id: 'nr1', initials: 'BT', name: 'Burak Tan', location: 'Adıyaman / Besni', status: 'Enkaz altında olabilir', category: 'danger' },
  { id: 'nr2', initials: 'HO', name: 'Hülya Öz', location: 'Malatya / Yeşilyurt', status: 'İletişim kesildi', category: 'danger' },
  { id: 'nr3', initials: 'AS', name: 'Ahmet Sabun', location: 'Adıyaman / Merkez', status: 'Güvenli bölgede', category: 'safe' },
];

const PEOPLE = [
  { id: 'p1', initials: 'AY', name: 'Aylin Yılmaz', location: 'Hatay / Merkez', status: 'Son görülme: enkaz alanı', badge: 'YENİ' },
  { id: 'p2', initials: 'MK', name: 'Mert Kaya', location: 'Kahramanmaraş / Dulkadiroğlu', status: 'Aile bildirimi bekleniyor', badge: 'ACİL' },
  { id: 'p3', initials: 'SE', name: 'Seda Erdem', location: 'Gaziantep / Şehitkamil', status: 'Görüntülü eşleşme aranıyor', badge: 'TAKİP' },
];

const PANELS = [
  { id: 'bildirimler', title: 'Bildirimler', content: 'Henüz yeni bir bildirim bulunmuyor.', isSpecial: true },
];

export default function DashboardScreen({ activeMenuItem }) {
  const [expandedPanel, setExpandedPanel] = useState(null);

  const stats = useMemo(() => [
    { value: '128', label: 'aktif ihbar' },
    { value: '24', label: 'kurtarma merkezi' },
    { value: '7 dk', label: 'ortalama eşleşme' },
  ], []);

  const specialPanel = PANELS[0];
  const dangerRelatives = NEAR_RELATIVES.filter(r => r.category === 'danger');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Hero */}
      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View>
            <Text style={styles.eyebrow}>AFET DESTEK PLATFORMU</Text>
            {specialPanel && (
              <Pressable style={styles.panelCardSpecial} onPress={() => setExpandedPanel(expandedPanel === specialPanel.id ? null : specialPanel.id)}>
                <Text style={styles.panelTitleSpecial}>{specialPanel.title}</Text>
                {expandedPanel === specialPanel.id && (
                  <Text style={styles.panelContent}>{specialPanel.content}</Text>
                )}
              </Pressable>
            )}
          </View>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Canlı izleme</Text>
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

      {/* Yakınlarım */}
      <View style={styles.heroCard}>
        <Text style={styles.sectionTitleEmbedded}>Yakınlarım</Text>
        {dangerRelatives.map((person) => (
          <View key={person.id} style={styles.personCard}>
            <Text style={styles.personName}>{person.name} — {person.location}</Text>
            <Text style={{ color: '#dc2626', fontSize: 12, marginTop: 3 }}>{person.status}</Text>
          </View>
        ))}
      </View>

      {/* Öncelikli kayıp listesi */}
      <View style={styles.heroCard}>
        <Text style={styles.sectionTitleEmbedded}>Öncelikli Kayıp Listesi</Text>
        <View style={styles.peopleGrid}>
          {PEOPLE.map((person) => (
            <View key={person.id} style={styles.personCard}>
              <Text style={styles.personName}>{person.name}</Text>
              <Text style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>{person.location}</Text>
              <Text style={{ color: '#94a3b8', fontSize: 11, marginTop: 2 }}>{person.status}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
