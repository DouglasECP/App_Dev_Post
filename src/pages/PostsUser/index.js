import React, {useLayoutEffect, useState, useCallback, 
    useContext} from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation, 
    useFocusEffect } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

import PostList from '../../components/PostList';
import { Container, ListPosts } from './styles';
import {AuthContext} from '../../contexts/auth'

export default function PostsUser() {
    //abaixo: puxa as propriedades
    const route = useRoute();
    //abaixo: navegação(repassando o titulo da barra superior)
    const navigation = useNavigation();
    //abaixo: armazenando o nome do user
    const [title,setTitle] = useState(route.params?.title);
    //abaixo: armazena o post do user, usado em useCallback
    const [posts,setPosts] = useState([]);
    //abaixo: loading do useFocusEffect
    const [loading,setLoading] = useState(true);
    //abaixo, pega os dado do context
    const {user} = useContext(AuthContext);

    useLayoutEffect(()=>{
        //abaixo, envia a propriedade que é o nome do user
        //para renomear a barra superior
        navigation.setOptions({
            title: title === '' ? '' : title
        })
    },[navigation, title])

    //abaixo, pega os pots só quando esta na tela de post do user
    useFocusEffect(
        useCallback(()=>{
            //abaixo: variavel para habilitar o loading, garantindo
            //que não carregue quando estiver em outra tela
            let isActive = true;
            //abaixo: .where busca tds os pots do user por id
            //o routes vem de PostList: index
            firestore().collection('posts')
            .where('userid','==', route.params?.userId)
            .orderBy('created','desc').get()
            .then((snapshot)=>{
                const postList = [];

                snapshot.docs.map((u)=>{
                    //abaixo: como o u tem tds os itens do post,
                    //vamos armazenar em postList para salvar
                    postList.push({
                        ...u.data(),
                        id: u.id //id do post, não salvo acima
                    })
                })

                if(isActive){
                    setPosts(postList);
                    setLoading(false);
                }

            })

            return ()=>{
                isActive = false;
            }
        },[])
    )

    return (
        <Container>

            {loading ? 
                (
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <ActivityIndicator size={50} color="#E52246"/>
                </View>
                ) : (
                <ListPosts
                    showsVerticalScrollIndicator={false}
                    data={posts}
                    renderItem={({item}) => <PostList data={item} userId={user.uid}/>}
                />
            )}

        </Container>
  );
}