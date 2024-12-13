const express = require('express')
const cors = require('cors')
const { BodyBuilder } = require('./src/bodybuilder/bodybuilder.entity')
const { Gym } = require('./src/gym/gym.entity')
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
  const estilo = estilos.find((estilo) => estilo.id == idEstilo);

  if (!gym || !estilo) {
      return res.status(404).send("Academia ou Estilo não encontrado");
  }

  // Criar bodyBuilder
  let bodyBuilder = new BodyBuilder(data.cpf, data.nome, data.peso, data.altura, data.idade, estilo.nome, gym);

  // Adicionar ao banco de dados
  clientes.push(bodyBuilder);
  res.send("Cadastrou com sucesso");

  // Retornar o cliente recém-criado
  res.json(bodyBuilder); // Retorna o body builder recém-criado
});


app.put('/body-builder/:cpf', (req, res) => {
  let cpf = req.params.cpf
  for(let i=0; i < clientes.length; i++){
    let cliente = clientes[i]
    if (cliente.cpf == cpf){
      const data = req.body

      // Localiza academia e estilo
      const gym = academias.find(gym => gym.id == data.idAcademia);
      const estilo = estilos.find(estilo => estilo.id == data.idEstilo);

      let bodyBuilder = new BodyBuilder(data.cpf, data.nome, data.peso, data.altura, data.idade, estilo.nome, gym)
      clientes[i] = bodyBuilder

       // Retornar o cliente atualizado
       return res.json(bodyBuilder); // Retorna o body builder atualizado

      //substitui o bodyBuilder pelos dados enviados no body
      // res.send("Atualizou")
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
   throw new Error("Cliene não encontrado")
}
    res.send("Deletou")
})

// Rota para buscar clientes (com ou sem filtro)
app.get('/body-builder', (req, res) => {
  let busca = req.query.busca
  let clientesFiltrados
  if (busca){ //se a busca for diferente de vazio
    clientesFiltrados = clientes.filter((cliente) => {
      return cliente.nome.toLowerCase().includes(busca.toLowerCase())
      || cliente.cpf.toLowerCase().includes(busca.toLowerCase())
    })
  }else{
    clientesFiltrados = clientes
  }
  res.json(clientesFiltrados)
})


// app.post('/gym', (req, res) =>{
//   const data = req.body
//   let gym = new Gym()
//   gym.nome = data.nome
//   gym.telefone = data.telefone
//   academias.push(gym)
//   res.send("cadastrou")
// })

app.get('/gym', (req, res) =>{
  res.json(academias)
})

// Inicia o servidor na porta especificada
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
})