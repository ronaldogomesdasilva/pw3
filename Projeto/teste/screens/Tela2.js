import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';

import { signOut } from 'firebase/auth';

import {
  ref,
  push,
  set,
  onValue,
  update,
  remove,
} from 'firebase/database';

import {
  auth,
  database,
} from '../firebaseConfig';

export default function Tela2({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  const [contatos, setContatos] = useState([]);
  const [idEditando, setIdEditando] = useState(null);
  const [mensagem, setMensagem] = useState('');

  // =====================================================
  // READ - CARREGAR CONTATOS
  // =====================================================

  useEffect(() => {
    const contatosRef = ref(
      database,
      'contatos'
    );

    const unsubscribe = onValue(
      contatosRef,
      (snapshot) => {
        const dados = snapshot.val();

        if (dados) {
          const lista = Object.keys(dados).map(
            (id) => ({
              id: id,
              ...dados[id],
            })
          );

          setContatos(lista);
        } else {
          setContatos([]);
        }
      },
      (error) => {
        console.log(
          'ERRO AO BUSCAR CONTATOS:',
          error
        );

        setMensagem(
          'Erro ao carregar os contatos.'
        );
      }
    );

    return () => unsubscribe();

  }, []);


  // =====================================================
  // CREATE - CADASTRAR
  // =====================================================

  async function cadastrar() {
    setMensagem('');

    if (
      !nome.trim() ||
      !email.trim() ||
      !telefone.trim()
    ) {
      setMensagem(
        'Preencha todos os campos.'
      );

      return;
    }

    try {
      const contatosRef = ref(
        database,
        'contatos'
      );

      const novoContatoRef =
        push(contatosRef);

      await set(
        novoContatoRef,
        {
          nome: nome.trim(),
          email: email.trim(),
          telefone: telefone.trim(),
        }
      );

      setMensagem(
        'Contato cadastrado com sucesso!'
      );

      limparCampos();

    } catch (error) {
      console.log(
        'ERRO AO CADASTRAR:',
        error
      );

      setMensagem(
        'Erro ao cadastrar o contato.'
      );
    }
  }


  // =====================================================
  // EDITAR
  // =====================================================

  function editar(contato) {
    setNome(contato.nome);
    setEmail(contato.email);
    setTelefone(contato.telefone);

    setIdEditando(contato.id);

    setMensagem(
      'Edite os dados e clique em Salvar alterações.'
    );
  }


  // =====================================================
  // UPDATE - SALVAR EDIÇÃO
  // =====================================================

  async function salvarEdicao() {
    setMensagem('');

    if (
      !nome.trim() ||
      !email.trim() ||
      !telefone.trim()
    ) {
      setMensagem(
        'Preencha todos os campos.'
      );

      return;
    }

    try {
      const contatoRef = ref(
        database,
        `contatos/${idEditando}`
      );

      await update(
        contatoRef,
        {
          nome: nome.trim(),
          email: email.trim(),
          telefone: telefone.trim(),
        }
      );

      setMensagem(
        'Contato atualizado com sucesso!'
      );

      limparCampos();

    } catch (error) {
      console.log(
        'ERRO AO ATUALIZAR:',
        error
      );

      setMensagem(
        'Erro ao atualizar o contato.'
      );
    }
  }


  // =====================================================
  // DELETE - EXCLUIR
  // =====================================================

  async function excluir(id) {
    try {
      const contatoRef = ref(
        database,
        `contatos/${id}`
      );

      await remove(contatoRef);

      setMensagem(
        'Contato excluído com sucesso!'
      );

      if (idEditando === id) {
        limparCampos();
      }

    } catch (error) {
      console.log(
        'ERRO AO EXCLUIR:',
        error
      );

      setMensagem(
        'Erro ao excluir o contato.'
      );
    }
  }


  // =====================================================
  // LIMPAR CAMPOS
  // =====================================================

  function limparCampos() {
    setNome('');
    setEmail('');
    setTelefone('');
    setIdEditando(null);
  }


  // =====================================================
  // CANCELAR EDIÇÃO
  // =====================================================

  function cancelarEdicao() {
    limparCampos();
    setMensagem('');
  }


  // =====================================================
  // LOGOUT
  // =====================================================

  async function sair() {
    try {
      await signOut(auth);

      navigation.navigate('Tela1');

    } catch (error) {
      console.log(
        'ERRO AO SAIR:',
        error
      );

      setMensagem(
        'Não foi possível sair da conta.'
      );
    }
  }


  // =====================================================
  // RENDERIZAR LINHA DA LISTA
  // =====================================================

  function renderizarContato({ item }) {
    return (
      <View style={styles.linhaContato}>

        <View style={styles.colunaNome}>
          <Text style={styles.textoNome}>
            {item.nome}
          </Text>
        </View>

        <View style={styles.colunaEmail}>
          <Text style={styles.textoLista}>
            {item.email}
          </Text>
        </View>

        <View style={styles.colunaTelefone}>
          <Text style={styles.textoLista}>
            {item.telefone}
          </Text>
        </View>

        <View style={styles.colunaAcoes}>

          <TouchableOpacity
            style={styles.botaoEditarLista}
            onPress={() => editar(item)}
          >
            <Text style={styles.textoBotaoLista}>
              Editar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoExcluirLista}
            onPress={() => excluir(item.id)}
          >
            <Text style={styles.textoBotaoLista}>
              Excluir
            </Text>
          </TouchableOpacity>

        </View>

      </View>
    );
  }


  // =====================================================
  // TELA
  // =====================================================

  return (
    <View style={styles.container}>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.conteudo}
      >

        <Text style={styles.titulo}>
          Cadastro de Contatos
        </Text>


        <Text style={styles.label}>
          Nome
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Digite o nome"
          value={nome}
          onChangeText={setNome}
        />


        <Text style={styles.label}>
          E-mail
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Digite o e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />


        <Text style={styles.label}>
          Telefone
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Digite o telefone"
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />


        {mensagem !== '' && (
          <Text style={styles.mensagem}>
            {mensagem}
          </Text>
        )}


        {idEditando === null ? (

          <TouchableOpacity
            style={styles.botaoCadastrar}
            onPress={cadastrar}
          >
            <Text style={styles.textoBotao}>
              Cadastrar
            </Text>
          </TouchableOpacity>

        ) : (

          <>

            <TouchableOpacity
              style={styles.botaoSalvar}
              onPress={salvarEdicao}
            >
              <Text style={styles.textoBotao}>
                Salvar alterações
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoCancelar}
              onPress={cancelarEdicao}
            >
              <Text style={styles.textoCancelar}>
                Cancelar edição
              </Text>
            </TouchableOpacity>

          </>

        )}


        <Text style={styles.subtitulo}>
          Contatos cadastrados
        </Text>


        {contatos.length === 0 ? (

          <Text style={styles.listaVazia}>
            Nenhum contato cadastrado.
          </Text>

        ) : (

          <>

            <View style={styles.cabecalhoLista}>

              <View style={styles.colunaNome}>
                <Text style={styles.textoCabecalho}>
                  Nome
                </Text>
              </View>

              <View style={styles.colunaEmail}>
                <Text style={styles.textoCabecalho}>
                  E-mail
                </Text>
              </View>

              <View style={styles.colunaTelefone}>
                <Text style={styles.textoCabecalho}>
                  Telefone
                </Text>
              </View>

              <View style={styles.colunaAcoes}>
                <Text style={styles.textoCabecalho}>
                  Ações
                </Text>
              </View>

            </View>

            <FlatList
              data={contatos}
              keyExtractor={(item) => item.id}
              renderItem={renderizarContato}
              scrollEnabled={false}
            />

          </>

        )}


        <TouchableOpacity
          style={styles.botaoSair}
          onPress={sair}
        >
          <Text style={styles.textoBotao}>
            Sair
          </Text>
        </TouchableOpacity>

      </ScrollView>

    </View>
  );
}


