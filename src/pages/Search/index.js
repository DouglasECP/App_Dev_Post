import React, {useState, useEffect} from 'react';
import { View, Text, FlatList } from 'react-native';
import firestore from '@react-native-firebase/firestore'
import Feather from 'react-native-vector-icons/Feather'

import { Container, AreaInput, Input, List } from './styles';
import SearchList from '../../components/SearchList';

export default function Search() {

    const [input, setInput] = useState("");
    const [user, setUser] = useState([]);

    //abaixo: eseEffect busca os nomes na firebase, está sendo
    //usado o useEffect pq quando mudar a state input ele já busca
    //no firestore se tem o nome digitado lá
    useEffect(()=>{

        if(input === '' || input === undefined){
            setUser([]);
            return;
        }

        const subscriber = firestore().collection('users')
        //abaixo:se o nome dos users cadastrados é maior ou igual
        //ao digitado pelo user do app
        .where('nome', '>=', input)
        //abaixo:se o nome dos users cadastrados é menor ou igual
        //ao digitado pelo user do app
        //quando usar a compa. de mair ou igual + menor ou igual,
        //será necessario inserir o "\uf8ff" confm. doc do firestore
        .where('nome','<=',input + "\uf8ff")
        //abaixo: real time, toda hr buscando
        .onSnapshot((snapshot)=>{
            const listUser = [];
            //abaixo: forEach percorre td o que encontrou
            snapshot.forEach(doc =>{
                listUser.push({
                    ...doc.data(),
                    id:doc.id, //uid do user
                })
            })
            
            setUser(listUser);

        })
        //abaixo: garante que não vai ficar pesquisando quando fechar
        //a tela
        return () => subscriber();

    },[input])

    return (
        <Container>

            <AreaInput>

                <Feather
                    name="search"
                    size={20}
                    color="#E52246"
                />

                <Input
                    placeholder="Procurando alguem?"
                    value={input}
                    onChangeText={(text) => setInput(text)}
                    //altera a cor do placeholder acima
                    placeholderTextColor="#353840"
                />

            </AreaInput>

            <List
                data={user}
                renderItem={({item})=> <SearchList data={item}/>}
            />

        </Container>
  );
}