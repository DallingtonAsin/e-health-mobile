import React, { useEffect } from 'react'
import { PermissionsAndroid, Platform } from 'react-native'

const requestAudioPermission = async () => {
    try {
        const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        if (
            granted['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED) {
            console.log(`You can use the mic`)
        } else {
            console.log(`Permission denied`)
        }
    } catch (err) {
        console.warn(err)
    }
}

const useRequestAudioHook = () => {
    useEffect(() => {
        if (Platform.OS === 'android') {
            requestAudioPermission().then(() => {
                console.log(`Audio permission requested!`)
            })
        }
    }, [])
}

export { requestAudioPermission, useRequestAudioHook }