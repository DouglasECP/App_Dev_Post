import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { Container, Title } from "./styles";

export function Header(){
    return(
        <Container>
            <Title>
                DEV
                <Text style={styles.titulo}>Post</Text>
            </Title>
        </Container>
    )
}

const styles = StyleSheet.create({
    titulo:{fontStyle:'italic',
     color:'#e52246',
    }
})