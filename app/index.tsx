import "react-native";

//screens
import StartScreen from "./screens/startscreen";
import LoginScreen from "./screens/login";
import SignUpScreen from "./screens/signup";
import HobbyScreen from "./auth_screens/hobbyscreen";

//React Navigation Stack
import RootStack from './RootStack';

export default function App() {
    // return <RootStack />;
    return <HobbyScreen />;
} 