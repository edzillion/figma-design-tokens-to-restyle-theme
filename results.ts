import {
  createTheme
} from "@shopify/restyle";

type DeepPartial < T > = {
  [P in keyof T] ? : T[P] extends object ? DeepPartial < T[P] > : T[P]
};

const colors = {
  // primary brand color
  green: '#b6c65e',
  // secondary color
  blue: '#75a8b9',
  // tertiary color
  yellow: '#ffc86d',
  // black color
  black: '#3e3535',
  grey: {
    // grey color 10% tint
    ['100']: '#ECEBEB',
    // grey color 90% tint
    ['900']: '#514949',
  },
  // light color
  white: '#fafafa',
  // off white color
  offWhite: '#fbf8df',
};

const fontFamilies = {
  heading: 'Balsamiq Sans',
  body: 'Roboto',
  Kalam: 'Kalam',
  ShortStack: 'Short Stack',
  Itim: 'Itim',
};

const lineHeights = {
  body: '140%',
  auto: 'AUTO',
  none: '100%',
  tight: '110%',
};

const fontWeights = {
  heading: {
    regular: 'Regular',
    bold: 'Bold',
  },
  body: {
    regular: 'Regular',
    bold: 'Bold',
  },
};

const fontSizes = {
  sm: 16,
  lg: 20,
  xl: 25,
  ['2xl']: 31,
};

const letterSpacing = {
  normal: '0%',
  tight: '-1%',
  tighter: '-3%',
  wide: '5%',
};

const radius = {
  // large border radius
  large: '12px',
  // small button border radius
  small: '5px',
};

// standard ui element border width
const element = 1;

// standard drop shadow for ui elements
const small = {
  x: '1',
  y: '1',
  blur: '5',
  spread: '3',
  color: '#3E3535',
  type: 'dropShadow',
}

;

// standard drop shadow for ui elements
const large = {
  x: '1',
  y: '1',
  blur: '8',
  spread: '8',
  color: '#3E3535',
  type: 'dropShadow',
}

;

export const theme = createTheme({
  textVariants: {
    theme_fonts_mainHeading: {
      fontFamily: fontFamilies.heading,
      fontWeight: fontWeights.heading.regular,
      lineHeight: lineHeights.auto,
      fontSize: fontSizes.xl,
      paragraphSpacing: '0',
      letterSpacing: letterSpacing.wide,
      textDecoration: 'none',
      textCase: 'TITLE',
    },
    theme_fonts_subHeading: {
      fontFamily: fontFamilies.heading,
      fontWeight: fontWeights.heading.regular,
      lineHeight: lineHeights.auto,
      fontSize: fontSizes.lg,
      paragraphSpacing: '0',
      textDecoration: 'none',
      textCase: 'none',
    },
    theme_fonts_cardTitle: {
      fontFamily: fontFamilies.Kalam,
      fontSize: fontSizes.lg,
      lineHeight: lineHeights.auto,
      paragraphSpacing: '0',
      textDecoration: 'none',
      textCase: 'none',
    },
    theme_fonts_cardTitle2: {
      fontFamily: fontFamilies.Itim,
      fontSize: fontSizes.lg,
      lineHeight: lineHeights.auto,
      paragraphSpacing: '0',
      textDecoration: 'none',
      textCase: 'none',
    },
    theme_fonts_cardTitle3: {
      fontFamily: fontFamilies.ShortStack,
      fontSize: fontSizes.lg,
      lineHeight: lineHeights.auto,
      paragraphSpacing: '0',
      textDecoration: 'none',
      textCase: 'none',
    },
  },
  colors: {
    // default foreground color
    theme_fg_default: colors.black,
    // muted foreground color
    theme_fg_muted: colors.grey['900'],
    // default background color
    theme_bg_default: colors.white,
    // muted background color
    theme_bg_muted: colors.grey['100'],
    // highlight background color
    theme_bg_highlight: colors.offWhite,
    // primary accent color
    theme_accent_primary: colors.green,
    // secondary accent color
    theme_accent_secondary: colors.blue,
    theme_gradient_fadeUpToBG: 'linear-gradient(0deg, rgba($theme.bg.default, 0.5) 0%, rgba($theme.bg.default, 1) 100%)',
    theme_gradient_fadeDownToBG: 'linear-gradient(180deg, rgba($theme.bg.default, 0.5) 0%, rgba($theme.bg.default, 1) 100%)',
  },
  spacing: {
    "s": 8,
    "m": 16,
    "l": 24,
    "xl": 40
  },
  breakpoints: {
    "phone": 0,
    "tablet": 768
  },
});


type Theme = typeof theme;
type SubTheme = DeepPartial < Theme > ;

export const dark: SubTheme = {
  colors: {
    // default foreground color
    theme_fg_default: colors.white,
    // muted foreground color
    theme_fg_muted: colors.grey['100'],
    // default background color
    theme_bg_default: colors.black,
    // muted background color
    theme_bg_muted: colors.grey['900'],
    // primary accent color
    theme_accent_primary: colors.green,
    // secondary accent color
    theme_accent_secondary: colors.blue,
  },
};