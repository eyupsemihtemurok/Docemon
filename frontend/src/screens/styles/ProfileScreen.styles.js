import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef9f0',
  },
  scrollContent: {
    padding: 18,
    gap: 20,
    paddingBottom: 40,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  // Header Section
  headerTop: {
    alignItems: 'center',
    marginVertical: 20,
  },
  largeAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#15803d',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
    boxShadow: '0 10px 25px rgba(21, 128, 61, 0.2)',
    marginBottom: 16,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 48,
    fontWeight: '900',
  },

  // Stats Panel
  statsPanel: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    boxShadow: '0 8px 30px rgba(16, 185, 129, 0.08)',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statsIcon: {
    fontSize: 24,
  },
  statsTitle: {
    color: '#052e16',
    fontSize: 16,
    fontWeight: '900',
  },
  statsCount: {
    color: '#15803d',
    fontSize: 20,
    fontWeight: '900',
  },
  expandIcon: {
    fontSize: 20,
    color: '#15803d',
  },
  expandedContent: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 16,
  },
  listSectionTitle: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  personItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  personAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  personAvatarText: {
    color: '#15803d',
    fontSize: 14,
    fontWeight: '800',
  },
  personName: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '700',
  },
  personStatus: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '500',
  },

  // Info Grid
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoCard: {
    flexBasis: '48%',
    flexGrow: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  infoLabel: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  infoValue: {
    color: '#052e16',
    fontSize: 15,
    fontWeight: '800',
  },

  // Footer Actions
  footer: {
    marginTop: 10,
    gap: 12,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 12,
  },
  footerLink: {
    color: '#15803d',
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  backButton: {
    backgroundColor: '#15803d',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    boxShadow: '0 8px 20px rgba(21, 128, 61, 0.25)',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
});
