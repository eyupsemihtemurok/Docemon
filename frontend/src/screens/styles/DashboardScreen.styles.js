import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  /* ─────────────── LAYOUT ─────────────── */
  container: {
    flex: 1,
    backgroundColor: '#eef9f0',
  },
  scrollContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 100,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },

  /* ─────────────── HERO CARD ─────────────── */
  heroCard: {
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    overflow: 'hidden',
  },
  heroGradientBand: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#16a34a',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  heroTopRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    marginTop: 4,
  },
  heroBadgeCol: {
    alignItems: 'flex-end',
    gap: 6,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  eyebrow: {
    color: '#15803d',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: '#052e16',
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 30,
  },
  subtitle: {
    color: '#4b7a5a',
    marginTop: 4,
    fontSize: 13,
    lineHeight: 20,
  },
  subtitleBold: {
    color: '#15803d',
    fontWeight: '800',
  },

  /* ─────────────── LIVE BADGE ─────────────── */
  liveBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#86efac',
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#16a34a',
  },
  livePulse: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#16a34a',
  },
  liveText: {
    color: '#166534',
    fontSize: 11,
    fontWeight: '800',
  },
  colorCaption: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'right',
  },

  /* ─────────────── SUMMARY GRID ─────────────── */
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  summaryCard: {
    flexGrow: 1,
    minWidth: 90,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 2,
  },
  summaryCardwarning: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  summaryCardsuccess: {
    backgroundColor: '#f0fdf4',
    borderColor: '#86efac',
  },
  summaryCardprimary: {
    backgroundColor: '#ecfeff',
    borderColor: '#67e8f9',
  },
  summaryCardIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  summaryValue: {
    color: '#052e16',
    fontSize: 22,
    fontWeight: '900',
  },
  summaryLabel: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },

  /* ─────────────── SECTION HEADER ─────────────── */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  sectionIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  sectionIcon: {
    fontSize: 20,
  },
  sectionTitleEmbedded: {
    color: '#052e16',
    fontSize: 16,
    fontWeight: '900',
  },
  sectionTitle: {
    color: '#052e16',
    fontSize: 16,
    fontWeight: '900',
  },
  sectionDescription: {
    color: '#64748b',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  chevronWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  chevronWrapActive: {
    backgroundColor: '#dcfce7',
    borderColor: '#86efac',
  },
  accordionChevron: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '900',
  },
  accordionChevronActive: {
    color: '#16a34a',
  },
  accordionBody: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#f0fdf4',
  },

  /* ─────────────── PEOPLE GRID ─────────────── */
  peopleGrid: {
    gap: 12,
  },
  personCard: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: '#f8fffe',
    borderWidth: 1,
    borderColor: '#d1fae5',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  personPhotoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  personPhoto: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  personPhotoText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },
  badgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeIcon: {
    fontSize: 11,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  badgeWrapActive: {
    borderColor: '#fca5a5',
    backgroundColor: '#fef2f2',
  },
  badgeWrapInactive: {
    borderColor: '#bbf7d0',
    backgroundColor: '#f0fdf4',
  },
  badgeTextActive: {
    color: '#dc2626',
  },
  badgeTextInactive: {
    color: '#16a34a',
  },
  personName: {
    color: '#052e16',
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 4,
  },
  personDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 3,
  },
  personDetailIcon: {
    fontSize: 12,
  },
  personLocation: {
    color: '#0f766e',
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  personStatus: {
    color: '#475569',
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
  friendCardFooter: {
    marginTop: 12,
  },
  friendActionButton: {
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  friendActionButtonPrimary: {
    backgroundColor: '#15803d',
  },
  friendActionButtonNeutral: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  friendActionButtonIcon: {
    fontSize: 13,
  },
  friendActionButtonText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#ffffff',
  },
  friendActionButtonTextDark: {
    color: '#475569',
  },

  /* ─────────────── DISASTERS ─────────────── */
  disasterList: {
    gap: 10,
  },
  disasterCard: {
    backgroundColor: '#fffbeb',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  disasterCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  disasterIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disasterIcon: {
    fontSize: 14,
  },
  disasterTitle: {
    flex: 1,
    color: '#052e16',
    fontSize: 14,
    fontWeight: '900',
  },
  disasterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#86efac',
  },
  disasterBadgeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#16a34a',
  },
  disasterBadgeText: {
    color: '#166534',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  disasterLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  disasterLocationIcon: {
    fontSize: 12,
  },
  disasterLocation: {
    color: '#0f766e',
    fontSize: 12,
    fontWeight: '700',
  },
  disasterDescription: {
    color: '#64748b',
    fontSize: 12,
    lineHeight: 18,
  },

  /* ─────────────── LOADING / EMPTY ─────────────── */
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  loadingText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 6,
  },
  emptyStateEmoji: {
    fontSize: 36,
    marginBottom: 4,
  },
  emptyStateTitle: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
  },
  emptyStateText: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
    lineHeight: 18,
    textAlign: 'center',
  },

  /* ─────────────── FEEDBACK ─────────────── */
  feedbackBox: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  feedbackIcon: {
    fontSize: 15,
  },
  feedbackError: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  feedbackSuccess: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  feedbackText: {
    color: '#334155',
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },

  /* ─────────────── RESCUE PANEL ─────────────── */
  rescuePanel: {
    gap: 12,
  },
  rescuePicker: {
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#fde68a',
    backgroundColor: '#fffbeb',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rescuePickerIcon: {
    fontSize: 26,
  },
  rescuePickerTitle: {
    color: '#92400e',
    fontSize: 14,
    fontWeight: '900',
  },
  rescuePickerText: {
    color: '#78350f',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  rescuePickerArrow: {
    color: '#d97706',
    fontSize: 22,
    fontWeight: '300',
  },
  rescuePreview: {
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  rescuePreviewImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#e2e8f0',
  },
  rescuePreviewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
  },
  rescuePreviewIcon: {
    fontSize: 14,
  },
  rescuePreviewText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  rescueButton: {
    backgroundColor: '#0f766e',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  rescueButtonLoading: {
    opacity: 0.7,
  },
  rescueButtonIcon: {
    fontSize: 16,
  },
  rescueButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },

  /* ─────────────── FORM ─────────────── */
  inputGroup: {
    gap: 6,
  },
  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  inputLabelIcon: {
    fontSize: 13,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
  },
  premiumInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 13,
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '600',
  },
  premiumTextArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  /* ─────────────── FRIEND MANAGEMENT ─────────────── */
  inlineForm: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    alignItems: 'stretch',
  },
  receiverInputWrap: {
    flex: 1,
    minWidth: 200,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#bbf7d0',
    borderRadius: 14,
    paddingHorizontal: 12,
    gap: 8,
  },
  receiverInputIcon: {
    fontSize: 15,
  },
  receiverInput: {
    flex: 1,
    paddingVertical: 12,
    color: '#052e16',
    fontSize: 14,
    fontWeight: '700',
  },
  sendButton: {
    backgroundColor: '#0f766e',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  sendButtonIcon: {
    fontSize: 14,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
  },
  requestList: {
    gap: 10,
    marginTop: 12,
  },
  requestCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d1fae5',
    backgroundColor: '#f8fffe',
    padding: 14,
  },
  requestCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  requestAvatar: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#0f766e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestAvatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
  requestName: {
    color: '#052e16',
    fontSize: 14,
    fontWeight: '900',
  },
  requestMeta: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 1,
  },
  requestStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderWidth: 1,
  },
  requestStatusIncoming: {
    backgroundColor: '#ecfdf5',
    borderColor: '#86efac',
  },
  requestStatusOutgoing: {
    backgroundColor: '#eff6ff',
    borderColor: '#93c5fd',
  },
  requestStatusIcon: {
    fontSize: 10,
  },
  requestStatusText: {
    color: '#166534',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    flexWrap: 'wrap',
  },
  requestButton: {
    borderRadius: 11,
    paddingVertical: 9,
    paddingHorizontal: 14,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  requestButtonIcon: {
    fontSize: 12,
  },
  requestButtonPrimary: {
    backgroundColor: '#0f766e',
  },
  requestButtonPrimaryText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },
  requestButtonSecondary: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  requestButtonSecondaryText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '900',
  },
  requestPendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  requestPendingIcon: {
    fontSize: 14,
  },
  requestPendingText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
  },

  /* ─────────────── FAB ─────────────── */
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#15803d',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#15803d',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 1000,
  },
  fabIcon: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: '600',
    lineHeight: 36,
    textAlign: 'center',
  },
  fabIconRotated: {
    transform: [{ rotate: '45deg' }],
  },
  fabMenuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.12)',
    zIndex: 999,
  },
  fabMenu: {
    position: 'absolute',
    right: 20,
    bottom: 96,
    alignItems: 'flex-end',
    gap: 10,
    zIndex: 1001,
  },
  menuItemPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    gap: 8,
  },
  menuItemPillPrimary: {
    backgroundColor: '#15803d',
    borderColor: '#15803d',
  },
  menuItemText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '700',
  },
  menuItemTextPrimary: {
    color: '#ffffff',
  },
  menuItemIcon: {
    fontSize: 18,
  },
});
