const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');

const prisma = new PrismaClient(); 
const app = express();
const upload = multer({dest: 'upload'});
const fs = require('fs');
const pdf = require('pdf-parse');

const port = 3000;

app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/api/teste', (req, res) => {
 
  res.json({ mensagem: 'Servidor back-end rodando perfeitamente!', 
  });             
   });
app.post('/api/upload', upload.single('documento'), async (req, res)=> {
  try {
    if (!req.file) {
      return res.status(400).json({ erro: 'Nenhum arquivo recebido!' });
    }

    const caminhoDoArquivo = req.file.path;
    const bufferDoArquivo = fs.readFileSync(caminhoDoArquivo);

    // Agora a ferramenta clássica vai funcionar direto!
    const dadosDoPdf = await pdf(bufferDoArquivo);
    
    res.json({ 
      mensagem: 'PDF lido com sucesso!', 
      textoExtraido: dadosDoPdf.text    
    });

  } catch (error) {
    console.error("Erro real ao ler pdf:", error);
    res.status(500).json({ erro: 'Não consegui ler o arquivo PDF' });
  }
});

// Rota para Criar um Local de Armazenamento
app.post('/api/locais', async (req, res) => {
  try {
    const novoLocal = await prisma.localArmazenamento.create({
      data: {
        nome: req.body.nome
      }
    });
    res.status(201).json(novoLocal); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Falha ao criar o local no banco de dados' });
  }
});

// Rota para Listar os Locais
app.get('/api/locais', async (req, res) => {
  try {
    const locais = await prisma.localArmazenamento.findMany();
    res.json(locais);
  } catch (error) {
    res.status(500).json({ erro: 'Falha ao buscar locais' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});