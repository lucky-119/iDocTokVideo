import React, { Component } from 'react';
import viewIcon from '../../img/viewIcon.svg';
import shareIcon from '../../img/shareIcon.svg';
import downloadIcon from '../../img/downloadIcon.svg';
import "./CallEnded.css"
import FileSaver from 'file-saver';

class CallEnded extends Component{

  constructor()
  {
    super();
    this.getPrescription=this.getPrescription.bind(this);
  }

  getPrescription(string)
  {
    var appointmentId="test2";
    fetch('/meeting/pdf/getPrescriptionPdf',{
      method: 'post', 
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({"appointmentId":"test2"})
    }).then(res=>res.blob()).then((response)=>{
      console.log(response);
      const file = new Blob([response], {
        type: "application/pdf"
      });
      if(string==="download")
      {
        FileSaver.saveAs(
          file,appointmentId+'_prescription.pdf'
        );
      }
      else if(string==="view")
      {
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      }
    });
  }

  getNotes(string)
  {
    var appointmentId="test2";
    fetch('/meeting/pdf/getNotesPdf',{
      method: 'post', 
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({"appointmentId":"test2"})
    }).then(res=>res.blob()).then((response)=>{
      console.log(response);
      const file = new Blob([response], {
        type: "application/pdf"
      });
      if(string==="download")
      {
        FileSaver.saveAs(
          file,appointmentId+'_notes.pdf'
        );
      }
      else if(string==="view")
      {
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      }
    });
  }

  getChat(string)
  {
    var appointmentId="test2";
    fetch('/meeting/pdf/getChatPdf',{
      method: 'post', 
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({"appointmentId":"test2"})
    }).then(res=>res.blob()).then((response)=>{
      console.log(response);
      const file = new Blob([response], {
        type: "application/pdf"
      });
      if(string==="download")
      {
        FileSaver.saveAs(
          file,appointmentId+'_chat.pdf'
        );
      }
      else if(string==="view")
      {
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      }
    });
  }

  render()
  {
    return (
    <div class="endData">
        <span class="backToDashboardEnd">Back To Dashboard</span>
        <div class="whiteEndBox" style={{left:"87px",top:"74px"}}>
          <p class="endBoxHeading">PRESCRIPTION</p>
          <div class="controlIcons">
            <img src={viewIcon} alt="viewicon" onClick={() => this.getPrescription("view")}></img>
            <img src={downloadIcon} alt="downloadicon" onClick={() => this.getPrescription("download")}></img>
          </div>
        </div>
        <div class="orangeEndBox" style={{right:"87px",top:"74px"}}>
          <p class="endBoxHeading">APPOINTMENT AND PATIENT DETAILS</p>
          <div class="controlIcons">
            <img src={viewIcon} alt="viewicon"></img>
            <img src={downloadIcon} alt="downloadicon"></img>
          </div>
        </div>
        <div class="whiteEndBox" style={{left:"50%",top:"523px",marginLeft:"-189.5px"}}>
          <p class="endBoxHeading">NOTES</p>
          <div class="controlIcons">
            <img src={viewIcon} alt="viewicon" onClick={() => this.getNotes("view")}></img>
            <img src={downloadIcon} alt="downloadicon" onClick={() => this.getNotes("download")}></img>
          </div>
        </div>
        <div class="orangeEndBox" style={{left:"87px",top:"648px"}}>
          <p class="endBoxHeading">CHAT</p>
          <div class="controlIcons">
            <img src={viewIcon} alt="viewicon" onClick={() => this.getChat("view")}></img>
            <img src={downloadIcon} alt="downloadicon" onClick={() => this.getChat("download")}></img>
          </div>
        </div>
        <div class="whiteEndBox" style={{right:"87px",top:"648px"}}>
          <p class="endBoxHeading">INVOICE</p>
          <div class="controlIcons">
            <img src={viewIcon} alt="viewicon"></img>
            <img src={downloadIcon} alt="downloadicon"></img>
          </div>
        </div>
    </div>
  );
  }
}

export default CallEnded;
