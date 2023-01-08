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
    // yarn add uuid

})
console.log('servidor rodando')
app.listen(3333);

