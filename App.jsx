// App.jsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from './screens/Home/HomeScreen';
import LoginScreen from './screens/Auth/LoginScreen';
import RegisterScreen from './screens/Auth/RegisterScreen';
import DefaultScreen from './screens/Auth/DefaultScreen';
import VerificationScreen from './screens/Auth/VerificationScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ChatInterface from './screens/InnerPages/ChatInterface';
import Toast from 'react-native-toast-message';
import * as Keychain from 'react-native-keychain';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginState, logoutState } from './redux/slice/authSlice';
import ProfilePage from './screens/InnerPages/ProfilePage';
import api from './api/axios';
import { setUSer } from './redux/slice/profileSlice';
import AjmalTestScreen from './screens/Home/AjmalTestScreen';
import SearchScreen from './screens/Search/SearchScreen';
import { getData } from './conf/AsyncStore';
import { io } from 'socket.io-client';
import { addMessage, setMessages, setOnlineUsers } from './redux/slice/chatSlice';

const Stack = createNativeStackNavigator();

const App = () => {
  let socket;
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userId = useSelector((state) => state.profile.userId);
  const tok = useSelector((state) => state.auth.token);
  console.log("isAuthenticated:", isAuthenticated);
  console.log("tok:", tok);


  // Function to check if the user is logged in
  const checkAuthentication = async () => {
    // const credentials = await Keychain.getGenericPassword();
    const credentials = await getData("token")

    if (credentials) {
      console.log("credentials from app.jsx");

      dispatch(loginState(JSON.parse(credentials))); // // Set isAuthenticated to true in Redux
    } else {
      dispatch(logoutState()); // Set isAuthenticated to false in Redux
    }
  };
  const fetchProfile = async () => {
    try {
      const response = await api.get("/profile");
      if (response.status === 200) {
        dispatch(setUSer({
          userName: response?.data?.user?.userName,
          profilePic: response?.data?.user?.profilePicture,
          bio: response?.data?.user?.bio,
          email: response?.data?.user?.email,
          userId: response?.data?.user?._id
        }))
      }
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    checkAuthentication();
    isAuthenticated && fetchProfile();
    socket = io("http://192.168.1.2:5000", {
      autoConnect: isAuthenticated,
      query: {
        userId: userId
      },
      reconnectionAttempts: 10,
      timeout: 10000,
    });
    socket.on("connect", () => {
      console.log(
        'Socket.io connected with id:', socket.id
      );
    });
    socket.on("disconnect", () => {
      'Socket disconnected'
    });
    socket.on("getOnlineUsers", (data) => {
      dispatch(setOnlineUsers(data))
    })
    socket.on("newMessage", (newMessage) => {
      console.log("newMessage is comming:", newMessage);
      dispatch(addMessage(newMessage));
    })
    return () => {
      socket.disconnect();
      console.log('Socket disconnected on app unmount');
    }
  }, [userId, isAuthenticated]);





  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isAuthenticated ? 'Home' : 'Default'}
          screenOptions={{ headerShown: false, animation: "fade" }}
        >
          {isAuthenticated ? (
            <>
              <Stack.Screen name='Home' component={HomeScreen} />
              <Stack.Screen name='ChatInterface' component={ChatInterface} />
              <Stack.Screen name='ProfilePage' component={ProfilePage} />
              <Stack.Screen name='test' component={AjmalTestScreen} />
              <Stack.Screen name='Search' component={SearchScreen} />

            </>
          ) : (
            <>
              <Stack.Screen name='Default' component={DefaultScreen} />
              <Stack.Screen name='Login' component={LoginScreen} />
              <Stack.Screen name='Register' component={RegisterScreen} />
              <Stack.Screen name='Verification' component={VerificationScreen} />

            </>
          )}
        </Stack.Navigator>
        <Toast />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
