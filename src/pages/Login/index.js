import React, {useState, useContext} from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

import {Container, Title, Input, Button, ButtonText, 
    SingUpButton, SingUpText} from './styles';
import { AuthContext } from '../../contexts/auth';

export default function Login() {

    //abaixo:começar sempre na tela de login
    const [login, setLoing] = useState(true);
    //abaixo: recebe o input do user p/login e cadastro
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    
    const { signUp, singIn, loadingAuth } = useContext(AuthContext);

    async function handleSignIn(){

        if(email === '' || password === ''){
            alert('Há campos a ser preenchido!')
            return;
        }

        //abaixo: o Context recebe o imput para login
        await singIn(email, password);
    }

    async function handleSignUp(){
        if(email === '' || password === '' || name === ''){
            alert('Há campos a ser preenchido!')
            return;
        }

        //abaixo: o Context recebe o imput para cadastro
        await signUp(email,password,name);

    }

    if(login){
        return (
            <Container>
                
                <Title>
                    Dev<Text style={{color:'#e52246'}}>Post</Text>
                </Title>
    
                <Input
                    placeholder="seuemail@teste.com"
                    value={email}
                    onChangeText={(texto) => setEmail(texto)}
                />
    
                <Input
                    placeholder="*************"
                    value={password}
                    onChangeText={(texto) => setPassword(texto)}
                    secureTextEntry={true}
                />
    
                <Button onPress={handleSignIn}>

                    {loadingAuth ? (
                        <ActivityIndicator size={20} color="#fff"/>
                    ) : <ButtonText>Acessar</ButtonText> }
    
                </Button>
    
                <SingUpButton onPress={()=> setLoing(false)}>
                    <SingUpText>Criar uma conta</SingUpText>
                </SingUpButton>
    
            </Container>
      );  
    }

    return (
        <Container>
            
            <Title>
                Dev<Text style={{color:'#e52246'}}>Post</Text>
            </Title>

            <Input
                placeholder="Seu nome"
                value={name}
                onChangeText={(texto) => setName(texto)}
            />

            <Input
                placeholder="seuemail@teste.com"
                value={email}
                onChangeText={(texto) => setEmail(texto)}
            />

            <Input
                placeholder="*************"
                value={password}
                onChangeText={(texto) => setPassword(texto)}
                secureTextEntry={true}
            />

            <Button onPress={handleSignUp}>
                {loadingAuth ? (
                    <ActivityIndicator size={20} color="#fff"/>
                    ) : <ButtonText>Cadastrar</ButtonText> }
            </Button>

            <SingUpButton onPress={()=> setLoing(true)}>
                <SingUpText>Já possuo uma conta</SingUpText>
            </SingUpButton>

        </Container>
  );
}