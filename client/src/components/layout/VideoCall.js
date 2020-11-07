import React, {Component} from 'react';
import './VideoCall.css';
import ringingLogo from '../../img/ringingImage.png';
import audioCallLogo from '../../img/audioCall.png';
import audioOnLogo from '../../img/audioon.svg';
import audioOffLogo from '../../img/audiooff.svg';
import videoCallOffLogo from '../../img/videooff.svg';
import videoCallOnLogo from '../../img/videoon.svg';
import endMeetingLogo from '../../img/exit.svg';
import messageLogo from '../../img/message.svg';
import messageUnreadLogo from '../../img/messageunread.svg';
import callEndedLogo from '../../img/callended.svg';
import sendMessageLogo from '../../img/sendMessage.svg';
import closeIcon from '../../img/closeIcon.svg';
import Options from './Options';
import Boxes from './Boxes';
import CallEnded from './CallEnded';
import ringingSound from "../../mp3/ringing.mp4";
import {
  ConsoleLogger,
  DefaultDeviceController,
  DefaultMeetingSession,
  LogLevel,
  MeetingSessionConfiguration,
  MeetingSessionStatusCode
} from 'amazon-chime-sdk-js';

class VideoCall extends Component{

  constructor()
  {
    super()
    this.joinMeeting = this.joinMeeting.bind(this);
    this.createMeetingSession = this.createMeetingSession.bind(this);
    this.addAudioVideoChangeObserver = this.addAudioVideoChangeObserver.bind(this);
    this.addAudioStartObserver = this.addAudioStartObserver.bind(this);
    this.addVideoStartObserver = this.addVideoStartObserver.bind(this);
    this.endMeeting = this.endMeeting.bind(this);
    this.muteCall = this.muteCall.bind(this);
    this.selectAudioDevices = this.selectAudioDevices.bind(this);
    this.selectVideoDevice = this.selectVideoDevice.bind(this);
    this.startVideo = this.startVideo.bind(this);
    this.stopVideo = this.stopVideo.bind(this);
    this.seeVideo = this.seeVideo.bind(this);
    this.toggleVideo = this.toggleVideo.bind(this);
    this.removeRinging = this.removeRinging.bind(this);
    this.showAudioCall = this.showAudioCall.bind(this);
    this.removeAudioCall = this.removeAudioCall.bind(this);
    this.enableIcons = this.enableIcons.bind(this);
    this.disableIcons = this.disableIcons.bind(this);
    this.videoObserver = this.videoObserver.bind(this);
    this.toggleChat = this.toggleChat.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.receiveMessageObserver = this.receiveMessageObserver.bind(this);
    this.startCall = this.startCall.bind(this);
    this.audioRef = React.createRef();
    this.meetingSession="";
    this.videoOn=false;
    this.attendee="";
    this.startTime="00";
    this.endTime="00";
    this.currentSendMessageId=0;
    this.currentReceiveMessageId=0;
    this.chatData=[];
  }

  //Runs just before component is mounted
  componentWillMount(){
    if(window.location.pathname==="/doctor")
      this.attendee="patient";
    else if(window.location.pathname==="/patient")
      this.attendee="doctor"
  }

  //Runs once component is mounted
  componentDidMount(){
    document.getElementById('ringingAudio').playbackRate=0.70;
    document.getElementById('ringingAudio').loop=true;
  }

  //Send API calls to create/join meeting
  joinMeeting()
  {
    if(window.location.pathname==="/doctor")
    fetch('/doctor/meeting/Prod/join?title="test2"&name="lakshay"&region="us-east-1"').then(res=>res.json()).then((result)=>{
      console.log(result);
      console.log("Join done");
      this.createMeetingSession(result);
    });
    else if(window.location.pathname==="/patient")
    fetch('/doctor/meeting/Prod/join?title="test2"&name="lakshay2"&region="us-east-1"').then(res=>res.json()).then((result)=>{
      console.log(result);
      console.log("Join done");
      this.createMeetingSession(result);
    });
  }
  
  //Create Meeting Session from meeting and attendee info received from API
  async createMeetingSession(result)
  {
    const logger = new ConsoleLogger('MyLogger', LogLevel.INFO);
    const deviceController = new DefaultDeviceController(logger);
    
    const meetingResponse = result.JoinInfo.Meeting;
    const attendeeResponse = result.JoinInfo.Attendee;
    const configuration = new MeetingSessionConfiguration(meetingResponse, attendeeResponse);
  
    this.meetingSession = new DefaultMeetingSession(
      configuration,
      logger,
      deviceController 
    );

    this.addAudioVideoChangeObserver();
    this.addAudioStartObserver();
    this.addVideoStartObserver();
    this.enableIcons();
    this.videoObserver();
    this.attendeePresentObserver();
    this.receiveMessageObserver();
  }