// =====================================================
// ESTILOS
// =====================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scroll: {
    flex: 1,
  },

  conteudo: {
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
    padding: 20,
    paddingBottom: 50,
  },

  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
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
    marginBottom: 18,
  },

  mensagem: {
    fontSize: 14,
    textAlign: 'center',
    color: '#305BD3',
    marginBottom: 15,
  },

  botaoCadastrar: {
    width: '100%',
    height: 50,
    backgroundColor: '#305BD3',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  botaoSalvar: {
    width: '100%',
    height: 50,
    backgroundColor: '#305BD3',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  botaoCancelar: {
    width: '100%',
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#777777',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  textoCancelar: {
    color: '#555555',
    fontSize: 16,
    fontWeight: '600',
  },

  textoBotao: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  subtitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 35,
    marginBottom: 15,
    color: '#222222',
  },

  listaVazia: {
    textAlign: 'center',
    color: '#777777',
    fontSize: 15,
    marginVertical: 20,
  },

  cabecalhoLista: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F4F8',
    borderBottomWidth: 2,
    borderBottomColor: '#305BD3',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },

  linhaContato: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },

  colunaNome: {
    flex: 2,
    paddingRight: 10,
  },

  colunaEmail: {
    flex: 2.5,
    paddingRight: 10,
  },

  colunaTelefone: {
    flex: 1.5,
    paddingRight: 10,
  },

  colunaAcoes: {
    flex: 1.8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
  },

  textoCabecalho: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222222',
  },

  textoNome: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222222',
  },

  textoLista: {
    fontSize: 14,
    color: '#555555',
  },

  botaoEditarLista: {
    backgroundColor: '#305BD3',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },

  botaoExcluirLista: {
    backgroundColor: '#D32F2F',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },

  textoBotaoLista: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },

  botaoSair: {
    width: '100%',
    height: 50,
    backgroundColor: '#D32F2F',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 35,
  },

});