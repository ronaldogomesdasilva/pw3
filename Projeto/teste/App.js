import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Tela1 from './screens/Tela1';
import Tela2 from './screens/Tela2';
import Cadastro from './screens/Cadastro';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen
          name="Tela1"
          component={Tela1}
          options={{ title: 'Login' }}
        />

        <Stack.Screen
          name="Cadastro"
          component={Cadastro}
          options={{ title: 'Cadastro' }}
        />

        <Stack.Screen
          name="Tela2"
          component={Tela2}
          options={{ title: 'Home' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
