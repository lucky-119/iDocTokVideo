import React, { Component } from 'react';
import profilePic from '../../img/profilePic.jpg';
import doctoklogo from '../../img/chromevaala.svg';
import "./NavBar.css"

class NavBar extends Component{
  render()
  {
    return (
    <div class="navbar">
      <nav>
        <img src={doctoklogo} alt="idoctoklogo" class="doctoklogo"></img>
        <span class="navbaricons" style={{left: "169px"}}>Home</span>
        <span class="navbardash" style={{left: "230px"}}></span>
        <span class="navbaricons" style={{left: "249px"}}>Profile</span>
        <span class="navbardash" style={{left: "320px"}}></span>
        <span class="navbaricons" style={{left: "339px"}}>Schedule Appointment</span>
        <span class="rectangleAccount"></span>
        <span class="userWelcome">Hello!<br></br>Dmitry Galkin</span>
        <img src={profilePic} alt="profilepic" class="userPicture"></img>
      </nav>
    </div>
  );
  }
}

export default NavBar;
