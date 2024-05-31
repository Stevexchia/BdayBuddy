import "react-native";

import AuthHomeScreen from "./auth_screens/homescreen";

import EntryScreen from "./screens/entryscreen";
import LoginScreen from "./screens/login";
import SignUpScreen from "./screens/signup";

export default function App() {
    const loggedIn = false;
    if (loggedIn) {
        return <AuthHomeScreen />
    } else {
        // return <EntryScreen />
        // return <LoginScreen />
        return <SignUpScreen name={undefined} setName={undefined} email={undefined} setEmail={undefined} password={undefined} setPassword={undefined} isLogin={undefined} setIsLogin={undefined} handleAuthentication={undefined} />
    }

};