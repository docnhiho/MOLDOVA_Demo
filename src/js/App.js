import React, {useState, useRef, useEffect} from 'react';
import '../scss/Common.scss';
import '../scss/App.scss';
import RegisterPreviewPopup from "./RegisterPreviewPopup";
import IdentifyCheck from "./identify_check/IdentifyCheck"

import strengthImg from '../image/strength.png';
import headerLineImg from '../image/headerLine.png';

function App() {
    
    const [showPopup, setShowPopup] = useState(false);

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const videoRef = useRef(null);

    useEffect(() => {
        const constraints = {
            video: true,
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                let video = videoRef.current;
                video.srcObject = stream;
            })
            .catch((err) => {
                console.error("Error accessing the camera: ", err);
            });
    }, []);

    const handleCanPlay = () => {
        videoRef.current.play();
    };

    return (
        <div className="App max-width-page">
            <div className="identifier-register margin-bottom-70">
                <div className="identifier-register-strength margin-bottom-50">
                    <img src={strengthImg} alt="identifier Register Fuction"/>
                </div>
                <div className="identifier-register-content margin-left-10">
                    <div className="identifier-register-content-intro margin-bottom-50">
                        <h1 className="identifier-register-content-intro-header margin-bottom-70">
                            Facial Recognition System
                            <img src={headerLineImg} alt="Line"/>
                        </h1>

                        <p className="identifier-register-content-intro-text">
                            Register an image from an ID or a captured image, and then you will receive an identifier
                            associated with that image.
                        </p>
                    </div>
                    <div className="margin-bottom-50">
                        <div className="identifier-register-content-camera" style={{"display" : "none"}}>
                            <video ref={videoRef} width="100%" height="100%" onLoadedMetadata={handleCanPlay}/>
                        </div>
                        <div className="identifier-register-content-btn">
                            <div id="registerByFile" className="margin-bottom-30">
                                <button className="btn btn-mainColor" onClick={togglePopup}>Register With File</button>
                                <RegisterPreviewPopup show={showPopup} handleClose={togglePopup}>
                                    <h2>Popup Content</h2>
                                    <p>This is the content inside the popup.</p>
                                </RegisterPreviewPopup>
                            </div>

                            <div id="registerByCapture">
                                <button className="btn btn-mainColor" onClick={togglePopup}>Register With Capture
                                </button>
                                <RegisterPreviewPopup show={showPopup} handleClose={togglePopup}>
                                    <h2>Popup Content</h2>
                                    <p>This is the content inside the popup.</p>
                                </RegisterPreviewPopup>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="identifier-find">
                <IdentifyCheck></IdentifyCheck>               
            </div>
            <div>
               
            </div>
           
        </div>
    );
}

export default App;
