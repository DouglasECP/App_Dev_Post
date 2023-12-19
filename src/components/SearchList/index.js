import React from "react";
import { Container, Name } from "./styles"; 

import {useNavigation} from '@react-navigation/native'

export default function SearchList({data}){

    const navigation = useNavigation();

    return(
        //abaixo: em navigation, deve ser passado os parametros title e
        //userId, conforme solicitado no PostUser(PostList/index.js)
        //os parametros são do usuários que estamos estauqueando
        //Container é um TouchableOpacity
        <Container onPress={()=> navigation.navigate('PostsUser', 
        {title: data.nome, userId: data.id})}>
            <Name>{data.nome}</Name>
        </Container>
    )
}