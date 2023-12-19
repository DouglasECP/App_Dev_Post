import React, {useState, createContext, useEffect} from 'react';
//abaixo, import conexão ao login do firebase
import auth from '@react-native-firebase/auth';
//abaixo: import conexão ao database do firebase
import firestore from '@react-native-firebase/firestore';
//abaixo: armazeno o user após login
import AsyncStorage from '@react-native-async-storage/async-storage'

export const AuthContext = createContext({});

export default function AuthProvider({children}){

    //abaixo: dados do usuário logado
    const [user, setUser] = useState(null);
    //abaixo: está efetuando loading do usuário?
    const [loadingAuth, setLoadingAuth] = useState(false);
    //abaixo:quando abrir o app para pegar o ultimo user logado
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        async function loadingStoarge(){
            const storageUser = await AsyncStorage.getItem('@devapp');

            if(storageUser){ //tem algo dentro de storageUser?
                //abaixo: passando para o useState User o ultomo usuário
                //logado, converter o salve que estava em string em JSON
                setUser(JSON.parse(storageUser))
                setLoading(false);
            }
            setLoading(false);
        }
        loadingStoarge();
    },[])

    //abaixo: função para cadastrar user
    async function signUp(email, password, name){
        setLoadingAuth(true);
        //abaixo: passa email e senha para o firebase cadastrar
        await auth().createUserWithEmailAndPassword(email,password)
        .then(async (value)=>{
            //abaixo: pega o id do usuário cadastrado
            let uid = value.user.uid;
            //abaixo: cria no database a coleção "users"
            await firestore().collection('users')
            //abaixo: cadastra o id do user no database e set p/ cadastrar +
            .doc(uid).set({
                nome: name,
                createdAT: new Date(),
            }).then(()=>{ //set é um promise, possui then e catch
                //abaixo: dentro do then do set, quero passar a useState user 
                //os dados do usuário.
                let data = {
                    uid: uid,
                    nome: name,
                    email: value.user.email
                }
                setUser(data);
                storageUser(data);
                setLoadingAuth(false);
            }) 
        })
        .catch((error)=>{ //se der erro ao tentar cadastrar o user (a partir da ln 16)
            console.log(error);
            setLoadingAuth(false);
        })
    }

    async function singIn(email, password){
        setLoadingAuth(true);
        await auth().signInWithEmailAndPassword(email,password)
        .then(async (value)=>{
            //abaixo, pega o id do user que está efetuando login
            let uid = value.user.uid;
            //abaixo: pega do banco os dado do user dentro do id do user
            const userProfile = await firestore().collection('users').doc(uid).get();

            let data = {
                uid: uid,
                nome: userProfile.data().nome,
                email: value.user.email
            };

            setUser(data);
            storageUser(data);
            setLoadingAuth(false);

        })
        .catch((error)=>{
            console.log(error);
            setLoadingAuth(false);
        })
    }

    async function singOut(){
        await AsyncStorage.clear()
        .then( ()=>{
            setUser(null);
        })
    }

    async function storageUser(data){
        //abaixo: salva no item '@devapp' no formato string
        await AsyncStorage.setItem('@devapp', JSON.stringify(data))
    }

    return(
        <AuthContext.Provider value={{signed: !!user, signUp, singIn, singOut, user, setUser,
        loadingAuth, loading, storageUser}}>
            {children}
        </AuthContext.Provider>
    )
}