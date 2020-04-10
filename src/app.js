const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function verifyIfIdExists(request,response,next){
  var { id } = request.params;

  var repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).send({ error: "ID informado não existe!"});
  }

  return next();
}

app.use("/repositories/:id",verifyIfIdExists);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  var { title, url, techs } = request.body;

  var newRepository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0  
  };

  repositories.push(newRepository);

  return response.json(newRepository);

});

app.put("/repositories/:id", (request, response) => {
  var { id } = request.params;
  var { title, url, techs } = request.body;

  var repository = repositories.find(repository => repository.id === id);

  var newRepository = {
    id: id,
    title: title,
    url: url,
    techs: techs,
    likes: repository.likes,
  };

  var repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories[repositoryIndex] = newRepository;

  return response.json(newRepository);

});

app.delete("/repositories/:id", (request, response) => {
  var { id } = request.params;

  var repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories.splice(repositoryIndex,1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  var { id } = request.params;

  var repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories[repositoryIndex].likes += 1;


  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
