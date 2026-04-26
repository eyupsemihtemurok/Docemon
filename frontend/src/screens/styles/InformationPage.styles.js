import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7ff',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 28,
    gap: 12,
  },
  headerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#d1fae5',
    padding: 18,
  },
  eyebrow: {
    color: '#065f46',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  title: {
    color: '#0f172a',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 6,
  },
  subtitle: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: 14,
    backgroundColor: '#0f766e',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  tableTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#f1f5f9',
  },
  headerCell: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  rowCell: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '600',
  },
  colMetric: {
    flex: 1.35,
    paddingRight: 8,
  },
  colValue: {
    flex: 0.75,
    textAlign: 'center',
  },
  colTrend: {
    flex: 1.2,
    textAlign: 'right',
  },
  valueCell: {
    color: '#065f46',
    fontWeight: '900',
  },
});

export default styles;