  //Select Local Audio Devices
  async selectAudioDevices()
  {
    const audioInputDevices = await this.meetingSession.audioVideo.listAudioInputDevices();
    const audioOutputDevices = await this.meetingSession.audioVideo.listAudioOutputDevices();

    await this.meetingSession.audioVideo.chooseAudioInputDevice(audioInputDevices[0].deviceId);
    await this.meetingSession.audioVideo.chooseAudioOutputDevice(audioOutputDevices[0].deviceId);
    console.log('DDone');
  }

  //Observer to change audio/video when input changes
  addAudioVideoChangeObserver()
  {
    const audioVideoChangeObserver = {
      audioInputsChanged: freshAudioInputDeviceList => {
        this.meetingSession.audioVideo.chooseAudioInputDevice(freshAudioInputDeviceList[0].deviceId);
        console.log('Audio inputs updated: ', freshAudioInputDeviceList[0]);
      },
      audioOutputsChanged: freshAudioOutputDeviceList => {
        this.meetingSession.audioVideo.chooseAudioOutputDevice(freshAudioOutputDeviceList[0].deviceId);
        console.log('Audio outputs updated: ', freshAudioOutputDeviceList[0]);
      },
      videoInputsChanged: freshVideoInputDeviceList => {
        this.meetingSession.audioVideo.chooseVideoInputDevice(freshVideoInputDeviceList[0].deviceId);
        console.log('Video inputs updated: ', freshVideoInputDeviceList[0]);
      }
    };
    this.meetingSession.audioVideo.addDeviceChangeObserver(audioVideoChangeObserver);
  }

  //Observer when audio starts
  addAudioStartObserver()
  {
    const audioElement = document.getElementById('audioElement');
    console.log(audioElement);
    this.meetingSession.audioVideo.bindAudioElement(audioElement);

    const addAudioStartObserver = {
      audioVideoDidStart: () => {
        console.log('Audio Started');
        this.selectAudioDevices();
      }
    };

    this.meetingSession.audioVideo.addObserver(addAudioStartObserver);

    this.meetingSession.audioVideo.start();
  }

  removeRinging()
  {
    document.getElementById("ringing").style.display = "none";
  }

  showAudioCall()
  {
    document.getElementById("audiocall").style.display = "block";
  }

  removeAudioCall()
  {
    document.getElementById("audiocall").style.display = "none";
  }

  enableCallEnded()
  {
    document.getElementById("callEnded").style.display = "block";
  }
  
  //Observer when video starts
  addVideoStartObserver()
  {
    const addVideoStartObserver = {
      videoDidStart: () => {
        console.log('Video Started');
      },
      audioVideoDidStop: sessionStatus => {
        // See the "Stopping a session" section for details.
        console.log('Stopped with a session status code: ', sessionStatus.statusCode());
      },
      audioVideoDidStartConnecting: reconnecting => {
        if (reconnecting) {
          // e.g. the WiFi connection is dropped.
          console.log('Attempting to reconnect');
        }
      }
    };
    
    this.meetingSession.audioVideo.addObserver(addVideoStartObserver);

    this.seeVideo();
  }

