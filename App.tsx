/* eslint-disable react/no-unstable-nested-components */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Provider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ChatRoomScreen} from './components/ChatRoom';
import {ChatInfoScreen} from './components/ChatRoom/ChatInformation';
import {MemberList} from './components/ChatRoom/MemberList';
import ContactScreen from './components/Contact';
import VideoCallScreen from './components/Contact/VideoCallScreen';
import HomeScreen from './components/HomeScreen';
import ForgotPasswordScreen from './components/Login&Register/ForgotPassword';
import LoginPage from './components/Login&Register/Login';
import {RegisterScreen} from './components/Login&Register/Register';
import {NewChatScreen} from './components/NewChat';
import {SettingsScreen} from './components/Settings';
import {UserProfileScreen} from './components/UserProfile';
import {EditProfileScreen} from './components/UserProfile/EditProfile';
import Colors from './constants/Colors';

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
  ChatInfo: undefined;
  EditProfile: undefined;
  MemberList: {
    members: [];
    isGroupAdmin?: boolean;
    onRemoveMember?: (userId: string) => void;
  };
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const theme = Colors.getTheme('light');
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: 'gray',
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="home" size={size} color={color} />
          ),
          headerStyle: {backgroundColor: theme.primary},
          headerTintColor: '#fff',
          title: 'Home',
        }}
      />
      <Tab.Screen
        name="Contact"
        component={ContactScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="contacts" size={size} color={color} />
          ),
          headerStyle: {backgroundColor: theme.primary},
          headerTintColor: '#fff',
        }}
      />
      <Tab.Screen
        name="User"
        component={UserProfileScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="account" size={size} color={color} />
          ),
          headerStyle: {backgroundColor: theme.primary},
          headerTintColor: '#fff',
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const theme = Colors.getTheme('light');
  return (
    <Provider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {backgroundColor: theme.primary},
            headerTintColor: '#fff',
          }}>
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
          <Stack.Screen
            name="NewChat"
            component={NewChatScreen}
            options={{title: 'New Chat'}}
          />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen
            name="VideoCallScreen"
            component={VideoCallScreen}
            options={({route}) => ({title: route.params.channelName})}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
          <Stack.Screen name="ChatInfo" component={ChatInfoScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen
            component={MemberList}
            name="MemberList"
            options={() => ({
              title: 'Group Members',
              headerStyle: {
                backgroundColor: theme.primary,
              },
              headerTintColor: '#fff',
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
