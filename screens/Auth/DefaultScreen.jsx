import { Button, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const logo = require('../../assets/logo.png');
const apple = require('../../assets/otherApp/apple.png');
const google = require('../../assets/otherApp/google.png');
const fb = require('../../assets/otherApp/fb.png');
const { width, height } = Dimensions.get('window');

const DefaultScreen = () => {
    const navigation = useNavigation()
    const handlePress = () => {
        navigation.navigate('Register'); // Navigate to the Register screen
    }
    const handleLogin = () => {
        navigation.navigate('Login'); // Navigate to the Register screen
    }

    return (
        <View style={styles.background}>
            <View style={{ alignItems: "center", zIndex: 1 }}>
                <Image source={logo} />
            </View>
            {/* Text View for Headings */}
            <View style={styles.textContainer}>
                <Text style={{ ...styles.heading, fontWeight: '400' }}>Connect friends</Text>
                <Text style={{ ...styles.heading, fontWeight: '700' }}>easily & quickly</Text>
            </View>
            {/* Gradient Overlay */}
            <View style={styles.gradientContainer}>
                <LinearGradient
                    colors={['rgba(67, 17, 106, 0)', 'rgba(67, 17, 106, 0.4)', 'rgba(67, 17, 106, 0.25)', 'rgba(67, 17, 106, 0)']} // Adjusted gradient colors for a smoky effect
                    style={styles.oval}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }} // Gradient from top to bottom
                    locations={[0, 0.4, 0.6, 1]} // Adjusted locations for smoother transitions
                />
            </View>
            {/* Description Text */}
            <View>
                <Text style={{ color: "#B9C1BE", fontSize: 18 }}>Our chat app is the perfect way to stay connected with friends and family</Text>
            </View>
            {/* Social Icons */}
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 15 }}>
                <View style={styles.iconcontainer}>
                    <Image source={fb} style={styles.icon} />
                </View>
                <View style={styles.iconcontainer}>
                    <Image source={google} style={styles.icon} />
                </View>
                <View style={styles.iconcontainer}>
                    <Image source={apple} style={styles.icon} />
                </View>
            </View>
            {/* OR Text Separator */}
            <View style={styles.container}>
                <View style={styles.line} />
                <Text style={styles.text}>OR</Text>
                <View style={styles.line} />
            </View>
            {/* Sign Up Button */}
            <View style={styles.signUpButton}>
                <TouchableOpacity style={styles.button} onPress={handlePress}>
                    <Text style={styles.buttonText}>Sign up with mail</Text>
                </TouchableOpacity>
            </View>
            {/* Login Prompt */}
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Text style={{ color: "white" }}>Existing account? </Text>
                <TouchableOpacity>
                    <Text style={{ color: "white", fontWeight: "600" }} onPress={handleLogin}> Log in</Text>

                </TouchableOpacity>
            </View>
        </View>
    );
};

export default DefaultScreen;

const styles = StyleSheet.create({
    background: {
        padding: 30,
        flex: 1,
        justifyContent: 'space-around',
        backgroundColor: '#1A1A1A',
        width: width,
        height: height,
        position: "relative"
    },
    heading: {
        color: 'white',
        fontSize: 70,
    },
    textContainer: {
        position: 'relative', // Ensure text is positioned relative to the parent
        zIndex: 1, // Higher z-index to display above the gradient
        // alignItems: 'center', // Center the text
    },
    icon: {
        width: 25,
        height: 25,
    },
    iconcontainer: {
        borderRadius: 100,
        borderColor: "white",
        borderWidth: 2,
        padding: 8
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
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signUpButton: {
        justifyContent: 'center',
    },
    button: {
        backgroundColor: 'white',
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
        color: 'black',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: "500"
    },
    gradientContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 600, // Adjust height if needed
        justifyContent: 'center',
        zIndex: 0, // Ensure gradient is below the text
    },
    oval: {
        width: 330,
        height: 600,
        position: 'absolute',
        top: -40,
        transform: [{ rotate: '50deg' }],
    },
});
