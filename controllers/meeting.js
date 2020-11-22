const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
const awsHandlers = require('./awsHandlers.js');
const AWS = require('aws-sdk');
const pdfGenerator = require('./pdfGenerator.js');

if (!AWS.config.region) {
    AWS.config.update({
      region: 'us-east-1'
    });
  }

const docClient = new AWS.DynamoDB.DocumentClient();

router.use(bodyParser.urlencoded({ extended: false }))

router.use(bodyParser.json())

router.use('/pdf',pdfGenerator);

router.post('/doctor/prescription',(req,res)=>{
    console.log('Request reached server');
    docClient.update({
        TableName: 'Appointments',
        Key: {
            "appointmentId": req.body.appointmentId
        },
        UpdateExpression: "set prescription = :x",
        ExpressionAttributeValues: {
            ":x": req.body.prescription
        },
        ReturnValues:"UPDATED_NEW"
    },function(err,data){
        if(err){
            console.log("Error", err);
            res.status(500).send('Error');;
        }
        else{
            console.log("Success", data);
            res.status(200).send('Prescription Updated');;
        }
    });
})

router.post('/doctor/notes',(req,res)=>{
    console.log('Request reached server');
    docClient.update({
        TableName: 'Appointments',
        Key: {
            "appointmentId": req.body.appointmentId
        },
        UpdateExpression: "set notes = :x",
        ExpressionAttributeValues: {
            ":x": req.body.notes
        },
        ReturnValues:"UPDATED_NEW"
    },function(err,data){
        if(err){
            console.log("Error", err);
            res.status(500).send('Error');;
        }
        else{
            console.log("Success", data);
            res.status(200).send('Notes Updated');;
        }
    });
})

router.post('/doctor/chat',(req,res)=>{
    console.log('Request reached server');
    docClient.update({
        TableName: 'Appointments',
        Key: {
            "appointmentId": req.body.appointmentId
        },
        UpdateExpression: "set chat = :x",
        ExpressionAttributeValues: {
            ":x": req.body.chat
        },
        ReturnValues:"UPDATED_NEW"
    },function(err,data){
        if(err){
            console.log("Error", err);
            res.status(500).send('Error');;
        }
        else{
            console.log("Success", data);
            res.status(200).send('Chat Updated');;
        }
    });
})

router.post('/doctor/time',(req,res)=>{
    console.log('Request reached server');
    docClient.update({
        TableName: 'Appointments',
        Key: {
            "appointmentId": req.body.appointmentId
        },
        UpdateExpression: "set totalMeetingTime = :x",
        ExpressionAttributeValues: {
            ":x": req.body.time
        },
        ReturnValues:"UPDATED_NEW"
    },function(err,data){
        if(err){
            console.log("Error", err);
            res.status(500).send('Error');;
        }
        else{
            console.log("Success", data);
            res.status(200).send('Time Updated');;
        }
    });
})

router.post('/doctor/getQuestions',(req,res)=>{
    console.log('Request reached server');
    docClient.scan({
        TableName: "Questionnaire",
        ProjectionExpression: "question, options",
        FilterExpression: "userGroup=:userVal",
        ExpressionAttributeValues: {
            ":userVal": "Doctor",
        }
    }, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            res.status(500).send('Error');;
        } else {
            console.log("GetItem succeeded:", data);
            res.status(200).send(data.Items);;
        }
    });
})

router.post('/doctor/questionnaire',(req,res)=>{
    console.log('Request reached server');
    docClient.update({
        TableName: 'Appointments',
        Key: {
            "appointmentId": req.body.appointmentId
        },
        UpdateExpression: "set doctorQuestionnaire = :x",
        ExpressionAttributeValues: {
            ":x": req.body.questionnaire
        },
        ReturnValues:"UPDATED_NEW"
    },function(err,data){
        if(err){
            console.log("Error", err);
            res.status(500).send('Error');;
        }
        else{
            console.log("Success", data);
            res.status(200).send('Questionnaire Submitted');;
        }
    });
})

router.post('/patient/getQuestions',(req,res)=>{
    console.log('Request reached server');
    docClient.scan({
        TableName: "Questionnaire",
        ProjectionExpression: "question, options",
        FilterExpression: "userGroup=:userVal",
        ExpressionAttributeValues: {
            ":userVal": "Patient",
        }
    }, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            res.status(500).send('Error');;
        } else {
            console.log("GetItem succeeded:", data);
            res.status(200).send(data.Items);;
        }
    });
})

router.post('/patient/questionnaire',(req,res)=>{
    console.log('Request reached server');
    docClient.update({
        TableName: 'Appointments',
        Key: {
            "appointmentId": req.body.appointmentId
        },
        UpdateExpression: "set patientQuestionnaire = :x",
        ExpressionAttributeValues: {
            ":x": req.body.questionnaire
        },
        ReturnValues:"UPDATED_NEW"
    },function(err,data){
        if(err){
            console.log("Error", err);
            res.status(500).send('Error');;
        }
        else{
            console.log("Success", data);
            res.status(200).send('Questionnaire Submitted');;
        }
    });
})

router.get('/Prod/join',(req,res)=>{
    console.log(req.query);
    awsHandlers.join(req.query).then(awsres=>{
        console.log(awsres);
        if(awsres.statusCode==200)
            res.status(200).send(awsres.body);
        else
            res.status(500).send('Error');
    });
})

router.get('/Prod/end',(req,res)=>{
    console.log(req.query);
    awsHandlers.end(req.query).then(awsres=>{
        console.log(awsres);
        if(awsres.statusCode==200)
            res.status(200).send(awsres.body);
        else
            res.status(500).send('Error');
    });
})

module.exports= router