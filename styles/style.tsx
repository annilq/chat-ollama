import { StyleSheet } from 'react-native';

// Core spacing values (similar to Tailwind)
const spacingScale = {
  0: 0,
  0.5: 2,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
};

// Font size scale
const fontScale = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
};

// Font weights
const fontWeights = {
  thin: '100',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

// Border radius scale
const borderRadiusScale = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
  '2xl': 16,
  full: 9999,
};

// Generate spacing utilities
const createSpacingUtils = () => {
  const spacing: any = {};
  Object.entries(spacingScale).forEach(([key, value]) => {
    // Margin
    spacing[`m-${key}`] = { margin: value };
    spacing[`mx-${key}`] = { marginHorizontal: value };
    spacing[`my-${key}`] = { marginVertical: value };
    spacing[`mt-${key}`] = { marginTop: value };
    spacing[`mb-${key}`] = { marginBottom: value };
    spacing[`ml-${key}`] = { marginLeft: value };
    spacing[`mr-${key}`] = { marginRight: value };

    // Padding
    spacing[`p-${key}`] = { padding: value };
    spacing[`px-${key}`] = { paddingHorizontal: value };
    spacing[`py-${key}`] = { paddingVertical: value };
    spacing[`pt-${key}`] = { paddingTop: value };
    spacing[`pb-${key}`] = { paddingBottom: value };
    spacing[`pl-${key}`] = { paddingLeft: value };
    spacing[`pr-${key}`] = { paddingRight: value };
  });
  return spacing;
};

// Generate typography utilities
const createTypographyUtils = () => {
  const typography: any = {};

  // Font sizes
  Object.entries(fontScale).forEach(([key, value]) => {
    typography[`text-${key}`] = { fontSize: value };
  });

  // Font weights
  Object.entries(fontWeights).forEach(([key, value]) => {
    typography[`font-${key}`] = { fontWeight: value };
  });

  // Text alignment
  typography['text-left'] = { textAlign: 'left' };
  typography['text-center'] = { textAlign: 'center' };
  typography['text-right'] = { textAlign: 'right' };

  // Text decoration
  typography['underline'] = { textDecorationLine: 'underline' };
  typography['line-through'] = { textDecorationLine: 'line-through' };
  typography['no-underline'] = { textDecorationLine: 'none' };

  return typography;
};

// Generate layout utilities
const createLayoutUtils = () => {
  const layout: any = {
    'w-full': { width: '100%' },
    'h-full': { height: '100%' },
    'w-screen': { width: '100vw' },
    'h-screen': { height: '100vh' },
    'overflow-hidden': { overflow: 'hidden' },
    'overflow-visible': { overflow: 'visible' },
    'relative': { position: 'relative' },
    'absolute': { position: 'absolute' },
  };

  // Add position utilities
  ['top', 'right', 'bottom', 'left'].forEach(position => {
    Object.entries(spacingScale).forEach(([key, value]) => {
      layout[`${position}-${key}`] = { [position]: value };
    });
  });

  return layout;
};

// Generate border utilities
const createBorderUtils = () => {
  const borders: any = {};

  // Border radius
  Object.entries(borderRadiusScale).forEach(([key, value]) => {
    borders[`rounded-${key}`] = { borderRadius: value };
    borders[`rounded-t-${key}`] = {
      borderTopLeftRadius: value,
      borderTopRightRadius: value,
    };
    borders[`rounded-b-${key}`] = {
      borderBottomLeftRadius: value,
      borderBottomRightRadius: value,
    };
  });

  // Border width
  [0, 1, 2, 4, 8].forEach(width => {
    borders[`border-${width}`] = { borderWidth: width };
  });

  return borders;
};

// Generate flexbox utilities
const createFlexboxUtils = () => {
  return {
    'flex': { display: "flex" },
    'flex-1': { flex: 1 },
    'flex-row': { flexDirection: 'row' },
    'flex-col': { flexDirection: 'column' },
    'flex-wrap': { flexWrap: 'wrap' },
    'flex-nowrap': { flexWrap: 'nowrap' },
    'justify-start': { justifyContent: 'flex-start' },
    'justify-end': { justifyContent: 'flex-end' },
    'justify-center': { justifyContent: 'center' },
    'justify-between': { justifyContent: 'space-between' },
    'justify-around': { justifyContent: 'space-around' },
    'items-start': { alignItems: 'flex-start' },
    'items-end': { alignItems: 'flex-end' },
    'items-center': { alignItems: 'center' },
    'items-stretch': { alignItems: 'stretch' },
  };
};

// Combine all utilities
const styles = StyleSheet.create({
  ...createSpacingUtils(),
  ...createTypographyUtils(),
  ...createLayoutUtils(),
  ...createBorderUtils(),
  ...createFlexboxUtils(),
});

export const getStyles = (listString: string) => {
  return listString.split(" ").map(item => styles[item])
}
export default styles;