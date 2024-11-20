import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';

import { useNavigation } from '@react-navigation/native';
import { logoutState } from '../../redux/slice/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { removeData } from '../../conf/AsyncStore';
const search = require('../../assets/tools/search.png');
const user = require('../../assets/users/usersample.png');

const TopBar = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const profilePic = useSelector((state) => state.profile.profilePic)
  console.log(profilePic);

  const handleLogout = async () => {
    console.log("clicked logout");

    await removeData("token");
    await dispatch(logoutState())
    // Clear token
    navigation.replace('Default'); // Navigate back to Default screen or Login
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.searchContainer} onPress={() => navigation.navigate("Search")} >
        <Image source={search} style={styles.searchIcon} />
      </TouchableOpacity>
      <Text style={styles.title} onPress={handleLogout}>Home</Text>
      <TouchableOpacity onPress={() => navigation.navigate("ProfilePage")}>{!profilePic ? <Image source={user} style={styles.userIcon} /> : <Image source={{ uri: profilePic || user }} style={styles.userIcon} />}</TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Aligns items vertically in the center
    // backgroundColor: 'red',
    paddingHorizontal: 16, // Add horizontal padding for better spacing
    height: 60, // Set a fixed height for the TopBar
  },
  searchContainer: {
    borderColor: '#363F3B',
    borderRadius: 40,
    borderWidth: 2,
    padding: 6,
  },
  searchIcon: {
    width: 22,
    height: 22,
  },
  title: {
    color: 'white',
    fontWeight: '700',
    fontSize: 20,
    textAlign: 'center', // Centers the text within its container
    flex: 1, // Allows the title to take up remaining space
  },
  userIcon: {
    width: 39,
    height: 39,
    borderRadius: 50
  },
});

export default TopBar;
