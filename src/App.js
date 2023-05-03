import './App.css';
import Webcam from "react-webcam";
import ReactPlayer from 'react-player'
import { useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';
import BottomNav from 'components/BottomNav';
import Card from 'components/Card';
import GlobalController from './GlobalController';
import { RecordingContext, RecordingDispatchContext } from 'contexts/RecordingContext';
import { recordingReducer } from 'contexts/RecordingReducer';
import { WebcamsContext, WebcamsDispatchContext } from 'contexts/WebcamsContext';
import { webcamsReducer } from 'contexts/WebcamsReducer';


export default function App() {
  const [recordingState, recordingDispatch] = useReducer(recordingReducer, -1);
  const [webcamsState, webcamsDispatch] = useReducer(webcamsReducer, []);

  const webcams = webcamsState.map((webcam) => <VideoComponent id={webcam.id} />)

  var cl = webcams.length;

  console.log(webcamsState)

  return (
    <WebcamsContext.Provider value={webcamsState}>
      <WebcamsDispatchContext.Provider value={webcamsDispatch}>
        <RecordingContext.Provider value={recordingState}>
          <RecordingDispatchContext.Provider value={recordingDispatch}>
            <div className={`video-grid bg-white dark:bg-gray-900 grid grid-flow-row grid-cols-1 md:grid-cols-${cl === 1 ? "1" : "2"} auto-rows-auto gap-2 p-2 h-full`}>
              {webcams}
            </div>
            <BottomNav />
          </RecordingDispatchContext.Provider>
        </RecordingContext.Provider>
      </WebcamsDispatchContext.Provider>
    </WebcamsContext.Provider>
  );
}


function useHookWithRefCallback(callback) {
  const ref = useRef(null)
  const setRef = useCallback(node => {
    if (ref.current) {
      // Make sure to cleanup any events/references added to the last instance
    }

    if (node) {
      // Check if a node is actually passed. Otherwise node would be null.
      // You can now do what you need to, addEventListeners, measure, etc.
      callback(node)
    }

    // Save a reference to the node
    ref.current = node
  }, [callback])

  return [setRef]
}


function VideoComponent({ id }) {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const recordingState = useContext(RecordingContext);

  const [playerRef] = useHookWithRefCallback((node) => {
    const controller = GlobalController.getInstance();
    controller.setRef(node, id);
  })

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

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
  }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable]);

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, setCapturing]);

  useEffect(() => {
    if (recordingState === 1) {
      handleStartCaptureClick();
    } else if (recordingState === 0 && capturing) {
      handleStopCaptureClick();
    }
  }, [recordingState, capturing, handleStartCaptureClick, handleStopCaptureClick])


  return (

    <div className='w-full flex items-center col-span-1 overflow-hidden'>
      <div className='w-full h-fit'>
        <Card>

          <Webcam
            className='w-full aspect-video'
            videoConstraints={{ deviceId: id }}
            ref={webcamRef}
            audio={false} />

          {recordedChunks.length > 0 && (
            <ReactPlayer
              className='absolute h-inherit w-inherit top-0 left-0'
              ref={playerRef}
              height={webcamRef?.current.video.clientHeight}
              width={webcamRef?.current.video.clientWidth}
              url={URL.createObjectURL(new Blob(recordedChunks))}
              onEnded={() => {
                const controller = GlobalController.getInstance();
                controller.onEnded()
              }}
              onProgress={(progress) => {
                const controller = GlobalController.getInstance();
                controller.onProgress(progress.played)
              }}
              progressInterval={10} />
          )}

        </Card>
      </div>
    </div>
  );

}