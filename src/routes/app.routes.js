//configura as rotas com o login validado
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import Feather from 'react-native-vector-icons/Feather'

import Home from '../pages/Home' //Tab
import Profile from '../pages/Profile' //Tab
import Search from '../pages/Search' //Tab
import NewPost from '../pages/NewPost' //stack 
import PostsUser from '../pages/PostsUser' //stack

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function StackRoutes(){
  return(
    <Stack.Navigator>

      <Stack.Screen 
        name='Home' 
        component={Home}
        options={{headerShown:false}}
      />

      <Stack.Screen 
        name='NewPost' 
        component={NewPost}
        options={{
          title:'Novo Post',
          headerTintColor:'#fff', //cor do titulo
          headerStyle:{
            backgroundColor:"#36394f" //cor de fundo
          }
        }}
      />

      <Stack.Screen 
        name='PostsUser' 
        component={PostsUser}
        options={{
          headerTintColor:'#fff', //cor do titulo
          headerStyle:{
            backgroundColor:"#36394f" //cor de fundo
          }
        }}
      />

    </Stack.Navigator>
  )
}

export default function AppRoutes() {
  return(
    <Tab.Navigator
      screenOptions={{ //configuração da tabBar
        headerShown: false, //sem barra superior
        tabBarHideOnKeyboard: true, //teclado abre em cima da tabBar
        tabBarShowLabel: false, //retira o name de baixo do icone
        tabBarActiveTintColor:'#fff', //cor branco quando estiver selec.
        tabBarStyle:{
          backgroundColor: '#202225',//cor de fundo
          borderTopWidth:0, //por padrão existe uma barra fina, retirado
        }
      }}
    >

      <Tab.Screen 
        name='HomeTab' 
        component={StackRoutes} 
        options={{
          //{color, size} pega a cor e o size padrão
          tabBarIcon:({color, size})=>{
            return <Feather name='home' color={color} size={size}/>
          }
        }}
      />

      <Tab.Screen 
        name='Search' 
        component={Search} 
        options={{
          //{color, size} pega a cor e o size padrão
          tabBarIcon:({color, size})=>{
            return <Feather name='search' color={color} size={size}/>
          }
        }}
      />

      <Tab.Screen 
        name='Profile' 
        component={Profile}
        options={{
          //{color, size} pega a cor e o size padrão
          tabBarIcon:({color, size})=>{
            return <Feather name='user' color={color} size={size}/>
          }
        }}
      />

    </Tab.Navigator>
  );
}