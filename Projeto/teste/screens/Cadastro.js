import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function Cadastro({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function cadastrar() {
    setMensagem('');

    console.log('BOTÃO CADASTRAR FOI CLICADO');
    console.log('E-mail:', email);

    if (!email.trim() || !senha) {
      setMensagem('Preencha o e-mail e a senha.');
      return;
    }

    if (senha.length < 6) {
      setMensagem(
        'A senha precisa ter pelo menos 6 caracteres.'
      );
      return;
    }

    try {
      setCarregando(true);

      console.log(
        'Tentando criar usuário no Firebase...'
      );

      const resultado =
        await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          senha
        );

      console.log(
        'USUÁRIO CRIADO:',
        resultado.user.uid
      );

      console.log(
        'E-mail:',
        resultado.user.email
      );

      setMensagem(
        'Usuário cadastrado com sucesso!'
      );

      setTimeout(() => {
        navigation.navigate('Tela1');
      }, 1000);

    } catch (error) {
      console.log('ERRO FIREBASE:', error);
      console.log('CÓDIGO:', error.code);
      console.log('MENSAGEM:', error.message);

      switch (error.code) {
        case 'auth/email-already-in-use':
          setMensagem(
            'Este e-mail já está cadastrado.'
          );
          break;

        case 'auth/invalid-email':
          setMensagem(
            'Digite um endereço de e-mail válido.'
          );
          break;

        case 'auth/weak-password':
          setMensagem(
            'A senha informada é muito fraca.'
          );
          break;

        case 'auth/network-request-failed':
          setMensagem(
            'Erro de conexão com o Firebase.'
          );
          break;

        case 'auth/operation-not-allowed':
          setMensagem(
            'O cadastro por e-mail e senha não está habilitado no Firebase.'
          );
          break;

        default:
          setMensagem(
            `Erro: ${error.code || error.message}`
          );
      }

    } finally {
      setCarregando(false);
    }
  }

  function voltarLogin() {
    navigation.navigate('Tela1');
  }

  return (
    <View style={styles.container}>

      <View style={styles.formulario}>

        <Text style={styles.titulo}>
          Cadastro
        </Text>

        <Text style={styles.label}>
          E-mail
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />

        <Text style={styles.label}>
          Senha
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={true}
        />

        {mensagem !== '' && (
          <Text
            style={[
              styles.mensagem,
              mensagem ===
              'Usuário cadastrado com sucesso!'
                ? styles.mensagemSucesso
                : styles.mensagemErro,
            ]}
          >
            {mensagem}
          </Text>
        )}

        <TouchableOpacity
          style={[
            styles.botao,
            carregando &&
              styles.botaoDesabilitado,
          ]}
          onPress={cadastrar}
          disabled={carregando}
          activeOpacity={0.7}
        >

          {carregando ? (
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />
          ) : (
            <Text style={styles.textoBotao}>
              Cadastrar
            </Text>
          )}

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoSecundario}
          onPress={voltarLogin}
          disabled={carregando}
          activeOpacity={0.7}
        >

          <Text
            style={
              styles.textoBotaoSecundario
            }
          >
            Voltar para Login
          </Text>

        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },

  formulario: {
    width: '100%',
    maxWidth: 400,
  },

  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 35,
    color: '#222222',
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#222222',
  },

  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },

  mensagem: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },

  mensagemErro: {
    color: '#D32F2F',
  },

  mensagemSucesso: {
    color: '#2E7D32',
  },

  botao: {
    width: '100%',
    height: 50,
    backgroundColor: '#305BD3',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  botaoDesabilitado: {
    opacity: 0.6,
  },

  textoBotao: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  botaoSecundario: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#305BD3',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },

  textoBotaoSecundario: {
    color: '#305BD3',
    fontSize: 17,
    fontWeight: 'bold',
  },

});