import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Alert, Text, ImageBackground, Dimensions  } from 'react-native';
import { Camera, CameraType } from 'expo-camera/legacy';
import { FlashMode } from 'expo-camera/legacy';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, FlipType } from 'expo-image-manipulator';
import Slider from '@react-native-community/slider';
import flipCameraIcon from './icons/flip_camera.png';
import FlashOnIcon from './icons/flash_icon.png';
import FlashOffIcon from './icons/flash_off.png';
import RefIcon from './icons/ref_icon.png';
import RefOffIcon from './icons/ref_off_icon.png';

export default function CameraScreen() {
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [flashMode, setFlashMode] = useState(FlashMode.off);
    const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
    const [photoUri, setPhotoUri] = useState(null);
    const [lastPhotoUri, setLastPhotoUri] = useState(null);
    const [referencePhoto, setReferencePhoto] = useState(null);
    const [isFrontCamera, setIsFrontCamera] = useState(type === CameraType.front);
    const [opacity, setOpacity] = useState(0.3); // Додаємо стан для прозорості
    const cameraRef = useRef(null);
    const { width, height } = Dimensions.get('window');

    useEffect(() => {
        const getPermissionsAndAssets = async () => {
            if (!permission?.granted) {
                const newPermission = await requestPermission();
                if (!newPermission.granted) return;
            }

            if (!mediaLibraryPermission?.granted) {
                const newMediaPermission = await requestMediaLibraryPermission();
                if (!newMediaPermission.granted) return;
            }

            const media = await MediaLibrary.getAssetsAsync({
                sortBy: MediaLibrary.SortBy.creationTime,
                mediaType: 'photo',
                first: 1,
            });

            if (media.assets.length > 0) {
                const lastAsset = media.assets[0];
                
                if (lastAsset.uri.startsWith('ph://')) {
                    const assetInfo = await MediaLibrary.getAssetInfoAsync(lastAsset.id);
                    setLastPhotoUri(assetInfo.localUri);
                } else {
                    setLastPhotoUri(lastAsset.uri);
                }
            }
        };

        getPermissionsAndAssets();
    }, [permission, mediaLibraryPermission]);

    useEffect(() => {
        setIsFrontCamera(type === CameraType.front);
    }, [type]);

    if (!permission?.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
                    <Text style={styles.permissionButtonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!mediaLibraryPermission?.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>We need your permission to access media library</Text>
                <TouchableOpacity onPress={requestMediaLibraryPermission} style={styles.permissionButton}>
                    <Text style={styles.permissionButtonText}>Grant Media Library Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            let photo = await cameraRef.current.takePictureAsync();

            if (type === CameraType.front) {
                const manipulatedImage = await manipulateAsync(
                    photo.uri,
                    [{ flip: FlipType.Horizontal }]
                );
                setPhotoUri(manipulatedImage.uri);
                await MediaLibrary.saveToLibraryAsync(manipulatedImage.uri);
            } else {
                setPhotoUri(photo.uri);
                await MediaLibrary.saveToLibraryAsync(photo.uri);
            }

            setLastPhotoUri(photo.uri);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets) {
            const asset = result.assets[0];
            
            if (asset.uri.startsWith('ph://')) {
                const assetInfo = await MediaLibrary.getAssetInfoAsync(asset.uri);
                setReferencePhoto(assetInfo.localUri);
            } else {
                setReferencePhoto(asset.uri);
            }
        }
    };

    


    const clearReferencePhoto = () => {
        setReferencePhoto(null);
    };

    const openGallery = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });

        // if (!result.canceled && result.assets) {
        //     Alert.alert('Selected Image', 'Image URI: ' + result.assets[0].uri);
        // }
    };

    function toggleCameraType() {
        setType((current) => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    function toggleFlash() {
        setFlashMode((prevFlashMode) =>
            prevFlashMode === FlashMode.off ? FlashMode.on : FlashMode.off
        );
    }

    return (
        <View style={styles.container}>
            <Camera
                style={{ width, height }}
                type={type}
                ref={cameraRef}
                flashMode={flashMode}
                //ratio="16:9"
            >
                
<View style={styles.overlayContainer}>
        {referencePhoto ? (
            <Image
                source={{ uri: referencePhoto }}
                style={[
                    { width, height, opacity: opacity },
                ]}
                resizeMode="contain"
            />
        ) : (
            <Text style={styles.overlayText}>Select an image as reference</Text>
        )}
    </View>
                <View style={styles.header} />
                <View style={styles.topControls}>
                    <TouchableOpacity onPress={toggleCameraType} style={styles.iconButton}>
                        <Image source={flipCameraIcon} style={styles.iconImage} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleFlash} style={styles.iconButton}>
                        <Image source={flashMode === FlashMode.off ? FlashOffIcon : FlashOnIcon} style={styles.iconImage} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={clearReferencePhoto} style={styles.iconButton}>
                        <Image source={RefOffIcon} style={styles.iconImage} />
                    </TouchableOpacity>
                </View>
                <View style={styles.bottomControlsContainer}>
                    <View style={styles.bottomControls}>
                        <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
                            <Image source={RefIcon} style={styles.iconImage} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
                            <View style={styles.captureCircle} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={openGallery} style={styles.iconButton}>
                            {lastPhotoUri ? (
                                <Image source={{ uri: lastPhotoUri }} style={styles.galleryImage} />
                            ) : (
                                <Text style={styles.iconPlaceholder}>Gallery</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                    {referencePhoto && (
                        <View style={styles.sliderContainer}>
                            <Text style={styles.sliderLabel}>Opacity</Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={1}
                                value={opacity}
                                onValueChange={setOpacity}
                            />
                        </View>
                    )}
                    <View style={styles.footer} />
                </View>
            </Camera>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
},

    overlayImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
},

    overlayText: {
        fontSize: 18,
        color: 'transparent',
        padding: 10,
        borderRadius: 5,
    },
    header: {
        top: 0,
        left: 0,
        right: 0,
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        height: 100,
    }, 
    topControls: {
        position: 'absolute',
        top: 100,
        left: 10,
        right: 10,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    bottomControlsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 220,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    footer: {
        ...StyleSheet.absoluteFillObject, // Зробити фон абсолютним в межах контейнера
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Напівпрозорий фон
        zIndex: -1,
    },
    bottomControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        width: '100%',
        position: 'absolute', // Позиціонування кнопок поверх фону
        bottom: 120,
    },
    iconButton: {
        padding: 10,
    },
    captureButton: {
        alignSelf: 'center',
    },
    captureCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'white',
        borderWidth: 5,
        borderColor: 'gray',
    },
    galleryImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
    },
    previewImage: {
        width: 100,
        height: 100,
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    iconPlaceholder: {
        fontSize: 12,
        color: 'white',
    },
    iconImage: {
        width: 40,
        height: 40,
    },
    permissionButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
    },
    permissionButtonText: {
        color: 'white',
        textAlign: 'center',
    },
    sliderContainer: {
        width: '100%',
        padding: 10,
        alignItems: 'center',
        bottom: 100,
    },
    sliderLabel: {
        color: 'white',
        marginBottom: 5,
    },
    slider: {
        width: '80%',
    },
});




