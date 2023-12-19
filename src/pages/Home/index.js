import React, {useState, useContext, useCallback} from 'react';
import { Text, ActivityIndicator, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation, useFocusEffect} from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore';

import { Header } from '../../components/Header';
import { Container, ButtonPost, ListPost } from './styles';
import {AuthContext} from '../../contexts/auth';
import PostList from '../../components/PostList';


export default function Home() {
    //abaixo: postagem a exebir na tela home
    const [posts, setPosts] = useState([]);
    //abaixo: carregando post do firestone
    const [loading, setLoading] = useState(true);
    //abaixo: estado para att a home ao puxar para cima td a tela
    const [loadingRefresh,setLoadingRefresh] = useState(false);
    //abaixo: armazena o ultimo item renderizado da flatList
    const [lastItem, setLastItem] = useState('');
    //abaixo: caso a lista esteja vazia (sem mais o que renderizar)
    const [emptyList, setEmptyList] = useState(false);

    const navigation = useNavigation();

    const { user } = useContext(AuthContext);

    //abaixo: igual a useEffect, porem att td vez que voltar a home
    useFocusEffect(
        useCallback(()=>{
            let isActive = true;

            function fetchPosts(){
                //abaixo: vai em post e ordena a data por decrescente
                //com limite de 5 post, get é uma promise
                firestore().collection('posts').orderBy('created', 'desc')
                .limit(5).get()
                .then((snapshot)=>{

                    if(isActive){ //garante que só att se estiver na tela

                        setPosts([]);

                        const postList = [];

                        snapshot.docs.map( u => { //percorre tds os documentos
                            postList.push({
                                ...u.data(),
                                id: u.id
                            })
                        })
                        
                        //abaixo: lista esta vazia?
                        //se tiver algo retorna false, se ñ tiver retorna true
                        setEmptyList(!!snapshot.empty)
                        setPosts(postList);
                        //abaixo: salva na state o ultimo item renderizado na lista
                        setLastItem(snapshot.docs[snapshot.docs.length -1]);
                        setLoading(false);

                    }
                })

            }

            fetchPosts();
            //abaixo: executa td vez que sair da tela home
            return () => {
                isActive = false;
            }

        },[])
    )

    async function handleRefrechPosts(){ //buscar nvs pots qd puxar para cima
        //abaixo: garente que a animação de recarregar fique ativo
        setLoadingRefresh(true);

        //abaixo: vai em post e ordena a data por decrescente
        //com limite de 5 post, get é uma promise
        firestore().collection('posts').orderBy('created', 'desc')
        .limit(5).get()
        .then((snapshot)=>{


            setPosts([]);

            const postList = [];

            snapshot.docs.map( u => { //percorre tds os documentos
                postList.push({
                    ...u.data(),
                    id: u.id
                })
            })
                            
            //abaixo: lista esta vazia?
            //se tiver algo retorna false, se ñ tiver retorna true
            setEmptyList(false)
            setPosts(postList);
            //abaixo: salva na state o ultimo item renderizado na lista
            setLastItem(snapshot.docs[snapshot.docs.length -1]);
            setLoading(false);

        })

        setLoadingRefresh(false);

    }


    async function getListPosts(){ //buscar + posts ao chegar no final da lista

        if(emptyList){
            //abaixo: se bustou td a lista, retiramos o loading
            setLoading(false);
            return null;
        }

        if(loading) return;

        firestore().collection('posts').orderBy('created', 'desc')
        //abaixo: startAfter é cmç a buscar após o item (no caso o ultimo item da lista)
        .limit(5).startAfter(lastItem).get()
        .then((snapshot)=>{
            const postList = [];

            snapshot.docs.map( u => {
                postList.push({
                    ...u.data(),
                    id:u.id,})
                }
            )

            //se tiver algo retorna false, se ñ tiver retorna true
            setEmptyList(!!snapshot.empty)
            setLastItem(snapshot.docs[snapshot.docs.length -1])
            //abaixo: oldPosts é todos os Posts que já temos
            //postList é os novos post pra inserir a lista q já existe
            setPosts(oldPosts => [...oldPosts, ...postList]);
            setLoading(false);

        })

    }

    return (
        <Container>
            <Header/>

            {loading ? 
                (
                    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                        <ActivityIndicator size={50} color="#e52246"/>
                    </View>
                ) : (
                    <ListPost
                        //abaixo: desativa a rolagem
                        showsVerticalScrollIndicator={false}
                        data={posts}
                        renderItem={({item})=> (
                            <PostList        
                                data={item}
                                userId={user?.uid}
                            />
                        ) }

                        //abaixo: mostra a animação de carregar do flatlist
                        //se estiver true ele mostra, caso contrario ñ
                        refreshing={loadingRefresh}
                        //abaixo: ao puxar para cima para recarregar, chama a func
                        onRefresh={handleRefrechPosts}
                        //abaixo: onEndReached quando chegar no final da lista executa
                        onEndReached={()=> getListPosts() }
                        //abaixo: controlando o quão perto chegar ao final da lista para 
                        //executar o onEndReached,0.1 é igual a 10% para chegar no final da list
                        onEndReachedThreshold={0.1}
                    />
                )
            }
            
            <ButtonPost 
                activeOpacity={0.8}
                onPress={()=> navigation.navigate('NewPost')}
            >
                <Feather
                    name='edit-2'
                    color='#fff'
                    size={25}
                />
            </ButtonPost>

        </Container>
  );
}