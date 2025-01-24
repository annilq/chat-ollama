import { useConfigStore } from '@/store/useConfig';
import { StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { FAB } from 'react-native-paper';
import { useState } from 'react';

const welcome1 = require('../../assets/images/welcome/1.png')
const welcome1Dark = require('../../assets/images/welcome/1dark.png')

const welcome2 = require('../../assets/images/welcome/2.png')
const welcome2Dark = require('../../assets/images/welcome/2dark.png')

const welcome3 = require('../../assets/images/welcome/3.png')
const welcome3Dark = require('../../assets/images/welcome/3dark.png')

export default function Welcome() {
  const { config: { theme }, setConfig } = useConfigStore()
  const router = useRouter()
  const [isLastPage, setIsLastPage] = useState(false)

  const handleComplete = () => {
    setConfig({ isFirstLaunch: false })
    router.replace('/chat/new')
  }

  const handlePageSelected = (e: any) => {
    setIsLastPage(e.nativeEvent.position === 2)
  }

  const img1 = theme === "dark" ? welcome1Dark : welcome1
  const img2 = theme === "dark" ? welcome2Dark : welcome2
  const img3 = theme === "dark" ? welcome3Dark : welcome3

  return (
    <View style={styles.container}>
      <PagerView
        style={styles.container}
        initialPage={0}
        onPageSelected={handlePageSelected}
      >
        <View key="1">
          <Image
            source={img1}
            style={{ height: "100%", width: "100%" }}
          />
        </View>
        <View key="2">
          <Image
            source={img2}
            style={{ height: "100%", width: "100%" }}
          />
        </View>
        <View key="3">
          <Image
            source={img3}
            style={{ height: "100%", width: "100%" }}
          />
        </View>
      </PagerView>
      {isLastPage && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={handleComplete}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80,
  },
});
