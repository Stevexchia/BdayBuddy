import "react-native";

//screens
import StartScreen from "./screens/startscreen";
import LoginScreen from "./screens/login";
import SignUpScreen from "./screens/signup";

//React Navigation Stack
import RootStack from './RootStack';

export default function App() {
    return <RootStack />;
} 