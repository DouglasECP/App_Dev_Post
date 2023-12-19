import React, {useContext, useState, useEffect} from 'react';
import { View, Text, Modal, Platform } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage'

import {AuthContext} from '../../contexts/auth';
import {Header} from '../../components/Header';
import { Container , Name, Email, ButtonText, Button,
    UploadButton, Avatar, ModalContainer,
    ButtonBack, Inputname } from './styles';

export default function Profile() {

    const { singOut, user, setUser, storageUser } = useContext(AuthContext);

    const [nome,setNome] = useState(user?.nome);
    //abaixo: vai armazenar a Url da foto do user
    const [url,setUrl] = useState(null);
    //abaixo: controla o visible do modal
    const [openModal, setOpenModal] = useState(false);

    //abaixo:
    useEffect(()=>{
        async function loadAvatar(){
            //abaixo:variavel que controla a montagem e desmongatem o useEffect
            let isActive = true;
            try{
                if(isActive){
                    //abaixo: variavel que busca a img no storage, já que o nome do 
                    //arquivo é o uid do usuário.
                    let response = await storage().ref('users').child(user?.uid)
                    .getDownloadURL();
                    
                    setUrl(response);
                }

            }catch(err){
                alert("NÃO LOCALIZADO A FOTO")
            }
        }
        loadAvatar();
        //abaixo:para não carregar quando desmontar o componente
        return ()=> isActive = false;
    },[])

    //abaixo: desolga o usuário
    async function handleSingOut(){
        await singOut();
    }

    //abaixo: Atualiza o nome do perfil
    async function updateProfile(){
        //abaixo: verificar se foi digitado algo, se ñ foi
        //sai da função updateProfile
        if(nome === ''){
            return;
        }

        await firestore().collection('users').doc(user?.uid)
        .update({
            nome: nome
        })

        //abaixo:buscar tds os posts do user e att o nome dele
        const postDocs = await firestore().collection('posts')
        .where('userid', '==', user?.uid).get();

        //abaixo: Percorre tds os pots e att o nome
        postDocs.forEach(async doc =>{
            await firestore().collection('posts').doc(doc.id)
            .update({
                autor: nome
            })
        })

        let data = {
            uid: user.uid,
            nome: nome,
            email: user?.email,
        }

        setUser(data);
        storageUser(data);
        setOpenModal(false);
        alert('Nome atualizado!');

    }

    //abaixo: função para enviar foto do perfil do user
    function uploadFile(){
        
        const options = {
            noData: true,
            mediaType: 'photo'
        };
        //abaixo: lauch.. serve para acessar as imagens do celular
        launchImageLibrary(options, response => {
            //abaixo: se cancelou a solicitação de abrir a galeria
            if(response.didCancel){
                alert("CPF CANCELADO!")
            }else if(response.error){
                alert('Ops, parece que deu algum erro')
            }else{
                //abaixo: func que faz o envio da imagem ao storage
                uploadFirebase(response)
                .then(()=>{
                    //se enviou a imagem chama a função para att tds os
                    //posts do user com a nv imagem
                    uploadAvatarPosts();
                })
                //abaixo: pega a foto selecionada, e envia para a state.
                //para finalidade de att a foto de perfil
                setUrl(response.assets[0].uri);
            }
        })

    }

    //abaixo: extrai e retorna a URL da foto
    function getFileLocalPath(response){
        //abaixo:O user pode selec varias fotos, por isso que colocamos
        //na posição 0, assim enviando apenas 1 foto
        return response.assets[0].uri;
    }

    async function uploadFirebase(response){
        //abaixo: getFileLocalPath pega a URL original da imagem
        const fileSource = getFileLocalPath(response);
        //abaixo: na variavel, cria uma referencia no storage como users,
        //dentro cria a child (cria o nome do arquivo, que será a uid do user)
        const storageRef = storage().ref('users').child(user?.uid);
        //abaixo: com o caminho para salvar a foto salva na variavel
        //storageRef, então é chamado o putFile que executa o envio da img
        //img salva na variavel fileSource
        return await storageRef.putFile(fileSource);
    }

    async function uploadAvatarPosts(){
        //abaixo: pega a foto no firebase em storage
        const storageRef = storage().ref('users').child(user?.uid);
        //abaixo, recebe a url da pagina do firebase (storage)
        const url = await storageRef.getDownloadURL()
        .then(async (image)=>{
            //abaixo: variavel que vai até o firestorage e aplica o filtro
            //.where para pegar os posts do user
            const postDocs = await firestore().collection('posts')
            .where('userid', '==', user?.uid).get();

            //abaixo: com o caminho declarado, chamamos o lop forEach para
            //percorrer todos e inserir a imagem do user no post
            postDocs.forEach( async doc =>{
                await firestore().collection('posts').doc(doc.id)
                .update({
                    //atualiza a variavel do avatar com a image armazenada
                    //no .then
                    avatarUrl: image
                })
            })

        })
        .catch((error)=>{
            alert('Error ao atualizar fotos dos posts, error no console...');
            console.log(error);
        })
    }

    return (
        <Container>

            <Header/>

            {url ? 
                (
                    <UploadButton onPress={()=> uploadFile()}>

                        <Avatar
                            source={{ uri: url}}
                        />

                    </UploadButton>
                ) 
                : 
                (
                    <UploadButton onPress={()=> uploadFile()}>

                    </UploadButton>
                )
            }

            <Name>{user?.nome}</Name>
            <Email>{user?.email}</Email>

            <Button bg="#4282cd" onPress={()=> setOpenModal(true)}>
                <ButtonText color="#fff">Atualizar Perfil</ButtonText>
            </Button>

            <Button bg="#ddd" onPress={handleSingOut}>
                <ButtonText color="#353840">Sair</ButtonText>
            </Button>
            
            <Modal visible={openModal} animationType="slide" transparent={true}>
            
                <ModalContainer behavior={Platform.OS === 'android' ? '' : 'padding'}>

                    <ButtonBack onPress={()=> setOpenModal(false)}>

                        <Feather
                            name="arrow-left"
                            size={22}
                            color="#121212"
                        />

                        <ButtonText color="#121212">Voltar</ButtonText>

                    </ButtonBack>

                    <Inputname
                        placeholder={user?.nome}
                        value={nome}
                        onChangeText={(text) => setNome(text)}
                    />

                    <Button bg="#4282cd" onPress={updateProfile}>
                        <ButtonText color="#fff">Salvar</ButtonText>
                    </Button>

                </ModalContainer>

            </Modal>
            
        </Container>
  );
}