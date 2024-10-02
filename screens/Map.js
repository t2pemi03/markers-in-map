import { View, Text, StyleSheet, SafeAreaView, Platform } from 'react-native';
import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { useState, useEffect } from "react";

export default function Map() {
   
    const [markers, setMarkers] = useState([])
    const [location, setLocation] = useState({
        latitude: 65.0800,
        longitude: 25.4800,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    })

    const markerIcon = (e) => {
        console.log('Karttaa painettu, markkeri siihen')
        const coords = e.nativeEvent.coordinate;
        
        setMarkers([...markers, coords])
        
        console.log(coords)
    }

    useEffect(() => {
        (async () => {
            await getPosition()
        })()
    }, [])

    const getPosition = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync()
        try {
            if (status !== 'granted') {
                console.log("Location permission not granted")
                return
            }
            const position = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High
            })

            setLocation({
                ...location,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            })

            console.log("Sijainti päivitetty gps mukaan:", {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <MapView
                style={styles.map}
                region={location}
                onLongPress={markerIcon} 
            >
               
                {markers.map((marker, index) => (
                    <Marker
                        key={index}
                        title={'Marker ${index + 1}'}
                        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                    />
                ))}
            </MapView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0
    },
    map: {
        flex: 1,
        width: '100%'
    }
})
