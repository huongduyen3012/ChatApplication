import Colors from './Colors';

const theme = Colors.getTheme('light');

export const {
  primary,
  secondary,
  accent,
  surface,
  text,
  textSecondary,
  background,
  border,
  success,
  warning,
  error,
  info,
} = {...theme};

export default theme;
