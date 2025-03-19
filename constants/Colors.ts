const primaryColor = '#24786D';    // Richer purple (slightly updated from your #24786D)
const secondaryColor = '#5B8DEF';  // Soft blue (replacing #6C63FF)
const accentColor = '#FF6B6B';     // Coral red (slightly updated from #FF6584)

const tintColorLight = primaryColor;
const backgroundLight = '#F8FAFD';  // Slightly cooler white background
const surfaceLight = '#FFFFFF';     // Pure white for cards
const textPrimaryLight = '#2D3748'; // Dark slate for better readability
const textSecondaryLight = '#718096'; // Medium slate for secondary text
const borderLight = '#E2E8F0';     // Soft gray for borders

// Dark mode colors (commented out but updated for future use)
// const tintColorDark = '#9F7AEA';    // Lavender for dark mode
// const backgroundDark = '#171923';   // Nearly black
// const surfaceDark = '#2D3748';      // Dark slate surface
// const textPrimaryDark = '#F7FAFC';  // Off-white text
// const textSecondaryDark = '#CBD5E0'; // Light gray text
// const borderDark = '#4A5568';       // Dark gray borders

const successColor = '#48BB78';   // Fresh green
const warningColor = '#F6AD55';   // Soft orange
const errorColor = '#F56565';     // Soft red
const infoColor = '#4299E1';      // Sky blue

export default {
  light: {
    text: textPrimaryLight,
    background: backgroundLight,
    tint: tintColorLight,
    tabIconDefault: '#A0AEC0',
    tabIconSelected: tintColorLight,

    primary: primaryColor,
    secondary: secondaryColor,
    accent: accentColor,
    surface: surfaceLight,
    textSecondary: textSecondaryLight,
    border: borderLight,

    messageBubbles: {
      sent: '#EBF4FF',      // Very light blue for sent messages
      received: '#F0F5FF',  // Very light indigo for received messages
      system: '#F7FAFC',    // Very light gray for system messages
    },
  },
  
  // Keeping dark mode commented as in your original file
  // dark: {
  //   text: textPrimaryDark,
  //   background: backgroundDark,
  //   tint: tintColorDark,
  //   tabIconDefault: '#718096',
  //   tabIconSelected: tintColorDark,
  //   
  //   primary: '#9F7AEA',      // Lavender purple for dark mode
  //   secondary: '#76E4F7',    // Bright cyan for dark mode
  //   accent: '#FC8181',       // Salmon accent for dark mode
  //   surface: surfaceDark,
  //   textSecondary: textSecondaryDark,
  //   border: borderDark,
  //   
  //   messageBubbles: {
  //     sent: '#553C9A',       // Deep purple for sent messages
  //     received: '#2C5282',   // Deep blue for received messages
  //     system: '#2D3748',     // Dark slate for system messages
  //   },
  // },

  common: {
    success: successColor,
    warning: warningColor,
    error: errorColor,
    info: infoColor,

    gradients: {
      primary: ['#5D3FD3', '#5B8DEF'],  // Purple to blue gradient
      accent: ['#FF6B6B', '#FFAA85'],   // Coral to peach gradient
      card: ['#F0F9FF', '#F8FAFD'],     // Subtle gradient for cards
    },

    opacity: {
      light: 0.7,
      medium: 0.5,
      dim: 0.3,
    },
  },

  getTheme: function (_colorScheme: 'light' | 'dark' = 'light') {
    return {...this.light, ...this.common};
  },
};
