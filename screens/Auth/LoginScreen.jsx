import { ActivityIndicator, Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; // Import Axios
import Toast from 'react-native-toast-message'; // Import Toast for notifications
import * as Keychain from 'react-native-keychain'; //secure storage functionality
import { loginState } from '../../redux/slice/authSlice';
import { useDispatch } from 'react-redux';
import { storeData } from '../../conf/AsyncStore';
import { base_url } from '../../conf/Constant';


const leftArrow = require('../../assets/navigation/leftArrow.png');
const apple = require('../../assets/otherApp/appleBlack.png');
const google = require('../../assets/otherApp/google.png');
const fb = require('../../assets/otherApp/fb.png');
const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation(); // Initialize navigation
  const [email, setEmail] = useState(''); // State for email input
  const [password, setPassword] = useState(''); // State for password input
  const [loading, setLoading] = useState(false); // State for loading indicator
  const dispatch = useDispatch()
  const handleLogin = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.post(`${base_url}/api/auth/login`, {
        email,
        password,
      });
      console.log('Login response:', response.data);

      // Handle successful login
      if (response.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: response.data.message,
        });
        // await Keychain.setGenericPassword('token', response?.data?.token);
        await storeData("token", response?.data?.token);
        // Navigate to the home screen
        await dispatch(loginState(response?.data?.token));
        navigation.replace('Home'); // Replace with your target screen
      }
      if (response.status === 203) {
        Toast.show({
          type: 'info',
          text1: 'Verification Required',
          text2: 'Please check your email for the OTP to verify your account.',
        });
        navigation.navigate('Verification', { response: response.data?.user });
      }
    } catch (error) {
      console.log(error.statuCode);

      // Handle specific status codes
      if (error.response) {
        switch (error.response.status) {
          case 400:
            Toast.show({
              type: 'error',
              text1: 'Invalid Input',
              text2: 'Please fill in all fields correctly.',
            });
            break;
          case 401:
            Toast.show({
              type: 'error',
              text1: 'Invalid Credentials',
              text2: 'Please check your email and password.',
            });
            break;

          case 500:
            Toast.show({
              type: 'error',
              text1: 'Server Error',
              text2: 'Please try again later.',
            });
            break;
          default:
            Toast.show({
              type: 'error',
              text1: 'Unexpected Error',
              text2: 'Something went wrong. Please try again.',
            });
            break;
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Network Error',
          text2: 'Please check your internet connection.',
        });

      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <View style={styles.background}>
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 20 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={leftArrow}
              style={{ width: 24, height: 19 }} // Set width and height here
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flexDirection: "column", flex: 1, paddingTop: 70, justifyContent: "space-between" }}>
        <View style={{ justifyContent: "center", gap: 20 }}>
          <Text style={{ color: "black", fontWeight: "800", fontSize: 18, textAlign: "center" }}>Login to ChatBox</Text>
          <Text style={{ color: "#797C7B", textAlign: "center" }}>Welcome back! Sign in using your social account or email to continue us</Text>
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
          <View style={styles.container}>
            <View style={styles.line} />
            <Text style={styles.text}>OR</Text>
            <View style={styles.line} />
          </View>
          <View style={{ gap: 30 }}>
            <View>
              <Text style={styles.labelText}>Your email</Text>
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail} // Update email state
                autoCapitalize="none" // Prevent capitalization
              />
            </View>
            <View>
              <Text style={styles.labelText}>Password</Text>
              <TextInput
                style={styles.textInput}
                value={password}
                onChangeText={setPassword} // Update password state
                secureTextEntry // Hide password input
              />
            </View>
          </View>
        </View>
        <View style={{ gap: 10 }}>
          <View style={styles.signUpButton}>
            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (<Text style={styles.buttonText}>Log In</Text>)}
            </TouchableOpacity>
          </View>
          {/* Login Prompt */}
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={{ color: "#24786D", fontWeight: "600" }}>Forgot password? </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
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
