import "react-native";

import AuthHomeScreen from "./auth_screens/homescreen";

import HomeScreen from "./screens/homescreen";
import LoginScreen from "./screens/login";
import SignUpScreen from "./screens/signup";

export default function App() {
    const loggedIn = false;
    if (loggedIn) {
        return <AuthHomeScreen />
    } else {
        // return <HomeScreen />
        // return <LoginScreen />
        return <SignUpScreen />
    }

};