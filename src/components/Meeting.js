import React, { useState,useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Peer from 'skyway-js';
import axios from './axios';
import '../styles/Meeting.css';

const Meeting = () => {
    const [videoId, setVideoId] = useState("");
    const [myId, setMyId] = useState("");
    const [theirId, setTheirId] = useState("");
    const videoElm = useRef(null);
    const thierVideo = useRef(null);

    let localStream;

    const key = process.env.REACT_APP_SKYWAY_KEY;

    const peer = new Peer({
        key,
        debug: 3,
        id: videoId
    });

    const getVideoId = async() => {
        axios.interceptors.response.use(response => {
            return response;
         }, error => {
           if (error.response.status === 401) {
                location.assign('/');
           }
           return error;
         });
        const res = await axios.get('/users/me');

        return res.data.data.data.videoID;
    };

    getVideoId().then((data) => { setMyId(data) });

    const makeCall = async () => {
        const mediaConnection = peer.call(theirId, videoElm.current.srcObject);
        mediaConnection.on('stream', async stream => {
            thierVideo.current.srcObject = stream;
            thierVideo.muted = false
            await thierVideo.current.play().catch(console.error);
        });
        setTheirId("");
    };

    const leaveVideo = () => {
        peer.destroy();
        thierVideo.current.srcObject = null;
    };

    useEffect(() => {
        peer.on('call', () => {
            getVideoId().then((data) => { setVideoId(data) });
        })
        
        peer.on('call', mediaConnection => {
            mediaConnection.answer(localStream);

            mediaConnection.on('stream', async stream => {
                thierVideo.current.srcObject = stream;
            });
        });

        navigator.mediaDevices.getUserMedia({video: true, audio: true})
        .then(stream => {
        const video = videoElm.current
        video.srcObject = stream;
        video.play();
        localStream = stream;
        localStream.muted = true;
        }).catch( error => {
            console.error('mediaDevice.getUserMedia() error:', error);
            return;
        });
    }, [videoElm]);

    peer.on('error', err => {
        alert(err.message);
    });

    peer.on('close', () => {
        alert('通信が切断しました。');
    });

    return (
        <div className="main">
            <div className="main__video">
                <video ref={videoElm} width="0" autoPlay muted playsInline></video>
                <video ref={thierVideo} className="main__video_screen" autoPlay muted playsInline></video>
            </div>
            <div className="main__controls">
                <div className="main__controls_font font-small"> 
                    <span>あなたのID</span>
                    <p>{myId}</p>
                </div>
                <div className="main__controls_block">
                    <input value={theirId} onChange={e => setTheirId(e.target.value)} placeholder="相手のIDを入力" />
                    <a onClick={makeCall} className="main__controls_font call-color">
                        <i className="fas fa-phone-volume"></i>
                        <span>発信</span>
                    </a>
                </div>
                <div>  
                    <Link to="/" onClick={leaveVideo} className="main__controls_font leave-color">
                        <i className="fas fa-door-open"></i>
                        <span>退出</span>
                    </Link>
                </div>
            </div>
        </div>
    )
};

export default Meeting;