  endMeetingObserver()
  {
    const observer = {
      audioVideoDidStop: sessionStatus => {
        const sessionStatusCode = sessionStatus.statusCode();
        if (sessionStatusCode === MeetingSessionStatusCode.Left || sessionStatusCode === MeetingSessionStatusCode.AudioCallEnded) {
          /*
            - You called meetingSession.audioVideo.stop().
            - When closing a browser window or page, Chime SDK attempts to leave the session.
          */
          this.disableIcons();
          this.removeAudioCall();
          this.removeRinging();
          var d=new Date();
          this.endTime=d.getTime();
          console.log('Start Time'+this.endTime);
          if(document.getElementById('chatbox').style.display==="block")
            this.toggleChat();
          this.enableCallEnded();
          this.showTime();
          document.getElementById('boxes').style.display="none";
          document.getElementById('OptionsBefore').style.display="none";
          document.getElementById('innerVideoCallBack').style.width="100%";
          fetch('/doctor/meeting/chat',{
            method: 'post', 
            headers: {
              'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({chat: this.chatData})
          }).then(res=>res.json()).then((result)=>{
            if(result.status===200)
              console.log("Chat Updated");
            else
              console.log('Error while updating chat');
          });
          console.log('You left the session');
        } else {
          console.log('Stopped with a session status code: ', sessionStatusCode);
        }
        
      }
    };
    
    this.meetingSession.audioVideo.addObserver(observer);
    
    this.meetingSession.audioVideo.stop();
  }

  showTime()
  {
    var time=this.endTime-this.startTime;
    fetch('/doctor/meeting/time',{
      method: 'post', 
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify({time: time})
    }).then(res=>res.json()).then((result)=>{
      if(result.status===200)
        console.log("Time Updated");
      else
        console.log('Error while updating time');
    });
    var min=Math.floor(time/60000);
    if(min<10)
      min="0"+min.toString();
    var sec=Math.floor(time/1000)-(min*60);
    if(sec<10)
      sec="0"+sec.toString();
    document.getElementById('time').innerHTML=min+":"+sec;
  }
  //Stops Video and calls API to end meeting
  async endMeeting()
  {
    document.getElementById('ringingAudio').pause();
    this.endMeetingObserver();
    await this.meetingSession.audioVideo.chooseVideoInputDevice(null);
    fetch('/doctor/meeting/Prod/end?title="test2"').then(res=>res.json()).then((result)=>{
      console.log(result);
      console.log("End done");
    })
  }

  //Mute/unmute call
  async muteCall()
  {
    const muted = await this.meetingSession.audioVideo.realtimeIsLocalAudioMuted();
    if (muted) {
      document.getElementById('audioOff').style.display="none";
      document.getElementById('audioOn').style.display="block";
      const unmuted = await this.meetingSession.audioVideo.realtimeUnmuteLocalAudio();
      if (unmuted) {
        console.log('Unmuted');
      } else {
        console.log('You cannot unmute yourself');
      }
    } else {
      document.getElementById('audioOff').style.display="block";
      document.getElementById('audioOn').style.display="none";
      await this.meetingSession.audioVideo.realtimeMuteLocalAudio();
      console.log('Muted');
    }
  }

  //Select Video Device
  async selectVideoDevice()
  {
    const videoInputDevices = await this.meetingSession.audioVideo.listVideoInputDevices();
    await this.meetingSession.audioVideo.chooseVideoInputDevice(videoInputDevices[0].deviceId);
  }

  async videoObserver()
  {
    const videoElement = document.getElementById('ownVideo');
    const observer = {
      // videoTileDidUpdate is called whenever a new tile is created or tileState changes.
      videoTileDidUpdate: tileState => {
        // Ignore a tile without attendee ID and other attendee's tile.
        if (!tileState.boundAttendeeId || !tileState.localTile) {
          return;
        }

        console.log('titlestate');
        console.log(tileState.active);
        this.videoOn=tileState.active;
        this.meetingSession.audioVideo.bindVideoElement(tileState.tileId, videoElement);
      }
    };

    this.meetingSession.audioVideo.addObserver(observer);
  } 
  //Start Sharing video 
  async startVideo()
  {
    this.selectVideoDevice();
    this.meetingSession.audioVideo.startLocalVideoTile();
  }

  //Stop Sharing Video
  async stopVideo()
  {
    this.meetingSession.audioVideo.stopLocalVideoTile();
    console.log('video stopped');
  }

  //See other attendees video
  async seeVideo()
  {
    const videoElements = [document.getElementById('viewVideo')];

    // index-tileId pairs
    const indexMap = {};

    const acquireVideoElement = tileId => {
      // Return the same video element if already bound.
      for (let i = 0; i < 16; i += 1) {
        if (indexMap[i] === tileId) {
          return videoElements[i];
        }
      }
      // Return the next available video element.
      for (let i = 0; i < 16; i += 1) {
        if (!indexMap.hasOwnProperty(i)) {
          indexMap[i] = tileId;
          return videoElements[i];
        }
      }
      throw new Error('no video element is available');
    };

    const releaseVideoElement = tileId => {
      for (let i = 0; i < 16; i += 1) {
        if (indexMap[i] === tileId) {
          delete indexMap[i];
          return;
        }
      }
    };

    const observer = {
      // videoTileDidUpdate is called whenever a new tile is created or tileState changes.
      videoTileDidUpdate: tileState => {
        // Ignore a tile without attendee ID, a local tile (your video), and a content share.
        if (!tileState.boundAttendeeId || tileState.localTile || tileState.isContent) {
          return;
        }
        this.removeRinging();
        this.removeAudioCall();
        this.meetingSession.audioVideo.bindVideoElement(
          tileState.tileId,
          acquireVideoElement(tileState.tileId)
        );

      },
      videoTileWasRemoved: tileId => {
        releaseVideoElement(tileId);
        this.showAudioCall();
      }
    };

    this.meetingSession.audioVideo.addObserver(observer);
  }

  toggleVideo()
  {
    if(this.videoOn===true)
    {
      document.getElementById('videoOff').style.display="block";
      document.getElementById('videoOn').style.display="none";
      this.stopVideo();
    }
    else if(this.videoOn===false)
    {
      document.getElementById('videoOff').style.display="none";
      document.getElementById('videoOn').style.display="block";
      this.startVideo();
      this.startVideo();
    }
  }

  enableIcons()
  {
    document.getElementById('videoOptions').style.display="block";
    var d=new Date();
    this.startTime=d.getTime();
    console.log('Start Time'+this.startTime);
  }

  disableIcons()
  {
    document.getElementById('videoOptions').style.display="none";
  }

  attendeePresentObserver()
  {
    const attendeePresenceSet = new Set();
    const callback = (presentAttendeeId, present) => {
      console.log(`Attendee ID: ${presentAttendeeId} Present: ${present}`);
      if (present) {
        attendeePresenceSet.add(presentAttendeeId);
        if(attendeePresenceSet.size===2)
        {
          this.removeRinging();
          document.getElementById('ringingAudio').pause();
          this.showAudioCall();
          var d=new Date();
          this.startTime=d.getTime();
          document.getElementById('backToDashboard').style.display="none";
          document.getElementById('appointmentDetailsClose').style.display="block";
          document.getElementById('appointmentDetailsOpen').style.display="none";
          console.log('Start Time'+this.startTime);
        }
      } else {
        attendeePresenceSet.delete(presentAttendeeId);
        this.endMeetingObserver();
      }
    };

    this.meetingSession.audioVideo.realtimeSubscribeToAttendeeIdPresence(callback);
  }

  toggleChat()
  {
    if(document.getElementById('chatbox').style.display==="none")
    {
      document.getElementById('chatbox').style.display="block";
      document.getElementById('messageLogo').style.display="block";
      document.getElementById('messageUnreadLogo').style.display="none";
    }
    else
    {
      document.getElementById('chatbox').style.display="none";
    }
  }

  sendMessage()
  {
    var message=document.getElementById('chatMessage').value;
    if(message!=="")
    {
      var html='<div id="messageSend'+this.currentSendMessageId+'" class="messageContainer"><div class="messageBoxSend"><p>'+message+'</p></div></div>';
      document.getElementById('allMessages').innerHTML+=html;
      document.getElementById('chatMessage').value="";
      document.getElementById('messageSend'+this.currentSendMessageId).scrollIntoView();
      this.currentSendMessageId+=1;
      this.meetingSession.audioVideo.realtimeSendDataMessage("topic",message);
      var dict={};
      if(window.location.pathname==="/doctor")
      {
        dict["Doctor"]=message;
        this.chatData.push(dict);
      }
      else if(window.location.pathname==="/patient")
      {
        dict["Patient"]=message;
        this.chatData.push(dict);
      }
    }
  }

  receiveMessageObserver()
  {
    const callback = (datamessage) => {
      console.log('MESSAGE RECEIVED');
      var message=String.fromCharCode.apply(null, datamessage.data);
      var html='<div id="messageReceive'+this.currentReceiveMessageId+'" class="messageContainer"><div class="messageBoxReceive"><p>'+message+'</p></div></div>';
      document.getElementById('allMessages').innerHTML+=html;
      document.getElementById('messageReceive'+this.currentReceiveMessageId).scrollIntoView();
      this.currentReceiveMessageId+=1;
      if(document.getElementById('chatbox').style.display==="none")
      {
        document.getElementById('messageLogo').style.display="none";
        document.getElementById('messageUnreadLogo').style.display="block";
      }
      var dict={};
      if(window.location.pathname==="/doctor")
      {
        dict["Doctor"]=message;
        this.chatData.push(dict);
      }
      else if(window.location.pathname==="/patient")
      {
        dict["Patient"]=message;
        this.chatData.push(dict);
      }
    };
    
    this.meetingSession.audioVideo.realtimeSubscribeToReceiveDataMessage("topic",callback);
    console.log('Message Receive Config Done')
  }

  startCall()
  {
    this.joinMeeting();
    document.getElementById('ringingAudio').play();
    document.getElementById('initiateCall').style.display="none";
    document.getElementById('ringing').style.display="block";
  }

  render(){
    return (
      <div>
      <div class="videoCallBack">
        <div id="innerVideoCallBack" class="innerVideoCallBack">
          <video id="viewVideo" class="viewVideo"></video>
          <video id="ownVideo" class="ownVideo"></video>
          <audio id="ringingAudio" src={ringingSound} loop></audio>
          <div id="initiateCall" class="middlepopup" onClick={this.startCall}>
          <p class="popupText">Click here to connect <br></br>with your {this.attendee}</p>
            <div style={{textAlign:"center"}}>
              <img class="popupImageIcon" alt="ringingIcon" src={ringingLogo} style={{transform:"rotate(135deg)"}}></img>
            </div>
            <p class="ringingText">CALL YOUR {this.attendee}</p>
          </div>
          <div id="ringing" class="middlepopup" style={{display:"none"}}>
            <p class="popupText">Connecting to your {this.attendee} in just a few moments</p>
            <div style={{textAlign:"center"}}>
              <img class="popupImageIcon" alt="ringingIcon" src={ringingLogo}></img>
            </div>
            <p class="ringingText">RINGING...</p>
          </div>
          <div id="audiocall" class="middlepopup"  style={{top:"50%", display:"none"}}>
            <div style={{textAlign:"center"}}>
              <img class="popupImageIcon" alt="audioCallIcon" src={audioCallLogo}></img>
            </div>
            <p class="popupText">Audio Call In Progress</p>
          </div>
          <div id="callEnded" class="callEndComplete" style={{display:"none"}}>
            <div class="callendpopup">
              <p class="ringingText">CALL OVERVIEW</p>
              <p id="time" class="time">00:00</p>
              <p class="ringingText">CALL ENDED</p><br></br>
              <div style={{textAlign:"center"}}>
                <img class="callEndedImageIcon" alt="callended" src={callEndedLogo}></img>
              </div>
            </div>
            <CallEnded />
          </div>
          <audio id="audioElement" style={{display:"none"}} ref={this.audioRef}></audio>
          <div id="videoOptions" class="videoOptions">
            <img id="audioOn" style={{left:"25px"}} alt="muteCallIcon" src={audioOnLogo} onClick={this.muteCall}></img>
            <img id="audioOff" style={{left:"25px", display:"none"}} alt="muteCallIcon" src={audioOffLogo} onClick={this.muteCall}></img>
            <img id="videoOff" style={{left:"90px"}} alt="videoIcon" src={videoCallOffLogo} onClick={this.toggleVideo}></img>
            <img id="videoOn" style={{left:"90px", display:"none"}} alt="videoIcon" src={videoCallOnLogo} onClick={this.toggleVideo}></img>
            <img id="messageLogo" style={{left:"155px"}} alt="messageIcon" src={messageLogo} onClick={this.toggleChat}></img>
            <img id="messageUnreadLogo" style={{left:"155px", display:"none"}} alt="messageIcon" src={messageUnreadLogo} onClick={this.toggleChat}></img>
            <img id="exit" style={{right:"25px"}} alt="endMeetingIcon" src={endMeetingLogo} onClick={this.endMeeting} disabled></img>
          </div>
          <Options />
        </div>
      </div>
      <Boxes />
      <div id="chatbox" class="chatbox" style={{display: "none"}}>
        <div class="chat">
          <span class="chatText">Chat</span>
          <img class="closeIcon" alt="closeIcon" src={closeIcon} onClick={this.toggleChat}></img>
        </div>
        <div id="allMessages" class="allMessages">
          <br></br>
        </div>
        <div class="sendMessage">
          <input id="chatMessage" placeholder="Message" class="sendMessageBox" onKeyPress={event => {if (event.key === 'Enter') {this.sendMessage()}}}></input>
          <img id="sendMessageIcon" class="sendMessageIcon" src={sendMessageLogo} alt="sendIcon" onClick={this.sendMessage}></img>
        </div>
      </div>
      </div>
    );
  }
}

export default VideoCall;
