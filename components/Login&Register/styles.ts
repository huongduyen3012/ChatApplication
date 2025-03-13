import {StyleSheet} from 'react-native';
import theme from '../../constants/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  loginContainer: {
    paddingHorizontal: 25,
    paddingTop: 10,
    paddingBottom: 30,
  },
  logoContainer: {
    marginTop: 30,
    marginBottom: 20,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
  },
  headerText: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 30,
    color: theme.primary,
    textAlign: 'center',
  },
  text_header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#F8FAFD',
    alignItems: 'center',
    height: 55,
    paddingHorizontal: 15,
  },

  iconContainer: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: '100%',
    color: theme.text,
    fontSize: 16,
    paddingVertical: 10,
    paddingLeft: 10,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: theme.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 25,
    paddingBottom: 30,
  },
  inBut: {
    width: '100%',
    height: 55,
    backgroundColor: theme.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  textSign: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  loginButton: {
    backgroundColor: theme.primary,
    width: '100%',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: theme.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 25,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.border,
  },
  dividerText: {
    color: theme.textSecondary,
    paddingHorizontal: 15,
    fontSize: 14,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    height: 50,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  socialButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  registerButton: {
    backgroundColor: theme.secondary,
  },
  googleButton: {
    backgroundColor: '#DB4437',
  },
  errorText: {
    color: theme.error,
    fontSize: 12,
    marginLeft: 15,
    marginTop: -10,
    marginBottom: 10,
  },
  validationIcon: {
    marginLeft: 5,
  },
  linkTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  linkText: {
    color: theme.primary,
    fontWeight: '600',
  },
  normalText: {
    color: theme.textSecondary,
  },
  // New style for disabled button
  disabledButton: {
    backgroundColor: theme.border,
    opacity: 0.7,
  },
});

export default styles;
