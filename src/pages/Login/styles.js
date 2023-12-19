import styled from 'styled-components/native'

export const Container = styled.View`
    flex:1;
    background:#36393f;
    justify-content:center;
    align-items:center;
`;

export const Title = styled.Text`
    color:#fff;
    font-size:55px;
    font-weight:bold;
    font-style:italic
`;

export const Input = styled.TextInput`
    width:80%;
    background:#fff;
    margin-top:10px;
    padding:10px;
    border-radius:8px;
    font-size:17px;
`;

export const Button = styled.TouchableOpacity`
    width:80%;
    background:#418cfd;
    border-radius:8px;
    margin-top:10px;
    padding:10px;
    align-items:center;
    justify-content:center;
`;

export const ButtonText = styled.Text`
    color: #fff;
    font-size:20px;
`;

export const SingUpButton = styled.TouchableOpacity`
    width:100%;
    margin-top:10px;
    justify-content:center;
    align-items:center
`;

export const SingUpText = styled.Text`
    color:#ddd;
    font-size:15px;
`;