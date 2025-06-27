import * as React from 'react';
import { useColorScheme } from 'react-native';
import { normalize } from '../hooks/useResponsiveDesign';

// Define theme types
export type ThemeMode = 'light' | 'dark' | 'system';

// Define color palette
export const palette = {
  // Primary colors
  primary: {
    100: '#E0F7FF',
    200: '#B3ECFF',
    300: '#80DFFF',
    400: '#4DD2FF',
    500: '#00C2FF', // Main primary
    600: '#009BCC',
    700: '#007499',
    800: '#004D66',
    900: '#002733',
  },
  // Secondary colors
  secondary: {
    100: '#F2E0FF',
    200: '#E0B3FF',
    300: '#C980FF',
    400: '#B24DFF',
    500: '#9D4EDD', // Main secondary
    600: '#7D3EB0',
    700: '#5D2E84',
    800: '#3E1F58',
    900: '#1E0F2C',
  },
  // Accent colors
  accent: {
    100: '#FFF2E0',
    200: '#FFE0B3',
    300: '#FFC980',
    400: '#FFB24D',
    500: '#FF9F1C', // Main accent
    600: '#CC7F16',
    700: '#995F11',
    800: '#66400B',
    900: '#332005',
  },
  // Success colors
  success: {
    100: '#E0FFE9',
    200: '#B3FFCF',
    300: '#80FFB0',
    400: '#4DFF91',
    500: '#06FFA5', // Main success
    600: '#05CC84',
    700: '#039963',
    800: '#026642',
    900: '#013321',
  },
  // Warning colors
  warning: {
    100: '#FFF8E0',
    200: '#FFEFB3',
    300: '#FFE580',
    400: '#FFDB4D',
    500: '#FFD60A', // Main warning
    600: '#CCAB08',
    700: '#998006',
    800: '#665604',
    900: '#332B02',
  },
  // Error colors
  error: {
    100: '#FFE0E9',
    200: '#FFB3CC',
    300: '#FF80AA',
    400: '#FF4D88',
    500: '#FF006E', // Main error
    600: '#CC0058',
    700: '#990042',
    800: '#66002C',
    900: '#330016',
  },
  // Neutral colors
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#0F0F23',
  },
};

// Define font sizes
export const fontSizes = {
  xs: normalize(10),
  sm: normalize(12),
  md: normalize(14),
  base: normalize(16),
  lg: normalize(18),
  xl: normalize(20),
  '2xl': normalize(24),
  '3xl': normalize(30),
  '4xl': normalize(36),
  '5xl': normalize(48),
};

// Define font weights
export const fontWeights = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
};

// Define font families
export const fontFamilies = {
  sans: {
    thin: 'Inter-Thin',
    extralight: 'Inter-ExtraLight',
    light: 'Inter-Light',
    normal: 'Inter-Regular',
    medium: 'Inter-Medium',
    semibold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
    extrabold: 'Inter-ExtraBold',
    black: 'Inter-Black',
  },
  mono: {
    normal: 'monospace',
  },
};

// Define spacing
export const spacing = {
  '0': 0,
  '0.5': normalize(2),
  '1': normalize(4),
  '2': normalize(8),
  '3': normalize(12),
  '4': normalize(16),
  '5': normalize(20),
  '6': normalize(24),
  '8': normalize(32),
  '10': normalize(40),
  '12': normalize(48),
  '16': normalize(64),
  '20': normalize(80),
  '24': normalize(96),
  '32': normalize(128),
};

// Define border radiuses
export const borderRadius = {
  none: 0,
  sm: normalize(2),
  md: normalize(6),
  lg: normalize(8),
  xl: normalize(12),
  '2xl': normalize(16),
  '3xl': normalize(24),
  full: 9999,
};

// Define shadows
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  '2xl': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
};

// Define gradients
export const gradients = {
  primary: ['#00F5FF', '#0080FF'],
  secondary: ['#9D4EDD', '#C77DFF'],
  accent: ['#FF9F1C', '#FFB14D'],
  success: ['#06FFA5', '#00D4AA'],
  warning: ['#FFD60A', '#FFE44D'],
  error: ['#FF006E', '#FF4D88'],
  dark: ['#0F0F23', '#1A1A3A', '#2D1B69'],
  darkBlue: ['#0F0F23', '#1F2937'],
  glow: ['rgba(0, 245, 255, 0.1)', 'rgba(0, 128, 255, 0.05)'],
  glass: ['rgba(31, 31, 58, 0.95)', 'rgba(45, 27, 105, 0.95)'],
};

// Define animations
export const animations = {
  fast: 200,
  normal: 300,
  slow: 500,
};

// Define zIndices
export const zIndices = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  toast: 1600,
  tooltip: 1700,
};

