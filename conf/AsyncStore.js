import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
        console.log("Data saved in Asyncstorage");

    } catch (error) {
        console.error("Error while Saving data")
    }
};

export const removeData = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
        console.log("Data removed successfully");
    } catch (error) {
        console.error("Error removing data:", error);
    }
}

export const getData = async (key) => {
    try {
        const data = await AsyncStorage.getItem(key);
        return data ? data : false;
    } catch (error) {
        console.error("Error removing data:", error);
    }
}

export const clearAllData = async () => {
    try {
        await AsyncStorage.clear();
        console.log("All data cleared");
    } catch (error) {
        console.error("Error clearing data:", error);
    }
};

export default AsyncStorage;