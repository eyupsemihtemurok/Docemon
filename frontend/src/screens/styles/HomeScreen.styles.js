import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f7ff',
  },
  todoCard: {
    width: '100%',
    maxWidth: 520,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    padding: 24,
    borderWidth: 1,
    borderColor: '#dbeafe',
    boxShadow: '0 16px 32px rgba(15, 23, 42, 0.10)',
    gap: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
  },
  todoItem: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
  },
  todoText: {
    color: '#1f2937',
    fontSize: 15,
    lineHeight: 20,
  },
  adBox: {
    marginTop: 14,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#f59e0b',
    backgroundColor: '#fffbeb',
  },
  adText: {
    color: '#92400e',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  primaryButton: {
    marginTop: 10,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    paddingVertical: 13,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
});
