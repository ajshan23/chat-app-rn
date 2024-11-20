import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import api from '../../api/axios';
import ImageCropPicker from 'react-native-image-crop-picker';
import { useDispatch } from 'react-redux';
import { updateProfilePic } from '../../redux/slice/profileSlice';
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');
const edit = require('../../assets/tools/edit.png');
const leftArrow = require('../../assets/navigation/leftArrow.png');

const ProfilePage = () => {
    const [name, setName] = useState('John Doe'); // Default name
    const [bio, setBio] = useState('This is a default bio.'); // Default bio
    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    useEffect(() => {
        fetchProfile();
    }, [])
    const handleImagePicker = () => {
        ImagePicker.launchImageLibrary({ mediaType: 'photo' }, async (response) => {
            if (!response.didCancel && !response.error) {
                try {
                    const croppedImage = await ImageCropPicker.openCropper({
                        path: response.assets[0].uri,
                        width: 300,
                        height: 300,
                        cropping: true,
                        cropperCircleOverlay: true,
                    });

                    const formData = new FormData();
                    formData.append('profilepic', {
                        uri: croppedImage.path,
                        type: croppedImage.mime,
                        name: `profile_${Date.now()}.jpg`,
                    });

                    const apiResponse = await api.post('/profile/profile-pic', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    // Handle different status codes
                    if (apiResponse.status === 200) {
                        setProfileImage(croppedImage.path);
                        dispatch(updateProfilePic(apiResponse.data?.profilePic))
                        Toast.show({ type: 'success', text1: 'Profile Updated' });
                    } else if (apiResponse.status === 400) {
                        Toast.show({ type: 'error', text1: 'Upload Failed', text2: 'Invalid request data.' });
                    } else if (apiResponse.status === 404) {
                        Toast.show({ type: 'error', text1: 'User Not Found', text2: 'Please try again.' });
                    } else if (apiResponse.status === 500) {
                        Toast.show({ type: 'error', text1: 'Server Error', text2: 'Please try again later.' });
                    } else {
                        Toast.show({ type: 'error', text1: 'Unexpected Error', text2: 'Something went wrong.' });
                    }
                } catch (cropError) {
                    Toast.show({ type: 'error', text1: 'Crop Failed', text2: 'Please try again.' });
                }
            } else if (response.error) {
                Toast.show({ type: 'error', text1: 'Image Upload Failed', text2: 'Please try again.' });
            }
        });
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            const response = await api.post("/profile/update", {
                bio: bio,
                userName: name,
            });
            if (response.status === 200) {
                Toast.show({ type: 'success', text1: 'Profile Updated' });
            }

            setIsEditing(false); // Exit editing mode after saving
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to update profile. Try again.' });
            console.log(error);

        } finally {
            setLoading(false);
        }
    };
    const fetchProfile = async () => {
        try {
            const response = await api.get("/profile");

            setProfileImage(response?.data?.user?.profilePicture);
            setName(response?.data?.user?.userName);
            setBio(response?.data?.user?.bio);
        } catch (error) {
            console.log(error);

        }
    }

    return (
        <View style={styles.background}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: "absolute", left: 20, top: 50 }} >
                <Image
                    source={leftArrow}
                    style={{ width: 24, height: 19 }} // Set width and height here
                />
            </TouchableOpacity>
            <Text style={styles.headerText}>Profile</Text>

            {/* Profile Image Section */}
            <View style={styles.imageContainer}>
                {profileImage ? (
                    <TouchableOpacity onPress={handleImagePicker} style={styles.imageWrapper}>
                        <Image source={{ uri: profileImage }} style={styles.profileImage} />
                        <View style={styles.editOverlay}>
                            <Image source={edit} style={{ width: 15, height: 16 }} />
                        </View>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={handleImagePicker} style={styles.placeholderContainer}>
                        <Text style={styles.placeholderText}>Add Photo</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Name Display and Edit */}
            <View style={styles.inputContainer}>
                <Text style={styles.labelText}>Name</Text>
                <TextInput
                    style={{
                        borderBottomColor: isEditing ? 'green' : '#CDD1D0',
                        borderBottomWidth: 1,
                        color: 'black',
                        paddingVertical: 5,
                    }}
                    value={name}
                    onChangeText={setName}
                    editable={isEditing}
                    placeholder="Enter your name"
                    placeholderTextColor="#CDD1D0"
                />
            </View>

            {/* Bio Display and Edit */}
            <View style={styles.inputContainer}>
                <Text style={styles.labelText}>Bio</Text>
                <TextInput
                    style={{
                        borderBottomColor: isEditing ? 'green' : '#CDD1D0',
                        borderBottomWidth: 1,
                        color: 'black',
                        paddingVertical: 5,
                    }}
                    value={bio}
                    onChangeText={setBio}
                    editable={isEditing}
                    placeholder="Describe yourself"
                    placeholderTextColor="#CDD1D0"
                    multiline
                />
            </View>

            {/* Edit and Save Buttons */}
            {isEditing ? (
                <TouchableOpacity style={styles.button} onPress={handleSaveProfile} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text style={styles.buttonText}>Save Profile</Text>
                    )}
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.button} onPress={() => setIsEditing(true)}>
                    <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        padding: 30,
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        width: width,
        height: height,
        position: "relative"
    },
    headerText: {
        color: '#24786D',
        fontWeight: '800',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 40,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    imageWrapper: {
        position: 'relative',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    editOverlay: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#24786D',
        borderRadius: 50,
        padding: 6
    },
    // editText: {
    //     color: 'white',
    //     fontSize: 12,
    //     fontWeight: 'bold',
    // },
    placeholderContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#CDD1D0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    inputContainer: {
        marginBottom: 20,
    },
    labelText: {
        color: '#24786D',
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#24786D',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
    },
});

export default ProfilePage;
