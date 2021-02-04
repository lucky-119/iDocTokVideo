import React, { Component } from 'react';
import downIcon from '../../img/downIcon.svg';
import "./Options.css"
import "./VideoCall.css"

class NavBar extends Component{

  constructor()
  {
    super()
    this.toggleAppointment=this.toggleAppointment.bind(this);
    this.togglePrescription=this.togglePrescription.bind(this);
    this.toggleQuestionnaire=this.toggleQuestionnaire.bind(this);
    this.toggleNotes=this.toggleNotes.bind(this);
    this.closeAll=this.closeAll.bind(this);
    this.audioRef = React.createRef();
  }

  componentDidMount(){
    if(window.location.pathname==="/patient")
    {
      document.getElementById('prescription').style.display="none";
      document.getElementById('notes').style.display="none";
    }
  }

  closeAll()
  {
    document.getElementById("questionnaireBox").style.display="none";
    document.getElementById("prescriptionBox").style.display="none";
    document.getElementById("notesBox").style.display="none";
  }

  togglePrescription()
  {
    if(document.getElementById("prescriptionBox").style.display==="none")
    {
      this.closeAll();
      document.getElementById("prescriptionBox").style.display="block";
      document.getElementById('innerVideoCallBack').style.width="80%";
    }
    else
    {
      document.getElementById("prescriptionBox").style.display="none";
      document.getElementById('innerVideoCallBack').style.width="100%";
    }
  }

  toggleAppointment()
  {
    if(document.getElementById("appointmentDetailsClose").style.display === "none")
    {
      document.getElementById("appointmentDetailsClose").style.display = "block";
      document.getElementById("appointmentDetailsOpen").style.display = "none";
    }
    else
    {
      document.getElementById("appointmentDetailsClose").style.display="none";
      document.getElementById("appointmentDetailsOpen").style.display="block";
    }
  }
  
  toggleQuestionnaire()
  {
    if(document.getElementById("questionnaireBox").style.display==="none")
    {
      this.closeAll();
      document.getElementById("questionnaireBox").style.display="block";
      document.getElementById('innerVideoCallBack').style.width="80%";
    }
    else
    {
      document.getElementById("questionnaireBox").style.display="none";
      document.getElementById('innerVideoCallBack').style.width="100%";
    }
  }

  toggleNotes()
  {
    if(document.getElementById("notesBox").style.display==="none")
    {
      this.closeAll();
      document.getElementById("notesBox").style.display="block";
      document.getElementById('innerVideoCallBack').style.width="80%";
    }
    else
    {
      document.getElementById("notesBox").style.display="none";
      document.getElementById('innerVideoCallBack').style.width="100%";
    }
  }

  render()
  {
    return (
    <div id="OptionsBefore">
        <div class="leftMenu">
          <div id="backToDashboard" class="orangeMenuSmall">
              <div class="centerHeading">
                <p class="menuHeading">Back to Dashboard</p>
              </div>
          </div>
          <div id="appointmentDetailsClose" class="whiteMenu" onClick={this.toggleAppointment}>
            <div class="headingContainer">
              <div class="centerHeading">
                <p class="menuHeading">Appointment Details</p>
              </div>
              <img src={downIcon} alt="downIcon" class="downLeftIcon"></img>
            </div>
          </div> 
          <div id="appointmentDetailsOpen" class="whiteMenuOpen"  style={{display: "none"}} onClick={this.toggleAppointment}>
            <div class="headingContainer">
              <div class="centerHeading">
                <p class="menuHeading">Appointment Details</p>
              </div>
              <img src={downIcon} alt="downIcon" class="downLeftIcon" style={{transform: "rotate(180deg)"}}></img>
            </div>
            <div class="openDetailsContainer">
              <div class="detailTopic">
                <p class="detailHeading">Doctor's Name</p>
                <p class="detailValue">Dr Gonsalez</p>
              </div>
              <div class="detailTopic">
                <p class="detailHeading">Patient's Name</p>
                <p class="detailValue">Mr Lakshay Arora</p>
              </div>
              <div class="detailTopic">
                <p class="detailHeading">Date</p>
                <p class="detailValue">25th September 2020</p>
              </div>
              <div class="detailTopic">
                <p class="detailHeading">Timings</p>
                <p class="detailValue">3:30pm to 5:30pm</p>
              </div>
              <div class="detailTopic">
              </div>
            </div>
          </div>
        </div>
        <div class="rightMenu">
          <div id="questionnaire" class="orangeMenu" onClick={this.toggleQuestionnaire}>
            <div class="centerHeading">
              <p class="menuHeading">Questionnaire</p>
              <p class="menuOptional">(2-3 Minutes)</p>
            </div>
            <img src={downIcon} alt="downIcon" class="downRightIcon"></img>
          </div>
          <div id="prescription" class="whiteMenu" onClick={this.togglePrescription}>
              <div class="centerHeading">
                <p class="menuHeading">Prescription</p>
              </div>
            <img src={downIcon} alt="downIcon" class="downRightIcon"></img>
          </div>
          <div id="notes" class="whiteMenu" onClick={this.toggleNotes}>
              <div class="centerHeading">
                <p class="menuHeading">Notes</p>
              </div>
            <img src={downIcon} alt="downIcon" class="downRightIcon"></img>
          </div>
        </div>
    </div>
  );
  }
}

export default NavBar;
