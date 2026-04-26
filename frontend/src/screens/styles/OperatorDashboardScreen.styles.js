import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef9f0',
  },

  // Üst Bar - Geri Butonu
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  backButtonText: {
    color: '#15803d',
    fontWeight: '700',
    fontSize: 14,
  },

  // Üst Başlık
  headerBar: {
    padding: 20,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#d1fae5',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#15803d',
  },
  headerSub: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 2,
  },

  // Boş Durum
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 52,
    marginBottom: 16,
  },
  emptyText: {
    color: '#64748b',
    fontWeight: '800',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Yükleme Durumu
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef9f0',
  },
  loadingText: {
    marginTop: 14,
    color: '#64748b',
    fontWeight: '700',
    fontSize: 14,
  },

  // Kart
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 14,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    boxShadow: '0 6px 18px rgba(16,185,129,0.08)',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  cardName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#052e16',
  },
  cardNationalId: {
    color: '#64748b',
    fontWeight: '700',
    fontSize: 13,
    marginTop: 2,
  },
  scoreBadge: {
    backgroundColor: '#dcfce7',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  scoreText: {
    color: '#166534',
    fontWeight: '900',
    fontSize: 13,
  },

  // Detay Alanları
  detailBlock: {
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },

  // Aksiyon Butonları
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  approveButton: {
    flex: 1,
    backgroundColor: '#15803d',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  approveButtonText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.5,
  },
});
