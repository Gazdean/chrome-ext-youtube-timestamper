import { Button, ListGroup } from "react-bootstrap";
import { convertToHMS, createYouTubeUrl } from "../utils";
import AddDescriptionForm from "./AddDescriptionForm";
import type { VideoEntry } from "../types";
import { navigateActiveTab } from "../chromeHelpers";
import TimestampEditingButtons from "./TimestampEditingButtons";

interface TimestampListProps {
  youTubeVideoId: string;
  videoEntry: VideoEntry;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  isAddingDescriptionTo: number | null;
  setIsAddingDescriptionTo: React.Dispatch<React.SetStateAction<number | null>>;
  activeTabId: number,
  isAutoPauseEnabled: boolean
}

export default function TimestampList({
  youTubeVideoId,
  videoEntry,
  isEditing,
  setIsEditing,
  isAddingDescriptionTo,
  setIsAddingDescriptionTo,
  activeTabId,
  isAutoPauseEnabled
}: TimestampListProps) {

  return (
    <ListGroup>
      {videoEntry.videoTimestamps.map((stamp, i) => {
        const isAdding = isAddingDescriptionTo === stamp.timeInSeconds;

        if (isAdding) {
          return (
            <ListGroup.Item key={stamp.timeInSeconds + i}>
              <div className="mb-1 flex-grow-1">
                <p className="h4 m-0 me-2 align-self-center">
                  {convertToHMS(stamp.timeInSeconds)}
                </p>
              </div>
              <AddDescriptionForm
                youTubeVideoId={youTubeVideoId}
                isAddingDescriptionTo={isAddingDescriptionTo}
                setIsAddingDescriptionTo={setIsAddingDescriptionTo}
                currentDescription={stamp.description || ""}
                isEditing={isEditing}
                activeTabId={activeTabId}
                isAutoPauseEnabled={isAutoPauseEnabled}
              />
            </ListGroup.Item>
          );
        }

        else {
          return (
            <ListGroup.Item
              key={stamp.timeInSeconds + i}
              className="d-flex flex-row justify-content-center m-0 p-0"
              action
              onClick={() =>
                !isEditing &&
                navigateActiveTab(
                  createYouTubeUrl(youTubeVideoId, stamp.timeInSeconds),
                )
              }
            >
              <div className="m-1 flex-grow-1">
                <p className="h4 m-0 me-2 align-self-center">
                  {convertToHMS(stamp.timeInSeconds)}
                </p>

                {stamp.description && <p className="h4">{stamp.description}</p>}

                {!isEditing && !stamp.description && (
                  <Button
                    variant="outline-primary"
                    onClick={(e) => {
                      e.stopPropagation();

                      setIsAddingDescriptionTo(stamp.timeInSeconds);
                    }}
                  >
                    Add Description
                  </Button>
                )}
              </div>

              {isEditing && (
                <TimestampEditingButtons
                  setIsAddingDescriptionTo={setIsAddingDescriptionTo}
                  stamp={stamp}
                  youTubeVideoId={youTubeVideoId}
                  setIsEditing={setIsEditing}
                />
              )}
            </ListGroup.Item>
          );
        }
      })}
    </ListGroup>
  );
}
