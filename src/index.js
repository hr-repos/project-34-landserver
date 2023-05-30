const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 8443;
const messages = require('./messages.json');
const Joi = require("joi");
const r = messages.bank;
const w = messages.wysd;

app.use(express.json())

app.listen (
    PORT,
    () => console.log(`It's alive on http://localhost:${PORT}`)
    )
    
    const withdrawValidator = Joi.object({
        head: {
        fromCtry: Joi.string().required(),
        fromBank: Joi.string().required(),
    },
    body: {
        acctNo: Joi.string().required(),
        pin: Joi.string().required(),
        amount: Joi.number().required(),
    },
});

const balanceValidator = Joi.object({
    head: {
        fromCtry: Joi.string().required(),
        fromBank: Joi.string().required(),
    },
    body: {
        acctNo: Joi.string().required(),
        pin: Joi.string().required(),
    },
});

const options = {
    allowUnknown: true
};

const bankListBalance = {
    "noob": "http://145.24.222.82:8443/api/balance",
    "BK":   "http://145.24.222.188:8443/balance",
    "MB":  "http://145.24.222.171:8888/balance"
};

const bankListWithdraw = {
    "noob":  "http://145.24.222.82:8443/api/balance",
    "BK":    "http://145.24.222.188:8443/balance",
    "MB":    "http://145.24.222.171:8888/balance"
};


app.post('/balance' ,(req, res) => {
    const {error, value} = balanceValidator.validate(req.body, options);
    // variabel type check => error wanneer het niet klopt
    if (error){
        console.log(error)
        return res.status(r.wrongVariableType.code).send(r.wrongVariableType.message);
    }
    
    // request type check => error wanneer het niet klopt
    if (!req.is('application/json')){
        console.log(r.expectedJSONError.message + w.sanityCheck)
        res.status(r.expectedJSONError.code).send(r.expectedJSONError.message);
        return;
    }
    
    // wanneer de gevraagde bank niet in onze lijst staat moet het verzoek naar noob gestuurd worden
    if (!bankListBalance[req.body.head.toBank]){
        console.log("noob code block to be added");
        return;
    } 
    else {
        axios.post(bankListBalance[req.body.head.toBank], req.body)
        .then((goodresponse) => {
            console.log("good response");
            return res.status(200).send(goodresponse.data);
        })
        .catch((error) => { 
            return res.status(error.response.status).send(error.response.data);
        });
    }
});

app.post('/withdraw' ,(req, res) => {
    const {error, value} = withdrawValidator.validate(req.body, options);
    // variabel type check => error wanneer het niet klopt
    if (error){
        console.log(error)
        return res.status(r.wrongVariableType.code).send(r.wrongVariableType.message);
    }
    
    // request type check => error wanneer het niet klopt
    if (!req.is('application/json')){
        console.log(r.expectedJSONError.message + w.sanityCheck)
        res.status(r.expectedJSONError.code).send(r.expectedJSONError.message);
        return;
    }
    
    // wanneer de gevraagde bank niet in onze lijst staat moet het verzoek naar noob gestuurd worden
    if (!bankListBalance[req.body.head.toBank]){
        console.log("noob code block to be added");
        return;
    } 
    else {
        axios.post(bankListBalance[req.body.head.toBank], req.body)
        .then((goodresponse) => {
            console.log("good response");
            return res.status(200).send(goodresponse.data);
        })
        .catch((error) => { 
            return res.status(error.response.status).send(error.response.data);
        });
    } 
}); 
