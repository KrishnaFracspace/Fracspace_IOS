import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const RESOLUTIONS = ['360p', '480p', '720p', '1080p', '2160p'];

export default function LiveStream({ route, navigation }) {
  const { liveStreamUrl } = route.params;
   // const liveStreamUrl = "https://stream.mux.com/lI9H02OxQB1P2SQvX1E1QGPgFJFJ700u1aatZYtgCW2U4.m3u8"
console.log(liveStreamUrl,"====live======")
  const videoRef = useRef(null);
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isLandscape = width > height;

  const [paused, setPaused] = useState(false);
  const [quality, setQuality] = useState('720p');
  const [showQualityModal, setShowQualityModal] = useState(false);

  const streamUrl = `${liveStreamUrl}?max_resolution=${quality}`;

  useEffect(() => {
    Orientation.unlockAllOrientations();
    return () => Orientation.lockToPortrait();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden />

   {/* 🔝 HEADER */}
        <View
          style={[
            styles.header,
            { paddingTop: insets.top +1}
          ]}
          pointerEvents="auto"
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.title}>Live Stream</Text>

          <View style={{ width: 28 }} />
        </View>

      {/* 🎥 VIDEO LAYER */}
      <View style={styles.videoWrapper}>
        <Video
          ref={videoRef}
          key={streamUrl}
          source={{ uri: streamUrl }}
          style={StyleSheet.absoluteFill}
          resizeMode="contain"
          controls
          paused={paused}
        />
      </View>

      {/* 🎛 OVERLAY CONTROLS */}
      <View style={styles.overlay} pointerEvents="box-none">

     

        {/* 🔘 ACTION BUTTONS */}
        <View
          style={[
            styles.actionRow,
            {
              top: insets.top + 54,
              right: isLandscape ? 40 : 16,
            },
          ]}
          pointerEvents="auto"
        >
          <TouchableOpacity
            style={styles.pill}
            onPress={() => setShowQualityModal(true)}
          >
            <Text style={styles.pillText}>{quality}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pill, { marginLeft: 10 }]}
            onPress={() =>
              isLandscape
                ? Orientation.lockToPortrait()
                : Orientation.lockToLandscape()
            }
          >
            <Icon name="phone-portrait-outline" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 📱 QUALITY BOTTOM SHEET */}
      <Modal
        visible={showQualityModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowQualityModal(false)}
      >
        <View style={styles.sheetOverlay}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setShowQualityModal(false)}
          />

          <View
            style={[
              styles.sheetContainer,
              { paddingBottom: insets.bottom + 10 },
            ]}
          >
            <View style={styles.handle} />

            <Text style={styles.sheetTitle}>Video Quality</Text>

            {RESOLUTIONS.map((res) => (
              <TouchableOpacity
                key={res}
                style={styles.sheetOption}
                onPress={() => {
                  setQuality(res);
                  setShowQualityModal(false);
                }}
              >
                <Text
                  style={[
                    styles.sheetText,
                    quality === res && styles.activeSheetText,
                  ]}
                >
                  {res}
                </Text>

                {quality === res && (
                  <Icon name="checkmark" size={18} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  videoWrapper: {
    flex: 1,
    backgroundColor: '#000',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },

  header: {
   // position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },

  actionRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:20
  },

  pill: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
  },

  pillText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },

  /* Bottom Sheet */

  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },

  sheetContainer: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 12,
    paddingHorizontal: 20,
  },

  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#555',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },

  sheetTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },

  sheetOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },

  sheetText: {
    fontSize: 16,
    color: '#ccc',
  },

  activeSheetText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
