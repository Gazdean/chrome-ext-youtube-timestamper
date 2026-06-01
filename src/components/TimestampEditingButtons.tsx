import { Button, ButtonGroup } from "react-bootstrap";
import type { VideoData, VideoTimestamp } from "../types";

interface TimestampEditingButtonsProps {
    setIsAddingDescriptionTo: React.Dispatch<React.SetStateAction<number | null>>
    stamp: VideoTimestamp
    youTubeVideoId: string
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
}

export default function TimestampEditingButtons({setIsAddingDescriptionTo, stamp, youTubeVideoId, setIsEditing}: TimestampEditingButtonsProps) {

  const handleOnClickDelete = async (timeInSeconds: number) => {
      const storage = await chrome.storage.local.get("videoData");
      const currentVideoData = (storage.videoData || {}) as VideoData;
      const filteredTimeStamps = currentVideoData[
        youTubeVideoId
      ].videoTimestamps.filter((stamp) => stamp.timeInSeconds !== timeInSeconds);
  
      if (!filteredTimeStamps.length) {
        delete currentVideoData[youTubeVideoId];
        setIsEditing(false);
      } else
        currentVideoData[youTubeVideoId].videoTimestamps = filteredTimeStamps;
      await chrome.storage.local.set({ videoData: currentVideoData });
    };

  return (
    <ButtonGroup aria-label="Edit buttons">
      <Button
      className="me-1 my-1 rounded-0 rounded-start-2 jusify-self-end"
      variant="primary"
      onClick={() => {
        setIsAddingDescriptionTo(stamp.timeInSeconds)
        setIsEditing(false)
      }}
      >
      Edit
      </Button>
      
      <Button
        className="me-1 my-1 rounded-0 rounded-end-2 jusify-self-end"
        variant="danger"
        onClick={() => handleOnClickDelete(stamp.timeInSeconds)}
      >
        Del
      </Button>
    </ButtonGroup>
  )
}
