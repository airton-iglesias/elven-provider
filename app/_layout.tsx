import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { TranslationProvider } from '@/contexts/TranslationContext';
import initializeI18Next from '@/utils/i18nextConfig';
import { StatusBar } from 'expo-status-bar';

SplashScreen.preventAutoHideAsync();
initializeI18Next();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <TranslationProvider>
      <StatusBar style="auto"/>
      <Stack screenOptions={{ headerShown: false }} />
    </TranslationProvider>
  );
}
