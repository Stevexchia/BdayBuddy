import React, {useState, useEffect} from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, Alert, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { signOut, updatePassword } from "firebase/auth";
import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig';
import { collection, updateDoc, doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Ionicons } from '@expo/vector-icons'; // Example import for Ionicons
import { registerIndieID, unregisterIndieDevice } from 'native-notify';
import { CommonActions } from '@react-navigation/native';

  const ProfileScreen = ({ navigation, route }) => {
    const { userId = null } = route.params || {};
    const [userName, setUserName] = useState('Username');
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null); // State to hold profile image URL
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showPasswordInputs, setShowPasswordInputs] = useState(false);

    if (!userId) {
      console.error('userId is not provided in route params.');
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>User data not available.</Text>
        </View>
      );
    }

    useEffect(() => {
      if (userId) {
        const fetchUserData = async () => {
          try {
            const userDoc = await getDoc(doc(FIREBASE_DB, 'users', userId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setUserName(userData.name);
              setProfileImageUrl(userData.profileImageUrl);
            } else {
              console.log('No such document!');
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        };
        fetchUserData();
      }
    }, [userId]);

    const storage = getStorage();

    const uploadImageAndUpdateFirestore = async (uri, userId) => {
      try {
        console.log("Starting image upload...");
        console.log("Image URI:", uri);
        
        // Read file as base64
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        const blob = new Blob([base64], { type: "image/jpeg" });
    
        const storageRef = ref(storage, `profileImages/${userId}`);
        console.log("Uploading to storage...");
        
        await uploadBytes(storageRef, blob);
        console.log("Image uploaded, getting download URL...");
    
        const downloadURL = await getDownloadURL(storageRef);
        console.log("Download URL:", downloadURL);
        
        if (downloadURL) {
          const userRef = doc(FIREBASE_DB, "users", userId);
          await updateDoc(userRef, { profileImageUrl: downloadURL });
          console.log('Profile image URL updated in Firestore:', downloadURL);
          return downloadURL;
        } else {
          throw new Error("Download URL is undefined");
        }
      } catch (error) {
        console.error("Error uploading image and updating Firestore:", error);
        Alert.alert('Error', 'Failed to upload image. Please check your network and try again.');
      }
    };

    const handleUploadPicture = async () => {
      // Ask for permission to access camera and gallery
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert('Permission required', 'Permission to access camera roll is required!');
        return;
      }
    
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
    
      if (!result.canceled) {
        const uri = result.uri;
        setProfileImageUrl(uri); // Set the local image URI
    
        try {
          // Upload the image to Firebase Storage and get the download URL
          console.log("Uploading image...");
          const downloadUrl = await uploadImageAndUpdateFirestore(uri, userId);
          
          if (downloadUrl) {
            console.log("Image uploaded successfully, URL:", downloadUrl);
            // Update Firestore with the new profile image URL
            setProfileImageUrl(downloadUrl); // Update local state with the download URL
          } else {
            console.error('Failed to upload image, download URL is undefined');
            Alert.alert('Error', 'Failed to upload image. Please try again.');
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          Alert.alert('Error', 'Failed to upload image. Please try again.');
        }
      }
    };
 
    const handleEditProfile = () => {
      console.log("EditProfile");
      navigation.navigate("EditProfile", { userId });
    };

    const handleChangePassword = () => {
      setShowPasswordInputs(true);
    };

    const handleCancelPasswordChange = () => {
      setShowPasswordInputs(false);
      setNewPassword('');
      setConfirmNewPassword('');
    };

    const handleSubmitPasswordChange = async () => {
      if (newPassword !== confirmNewPassword) {
        Alert.alert('Passwords do not match', 'Please make sure your passwords match.');
        return;
      }
    
      try {
        const currentUser = FIREBASE_AUTH.currentUser;
        if (!currentUser) {
          console.error('User is not authenticated.');
          return;
        }

        await updatePassword(currentUser, newPassword);
        Alert.alert('Password Changed', 'Your password has been changed successfully.');
        setNewPassword('');
        setConfirmNewPassword('');
        setShowPasswordInputs(false);
      } catch (error) {
        console.error('Error changing password:', error);
        Alert.alert('Error', 'Failed to change password. Please try again.');
      }
    };
    
    const handleLogout = async () => {
      try {
        unregisterIndieDevice([userId], 22706, 'ZVD7i7LCQ7RGIwOxgMdQSA');
        await signOut(FIREBASE_AUTH);
        Alert.alert('Logged out', 'You have been logged out successfully.');
    
        // Resetting the navigation state to AuthNavigator
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'AuthNavigator' }],
          })
        );
      } catch (error) {
        console.error('Error logging out: ', error);
        Alert.alert('Error', 'Failed to log out. Please try again.');
      }
    };

    return (
      <ImageBackground source={require('@/assets/images/background.png')} style={styles.backgroundImage}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Profile Picture and Name */}
          <View style={styles.profileHeader}>
            <TouchableOpacity onPress={handleUploadPicture}>
              <View style={styles.profileImageContainer}>
                {profileImageUrl ? (
                  <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
                ) : (
                  <View style={[styles.profileImage, styles.placeholderImage]}>
                    <Ionicons name="person-circle-outline" size={120} color="grey" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
            <Text style={styles.userName}>{userName}</Text>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {/* Account */}
            <Text style={[styles.sectionHeader, { marginBottom: 5 }]}>Account</Text>
            <TouchableOpacity style={styles.optionButton} onPress={handleEditProfile}>
              <Ionicons name="person-outline" size={20} color="black" style={styles.optionIcon} />
              <Text style={styles.optionText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={() => {/* Navigate to Edit Hobbies & Preferences screen */}}>
              <Ionicons name="heart-half" size={20} color="black" style={styles.optionIcon} />
              <Text style={styles.optionText}>Edit Hobbies & Preferences</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={() => {/* Navigate to Security screen */}}>
              <Ionicons name="shield-checkmark-outline" size={20} color="black" style={styles.optionIcon} />
              <Text style={styles.optionText}>Security</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={() => {/* Navigate to Privacy screen */}}>
              <Ionicons name="lock-closed-outline" size={20} color="black" style={styles.optionIcon} />
              <Text style={styles.optionText}>Privacy</Text>
            </TouchableOpacity>

            {/* Support & About */}
            <Text style={[styles.sectionHeader, { marginTop: 20 }]}>Support & About</Text>
            <TouchableOpacity style={styles.optionButton} onPress={() => {/* Navigate to My Subscription screen */}}>
              <Ionicons name="newspaper-outline" size={20} color="black" style={styles.optionIcon} />
              <Text style={styles.optionText}>My Subscription</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={() => {/* Navigate to Help & Support screen */}}>
              <Ionicons name="help-circle-outline" size={20} color="black" style={styles.optionIcon} />
              <Text style={styles.optionText}>Help & Support</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={() => {/* Navigate to Terms & Policies screen */}}>
              <Ionicons name="document-text-outline" size={20} color="black" style={styles.optionIcon} />
              <Text style={styles.optionText}>Terms & Policies</Text>
            </TouchableOpacity>

            {/* Cache & Cellular */}
            <Text style={[styles.sectionHeader, { marginTop: 20 }]}>Cache & Cellular</Text>
            <TouchableOpacity style={styles.optionButton} onPress={() => {/* Navigate to Free up space screen */}}>
              <Ionicons name="trash-outline" size={20} color="black" style={styles.optionIcon} />
              <Text style={styles.optionText}>Free up space</Text>
            </TouchableOpacity>

            {/* Actions */}
            <Text style={[styles.sectionHeader, { marginTop: 20 }]}>Actions</Text>
            <TouchableOpacity style={styles.optionButton} onPress={() => {/* Navigate to Report a problem screen */}}>
              <Ionicons name="alert-circle-outline" size={20} color="black" style={styles.optionIcon} />
              <Text style={styles.optionText}>Report a problem</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={handleChangePassword}>
              <Ionicons name="key-outline" size={20} color="black" style={styles.optionIcon} />
              <Text style={styles.optionText}>Change Password</Text>
            </TouchableOpacity>
            
            {showPasswordInputs && (
              <>
                <TextInput
                  style={styles.passwordInput}
                  secureTextEntry
                  placeholder="New Password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TextInput
                  style={styles.passwordInput}
                  secureTextEntry
                  placeholder="Confirm New Password"
                  value={confirmNewPassword}
                  onChangeText={setConfirmNewPassword}
                />
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmitPasswordChange}>
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancelPasswordChange}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity style={[styles.optionButton, { borderBottomWidth: 0 }]} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="red" style={styles.optionIcon} />
              <Text style={[styles.optionText, { color: 'red' }]}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  };

  const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
    },
    scrollContainer: {
      flexGrow: 1,
      paddingBottom: 20,
    },
    profileHeader: {
      alignItems: 'center',
      marginTop: 50, // Adjust as needed
      marginBottom: 20,
    },
    profileImageContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      overflow: 'hidden', // Ensure image stays within circular frame
      marginBottom: 10,
    },
    profileImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    userName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'black', // Text color against the background image
    },
    optionsContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.7)', // Slight white background with transparency
      borderRadius: 10,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 50, // Increased padding to ensure options are visible
      marginTop: 20,
    },
    sectionHeader: {
      fontSize: 16,
      fontFamily: 'Ubuntu-Medium',
      marginBottom: 10,
      color: 'black', // Section header text color
    },
    optionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    optionIcon: {
      marginRight: 10,
    },
    optionText: {
      fontSize: 16,
      fontFamily: 'Ubuntu-Regular',
      marginLeft: 5,
      color: 'black', // Option text color
    },
    placeholderImage: {
      backgroundColor: '#f0f0f0', // Grey background color for placeholder
      justifyContent: 'center',
      alignItems: 'center',
    },
    passwordInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 10,
      backgroundColor: 'white', 
      color: 'black', 
    },
    submitButton: {
      backgroundColor: '#a1373f',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 5,
      marginTop: 10,
      alignItems: 'center',
    },
    submitButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
    cancelButton: {
      backgroundColor: '#656773',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 5,
      marginTop: 10,
      alignItems: 'center',
    },
    cancelButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      fontSize: 18,
      color: 'red',
    },
  });

  export default ProfileScreen;
