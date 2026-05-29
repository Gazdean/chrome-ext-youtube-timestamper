import type { VideoData } from "../types";
import { STORAGE_LIMITS } from "../constants";
import { useState } from "react";
import VideoList from "../components/VideoList";
import EditButton from "../components/EditButton";

interface MainYouTubePageProps {
  videoData: VideoData;
  isAtVideoStorageLimit: boolean;
}

export default function MainYouTubePage({
  videoData,
  isAtVideoStorageLimit,
}: MainYouTubePageProps) {
  const [isEditing, setIsEditing] = useState(false);

  const videoKeys = Object.keys(videoData || {});
  const videoCount = videoKeys.length;

  if (videoCount === 0) return (<h2>You have no videos stored</h2>)
  return (
    <div>
      <h2>
        Your video list {videoCount}/{STORAGE_LIMITS.MAX_VIDEOS}
      </h2>

      {isAtVideoStorageLimit && (
        <p className="text-danger">
          Storage limit reached, to add timestamps please delete any
          unwanted videos
        </p>
      )}

      <EditButton isEditing={isEditing} setIsEditing={setIsEditing} />

      <VideoList
        videoData={videoData}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
    </div>
  );
}
