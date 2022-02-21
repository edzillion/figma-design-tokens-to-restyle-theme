import { createTheme } from "@shopify/restyle";

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

const global = {
  ["600"]: 0.6,
  colors: {
    green: {
      // primary brand color
      light: "#b6c65e",
      // dark brand color
      dark: "#b6c600",
    },
    // secondary color
    blue: "#75a8b9",
    // tertiary color
    yellow: "#ffc86d",
    // black color
    black: "#3e3535",
    grey: {
      // grey color 10% tint
      ["100"]: "#ECEBEB",
      // grey color 90% tint
      ["900"]: "#514949",
    },
    // light color
    white: "#fafafa",
    // off white color
    offWhite: "#fbf8df",
  },
  fontFamilies: {
    heading: "Balsamiq Sans",
    body: "Roboto",
    Kalam: "Kalam",
    ShortStack: "Short Stack",
    Itim: "Itim",
  },
  lineHeights: {
    body: "140%",
    auto: "AUTO",
    none: "100%",
    tight: "110%",
  },
  fontWeights: {
    heading: {
      regular: "Regular",
      bold: "Bold",
    },
    body: {
      regular: "Regular",
      bold: "Bold",
    },
  },
  fontSizes: {
    sm: 16,
    lg: 20,
    xl: 25,
    ["2xl"]: 31,
  },
  letterSpacing: {
    normal: "0%",
    tight: "-1%",
    tighter: "-3%",
    wide: "5%",
  },
  radius: {
    // large border radius
    large: "12px",
    // small button border radius
    small: "5px",
  },
  // standard ui element border width
  element: 1,
  // standard drop shadow for ui elements
  small: {
    x: "1",
    y: "1",
    blur: "5",
    spread: "3",
    color: "#3E3535",
    type: "dropShadow",
  },
  // standard drop shadow for ui elements
  large: {
    x: "1",
    y: "1",
    blur: "8",
    spread: "8",
    color: "#3E3535",
    type: "dropShadow",
  },
};

const fonts = {
  mainHeading: {
    fontFamily: global.fontFamilies.heading,
    fontWeight: global.fontWeights.heading.regular,
    lineHeight: global.lineHeights.auto,
    fontSize: global.fontSizes.xl,
    paragraphSpacing: "0",
    letterSpacing: global.letterSpacing.wide,
    textDecoration: "none",
    textCase: "TITLE",
  },
  subHeading: {
    fontFamily: global.fontFamilies.heading,
    fontWeight: global.fontWeights.heading.regular,
    lineHeight: global.lineHeights.auto,
    fontSize: global.fontSizes.lg,
    paragraphSpacing: "0",
    textDecoration: "none",
    textCase: "none",
  },
  cardTitle: {
    fontFamily: global.fontFamilies.Kalam,
    fontSize: global.fontSizes.lg,
    lineHeight: global.lineHeights.auto,
    paragraphSpacing: "0",
    textDecoration: "none",
    textCase: "none",
  },
  cardTitle2: {
    fontFamily: global.fontFamilies.Itim,
    fontSize: global.fontSizes.lg,
    lineHeight: global.lineHeights.auto,
    paragraphSpacing: "0",
    textDecoration: "none",
    textCase: "none",
  },
  cardTitle3: {
    fontFamily: global.fontFamilies.ShortStack,
    fontSize: global.fontSizes.lg,
    lineHeight: global.lineHeights.auto,
    paragraphSpacing: "0",
    textDecoration: "none",
    textCase: "none",
  },
};

export const theme = createTheme({
  colors: {
    // default foreground color
    theme_fg_default: global.colors.black,
    // muted foreground color
    theme_fg_muted: global.colors.grey["900"],
    // default background color
    theme_bg_default: global.colors.white,
    // muted background color
    theme_bg_muted: global.colors.grey["100"],
    // highlight background color
    theme_bg_highlight: global.colors.offWhite,
    // primary accent color
    theme_accent_primary: global.colors.green.light,
    // secondary accent color
    theme_accent_secondary: global.colors.blue,
    theme_gradient_fadeUpToBG:
      "linear-gradient(0deg, rgba($theme.bg.default, 0.5) 0%, rgba($theme.bg.default, 1) 100%)",
    theme_gradient_fadeDownToBG:
      "linear-gradient(180deg, rgba($theme.bg.default, 0.5) 0%, rgba($theme.bg.default, 1) 100%)",
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
  textVariants: {
    header: {
      fontFamily: "Short+Stack",
      fontSize: 34,
      lineHeight: 42.5,
      color: "black",
    },
  },
});

type Theme = typeof theme;
type SubTheme = DeepPartial<Theme>;

export const dark: SubTheme = {
  colors: {
    // default foreground color
    theme_fg_default: global.colors.white,
    // muted foreground color
    theme_fg_muted: global.colors.grey["100"],
    // default background color
    theme_bg_default: global.colors.black,
    // muted background color
    theme_bg_muted: global.colors.grey["900"],
    // primary accent color
    theme_accent_primary: global.colors.green.dark,
    // secondary accent color
    theme_accent_secondary: global.colors.blue,
  },
};
