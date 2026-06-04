import { Button } from "react-bootstrap";
import type { StoredConfig, VideoEntry, VideoTimeStamps } from "../types";
import { sortVideoEntrysAscOrder } from "../utils";
import { STORAGE_LIMITS } from "../constants";
import { useEffect, useState } from "react";

import EditButton from "../components/EditButton";
import TimestampList from "../components/TimestampList";
import AutoPauseButton from "../components/AutoPauseButton";

interface VideoTimestampInfoProps {
  activeTabId: number;
  youTubeVideoId: string;
  videoEntry: VideoEntry;
}

export default function YouTubeVideoPage({
  activeTabId,
  youTubeVideoId,
  videoEntry,
}: VideoTimestampInfoProps) {
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("")
  const [isAutoPauseEnabled, setIsAutoPauseEnabled] = useState(false)
  const [isAddingDescriptionTo, setIsAddingDescriptionTo] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (!isAutoPauseEnabled && isAddingDescriptionTo) {
      chrome.tabs.sendMessage(
        activeTabId,
        { type: "PLAY_VIDEO"},
        async (response) => {
          console.log(response)
        }
      )
    }
  }, [isAutoPauseEnabled, isAddingDescriptionTo, activeTabId])

  
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "UPDATE_UI_AD_STATUS" && message.forTabId === activeTabId) setIsAdPlaying(message.isAd);
    
    if (message.type === "TITLE_UPDATED") setTitle(message.title)
  });

  const handleOnClickMarkTimestamp = () => {
    // send message to content to grab timestamp and video title
    chrome.tabs.sendMessage(
      activeTabId,
      { type: "MARK_TIMESTAMP", pauseVideo: isAutoPauseEnabled},
      async (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error: Content Script not loaded. Refresh YouTube.");
          return;
        }

        if (response) {
          const timeStamp = response.time;
          const config = await chrome.storage.local.get("videoData") as StoredConfig;

          const existingVideoEntry: VideoEntry = config.videoData?.[youTubeVideoId] || {} as VideoEntry; 
          const currTimeStamps: VideoTimeStamps = existingVideoEntry?.videoTimestamps || [] as VideoTimeStamps;

          // Return early if the timestamp is already in storage
          if (currTimeStamps.some(timestamp => timestamp.timeInSeconds === response?.time)) return

          const newVideoEntry = {
              ...existingVideoEntry,
              title: existingVideoEntry.title || response.videoTitle,
              videoTimestamps: sortVideoEntrysAscOrder([
              ...currTimeStamps,
              { timeInSeconds: timeStamp, created_at: Date.now() },
            ]),
              created_at: existingVideoEntry.created_at || Date.now(),
            };

          await chrome.storage.local.set({
            videoData: {
              ...config.videoData,
              [youTubeVideoId]: newVideoEntry,
            },
          });

          if (isAutoPauseEnabled) {
            setIsAddingDescriptionTo(timeStamp)
          }
          
        }
      },
    );
  };

  const isTimeStampLimitReached =
    videoEntry.videoTimestamps?.length >=
    STORAGE_LIMITS.MAX_TIMESTAMPS_PER_VIDEO;

  return (
    <div className="mx-1">
      <AutoPauseButton isAutoPauseEnabled={isAutoPauseEnabled} setIsAutoPauseEnabled={setIsAutoPauseEnabled}/>
      <Button
        className="mb-4"
        style={{ width: "180px" }}
        variant={isAdPlaying ? "warning" : isTimeStampLimitReached ? "danger" : "primary"}
        onClick={handleOnClickMarkTimestamp}
        disabled={isTimeStampLimitReached || isAdPlaying || isEditing}
      >
        {isAdPlaying ? "Please Wait" : isTimeStampLimitReached ? "Limit Reached" : "Mark Timestamp"}
      </Button>

      {Object.keys(videoEntry).length ? (
        <div>
          <h2 className="mb-2">{videoEntry.title}</h2>
          <EditButton isEditing={isEditing} setIsEditing={setIsEditing} />
          <TimestampList
            youTubeVideoId={youTubeVideoId}
            videoEntry={videoEntry}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            isAddingDescriptionTo={isAddingDescriptionTo}
            setIsAddingDescriptionTo={setIsAddingDescriptionTo}
            activeTabId={activeTabId}
            isAutoPauseEnabled={isAutoPauseEnabled}
          />
        </div>
      ) : (
        <div>
          <h2>{title}</h2>
          <p>No current timestamps for this video</p>
        </div>
      )}
    </div>
  );
}
