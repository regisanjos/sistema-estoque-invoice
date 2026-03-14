import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  // Criamos uma "memória" para guardar a lista de locais que virá do banco
  const [locais, setLocais] = useState([])
  const [status, setStatus] = useState('Buscando dados no servidor...')

  // Assim que a tela abrir, ele vai lá no seu back-end buscar os dados
  useEffect(() => {
    axios.get('http://localhost:3000/api/locais')
      .then(resposta => {
        setLocais(resposta.data) // Guarda os dados recebidos na memória
        setStatus('Conectado com sucesso ao Banco de Dados na Nuvem! 🚀')
      })
      .catch(erro => {
        console.error("Ops, deu erro:", erro)
        setStatus('Erro ao conectar com o servidor.')
      })
  }, [])

  return (
    <div style={{ padding: '45px', fontFamily: 'Arial', maxWidth: '650px', margin: '0 auto' }}>
      <h1 style={{ color: '#333' }}>Sistema de Estoque - Invoices</h1>

      <div style={{ padding: '15px', backgroundColor: '#e6f7ff', borderRadius: '8px', marginBottom: '20px' }}>
        <p style={{ margin: 0, color: '#0050b3', fontWeight: 'bold' }}>Status: {status}</p>
      </div>

      <h3>Locais de Armazenamento Cadastrados:</h3>

      {/* Aqui nós mandamos o React desenhar a lista na tela */}
      <ul style={{ fontSize: '18px', lineHeight: '1.6' }}>
        {locais.map(local => (
          <li key={local.id}>
            <strong>{local.nome}</strong> (ID: {local.id})
          </li>
        ))}
      </ul>

      {/* Mensagem caso o banco esteja vazio */}
      {locais.length === 0 && <p>Nenhum local cadastrado ainda.</p>}
    </div>
  )
}

export default App