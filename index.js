const express = require('express')
const cors = require('cors')
const { BodyBuilder } = require('./src/bodybuilder/bodybuilder.entity')
const { Gym } = require('./src/gym/gym.entity')
const { Style } = require('./src/style/style.entity')
const app = express()
app.use(cors())
const port = 3000
app.use(express.json())


//banco de dados de clientes
var clientes = []

//banco de dados de academias
var academias = [
  {id: 1, nome: "Academia 1", telefone: "123456789", bodyBuilder: [] },
  {id: 2, nome: "Academia 2", telefone: "987654321", bodyBuilder: [] },
]

// banco de dados de estilos de body builders
var estilos = [
  {id: 1, nome: "Monstrão", bodyBuilder: [] },
  {id: 2, nome: "Frango", bodyBuilder: [] },
  {id: 3, nome: "Chassi de Grilo", bodyBuilder: [] },
  {id: 4, nome: "Esquelético", bodyBuilder: [] },
]

app.post("/body-builder", (req, res) => {
  const data = req.body;

  // Encontrar academia
  const idAcademia = data.idAcademia;
  const gym = academias.find((gym) => gym.id == idAcademia);

  // Encontrar estilo pelo id
  const idEstilo = data.idEstilo;
  const style = estilos.find((style) => style.id == idEstilo);

  if (!gym || !style) {
      return res.status(404).send("Academia ou Estilo não encontrado");
  }

  // Criar bodyBuilder
  let bodyBuilder = new BodyBuilder(data.nome, data.cpf, data.peso, data.altura, data.idade, style, gym);

  // Adicionar ao banco de dados
  clientes.push(bodyBuilder);
  res.send("Cadastrou com sucesso");

  // Retornar o cliente recém-criado
  res.json(bodyBuilder); // Retorna o body builder recém-criado
});


app.use((err, req, res, next) => {
  console.error(err.stack); // Loga o erro no console
  res.status(500).send("Ocorreu um erro no servidor!");
});


app.put('/body-builder/:cpf', (req, res) => {
  let cpf = req.params.cpf
  for(let i=0; i < clientes.length; i++){
    let cliente = clientes[i]
    if (cliente.cpf == cpf){
      const data = req.body

      // Localiza academia e estilo

      const idAcademia = data.idAcademia
      const gym = academias.find((academia) => academia.id == idAcademia)

      const idEstilo = data.idEstilo
      const style = estilos.find((estilo) => estilo.id == idEstilo);

      let bodyBuilder = new BodyBuilder(data.nome, data.cpf, data.peso, data.altura, data.idade, style, gym)
      clientes[i] = bodyBuilder

      //substitui o bodyBuilder pelos dados enviados no body
      return res.send("Atualizou")

       // Retornar o cliente atualizado
       // return res.json(bodyBuilder); // Retorna o body builder atualizado

      
    }
  }
  throw new Error("Body builder nao encontrado")
})

app.delete("/body-builder/:cpf", (req, res) => {
  let cpf = req.params.cpf
  for (let i = 0; i < clientes.length; i++) {
    let cliente = clientes[i]
    if (cliente.cpf == cpf) {
        clientes.splice(i, 1) // Remove do vetor o cliente encontrado
        return res.send("Deletou")
    }
   throw new Error("Cliente não encontrado")
}
    res.send("Deletou")
})

// Rota para buscar clientes (com ou sem filtro)
app.get("/body-builder", (req, res) => {
  const searchQuery = req.query.search ? req.query.search.toLowerCase() : '';

  const clientesFiltrados = clientes.filter(cliente => {
      return (
          cliente.nome.toLowerCase().includes(searchQuery) ||
          cliente.cpf.toLowerCase().includes(searchQuery)
      );
  });

  // Inclui estilo completo no cliente
  const resultado = clientesFiltrados.map(cliente => {
      const estilo = estilos.find(e => e.nome === cliente.estilo);
      return {
          ...cliente,
          estilo: estilo ? estilo.nome : 'Desconhecido',
      };
  });

  res.json(resultado); // Retorna os clientes com o estilo completo
});


app.post('/gym', (req, res) =>{
  const data = req.body
  let gym = new Gym()
  gym.nome = data.nome
  gym.telefone = data.telefone
  academias.push(gym)
  res.send("cadastrou")
})

app.get('/gym', (req, res) =>{
  res.json(academias)
})

// Inicia o servidor na porta especificada
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
})