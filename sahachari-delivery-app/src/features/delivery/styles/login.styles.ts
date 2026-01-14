import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

const PRIMARY = Colors.primary || '#FF7043';

export const styles = StyleSheet.create({
  /* ===== Screen ===== */
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  scrollContainer: {
    flexGrow: 1,
  },

  /* ===== Header ===== */
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 12,
  },

  headerSubtitle: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
    marginTop: 4,
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

  /* ===== Tabs (Signup-style bulged) ===== */
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
    backgroundColor: 'transparent',
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

  /* ===== Inputs ===== */
  inputGroup: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F9F9F9',
  },

  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#333',
  },

  /* ===== Forgot Password ===== */
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },

  forgotText: {
    fontSize: 13,
    color: PRIMARY,
    fontWeight: '500',
  },

  /* ===== Button ===== */
  loginButton: {
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },

  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },

  /* ===== Footer ===== */
  footer: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 10,
  },

  footerLink: {
    color: PRIMARY,
    fontWeight: '600',
  },
});
