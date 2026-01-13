import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  scrollContent: {
    paddingBottom: 20,
  },

  header: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
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
  },

  content: {
    flex: 1,
    padding: 24,
  },

  gradientHeader: {
    paddingTop: 50,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
    alignItems: 'center',
  },

  card: {
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    marginTop: -50,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },

  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#FF7043',
  },

  tabText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
  },

  activeTabText: {
    color: '#FF7043',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },

  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#333',
  },

  forgotPassword: {
    fontSize: 13,
    color: '#FF7043',
    fontWeight: '500',
    marginBottom: 20,
  },

  loginButton: {
    backgroundColor: '#FF7043',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },

  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },

  footer: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },

  footerLink: {
    color: '#FF7043',
    fontWeight: '600',
  },
});