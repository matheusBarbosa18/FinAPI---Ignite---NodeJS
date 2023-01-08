const express = require('express');
const { v4: uuidv4 } = require('uuid')
const app = express();
const custormes = [];

app.use(express.json());

//middleware
function verifyIfExistAccountCpf(request, response, next) {
    const { cpf } = request.headers;
    const custormer = custormes.find((custormer) => custormer.cpf == cpf);

    if (!custormer) {
        return response.status(400).json({ status: 'custormer is not found!' })
    }
    request.custormer = custormer;
    return next();

}

app.post('/account', (request, response) => {
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

app.get('/statement', verifyIfExistAccountCpf, (request, response) => {

    const { custormer } = request;
    return response.json(custormer.statement)
})

app.post('/deposit', verifyIfExistAccountCpf, (request, response) => {
    const { description, amount } = request.body;
    const { custormer } = request;
    const statementOperation = {
        description, amount, created_at: new Date(), type: 'credit'
    }

    custormer.statement.push(statementOperation)

    return response.status(201).send();
})

app.post('/withdraw', verifyIfExistAccountCpf, (request, response) => {
    const { amount } = request.body
    const { customer } = request

    const balance = getBalance(customer.statement)

    if (balance < amount) {
        return response.status(400).json({ error: 'Insufficient funds!' })
    }

    const statementOperation = {
        amount,
        created_at: new Date(),
        type: 'debit'
    }

    customer.statement.push(statementOperation)

    return response.status(201).send()
})

app.get('/statement/date', verifyIfExistAccountCpf, (request, response) => {
    const { customer } = request
    const { date } = request.query

    const statement = customer.statement.filter(statement =>
        statement.created_at.toISOString().includes(date)
    )

    return response.json(statement)
})



console.log('servidor rodando')
app.listen(3333);

