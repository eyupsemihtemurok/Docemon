import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef9f0',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Başlık
  headerBlock: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#052e16',
  },
  headerSub: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },

  // Fotoğraf Alanı
  photoCard: {
    width: '100%',
    height: 300,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    overflow: 'hidden',
    boxShadow: '0 12px 24px rgba(16,185,129,0.12)',
  },
  photoTouchable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  photoIconWrap: {
    backgroundColor: 'rgba(21,128,61,0.1)',
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  photoIconText: {
    fontSize: 40,
  },
  photoLabel: {
    color: '#15803d',
    fontSize: 18,
    fontWeight: '900',
  },
  photoHint: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 4,
  },

  // Resim üzerindeki butonlar
  photoOverlayButtons: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  retakeButton: {
    backgroundColor: '#15803d',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 999,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  retakeButtonText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
  },
  removeButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 999,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  removeButtonText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
  },

  // Galeri linki
  galleryLink: {
    alignSelf: 'center',
    marginTop: 14,
  },
  galleryLinkText: {
    color: '#15803d',
    fontWeight: '800',
    fontSize: 14,
    textDecorationLine: 'underline',
  },

  // Form Alanları
  formSection: {
    marginTop: 28,
    gap: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 6,
    marginLeft: 4,
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
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  // Ana Buton
  submitButton: {
    backgroundColor: '#15803d',
    paddingVertical: 20,
    borderRadius: 22,
    alignItems: 'center',
    marginTop: 32,
    boxShadow: '0 10px 24px rgba(21, 128, 61, 0.3)',
  },
  submitButtonDisabled: {
    backgroundColor: '#94a3b8',
    boxShadow: 'none',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },

  // Geri Dönüş
  backButton: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 12,
  },
  backButtonText: {
    color: '#64748b',
    fontWeight: '700',
    fontSize: 14,
  },
});
