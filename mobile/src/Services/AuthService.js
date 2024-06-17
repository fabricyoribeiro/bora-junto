// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./FireBaseConfig";


export const getCurrentUser = () => {
    return auth.currentUser;
};

export const updateUserProfile = async (displayName, photoURL) => {
    const user = auth().currentUser;

    try {
        await user.updateProfile({
            displayName,
            photoURL,
        });
        return true;
    } catch (error) {
        console.error('Error updating profile:', error.message);
        return false;
    }
};

export const getUserDisplayName = () => {
    const user = getCurrentUser();
    return user ? user.displayName : null;
};

export const getUserUID = () => {
    const user = getCurrentUser();
    return user ? user.uid : null;
};