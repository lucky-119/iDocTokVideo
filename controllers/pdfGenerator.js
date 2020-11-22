const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const fs = require('fs');
const AWS = require('aws-sdk');
var path = require('path');

if (!AWS.config.region) {
    AWS.config.update({
      region: 'us-east-1'
    });
  }

const docClient = new AWS.DynamoDB.DocumentClient();

router.post('/createMeetingPdfs',(req,res)=>{
    docClient.get({
        TableName : 'Appointments',
        Key: {
            "appointmentId": req.body.appointmentId
        }
    },function(err,data){
        if(err){
            console.log("Error Getting Data from DB", err);
            res.status(500).send('Error');;
        }
        else{
            console.log("Data extracted from DB", data);
            createPdf(req.body.appointmentId,'prescription',data.Item.prescription);
            createPdf(req.body.appointmentId,'notes',data.Item.notes);
            parseChatThenCreatePDF(req.body.appointmentId,data.Item.chat);
            res.status(200).send('Pdfs are being generated');
        }
    });
})

router.post('/getPrescriptionPdf',(req,res)=>{
    res.download(path.join(__dirname, '../pdfs/'+req.body.appointmentId+'_prescription.pdf'))
})

router.post('/getNotesPdf',(req,res)=>{
    res.download(path.join(__dirname, '../pdfs/'+req.body.appointmentId+'_notes.pdf'))
})

router.post('/getChatPdf',(req,res)=>{
    res.download(path.join(__dirname, '../pdfs/'+req.body.appointmentId+'_chat.pdf'))
})


//Functions
function parseChatThenCreatePDF(appointmentId,chat)
{
    var parsedChat="";
    for(var i=0;i<chat.length;i++)
    {
        parsedChat+=Object.keys(chat[i])[0]+":";
        parsedChat+=chat[i][Object.keys(chat[i])[0]]+"\n";
    }
    createPdf(appointmentId,'chat',parsedChat);
}

async function createPdf(appointmentId,purpose,text)
{
    let pdfDoc = new PDFDocument;
    pdfDoc.pipe(fs.createWriteStream('./pdfs/'+appointmentId+'_'+purpose+'.pdf'));
    pdfDoc.text(text);
    pdfDoc.end();
}

module.exports=router;


