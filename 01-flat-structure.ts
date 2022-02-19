import { createTheme } from "@shopify/restyle";

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

const brand_palette_charcoal = "#212529";

const brand_palette_gold = "#f59f00";

const brand_palette_cornflower_blue = "#339af0";

const brand_typeface_primary = "Helvetica Neue";

const brand_typeface_secondary = "Inter";

const text_size_scale_0 = "1rem";

const text_size_scale_1 = "1.25rem";

const text_size_scale_2 = "1.563rem";

const text_size_scale_3 = "1.953rem";

const text_size_title = text_size_scale_3;

const text_size_heading = text_size_scale_2;

const text_size_body_copy = text_size_scale_0;

const color_text = brand_palette_charcoal;

const color_accent = brand_palette_gold;

const text_style_heading_size = text_size_heading;

const text_style_heading_color = color_text;

const text_style_heading_font = brand_typeface_primary;

const text_style_heading_weight = 700;

const text_style_heading_line_height = 1.2;

const text_style_paragraph_size = text_size_body_copy;

const text_style_paragraph_color = color_text;

const text_style_paragraph_font = brand_typeface_secondary;

const text_style_paragraph_weight = 400;

const text_style_paragraph_line_height = 1.5;
