import { StyleSheet } from 'react-native';

const PRIMARY = '#FF7043';

export const styles = StyleSheet.create({
  /* ===== Screen ===== */
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  scrollContent: {
    paddingBottom: 30,
  },

  /* ===== Header ===== */
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 10,
  },

  headerSubtitle: {
    fontSize: 14,
    color: '#FFF',
    marginTop: 5,
    opacity: 0.9,
  },

  /* ===== Card ===== */
  card: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  /* ===== Tabs (Bulged like Login) ===== */
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },

  activeTab: {
    backgroundColor: '#FFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  tabText: {
    fontSize: 15,
    color: '#888',
    fontWeight: '500',
  },

  activeTabText: {
    color: PRIMARY,
    fontWeight: '700',
  },

  /* ===== Status Banner ===== */
  statusBanner: {
    backgroundColor: '#F3FFF4',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },

  statusText: {
    color: '#2E7D32',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 13,
  },

  /* ===== Inputs ===== */
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 14,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F9F9F9',
    marginBottom: 16,
  },

  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#333',
  },

  /* ===== Pincode Section ===== */
  pincodeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },

  pincodeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#F9F9F9',
  },

  addButton: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 16,
    borderRadius: 20,
    justifyContent: 'center',
  },

  addButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },

  pincodeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },

  pincodeChip: {
    backgroundColor: '#FFE0D6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },

  pincodeText: {
    color: PRIMARY,
    fontWeight: '600',
    fontSize: 13,
  },

  /* ===== Signup Button ===== */
  signupButton: {
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  signupButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
