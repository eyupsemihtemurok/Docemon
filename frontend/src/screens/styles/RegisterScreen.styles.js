import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef9f0',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },

  // Başlık
  headerBlock: {
    alignItems: 'center',
    marginBottom: 28,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#15803d',
  },
  headerSub: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 6,
  },

  embeddedCard: {
    width: '100%',
  },

  // Fotoğraf Alanı
  photoSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  photoCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#f0fdf4',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#15803d',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    color: '#94a3b8',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  photoButtonRow: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 12,
  },
  cameraButton: {
    backgroundColor: '#15803d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  cameraButtonText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
  },
  galleryButton: {
    backgroundColor: '#e2e8f0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  galleryButtonText: {
    color: '#334155',
    fontWeight: '800',
    fontSize: 14,
  },

  // Form
  formGroup: {
    gap: 14,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: '#0f172a',
    fontWeight: '600',
  },

  // Ana Buton
  submitButton: {
    backgroundColor: '#15803d',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 32,
    boxShadow: '0 8px 20px rgba(21, 128, 61, 0.25)',
  },
  submitButtonDisabled: {
    backgroundColor: '#94a3b8',
    boxShadow: 'none',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '900',
  },

  // Geri Dönüş
  backLink: {
    alignItems: 'center',
    marginTop: 20,
  },
  backLinkText: {
    color: '#64748b',
    fontSize: 14,
  },
  backLinkBold: {
    color: '#15803d',
    fontWeight: '800',
  },
});
