
import React, { useLayoutEffect, useState } from 'react';
import OtpInputs from 'react-native-otp-inputs';
import { Dimensions, Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { base_url } from '../../conf/Constant';

const { width, height } = Dimensions.get('window');
const leftArrow = require('../../assets/navigation/leftArrow.png');
const VerificationScreen = ({ route }) => {
    const { response: user } = route.params;
    const navigation = useNavigation();
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false)
    const userId = user?._id; // Replace with the actual userId as necessary
    useLayoutEffect(() => {
        if (!userId) {
            navigation.navigate("Default");
        }
    }, [])
    const handleSubmit = async () => {
        console.log('Submitted OTP:', otp);
        setLoading(true);

        try {
            // API call to verify OTP
            const response = await axios.post(`${base_url}/api/auth/verify`, {
                userId,
                otp,
            });
            console.log('Verification response:', response.data);

            // Handle successful response
            if (response.status === 200) {
                // If verification is successful
                Toast.show({
                    type: 'success',
                    text1: 'Verification Successful',
                    text2: 'Login to continue',
                });
                navigation.replace('Login');
            }
        } catch (error) {
            

            // Handle specific status codes
            if (error.response) {
                // The request was made, and the server responded with a status code
                switch (error.response.status) {
                    case 400:
                        // Bad request (could be invalid or expired OTP)
                        Toast.show({
                            type: 'error',
                            text1: 'Verification Failed',
                            text2: 'Invalid or expired OTP.',
                        });
                        break;
                    case 500:
                        // Internal server error
                        Toast.show({
                            type: 'error',
                            text1: 'Server Error',
                            text2: 'Please try again later.',
                        });
                        break;
                    default:
                        // Any other status codes
                        Toast.show({
                            type: 'error',
                            text1: 'Unexpected Error',
                            text2: 'Something went wrong. Please try again.',
                        });
                        break;
                }
            } else {
                // Handle other errors (e.g., network errors)
                Toast.show({
                    type: 'error',
                    text1: 'Verification Failed',
                    text2: 'Please check your network and try again.',
                });
             
            }
        } finally {
            setLoading(false);
        }
    };



    const handlePress = () => {
        navigation.navigate("Home")
    }

    return (
        <View style={styles.background}>
            <View style={{}}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 20 }}>

                </View>
            </View>
            <View style={{ flexDirection: "column", flex: 1, paddingTop: 30, justifyContent: "space-between" }}>
                <View style={{ justifyContent: "center", gap: 20 }}>
                    <Text style={{ color: "black", fontWeight: "800", fontSize: 18, textAlign: "center" }}>Verify Account</Text>
                    <Text style={{ color: "#797C7B", textAlign: "center" }}>We have sent you verification code to your mail .Verify it's you</Text>

                    <View style={{ top: 20 }}>

                        <View style={styles.container}>

                            <OtpInputs
                                handleChange={code => setOtp(code)}
                                numberOfInputs={4}
                                inputContainerStyles={styles.inputContainer} // Styles for the input containers
                                inputStyles={styles.input} // Styles for each individual input
                            />
                        </View>
                    </View>
                </View>
                <View style={{ gap: 10 }}>
                    <View style={styles.signUpButton}>
                        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (<Text style={styles.buttonText}>Verify</Text>)}
                        </TouchableOpacity>
                    </View>
                    {/* Login Prompt */}
                    <View style={{ flexDirection: "row", justifyContent: "center" }}>
                        <Text style={{ color: "#24786D", fontWeight: "600" }}>Didnt get the mail? </Text>
                    </View>
                </View>
            </View>
        </View>

    );
};

export default VerificationScreen;

const styles = StyleSheet.create({
    container: {

        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: '#fff',
    },

    inputContainer: {

        // Add more styling as needed
    },
    input: {
        width: 60, // Width of the input box
        height: 60, // Height of the input box
        borderWidth: 2, // Border thickness
        borderColor: '#24786D', // Border color
        color: "black",
        borderRadius: 8, // Rounded corners
        textAlign: 'center', // Center text inside the input box
        fontSize: 18, // Font size for input text
        marginHorizontal: 5, // Space between inputs
    },
    background: {
        padding: 30,
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: 'white',
        width: width,
        height: height,
        position: "relative"
    },
    iconcontainer: {
        borderRadius: 100,
        borderColor: "black",
        borderWidth: 2,
        padding: 4,
        justifyContent: "center"
    },
    icon: {
        width: 18,
        height: 18,

    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    line: {
        height: 1,
        backgroundColor: "#CDD1D0",
        flex: 1,
        marginHorizontal: 10,
    },
    text: {
        color: '#797C7B',
        fontSize: 18,
        fontWeight: 'bold',
    },
    labelText: {
        color: "#24786D",
        fontWeight: 'bold'
    },
    textInput: {
        borderBottomColor: "#CDD1D0",
        borderBottomWidth: 1,
        color: "black"
    }, signUpButton: {
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#24786D',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: "500"
    },
});








