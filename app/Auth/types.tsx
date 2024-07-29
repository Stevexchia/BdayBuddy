import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  Start: undefined;
  Onboard: undefined;
  Login: undefined;
  Signup: undefined;
  Contact: { userId: string };
  Hobby: { userId: string };
  DOB: { userId: string };
};

export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
