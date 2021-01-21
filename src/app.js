//Importações e definições de constantes do projeto
const express = require("express");
const {v4:uuid,v4:isUuid} = require('uuid');
const cors = require("cors");
// const { v4: uuid, validate: isUuid } = require('uuid');
const app = express();
// *********************************************************

app.use(express.json());  //receber dados/informações de requisição em JSON
app.use(cors());

const repositories = [];

//LIST, RETRIEVE
app.get("/repositories", (request, response) => {
  //Listagem de todos os objetos do array repositories
  return response.json(repositories);
});

//CREATE
app.post("/repositories", (request, response) => {
  //Parâmetros dentro do corpo de requisição --> request.body
  const { title, url, techs} = request.body
  //console.log(title);
  //console.log(url);
  //console.log(techs);

  const newRepo = {id: uuid(), title: title , url: url , techs: techs, likes: 0};

  repositories.push(newRepo);
  //console.log('versão atualizada do array repositories...')
  //console.log(repositories);

  return response.json(newRepo);
});



//UPDATE
app.put("/repositories/:id", (request, response) => {
  //Atualizar os dados de title, url e techs conforme o id requerido
  //id --> Virá como um parâmetro da rota
  const { id } = request.params
  //Demais parâmetros de alteração estarão no corpo de requisição
  const { title, url, techs} = request.body
  //console.log(title);
  //console.log(url);
  //console.log(techs);

  //descobrindo a posição do registro de repositório desejado
  const pos = repositories.findIndex (repo => repo.id === id);

  //verificando se o registro existe
  if (pos < 0 ) {
    //Repositório não encontrado
    return response.status(400).send('Repository not found.');
  }

  //atualizar os dados do repositório
  const updRepo = {id: id, title: title, url: url, techs: techs, likes: repositories[pos].likes };
  
  repositories[pos] = updRepo;

  return response.json(updRepo);
});



//DELETE
app.delete("/repositories/:id", (request, response) => {
  //Apagar repositório cujo id foi passado na requisição
  const {id} = request.params

  //Procurar pelo registro no array: repositories
  const pos = repositories.findIndex (repo => repo.id === id);
  
  if (pos < 0 ) {
    //Repositório não encontrado
    return response.status(400).json({error:'Error'});
  }

  //apagar o registro conforme id do repositório
  repositories.splice(pos,1);

  //Quando operação de DELEÇÃO... valor de retorno é vazio --> send()
  return response.status(204).send();
});



//CREATE --> +Likes (incremental dos Likes)
app.post("/repositories/:id/like", (request, response) => {
  //Obtendo o ID como parâmetro da rota
  const { id } = request.params

  //Procurar pelo registro no array: repositories
  const pos = repositories.findIndex (repo => repo.id === id);
  
  if (pos < 0 ) {
    //Repositório não encontrado
    return response.status(400).send('Repository not found.');
  }

  //incrementar +1 Like no registro
  repositories[pos].likes = (repositories[pos].likes + 1);

  return response.json(repositories[pos]);
});

module.exports = app;

//console.log('Servidor Node.js iniciado com sucesso!!');
