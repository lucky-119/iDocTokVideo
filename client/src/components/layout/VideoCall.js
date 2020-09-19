import React, {Component} from 'react';
import './VideoCall.css';
import ringingLogo from '../../img/ringingImage.png';
import {
  ConsoleLogger,
  DefaultDeviceController,
  DefaultMeetingSession,
  LogLevel,
  MeetingSessionConfiguration
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
    this.audioRef = React.createRef();
    this.meetingSession="";
    this.videoOn="false";
  }

  //Run when component opens up/is mounted
  componentWillMount(){
    console.log('HHH')
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
    this.startVideo();
  }

  //Select Local Audio Devices
  async selectAudioDevices()
  {
    const audioInputDevices = await this.meetingSession.audioVideo.listAudioInputDevices();
    const audioOutputDevices = await this.meetingSession.audioVideo.listAudioOutputDevices();

    console.log(audioInputDevices[0]);
    console.log(audioOutputDevices[0]);
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
        this.selectVideoDevice();
      }
    };

    this.meetingSession.audioVideo.addObserver(addAudioStartObserver);
  }

  //Observer when video starts
  addVideoStartObserver()
  {
    const addVideoStartObserver = {
      audioVideoDidStart: () => {
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
  }

  //Stops Video and calls API to end meeting
  endMeeting()
  {
    this.stopVideo();
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
      const unmuted = this.meetingSession.audioVideo.realtimeUnmuteLocalAudio();
      if (unmuted) {
        console.log('Unmuted');
      } else {
        console.log('You cannot unmute yourself');
      }
    } else {
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

  //Start Sharing video 
  async startVideo()
  {
    const videoElement = document.getElementById('ownVideo');

    this.selectVideoDevice();

    const observer = {
      // videoTileDidUpdate is called whenever a new tile is created or tileState changes.
      videoTileDidUpdate: tileState => {
        // Ignore a tile without attendee ID and other attendee's tile.
        if (!tileState.boundAttendeeId || !tileState.localTile) {
          return;
        }
        this.selectVideoDevice();

        if(tileState.active==="true")
          this.videoOn="true";
        else if(tileState.active==="false")
          this.videoOn="false";

        this.meetingSession.audioVideo.bindVideoElement(tileState.tileId, videoElement);
      }
    };

    this.meetingSession.audioVideo.addObserver(observer);

    this.meetingSession.audioVideo.start();

    this.meetingSession.audioVideo.startLocalVideoTile();

    this.seeVideo();
  }

  //Stop Sharing Video
  async stopVideo()
  {
    const videoElement = document.getElementById('ownVideo');

    let localTileId = null;
    const observer = {
      videoTileDidUpdate: tileState => {
        // Ignore a tile without attendee ID and other attendee's tile.
        if (!tileState.boundAttendeeId || !tileState.localTile) {
          return;
        }

        if(tileState.active==="true")
          this.videoOn="true";
        else if(tileState.active==="false")
          this.videoOn="false";
          
        // videoTileDidUpdate is also invoked when you call startLocalVideoTile or tileState changes.
        console.log(`If you called stopLocalVideoTile, ${tileState.active} is false.`);
        this.meetingSession.audioVideo.bindVideoElement(tileState.tileId, videoElement);
        localTileId = tileState.tileId;
      },
      videoTileWasRemoved: tileId => {
        if (localTileId === tileId) {
          console.log(`You called removeLocalVideoTile. videoElement can be bound to another tile.`);
          localTileId = null;
        }
      }
    };

    this.meetingSession.audioVideo.addObserver(observer);

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

        this.meetingSession.audioVideo.bindVideoElement(
          tileState.tileId,
          acquireVideoElement(tileState.tileId)
        );
      },
      videoTileWasRemoved: tileId => {
        releaseVideoElement(tileId);
      }
    };

    this.meetingSession.audioVideo.addObserver(observer);
  }

  toggleVideo()
  {
    if(this.videoOn==="true")
      this.stopVideo();
    else if(this.videoOn==="false")
      this.startVideo();
  }

  render(){
    return (
      <div>
        <video id="viewVideo" class="viewVideo"></video>
        <video id="ownVideo" class="ownVideo"></video>
        <div class="ringing">
          <div style={{textAlign:"center"}}>
            <img class="ringingIcon" alt="ringingicon" src={ringingLogo} onClick={this.joinMeeting}></img>
          </div>
          <p class="ringingText">Ringing...</p>
        </div>
        <audio id="audioElement" style={{display:"none"}} ref={this.audioRef}></audio>
        <div>
          <button class="muteCallIcon" onClick={this.muteCall}>mute</button>
          <button class="videoIcon" onClick={this.toggleVideo}>video</button>
          <button class="endMeetingIcon" onClick={this.endMeeting}>end</button>
        </div>
      </div>
    );
  }
}

export default VideoCall;
