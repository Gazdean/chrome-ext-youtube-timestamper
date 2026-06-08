import { Button, ListGroup } from "react-bootstrap";
import { STORAGE_LIMITS } from "../constants";
import type { VideoData } from "../types";
import { navigateActiveTab } from "../chromeHelpers";
import { createYouTubeUrl, formatTitle } from "../utils";

interface VideoListProps {
  videoData: VideoData;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function VideoList({
  videoData,
  isEditing,
  setIsEditing,
}: VideoListProps) {
  const handleDeleteVideo = async (idToDelete: string) => {
    const storage = await chrome.storage.local.get("videoData");
    const currentVideoData = (storage.videoData || {}) as VideoData;

    delete currentVideoData[idToDelete];

    // if currentVideoData is empty setIsEditing to false to close editing
    if (Object.keys(currentVideoData).length === 0) setIsEditing(false);

    await chrome.storage.local.set({ videoData: currentVideoData });
    return currentVideoData;
  };

  return (
    <ListGroup className="m-2">
      {!!Object.keys(videoData).length &&
        Object.keys(videoData).map((id, i) => (
          <ListGroup.Item
            key={id + `${i}`}
            className="d-flex flex-row m-0 p-0"
            action={!isEditing}
            onClick={() =>
              !isEditing && navigateActiveTab(createYouTubeUrl(id))
            }
          >
            <div className="my-2 flex-grow-1">
              <h3 className="h5">{formatTitle(videoData[id].title)}</h3>
              <h4 className="h6">
                No. Timestamps {videoData[id].videoTimestamps.length} /{" "}
                {STORAGE_LIMITS.FREE_TIER_MAX_TIMESTAMPS_PER_VIDEO}
              </h4>
            </div>

            {isEditing && (
              <Button
                className="me-1 my-1 rounded-0 rounded-end-2 jusify-self-end"
                variant="danger"
                onClick={() => handleDeleteVideo(id)}
              >
                Del
              </Button>
            )}
          </ListGroup.Item>
        ))}
    </ListGroup>
  );
}
