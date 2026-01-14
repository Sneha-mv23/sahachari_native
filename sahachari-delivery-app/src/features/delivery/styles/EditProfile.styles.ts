import { StyleSheet } from 'react-native';
import { Colors } from '../../../../constants/Colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6dbdbff',
  },

  /* ---------- GRADIENT HEADER (MOVED UP) ---------- */
  gradientHeader: {
    paddingTop: 30, // ✅ Reduced from 50
    paddingBottom: 30, // ✅ Reduced from 40
    paddingHorizontal: 24,
    borderBottomLeftRadius: 1,    borderBottomRightRadius: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },

  /* ---------- CONTENT ---------- */
  scrollContent: {
    flexGrow: 1,
  },

  content: {
    flex: 1,
    padding: 24,
    marginTop: -10
  },

  /* ---------- AVATAR CARD (SMALLER) ---------- */
  avatarCard: {
  backgroundColor: Colors.white,
  borderRadius: 50,
  borderWidth: 2,
  borderColor: '#F57C00',

  padding: 24,                  
  marginBottom: 16,

  alignItems: 'center',         
  justifyContent: 'center',    

  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 5,
},



  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },

  avatarGradient: {
    width: 80, // ✅ Reduced from 110
    height: 80, // ✅ Reduced from 110
    borderRadius: 40, // ✅ Half of width/height
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  avatarImage: {
    width: 100, // ✅ Reduced from 110
    height: 80, // ✅ Reduced from 110
    borderRadius: 40, // ✅ Half of width/height
  },

  cameraButton: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -21, // Half of width (42/2) to center
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: Colors.primary, 
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  avatarText: {
    marginTop: 4,  
    fontSize: 13, 
    fontWeight: '600',
    color: Colors.primary,
  },

  /* ---------- FORM CARD ---------- */
  formCard: {
    backgroundColor: Colors.white,borderWidth: 2,
    borderColor: '#F57C00',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  field: {
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FAFAFA',
  },

  inputIcon: {
    marginRight: 8,
  },

  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.text.primary,
  },

  /* ---------- PINCODES SECTION ---------- */
  pincodesCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#F57C00',
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  pincodeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  pincodeHeaderIcon: {
    marginRight: 8,
  },

  pincodeHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },

  pincodeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },

  pincodeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 15,
    backgroundColor: '#FAFAFA',
  },

  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  addButtonText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 15,
  },

  pincodeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  pincodeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE0B2',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },

  pincodeChipText: {
    color: '#F57C00',
    fontWeight: '600',
    fontSize: 14,
  },

  /* ---------- ACTION BUTTONS (EQUAL WIDTH) ---------- */
  buttonsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
  },

  btn: {
    flex: 1, // ✅ Equal width
    borderRadius: 14,
    overflow: 'hidden',
  },

  btnCancel: {
    flex: 1, // ✅ Equal width
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnSaveGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },

  btnCancelText: {
    color: Colors.text.primary,
    fontWeight: '600',
    fontSize: 16,
  },

  btnSaveText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },

  /* ---------- LOADING STATE ---------- */
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6dbdbff',
  },

  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: Colors.text.secondary,
  },
});