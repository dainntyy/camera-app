import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CameraScreen from '../components/CameraScreen';
import IntroSlider from '../components/IntroSlider';
import ReferenceImageScreen from '../components/ReferenceImageScreen';  // новий екран

const Stack = createStackNavigator();

export default function App() {
  // const [firstLaunch, setFirstLaunch] = useState(true); // Додаємо стан для контролю запуску

  // const handleIntroDone = () => {
  //   setFirstLaunch(false); // Змінюємо стан після завершення слайдера
  // };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {firstLaunch ? (
          // Якщо це перший запуск, показуємо слайдер
          <Stack.Screen name="IntroSlider">
            {props => <IntroSlider {...props} onDone={handleIntroDone} />}
          </Stack.Screen>
        ) : (
          // Показуємо екран камери після завершення слайдера
          <Stack.Screen name="CameraScreen" component={CameraScreen} />
        )}
        
        {/* Новий екран для вибору референсного зображення */}
        <Stack.Screen name="ReferenceImageScreen" component={ReferenceImageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
