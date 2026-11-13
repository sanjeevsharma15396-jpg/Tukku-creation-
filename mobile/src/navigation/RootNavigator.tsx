import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { AIToolsScreen } from '../screens/AIToolsScreen';
import { CreateScreen } from '../screens/CreateScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { MyProjectsScreen } from '../screens/MyProjectsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AIImageGeneratorScreen } from '../screens/tools/AIImageGeneratorScreen';
import { AIStoryGeneratorScreen } from '../screens/tools/AIStoryGeneratorScreen';
import { AIVideoGeneratorScreen } from '../screens/tools/AIVideoGeneratorScreen';
import { AIVoiceStudioScreen } from '../screens/tools/AIVoiceStudioScreen';
import { CartoonStudioScreen } from '../screens/tools/CartoonStudioScreen';
import { VideoEditorScreen } from '../screens/tools/VideoEditorScreen';
import { YouTubeCreatorStudioScreen } from '../screens/tools/YouTubeCreatorStudioScreen';
import { COLORS } from '../theme/colors';
import { MainTabParamList, RootStackParamList } from '../types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const MainTabsNavigator: React.FC = () => {
  const { t, theme } = useApp();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.textPrimary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: theme.surface,
            borderTopColor: theme.border,
            height: 62 + Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0),
            paddingBottom: Math.max(insets.bottom, 8),
          },
        ],
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color }) => {
          let iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'] =
            'home-variant-outline';

          if (route.name === 'Home') {
            iconName = focused ? 'home-variant' : 'home-variant-outline';
          } else if (route.name === 'Create') {
            iconName = focused ? 'plus-circle' : 'plus-circle-outline';
          } else if (route.name === 'MyProjects') {
            iconName = focused ? 'folder-multiple' : 'folder-multiple-outline';
          } else if (route.name === 'AITools') {
            iconName = focused ? 'view-grid' : 'view-grid-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'cog' : 'cog-outline';
          }

          return (
            <MaterialCommunityIcons
              name={iconName}
              size={23}
              color={focused ? COLORS.amethyst : color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: t.tabs.home }}
      />
      <Tab.Screen
        name="Create"
        component={CreateScreen}
        options={{ tabBarLabel: t.tabs.create }}
      />
      <Tab.Screen
        name="MyProjects"
        component={MyProjectsScreen}
        options={{ tabBarLabel: t.tabs.projects }}
      />
      <Tab.Screen
        name="AITools"
        component={AIToolsScreen}
        options={{ tabBarLabel: t.tabs.tools }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarLabel: t.tabs.settings }}
      />
    </Tab.Navigator>
  );
};

export const RootNavigator: React.FC = () => {
  const { theme } = useApp();

  const navigationTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: theme.background,
      card: theme.surface,
      text: COLORS.textPrimary,
      border: theme.border,
      primary: COLORS.violetPrimary,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabsNavigator} />
        <Stack.Screen name="AIStoryGenerator" component={AIStoryGeneratorScreen} />
        <Stack.Screen name="AIImageGenerator" component={AIImageGeneratorScreen} />
        <Stack.Screen name="AIVideoGenerator" component={AIVideoGeneratorScreen} />
        <Stack.Screen name="AIVoiceStudio" component={AIVoiceStudioScreen} />
        <Stack.Screen name="CartoonStudio" component={CartoonStudioScreen} />
        <Stack.Screen name="YouTubeCreatorStudio" component={YouTubeCreatorStudioScreen} />
        <Stack.Screen name="VideoEditor" component={VideoEditorScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    paddingTop: 6,
    elevation: 12,
  },
  tabLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    marginTop: 2,
  },
});
