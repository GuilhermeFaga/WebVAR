import './App.css';
import Webcam from "react-webcam";
import ReactPlayer from 'react-player'
import { useCallback, useRef, useState } from 'react';
import BottomNav from './components/BottomNav';
import Card from './components/Card';


export default function App() {
  const [isRecording, setIsRecording] = useState(false);


  const components = [
    <VideoComponent />,
    <VideoComponent />,
  ]

  var cl = components.length;

  return (
    <>
      <div
        className={`video-grid bg-white dark:bg-gray-900 grid grid-flow-row grid-cols-1 md:grid-cols-${cl == 1 ? "1" : "2"} auto-rows-auto gap-2 p-2 h-full`}>
        {components}
      </div>
      <BottomNav isRecording={isRecording} />
    </>
  );
}


function VideoComponent({ }) {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);


  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    setRecordedChunks([]);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm"
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);


  return (

    <div className='w-full flex items-center col-span-1 overflow-hidden'>
      <div className='w-full h-fit'>
        <Card>

          <Webcam
            className='w-full aspect-video'
            ref={webcamRef}
            audio={false} />

          {/* {capturing ? (
          <button onClick={handleStopCaptureClick} className='temp'>Stop Capture</button>
          ) : (
            <button onClick={handleStartCaptureClick} className='temp'>Start Capture</button>
          )} */}

          {recordedChunks.length > 0 && (
            <ReactPlayer
              className='absolute h-inherit w-inherit m-2 top-0 left-0'
              height={webcamRef?.current.video.clientHeight}
              width={webcamRef?.current.video.clientWidth}
              url={URL.createObjectURL(new Blob(recordedChunks))} />
          )}

        </Card>
      </div>
    </div>
  );

}