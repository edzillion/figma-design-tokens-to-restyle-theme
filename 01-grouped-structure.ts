import {
  createTheme
} from "@shopify/restyle";

type DeepPartial < T > = {
  [P in keyof T] ? : T[P] extends object ? DeepPartial < T[P] > : T[P]
};

const brand = {
  palette: {
    charcoal: '#212529',
    gold: '#f59f00',
    ['cornflower-blue']: '#339af0',
  },
  typeface: {
    primary: 'Helvetica Neue',
    secondary: 'Inter',
  },
};

const text_size = {
  scale: {
    ['0']: '1rem',
    ['1']: '1.25rem',
    ['2']: '1.563rem',
    ['3']: '1.953rem',
  },
};

text_size['title'] = text_size.scale['3'];

text_size['heading'] = text_size.scale['2'];

text_size['body-copy'] = text_size.scale['0'];

const color = {
  text: brand.palette.charcoal,
  accent: brand.palette.gold,
};

const text_style = {
  heading: {
    size: text_size['heading'],
    color: color.text,
    font: brand.typeface.primary,
    weight: 700,
    ['line-height']: 1.2,
  },
  paragraph: {
    size: text_size['body-copy'],
    color: color.text,
    font: brand.typeface.secondary,
    weight: 400,
    ['line-height']: 1.5,
  },
};