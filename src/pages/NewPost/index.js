import React, {useState, useLayoutEffect, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import {AuthContext} from '../../contexts/auth'
import { Container, Input, Button, ButtonText } from './styles';

export default function NewPost() {

    const { user } = useContext(AuthContext);

    const navigation = useNavigation();

    const [post, setPost] = useState("");

    useLayoutEffect(()=>{ //ñ é async (1º carrega ele dps a pag.)

        const options = navigation.setOptions({
            //abaixo: func anonima que já retorna o btn
            headerRight: () => (
                <Button onPress={() => handlePost()}>
                    <ButtonText>Compartilhar</ButtonText>
                </Button>
            )
        })

    },[navigation, post])

    async function handlePost(){ //func. para postagem
        if(post === ''){
            alert("Sem conteudo no post!");
            return;
        }

        let avatarUrl = null;

        try{ //executa e se der erro executa o catch
            //abaixo: vai no storage, procura dentro de users
            //o user logado por ID, e baixa a url de acesso
            //tem o ? caso não achar ñ feche o app e vai p/catch
            let response = await storage().ref('users')
            .child(user?.uid).getDownloadURL();
            //abaixo: recebe o URL
            avatarUrl = response;

        }catch(err){
            avatarUrl = null;
        }

        //abaixo: add() é p/ criar um num aleatorio
        //add é um promise
        await firestore().collection('posts').add({
            created: new Date(),
            content: post,
            autor: user?.nome,
            userid: user?.uid,
            likes: 0,
            avatarUrl,
        }).then(() => {
            setPost('');
            alert('Postando seu post...')
        }).catch((error)=>{
            alert('Erro ao criar seu post (VER NO CONSOLE)');
            console.log(`ERRO: ${error}`);
        })
        //abaixo: voltar o stack para trás
        navigation.goBack();

    }

    return (
        <Container>
            <Input
                placeholder="O que está acontecendo?"
                placeholderTextColor="#ddd"
                value={post}
                onChangeText={(texto)=> setPost(texto)}
                autoCorrect={false} //s.corretor otografico
                multiline={true}//cx de txt com varias linhas
                maxLength={300}//qtd de caracter maximo
            />
        </Container>
  );
}