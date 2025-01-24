// app/index.tsx
import { Redirect } from 'expo-router'
import { useConfigStore } from '@/store/useConfig'
import { View } from 'react-native'

export default function Index() {
  const { config: { isFirstLaunch }, isHydrated } = useConfigStore()

  if (!isHydrated) {
    return <View />
  }

  if (isFirstLaunch) {
    return <Redirect href="/welcome" />
  }

  return <Redirect href="/chat/new" />
}