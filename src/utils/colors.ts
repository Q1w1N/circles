export const getRandomBrightColor = () => {
  // Generate random values for RGB components
  let r = Math.floor(Math.random() * 156) + 100; // Ensure value is between 100 and 255
  let g = Math.floor(Math.random() * 156) + 100; // Ensures brighter shades
  let b = Math.floor(Math.random() * 156) + 100;

  // Convert to hexadecimal and pad if necessary
  const toHex = (value: number) => value.toString(16).padStart(2, '0');

  // Combine to form a hex color string
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};
