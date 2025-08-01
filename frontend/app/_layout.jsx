import React from 'react';
import { Slot } from "expo-router";
import SafeScreen from "@/components/safeScreen";

export default function Layout() {

  return (
    <SafeScreen>
      <Slot />
    </SafeScreen>
  );
}
