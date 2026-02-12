import fs from 'fs-extra';
import path from 'path';

export async function createResponsiveFile() {
  const filePath = path.join(process.cwd(), 'src/utils/responsive-screen.ts');

  await fs.ensureDir(path.dirname(filePath));

  const content = `
import { Dimensions, PixelRatio, ScaledSize } from 'react-native';

let screenWidth: number = Dimensions.get('window').width;
let screenHeight: number = Dimensions.get('window').height;

export const widthPercentageToDP = (widthPercent: string | number): number => {
  const elemWidth = typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel(screenWidth * elemWidth / 100);
};

export const heightPercentageToDP = (heightPercent: string | number): number => {
  const elemHeight = typeof heightPercent === "number" ? heightPercent : parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel(screenHeight * elemHeight / 100);
};

type OrientationType = 'portrait' | 'landscape';

interface OrientationConfig {
  setOrientation: (orientation: OrientationType) => void;
}

export const listenOrientationChange = (config: OrientationConfig): (() => void) => {
  const updateDimensions = ({ window }: { window: ScaledSize }): void => {
    screenWidth = window.width;
    screenHeight = window.height;
    const newOrientation: OrientationType = screenWidth < screenHeight ? 'portrait' : 'landscape';
    config.setOrientation(newOrientation);
  };

  const subscription = Dimensions.addEventListener('change', updateDimensions);

  return () => {
    subscription.remove();
  };
};
`;

  await fs.writeFile(filePath, content.trim());
}