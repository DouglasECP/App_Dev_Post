//decide mostrar as auth.rotes (sem login)
//ou mostra as app.routes (Já tem Login)
import React, {useContext} from 'react';
import { View, ActivityIndicator } from 'react-native';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';
import {AuthContext} from '../contexts/auth'

export default function Routes() {
    //abaixo: está logado? (false = ñ)
    const {signed, loading} = useContext(AuthContext)  

 //abaixo: verifica se em loading e depois que terminar 
 //verifica se abre as rotas para user logado ou ñ logado

    if(loading){
        return(
            <View style={{flex:1,justifyContent:'center', 
            alignItems:'center', backgroundColor:'#36393f'}}>
    
                <ActivityIndicator size={50} color='#e52246'/>
    
            </View>
        )
    }

    return (
        //abaixo: verifica se está logado e 
        //se estiver executa o AppRoutes (rota
        //para quem está logado) ou AuthRoutes
        //(rota para quem não está logado)
        signed ? <AppRoutes/> : <AuthRoutes/>
    );
}