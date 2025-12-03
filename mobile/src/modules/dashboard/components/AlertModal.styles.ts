import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  alertContainer: {
    width: '85%',
    maxWidth: 500,
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  warningContainer: {
    backgroundColor: '#FFF9E6',
    borderWidth: 3,
    borderColor: '#FF9500',
  },
  criticalContainer: {
    backgroundColor: '#FFE6E6',
    borderWidth: 3,
    borderColor: '#FF3B30',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  warningTitle: {
    color: '#FF9500',
  },
  criticalTitle: {
    color: '#FF3B30',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
    color: '#1F2937',
    fontWeight: '600',
  },
  details: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '700',
  },
  valueHighlight: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    marginVertical: 12,
  },
  warningValue: {
    color: '#FF9500',
  },
  criticalValue: {
    color: '#FF3B30',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissButton: {
    backgroundColor: '#E5E7EB',
  },
  dismissButtonText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '700',
  },
  actionButton: {
    backgroundColor: '#3B82F6',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
});
