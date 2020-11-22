const express = require('express')
var bodyParser = require('body-parser')
const AWS = require('aws-sdk');

if (!AWS.config.region) {
    AWS.config.update({
      region: 'us-east-1'
    });
  }

const app = express();

const meeting = require('./controllers/meeting.js');
const appointment = require('./controllers/appointment.js');
const questionnaire = require('./controllers/questionnaire.js');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/quetionnaire',questionnaire)
app.use('/appointment',appointment);
app.use('/meeting',meeting);

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`) 
});
