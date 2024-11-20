import { ActivityIndicator, Alert, Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { base_url } from '../../conf/Constant';
const leftArrow = require('../../assets/navigation/leftArrow.png');
const apple = require('../../assets/otherApp/appleBlack.png');
const google = require('../../assets/otherApp/google.png');
const fb = require('../../assets/otherApp/fb.png');
const { width, height } = Dimensions.get('window');

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)





  const handleLogin = () => {
    navigation.navigate('Login'); // Navigate to the Register screen
  }


  const handleRegister = async () => {
    setLoading(true)
    // Ensure all fields are filled and passwords match
    if ([email, password, userName, confirmPassword].some((field) => field.trim() === "")) {
      Toast.show({
        type: 'info',
        text1: 'Hey champ!',
        text2: 'Please fill in all the fields 😊',
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'info',
        text1: 'Password Mismatch!',
        text2: 'Password and confirm password must be the same 😊',
      });
      return;
    }

    const requestBody = { userName, password, email };

    try {
      const response = await axios.post(`${base_url}/api/auth/register`, requestBody);
      console.log(response);

      // const response=await axios.get("")
      // return;
      // Handle a successful registration
      if (response.status === 201) {
        Toast.show({
          type: 'success',
          text1: 'Registration Successful',
          text2: response?.data?.message
        });

        navigation.replace("Verification", { response: response?.data?.user })
        // Additional success logic, like navigating to the login screen
      }
    } catch (error) {
      console.log(error);

      if (error.response) {
        // Handle expected errors from the backend
        const { status, data } = error.response;
        if (status === 400) {
          if (data.errors) {
            // Validation errors
            data.errors.forEach((errorMsg) => {
              Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: errorMsg,
              });
            });
          } else if (data.message === 'User already exists') {
            // User already exists error
            Toast.show({
              type: 'error',
              text1: 'Registration Failed',
              text2: 'User already exists. Try logging in instead.',
            });
          }
        } else if (status === 500) {
          // Handle unexpected server error
          Alert.alert("Server Error", "An error occurred on our end. Please try again later.");
        }
      } else {
        // Handle any other errors, such as network issues
        Alert.alert("Network Error", "Please check your connection and try again.");
      }
    } finally {
      setLoading(false)
    }
  };


  // Initialize navigation
  return (
    <View style={styles.background}>
      <View style={{}}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 20 }}>
          <TouchableOpacity onPress={() => navigation?.goBack?.()}>
            <Image
              source={leftArrow}
              style={{ width: 24, height: 19 }} // Set width and height here
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flexDirection: "column", flex: 1, paddingTop: 30, justifyContent: "space-between" }}>
        <View style={{ justifyContent: "center", gap: 20 }}>
          <Text style={{ color: "black", fontWeight: "800", fontSize: 18, textAlign: "center" }}>Sign up with ChatBox</Text>
          <Text style={{ color: "#797C7B", textAlign: "center" }}>Get chatting with friends and family today by signing up for our chat app!</Text>

          <View style={{ gap: 24, top: 20 }}>
            <View>
              <Text style={styles.labelText}>Username</Text>
              <TextInput style={styles.textInput} value={userName}
                onChangeText={text => setUserName(text)} />
            </View>
            <View>
              <Text style={styles.labelText}>Yout email</Text>
              <TextInput style={styles.textInput} value={email} onChangeText={text => setEmail(text)} />
            </View>
            <View>
              <Text style={styles.labelText}>Password</Text>
              <TextInput style={styles.textInput} value={password} onChangeText={text => setPassword(text)} />
            </View>
            <View>
              <Text style={styles.labelText}>Confirm password</Text>
              <TextInput style={styles.textInput} value={confirmPassword} onChangeText={text => setConfirmPassword(text)} />
            </View>
          </View>
        </View>
        <View style={{ gap: 10 }}>
          <View style={styles.signUpButton}>
            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (<Text style={styles.buttonText}>Create an account</Text>)}

            </TouchableOpacity>
          </View>
          {/* Login Prompt */}
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={{ color: "#24786D" }}>Existing account? </Text>
            <TouchableOpacity>
              <Text style={{ color: "#24786D", fontWeight: "600" }} onPress={handleLogin}> Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export default RegisterScreen

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
})