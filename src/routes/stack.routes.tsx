import React from 'react'
import {} from 'react-native'
import { createStackNavigator } from "@react-navigation/stack";
import colors from '../styles/colors'
import { Welcome } from '../pages/Welcome';
import { UserIdentification } from '../pages/UserIdentification';
import { Confirmation } from '../pages/Confirmation';
import { PlantSelect } from '../pages/PlantSelect';


const stackRoute = createStackNavigator();

const AppRoutes: React.FC = () =>(
    <stackRoute.Navigator
    headerMode='none'
    screenOptions={{
        cardStyle: {
            backgroundColor: colors.white,
        }
    }}
    >
    <stackRoute.Screen
    name="Welcome"
    component={Welcome}
    />
        <stackRoute.Screen
    name="UserIdentification"
    component={UserIdentification}
    />
        <stackRoute.Screen
    name="Confirmation"
    component={Confirmation}
    />
    <stackRoute.Screen
    name="PlantSelect"
    component={PlantSelect}
    />


    </stackRoute.Navigator>
)

export default AppRoutes;