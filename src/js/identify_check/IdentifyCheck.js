import React, { useRef, useState, useEffect } from "react";
import "../../scss/Common.scss";
import "../../scss/App.scss";
import "../../scss/IdentifyCheck.scss";

const IdentifyCheck = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false); // Check api have call already?
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const startWebcam = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          const video = videoRef.current;
          if (video) {
            video.srcObject = stream;
            video.addEventListener("loadeddata", () => {
              video.play();
            });
          }
        })
        .catch((err) => {
          console.error("Error accessing webcam: ", err);
        });
    };
    startWebcam();
  }, []);

  const capturePhoto = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      setImageSrc(canvas.toDataURL("image/png"));
      const base64Image = canvas.toDataURL("image/png");
      const base64String = base64Image.split(",")[1];

      setLoading(true); // start call api
      setDataFetched(false); // set the state before call api
      setError(null);
      try {
        const response = await fetch("/moldova/v2/identity/check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: base64String }),
        });

        if (!response.ok) {
          const errorText = await response.text(); // Get response text for detailed error
          throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        // console.error("There was a problem with the fetch operation:", error);
        setError(error.message);
        setData(null);
      } finally {
        setLoading(false); // complete call api
        setDataFetched(true); // set the state after call api
      }
    }
  };

  return (
    <div>
      <button
        className="identifier-find-btn btn btn-whiteColor"
        onClick={capturePhoto}
      >
        Capture Photo
      </button>
      <div>
        <video ref={videoRef} style={{ display: "none" }} />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {loading && <div class="loader"></div>}

        {!loading && dataFetched && data ? (
          <>
            <div className="result">
              <div className="image-result">
                {imageSrc && (
                  <img src={imageSrc} alt="Captured" className="images-find" />
                )}
              </div>
              <div className="contents">
                <p>ID: {data.id}</p>
                <p>Distance: {data.distance.toFixed(1)}</p>
                <p>Similarity: {data.similarity.toFixed(1)}</p>
              </div>
            </div>
          </>
        ) : (  
          
          error && <p style={{ color: "red" }}>Error: {error}</p>
        )}
      </div>
    </div>
  );
};

export default IdentifyCheck;
