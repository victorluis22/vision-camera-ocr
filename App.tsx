import 'react-native-reanimated'
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';
import { Camera } from 'react-native-vision-camera';
import { useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import { scanOCR } from 'vision-camera-ocr';
import { runOnJS } from 'react-native-reanimated';


async function getPermissions() {
  const newCameraPermission = await Camera.requestCameraPermission()
  const newMicrophonePermission = await Camera.requestMicrophonePermission()

  return [newCameraPermission, newMicrophonePermission]
}

function App(): JSX.Element {

  const [text, setText] = useState('')
  

  useEffect(() => {
    (async () => {
      const [cameraPermission, microphonePermission] = await getPermissions()
    })();
  }, [])
  
  const devices = useCameraDevices()
  const device = devices.back || null

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    const scannedOcr = scanOCR(frame);

    runOnJS(setText)(scannedOcr.result.text)

    console.log(scannedOcr)
  }, []);
  

  if(device === null) return <View>{null}</View>
  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
      />
      <Text style={styles.text}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    width: '100%',
    textAlign: 'center',
    backgroundColor: '#c2c2c2',
    padding: 10,
    color: '#000'
  }
});

export default App;
