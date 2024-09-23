import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CameraScreen from 'C:/Users/Hp/Desktop/camera-app/components/CameraScreen'; // Adjust the import path as necessary
import IntroSlider from 'C:/Users/Hp/Desktop/camera-app/components/IntroSlider'; // Додай шлях до IntroSlider

const Stack = createStackNavigator();

export default function App() {
  const [firstLaunch, setFirstLaunch] = useState(true); // Стан для контролю показу слайдера

  const handleIntroDone = () => {
    setFirstLaunch(false); // Після завершення слайдера змінюємо стан
  };

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName={firstLaunch ? "IntroSlider" : "Camera"}>
        {firstLaunch && (
          <Stack.Screen 
            name="IntroSlider" 
            options={{ headerShown: false }} 
          >
            {(props) => <IntroSlider {...props} onDone={handleIntroDone} />}
          </Stack.Screen>
        )}
        <Stack.Screen 
          name="Camera" 
          component={CameraScreen} 
          options={{ title: 'Camera', headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
