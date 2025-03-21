/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {lazy, Suspense} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {Provider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from './components/HomeScreen';
import LoginPage from './components/Login&Register/Login';
import {RegisterScreen} from './components/Login&Register/Register';
import Colors from './constants/Colors';
import ContactScreen from './components/Contact';

const ChatRoomScreen = lazy(() =>
  import('./components/ChatRoom').then(module => ({
    default: module.ChatRoomScreen,
  })),
);
const ChatInfoScreen = lazy(() =>
  import('./components/ChatRoom/ChatInformation').then(module => ({
    default: module.ChatInfoScreen,
  })),
);
const MemberList = lazy(() =>
  import('./components/ChatRoom/MemberList').then(module => ({
    default: module.MemberList,
  })),
);
const ForgotPasswordScreen = lazy(
  () => import('./components/Login&Register/ForgotPassword'),
);
const NewChatScreen = lazy(() =>
  import('./components/NewChat').then(module => ({
    default: module.NewChatScreen,
  })),
);
const SettingsScreen = lazy(() =>
  import('./components/Settings').then(module => ({
    default: module.SettingsScreen,
  })),
);
const UserProfileScreen = lazy(() =>
  import('./components/UserProfile').then(module => ({
    default: module.UserProfileScreen,
  })),
);
const EditProfileScreen = lazy(() =>
  import('./components/UserProfile/EditProfile').then(module => ({
    default: module.EditProfileScreen,
  })),
);
const FriendProfileScreen = lazy(() =>
  import('./components/ChatRoom/FriendProfileScreen/index').then(module => ({
    default: module.FriendProfileScreen,
  })),
);
//12694154B6009017
export type RootStackParamList = {
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
  FriendProfile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const LoadingComponent = () => {
  const theme = Colors.getTheme('light');
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.background,
      }}>
      <ActivityIndicator size="large" color={theme.primary} />
    </View>
  );
};

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
            <Icon name="book-open-variant" size={size} color={color} />
          ),
          headerStyle: {backgroundColor: theme.primary},
          headerTintColor: '#fff',
          title: 'Contacts',
        }}
      />
      <Tab.Screen
        name="User Profile"
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="account" size={size} color={color} />
          ),
          headerStyle: {backgroundColor: theme.primary},
          headerTintColor: '#fff',
        }}>
        {() => (
          <Suspense fallback={<LoadingComponent />}>
            <UserProfileScreen />
          </Suspense>
        )}
      </Tab.Screen>
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
            options={({route}) => ({title: route.params.name})}>
            {props => {
              const {route, navigation} = props;
              const {chatId, name} = route.params;
              return (
                <Suspense fallback={<LoadingComponent />}>
                  <ChatRoomScreen
                    chatId={chatId}
                    name={name}
                    navigation={navigation}
                  />
                </Suspense>
              );
            }}
          </Stack.Screen>
          <Stack.Screen name="NewChat" options={{title: 'New Chat'}}>
            {props => (
              <Suspense fallback={<LoadingComponent />}>
                <NewChatScreen {...props} />
              </Suspense>
            )}
          </Stack.Screen>
          <Stack.Screen name="Settings">
            {props => (
              <Suspense fallback={<LoadingComponent />}>
                <SettingsScreen {...props} />
              </Suspense>
            )}
          </Stack.Screen>
          <Stack.Screen
            name="ForgotPassword"
            options={{title: 'Back to Login'}}>
            {() => (
              <Suspense fallback={<LoadingComponent />}>
                <ForgotPasswordScreen />
              </Suspense>
            )}
          </Stack.Screen>
          <Stack.Screen name="ChatInfo">
            {props => (
              <Suspense fallback={<LoadingComponent />}>
                <ChatInfoScreen {...props} />
              </Suspense>
            )}
          </Stack.Screen>
          <Stack.Screen name="EditProfile">
            {() => (
              <Suspense fallback={<LoadingComponent />}>
                <EditProfileScreen />
              </Suspense>
            )}
          </Stack.Screen>
          <Stack.Screen
            name="MemberList"
            options={() => ({
              title: 'Group Members',
              headerStyle: {
                backgroundColor: theme.primary,
              },
              headerTintColor: '#fff',
            })}>
            {props => (
              <Suspense fallback={<LoadingComponent />}>
                <MemberList {...props} />
              </Suspense>
            )}
          </Stack.Screen>
          <Stack.Screen name="FriendProfile">
            {props => (
              <Suspense fallback={<LoadingComponent />}>
                <FriendProfileScreen {...props} />
              </Suspense>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
