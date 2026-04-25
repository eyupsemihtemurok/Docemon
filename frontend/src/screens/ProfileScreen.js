import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import styles from './styles/ProfileScreen.styles';

export default function ProfileScreen({ navigate }) {
  const [isStatsExpanded, setIsStatsExpanded] = useState(false);

  const userData = {
    name: 'Mete',
    surname: 'Kaya',
    phone: '+90 5XX XXX XX XX',
    friendsCount: 12,
    relativesCount: 4,
  };

  const FRIENDS = [
    { id: 'f1', name: 'Burak Tan', status: 'Çevrimiçi' },
    { id: 'f2', name: 'Ayşe Yılmaz', status: 'Son görülme: 2s önce' },
    { id: 'f3', name: 'Caner Öz', status: 'Ulaşılamıyor' },
  ];

  const RELATIVES = [
    { id: 'r1', name: 'Ahmet Kaya', status: 'Güvendeyim' },
    { id: 'r2', name: 'Seda Kaya', status: 'Konum paylaştı' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Centered Avatar */}
        <View style={styles.headerTop}>
          <View style={styles.largeAvatar}>
            <Text style={styles.avatarText}>{userData.name.charAt(0)}</Text>
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

          {isStatsExpanded && (
            <View style={styles.expandedContent}>
              <Text style={styles.listSectionTitle}>Yakınlar</Text>
              {RELATIVES.map(person => (
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

              <Text style={[styles.listSectionTitle, { marginTop: 8 }]}>Arkadaşlar</Text>
              {FRIENDS.map(person => (
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
