import React, {useState} from "react";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {formatDistance} from 'date-fns';
import {ptBR} from 'date-fns/locale';
import firestore from '@react-native-firebase/firestore'
import {useNavigation} from '@react-navigation/native'

import { Container, Name, Header, Avatar, ContenView,
     Content, Actions, LikeButton, Like, TimePost } from "./styles";

export default function PostList({data, userId}){

    const navigation = useNavigation();    
    const [likePost,setLikePost]= useState(data?.likes);

    async function handleLikePost(id, likes){ //função btn like
        //abaixo: criando identificado do post
        const docId = `${userId}_${id}`;
        //abaixo: verifica se o post já foi curtido
        //criado tbm a coleção likes e localizando o idenfificador
        const doc = await firestore().collection('likes')
        .doc(docId).get();

        //abaixo: se o doc existir (se deu like no post) executa
        if(doc.exists){
            //já curtiu o post, então devemos remover o like
            await firestore().collection('posts').doc(id).update({
                likes: likes -1,
            })
            //agora que atualizou o fireStore, precisamos atualizar a
            //variavel doc criado acima, retirando o like de lá tbm
            await firestore().collection('likes').doc(docId).delete()
            .then(()=>{
                setLikePost(likes - 1) //atualiza a tela do user
            })
            return;
        }

        //abaixo: se não entrou no if acima, significia que precisamos  
        //dar +1 like Primeiro like da post
        await firestore().collection('likes').doc(docId).set({
            postId: id,
            userId: userId,
        })
        //abaixo: atualizando tela do user
        await firestore().collection('posts').doc(id).update({
            likes: likes +1,
        })
        .then(()=>{
            setLikePost(likes + 1)
        })

    }

    function fortmatTimePosts(){ //criar o text de qts tempo tem a publicação
        //abaixo, pega a data do firebase e formata em ano-mes-dia e time
        //console.log(new Date(data.created.seconds * 1000));

        const datePost = new Date(data.created.seconds * 1000);

        //abaixo: formatDistance vem do data-fns
        return formatDistance(
            //abaixo, a data de hoje
            new Date(),
            //em comparação com a data abaixo
            datePost,
            {
                locale: ptBR
            }

        )
    }

    return(
        <Container>
            <Header onPress={()=> navigation.navigate('PostsUser', 
                {title: data.autor, userId: data.userid})}>
                
                {data.avatarUrl ? ( //pega a foto do user se ñ tiver mostra a padrão 
                    <Avatar
                        source={{uri: data.avatarUrl}}
                    />                    
                    ) : 
                    (
                        <Avatar
                            source={require('../../assets/avatar.png')}
                        />
                    )
                }


                <Name numberOfLines={1} >{data?.autor}</Name>

            </Header>

            <ContenView>
                <Content>{data?.content}</Content>
            </ContenView>

            <Actions>
                <LikeButton onPress={()=> handleLikePost(data.id, likePost)}>

                    <Like>{likePost === 0 ? '' : likePost}</Like>
                    
                    <MaterialCommunityIcons
                        name={likePost === 0 ? "heart-plus-outline" : "cards-heart"}
                        size={20}
                        color='#e52246'
                    />

                </LikeButton>

                <TimePost>{fortmatTimePosts()}</TimePost>

            </Actions>

        </Container>
    )
}