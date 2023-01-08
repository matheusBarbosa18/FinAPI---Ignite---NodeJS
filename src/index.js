const express = require('express');
const { v4: uuidv4 } = require('uuid')
const app = express();
const custormes = [];

app.use(express.json());
app.post('/account', function (request, response) {
    const { cpf, name } = request.body;
    const cpfExistente = custormes.some((custormes) => custormes.cpf === cpf);

    if (cpfExistente) {
        return response.status(400).json({ error: "cpf ja existente" })
    }

    custormes.push({
        cpf, name, id: uuidv4(), statement: []
    });

    return response.status(201).send()
})

app.get('/statement', function (request, response) {
    const { cpf } = request.headers;
    const custormer = custormes.find((custormer) => custormer.cpf == cpf);

    if (!custormer) {
        return response.status(400).json({ status: 'custormer is not found!' })
    }

    return response.json(custormer.statement)
})



console.log('servidor rodando')
app.listen(3333);

