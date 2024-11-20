import * as Keychain from 'react-native-keychain';

export const getToken = async () => {
    try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
            return credentials.password; // This is your token
        } else {
            console.log('No token found');
            return null;
        }
    } catch (error) {
        console.error('Failed to retrieve token:', error);
        return null;
    }
};