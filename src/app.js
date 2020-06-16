const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// List repositories
app.get("/repositories", (request, response) => {
  return response.status(200).send(repositories);
});

// New repository
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepository = {
    id: uuid(), title, url, techs, likes: 0
  };

  repositories.push(newRepository);

  return response.status(200).send(newRepository);
});

// Update repository info
app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repositoryResultIndex = repositories.findIndex((repository) => repository.id === id);

  if (repositoryResultIndex < 0)
    return response.status(404).send({ message: 'Repository was not found' });

  const { id: oldId, likes: oldLikes } = repositories[repositoryResultIndex];

  const changedRepository = {
    id: oldId, title, url, techs, likes: oldLikes
  }

  repositories[repositoryResultIndex] = changedRepository;

  return response.status(200).send(changedRepository);
});

// Delete repository
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryResultIndex = repositories.findIndex((repository) => repository.id === id);

  if (repositoryResultIndex < 0)
    return response.status(404).send({ message: 'Repository was not found' });

  repositories.splice(repositoryResultIndex, 1);

  return response.status(200).send({ message: 'Repository was successfully deleted' });
});

// Add new like to repository
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryResultIndex = repositories.findIndex((repository) => repository.id === id);

  if (repositoryResultIndex < 0)
    return response.status(404).send({ message: 'Repository was not found' });

  const { title, url, techs, likes } = repositories[repositoryResultIndex];
  const newLikes = parseInt(likes) + 1;

  const changedRepository = {
    id: repositories[repositoryResultIndex].id, title, url, techs, likes: newLikes
  }

  repositories[repositoryResultIndex] = changedRepository;

  return response.status(200).send(changedRepository);
});

module.exports = app;
