import { Platform } from 'react-native';

// UPDATE THIS WITH YOUR LOCAL IP ADDRESS IF RUNNING ON PHYSICAL DEVICE
const LOCAL_IP = '192.168.1.77'; // Change this to your computer's IP

export const API_URL = Platform.select({
    ios: 'http://localhost:3000/api',
    android: 'http://10.0.2.2:3000/api',
    default: `http://${LOCAL_IP}:3000/api`,
});
