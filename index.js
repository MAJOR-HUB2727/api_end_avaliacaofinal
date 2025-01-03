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
  console.log("Dados recebidos do Front-end:", data);

  // if (idEstilo === null) {
  //   const idEstilo = estilos[estilos.length - 1].id + 1
  //   console.log("Último id do array estilos:", idEstilo);  
  // }

   // Verifica se foi enviado um novo estilo
   const novoEstilo = data.novoEstilo?.trim(); // Remove espaços em branco nas extremidades


     // Verifica se há um estilo personalizado
    //  const novoEstilo = document 
    //  console.log("Estilo personalizado:", novoEstilo);

  // if (novoEstilo) {
  //     // Criar o novo estilo e adicioná-lo ao array estilos
  //     console.log("Novo estilo digitado", novoEstilo)
  //     const estilo = {
  //         id: estilos.length + 1, // Define o próximo ID do estilo
  //         nome: novoEstilo,
  //         bodyBuilder: [], // Lista inicial de bodybuilders para o estilo
  //         };

  //     estilos.push(estilo); // Adiciona ao array estilos
  //     console.log("Novo estilo adicionado ao array estilos:", estilos);

  // } //else {
      // Caso contrário, buscar pelo ID do estilo existente
      const idEstilo = data.idEstilo;
      const style = estilos.find((style) => style.id == idEstilo);
      console.log("Estilo encontrado:", style);

      // Verificar se o estilo foi encontrado
      // if (!style) {
      //     return res.status(404).send("Estilo não encontrado.");
      // }
  //}

  console.log("Estilos atualizados:", estilos);

  // Encontrar academia
  const idAcademia = data.idAcademia;
  const gym = academias.find((gym) => gym.id == idAcademia);
  console.log("Academia encontrada:", gym);

  // Verificar se academia foi encontrada
  if (!gym) {
      return res.status(404).send("Academia não encontrada.");
  }

  // Criar bodyBuilder
  const bodyBuilder = new BodyBuilder(
      data.nome,
      data.cpf,
      data.peso,
      data.altura,
      data.idade,
      style,
      gym
  );

  // Atualizar listas de bodybuilders no estilo e academia
  // style.bodyBuilder.push(bodyBuilder);
  // gym.bodyBuilder.push(bodyBuilder);

  // Adicionar ao banco de dados
  clientes.push(bodyBuilder);
  console.log("Novo bodyBuilder adicionado:", bodyBuilder);

  res.status(201).json(bodyBuilder); // Retorna o body builder recém-criado
  // return res.send("Cadastrou")

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

      console.log(estilos);


      //substitui o bodyBuilder pelos dados enviados no body
      //return res.send("Atualizou")
      

      // Retornar o cliente atualizado
      return res.json(bodyBuilder); // Retorna o body builder atualizado

      
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
  }
   throw new Error("Cliente não encontrado")
  // res.send("Deletou")
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

app.post('/style', (req, res) => {
  console.log("Dados recebidos do Front-end :", req.body);
  const novoEstilo = req.body; // Assume que o body é uma string diretamente
  
  if (!novoEstilo) {
      return res.status(400).json({ error: "O campo 'novoEstilo' é obrigatório." });
  }
  console.log("Estilo digitado", novoEstilo)
  const estilo = {
      id: estilos.length + 1,  // Define o próximo ID do estilo
      nome: novoEstilo.novoEstilo,        // Usa a string diretamente como nome do estilo
      bodyBuilder: [],         // Lista inicial de bodybuilders para o estilo
  };

  estilos.push(estilo); // Adiciona ao array estilos

  //const idEstilo = estilos.length > 0 ? estilos[estilos.length - 1].id + 1 : null;


  
  console.log("Novo estilo adicionado ao array estilos:", estilos);

  // Retorna o ID do último estilo criado
  //return res.json({ id: estilo.id }); // Retorna apenas o ID do novo estilo
  //return res.json ( estilos ) // Retorna apenas o ID do novo estilo;
   return false
});




app.get('/style', (req, res) => {
  res.json(estilos)
})
