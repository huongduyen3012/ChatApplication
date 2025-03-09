/* eslint-disable react/no-unstable-nested-components */
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import HomeScreen from './components/HomeScreen';
import LoginPage from './components/Login&Register/Login';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ContactScreen from './components/Contact';
import VideoCallScreen from './components/Contact/VideoCallScreen';
import ForgotPasswordScreen from './components/Login&Register/ForgotPassword';
import {UserProfileScreen} from './components/UserProfile';
import {RegisterScreen} from './components/Login&Register/Register';
import {ChatRoomScreen} from './components/ChatRoom';
import {NewChatScreen} from './components/NewChat';
import {SettingsScreen} from './components/Settings';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  ChatScreen: {
    chatId: string;
    name: string;
  };
  HomeScreen: undefined;
  UserProfileScreen: undefined;
  NewChat: undefined;
  Settings: undefined;
  VideoCallScreen: {
    channelName: string;
    onEndCall: () => void;
  };
  ForgotPassword: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#0084ff',
        tabBarInactiveTintColor: 'gray',
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Contact"
        component={ContactScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="contacts" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="User"
        component={UserProfileScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{headerShown: false}}
          name="Login"
          component={LoginPage}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Register"
          component={RegisterScreen}
        />
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ChatScreen"
          component={ChatRoomScreen}
          options={({route}) => ({title: route.params.name})}
        />
        <Stack.Screen name="NewChat" component={NewChatScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen
          name="VideoCallScreen"
          component={VideoCallScreen}
          options={({route}) => ({title: route.params.channelName})}
        />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
