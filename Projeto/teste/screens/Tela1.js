import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function Tela1({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    console.log('BOTÃO ENTRAR CLICADO');

    setMensagem('');

    if (!usuario.trim() || !senha) {
      setMensagem('Digite seu e-mail e sua senha.');
      return;
    }

    try {
      setCarregando(true);

      console.log('Tentando login...');
      console.log('E-mail:', usuario.trim());

      const credencial = await signInWithEmailAndPassword(
        auth,
        usuario.trim(),
        senha
      );

      console.log('LOGIN REALIZADO COM SUCESSO');
      console.log('UID:', credencial.user.uid);
      console.log('E-mail:', credencial.user.email);

      setMensagem('Login realizado com sucesso!');

      navigation.navigate('Tela2');

    } catch (error) {
      console.log('ERRO NO LOGIN');
      console.log('Código:', error.code);
      console.log('Mensagem:', error.message);
      console.log('Erro completo:', error);

      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          setMensagem('E-mail ou senha incorretos.');
          break;

        case 'auth/invalid-email':
          setMensagem('Digite um e-mail válido.');
          break;

        case 'auth/user-disabled':
          setMensagem('Este usuário está desativado.');
          break;

        case 'auth/too-many-requests':
          setMensagem(
            'Muitas tentativas. Aguarde alguns minutos e tente novamente.'
          );
          break;

        case 'auth/network-request-failed':
          setMensagem(
            'Erro de conexão com o Firebase.'
          );
          break;

        case 'auth/operation-not-allowed':
          setMensagem(
            'O login por e-mail e senha não está habilitado no Firebase.'
          );
          break;

        case 'auth/invalid-api-key':
          setMensagem(
            'A chave da API do Firebase é inválida.'
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

  function irParaCadastro() {
    navigation.navigate('Cadastro');
  }

  return (
    <View style={styles.container}>

      <View style={styles.formulario}>

        <Text style={styles.titulo}>
          Login
        </Text>

        <Text style={styles.label}>
          E-mail
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          value={usuario}
          onChangeText={setUsuario}
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
              mensagem === 'Login realizado com sucesso!'
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
            carregando && styles.botaoDesabilitado,
          ]}
          onPress={entrar}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />
          ) : (
            <Text style={styles.textoBotao}>
              Entrar
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoSecundario}
          onPress={irParaCadastro}
          disabled={carregando}
        >
          <Text style={styles.textoBotaoSecundario}>
            Criar uma conta
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