// Define theme interface
export interface Theme {
  mode: ThemeMode;
  colors: {
    background: {
      primary: string;
      secondary: string;
      card: string;
      input: string;
    };
    text: {
      primary: string;
      secondary: string;
      muted: string;
      inverse: string;
    };
    border: {
      default: string;
      focus: string;
    };
    button: {
      primary: {
        background: string[];
        text: string;
      };
      secondary: {
        background: string[];
        text: string;
      };
      success: {
        background: string[];
        text: string;
      };
      warning: {
        background: string[];
        text: string;
      };
      error: {
        background: string[];
        text: string;
      };
      disabled: {
        background: string[];
        text: string;
      };
    };
    status: {
      online: string;
      offline: string;
      away: string;
      busy: string;
    };
  };
  fontSizes: typeof fontSizes;
  fontWeights: typeof fontWeights;
  fontFamilies: typeof fontFamilies;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  gradients: typeof gradients;
  animations: typeof animations;
  zIndices: typeof zIndices;
}

interface ThemeContextType {
  theme: Theme;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const defaultTheme: Theme = {
  mode: 'system',
  colors: {
    background: {
      primary: palette.neutral[950],
      secondary: palette.neutral[900],
      card: palette.neutral[800],
      input: palette.neutral[700],
    },
    text: {
      primary: palette.neutral[50],
      secondary: palette.neutral[400],
      muted: palette.neutral[600],
      inverse: palette.neutral[950],
    },
    border: {
      default: palette.neutral[700],
      focus: palette.primary[500],
    },
    button: {
      primary: {
        background: gradients.primary,
        text: palette.neutral[50],
      },
      secondary: {
        background: gradients.secondary,
        text: palette.neutral[50],
      },
      success: {
        background: gradients.success,
        text: palette.neutral[50],
      },
      warning: {
        background: gradients.warning,
        text: palette.neutral[950],
      },
      error: {
        background: gradients.error,
        text: palette.neutral[50],
      },
      disabled: {
        background: [palette.neutral[700], palette.neutral[600]],
        text: palette.neutral[400],
      },
    },
    status: {
      online: palette.success[500],
      offline: palette.neutral[500],
      away: palette.warning[500],
      busy: palette.error[500],
    },
  },
  fontSizes,
  fontWeights,
  fontFamilies,
  spacing,
  borderRadius,
  shadows,
  gradients,
  animations,
  zIndices,
};

// Create context with a default value
const ThemeContext = React.createContext<ThemeContextType>({
  theme: defaultTheme,
  setThemeMode: () => {},
  toggleTheme: () => {},
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = React.useState<ThemeMode>('system');

  const getCurrentTheme = (): Theme => {
    const effectiveMode = themeMode === 'system' ? systemColorScheme || 'light' : themeMode;
    
    return {
      mode: themeMode,
      colors: {
        background: {
          primary: effectiveMode === 'dark' ? palette.neutral[950] : palette.neutral[50],
          secondary: effectiveMode === 'dark' ? palette.neutral[900] : palette.neutral[100],
          card: effectiveMode === 'dark' ? palette.neutral[800] : palette.neutral[50],
          input: effectiveMode === 'dark' ? palette.neutral[700] : palette.neutral[200],
        },
        text: {
          primary: effectiveMode === 'dark' ? palette.neutral[50] : palette.neutral[950],
          secondary: effectiveMode === 'dark' ? palette.neutral[400] : palette.neutral[600],
          muted: effectiveMode === 'dark' ? palette.neutral[600] : palette.neutral[400],
          inverse: effectiveMode === 'dark' ? palette.neutral[950] : palette.neutral[50],
        },
        border: {
          default: effectiveMode === 'dark' ? palette.neutral[700] : palette.neutral[300],
          focus: palette.primary[500],
        },
        button: {
          primary: {
            background: gradients.primary,
            text: palette.neutral[50],
          },
          secondary: {
            background: gradients.secondary,
            text: palette.neutral[50],
          },
          success: {
            background: gradients.success,
            text: palette.neutral[50],
          },
          warning: {
            background: gradients.warning,
            text: palette.neutral[950],
          },
          error: {
            background: gradients.error,
            text: palette.neutral[50],
          },
          disabled: {
            background: effectiveMode === 'dark' 
              ? [palette.neutral[700], palette.neutral[600]]
              : [palette.neutral[300], palette.neutral[200]],
            text: effectiveMode === 'dark' ? palette.neutral[400] : palette.neutral[600],
          },
        },
        status: {
          online: palette.success[500],
          offline: palette.neutral[500],
          away: palette.warning[500],
          busy: palette.error[500],
        },
      },
      fontSizes,
      fontWeights,
      fontFamilies,
      spacing,
      borderRadius,
      shadows,
      gradients,
      animations,
      zIndices,
    };
  };

  const toggleTheme = () => {
    setThemeMode((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  // Memoize the theme value to prevent unnecessary re-renders
  const value = React.useMemo(() => ({
    theme: getCurrentTheme(),
    setThemeMode,
    toggleTheme,
  }), [themeMode, systemColorScheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;