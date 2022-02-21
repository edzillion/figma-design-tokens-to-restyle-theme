import type { ShadowTokenSingleValue, TypographyObject } from "./propertyTypes";

export interface TokenProps {
  values: {
    [key: string]: SingleTokenObject[] | TokenObject;
  };
  updatedAt?: string;
  version?: string;
}

export type SingleToken = TokenGroup;

export type NewTokenObject = {
  name: string;
  value:
    | string
    | TypographyObject
    | ShadowTokenSingleValue[]
    | ShadowTokenSingleValue
    | number;
  type: TokenType | string | "undefined";
  description?: string;
};

type SingleTokenObjectCommonProperties = {
  name?: string;
  description?: string;
};

export type SingleTokenObject =
  | (SingleTokenObjectCommonProperties & {
      type: "boxShadow";
      value: ShadowTokenSingleValue[] | ShadowTokenSingleValue;
    })
  | (SingleTokenObjectCommonProperties & {
      type: "typography";
      value: TypographyObject;
    })
  | (SingleTokenObjectCommonProperties & {
      type: TokenType;
      value: string | number;
    });

export type TokenGroup = TokenGroupType & {
  [key: string]: SingleToken;
};

export interface TokenGroupType {
  type?: TokenType;
}

export type TokenArrayGroup = SingleTokenObject[];

export interface Tokens {
  [key: string]: TokenObject;
}

export interface TokenObject {
  values: TokenArrayGroup;
  type: "array" | "object";
}

export const tokenTypes = [
  "font",
  "dimension",
  "color",
  "implicit",
  "borderRadius",
  "sizing",
  "spacing",
  "text",
  "typography",
  "opacity",
  "borderWidth",
  "boxShadow",
  "fontFamilies",
  "fontWeights",
  "lineHeights",
  "fontSizes",
  "letterSpacing",
  "paragraphSpacing",
  "textDecoration",
  "textCase",
] as const;

export type TokenType = typeof tokenTypes[number];

export function isTokenType(key: string): key is TokenType {
  return exports.tokenTypes.includes(key as TokenType);
}

export const compositeTokenTypes = [
  "typography",
  "border",
  "gradient",
  "boxShadow",
  "transition",
];

export type CompositeTokenType = typeof tokenTypes[number];

export function isCompositeTokenType(key: string): key is CompositeTokenType {
  return exports.compositeTokenTypes.includes(key as CompositeTokenType);
}

export interface SelectionGroup {
  category: TokenType;
  type: SelectionValue;
  value: string;
  nodes: string[];
}

export interface SelectionValue {
  values?: string;
  sizing?: string;
  height?: string;
  width?: string;
  spacing?: string;
  verticalPadding?: string;
  horizontalPadding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  itemSpacing?: string;
  fill?: string;
  border?: string;
  borderRadius?: string;
  borderRadiusTopLeft?: string;
  borderRadiusTopRight?: string;
  borderRadiusBottomRight?: string;
  borderRadiusBottomLeft?: string;
  borderWidth?: string;
  boxShadow?: string;
  opacity?: string;
  fontFamilies?: string;
  fontWeights?: string;
  fontSizes?: string;
  lineHeights?: string;
  typography?: string;
  letterSpacing?: string;
  paragraphSpacing?: string;
  tokenValue?: string;
  value?: string;
  tokenName?: string;
  description?: string;
}

export type PullStyleTypes = {
  textStyles?: boolean;
  colorStyles?: boolean;
  effectStyles?: boolean;
};

export interface TokenEntry {
  path: string[];
  token: SingleTokenObject;
}

export interface GroupTokenEntry {
  path: string[];
  tokenEntries: [TokenEntry];
}
