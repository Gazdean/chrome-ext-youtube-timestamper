import { Button, Form } from "react-bootstrap";
import type { VideoData, VideoEntry } from "../types";
import { useEffect, useState } from "react";

interface AddDescriptionFormProps {
  youTubeVideoId: string;
  isAddingDescriptionTo: number;
  setIsAddingDescriptionTo: React.Dispatch<React.SetStateAction<number | null>>
  currentDescription: string
  isEditing: boolean
}

export default function AddDescriptionForm({
  youTubeVideoId,
  isAddingDescriptionTo,
  setIsAddingDescriptionTo,
  currentDescription,
  isEditing
}: AddDescriptionFormProps) {
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (isEditing) setIsAddingDescriptionTo(null)
  },[isEditing, setIsAddingDescriptionTo])

   const handleSubmitDescription = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (description) {
      const storage = await chrome.storage.local.get("videoData");
      const currentVideoData = (storage.videoData || {}) as VideoData;

      const currentEntryData: VideoEntry = currentVideoData[youTubeVideoId];

      if (isAddingDescriptionTo !== null) {
        const currTimestampIndex = currentEntryData.videoTimestamps.findIndex(
          (stamp) => stamp.timeInSeconds === isAddingDescriptionTo,
        );
        if (currTimestampIndex !== -1)
          currentEntryData.videoTimestamps[currTimestampIndex].description = `${description[0].toUpperCase()}${description.slice(1)}`;
      }

      await chrome.storage.local.set({ videoData: currentVideoData });
    }
    setIsAddingDescriptionTo(null);
    setDescription("");
  };

  return (
    <div onClick={(e)=> e.stopPropagation()}>
      <Form className="d-flex flex-row" onSubmit={handleSubmitDescription}>
        <Form.Group className="d-flex flex-row" controlId="formDescription">
          
        <Form.Label></Form.Label>
          <Form.Control
            type="text"
            placeholder={currentDescription ? currentDescription : "Enter Description"}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === " ") {
                e.stopPropagation();
              }
            }}
          />
        </Form.Group>
        <Button className="ms-1" variant="primary" type="submit">
          Submit
        </Button>
      </Form>  
    </div>
  );
}
