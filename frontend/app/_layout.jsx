import React, { useState } from 'react';
import { Slot } from "expo-router";
import SafeScreen from "@/components/safeScreen";
import * as SplashScreen from 'expo-splash-screen';
import CustomSplashScreen from '../components/CustomSplashScreen';

export default function Layout() {
  SplashScreen.preventAutoHideAsync();

  const [isSplashFinished, setSplashFinished] = useState(false);

  if (!isSplashFinished) {
    return <CustomSplashScreen onFinish={() => setSplashFinished(true)} duration={2000} />;
  } else {
    return (
      <SafeScreen>
        <Slot />
      </SafeScreen>
    );
  }
}
