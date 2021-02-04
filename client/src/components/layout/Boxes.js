import React, { Component } from 'react';
import "./Options.css"
import "./VideoCall.css"
import "./Boxes.css"

class Boxes extends Component{

  constructor()
  {
    super();
    this.updatePrescription = this.updatePrescription.bind(this);
    this.updateNotes = this.updateNotes.bind(this);
    this.submitQuestionnaire = this.submitQuestionnaire.bind(this);
    this.getQuestions = this.getQuestions.bind(this);
  }

  componentWillMount()
  {
    this.getQuestions();
  }

  getQuestions()
  {
    if(window.location.pathname==="/doctor")
    {
      fetch('/meeting/doctor/getQuestions',{method: 'post'}).then(res=>res.json()).then((result)=>{
        for(var i=0;i<result.length;i++)
        {
          var html='<div class="questionContainer"><div class="questionText"><p>'+result[i].question+'</p></div><select class="questionInput">';
          for(var j=0;j<result[i].options.length;j++)
            html+='<option value='+result[i].options[j]+'>'+result[i].options[j]+'</option>';
          html+='</select></div>';
          document.getElementById('allQuestions').innerHTML+=html;
        }
      });
    }
    else if(window.location.pathname==="/patient")
    {
      fetch('/meeting/patient/getQuestions',{method: 'post'}).then(res=>res.json()).then((result)=>{
        for(var i=0;i<result.length;i++)
        {
          var html='<div class="questionContainer"><div class="questionText"><p>'+result[i].question+'</p></div><select class="questionInput">';
          for(var j=0;j<result[i].options.length;j++)
            html+='<option value='+result[i].options[j]+'>'+result[i].options[j]+'</option>';
          html+='</select></div>';
          document.getElementById('allQuestions').innerHTML+=html;
        }
      });
    }
  }

  updatePrescription()
  {
    var prescriptionData = document.getElementById('prescriptionInput').value;
    console.log(prescriptionData);
    fetch('/meeting/doctor/prescription',{
      method: 'post', 
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify({"prescription": prescriptionData,"appointmentId":"test2"})
    }).then(res=>res.json()).then((result)=>{
      if(result.status===200)
        console.log("Prescription Updated");
      else
        console.log('Error while updating prescription');
    });
  }

  updateNotes()
  {
    var notesData = document.getElementById('notesInput').value;
    console.log(notesData);
    fetch('/meeting/doctor/notes',{
      method: 'post', 
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify({"notes": notesData,"appointmentId":"test2"})
    }).then(res=>res.json()).then((result)=>{
      if(result.status===200)
        console.log("Notes Updated");
      else
        console.log('Error while updating notes');
    });
  }

  submitQuestionnaire()
  {
    var allQuestions = document.getElementById('allQuestions').childNodes;
    var noOfQuestions = allQuestions.length-1;
    console.log(allQuestions)
    console.log(noOfQuestions)
    var questionData={}
    for(var i=1;i<(noOfQuestions+1);i++)
      questionData[allQuestions[i].firstChild.innerText]=allQuestions[i].lastChild.value;
    if(window.location.pathname==="/doctor")
    {
      fetch('/meeting/doctor/questionnaire',{
        method: 'post', 
        headers: {
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({"questionnaire": questionData,"appointmentId":"test2"})
      }).then(res=>res.json()).then((result)=>{
        if(result.status===200)
          console.log("Questionnaire Submitted");
        else
          console.log('Error while submitting questionnaire');
      });
    }
    else if(window.location.pathname==="/patient")
    {
      fetch('/meeting/patient/questionnaire',{
        method: 'post', 
        headers: {
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({"questionnaire": questionData,"appointmentId":"test2"})
      }).then(res=>res.json()).then((result)=>{
        if(result.status===200)
          console.log("Questionnaire Submitted");
        else
          console.log('Error while submitting questionnaire');
      });
    }
  }


  render()
  {
    return (
    <div id="boxes">

        <div id="questionnaireBox" class="rightbox" style={{display:"none"}}>
          <div class="questionnaireTopContainer">
            <span class="questionnaireText">Questionnaire</span>
          </div>
          <div id="allQuestions" class="allQuestions">
            <br></br>
          </div>
          <div class="bottomSubmit">
            <button class="buttonSubmit" onClick={this.submitQuestionnaire}>SUBMIT</button>
          </div>
        </div>

        <div id="prescriptionBox" class="rightbox" style={{display:"none"}}>
        <div class="rightWhiteBoxContainer">
          <span class="rightWhiteBoxText">Prescription</span>
        </div>
        <div class="insideRightBox">
        <textarea id="prescriptionInput" class="inputText" placeholder="Type your prescription here..."></textarea>
          <div class="doctorDetailsContainer">
            <div class="doctorDetails">
              <p>Mr Gonsalez</p>
              <p>MBBS</p>
              <p>25th September 2020</p>
            </div>
          </div>
        </div>
        <div class="bottomSave">
            <button class="buttonSave" onClick={this.updatePrescription}>SAVE</button>
        </div>
      </div>

      <div id="notesBox" class="rightbox" style={{display:"none"}}>
        <div class="rightWhiteBoxContainer">
          <span class="rightWhiteBoxText">Notes</span>
        </div>
        <div class="insideRightBox">
          <textarea id="notesInput" class="notesInput" placeholder="Write your notes here..."></textarea>
        </div>
        <div class="bottomSave">
          <button class="buttonSave" onClick={this.updateNotes}>SAVE</button>
        </div>
      </div>
    </div>
  );
  }
}

export default Boxes;
