import { useEffect, useState } from "react";

import { APP_CONFIG, STORAGE_LIMITS } from "../constants";

import InvalidPage from "../pages/InvalidPage";
import MainYouTubePage from "../pages/MainYouTubePage";
import YouTubeVideoPage from "../pages/YouTubeVideoPage";
import type { StoredConfig, VideoData, VideoEntry } from "../types";
import { getYouTubeVideoIdFromUrl } from "../utils";

export default function MainContent() {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isValidPage, setIsValidPage] = useState<boolean>(false);
  const [activeTabId, setActiveTabId] = useState<number | null>(null);
  const [activeTabUrl, setActiveTabUrl] = useState<string>("");
  const [videoData, setVideoData] = useState<VideoData>({} as VideoData);
  const [isLoading, setIsLoading] = useState(false);

  // Validate page state useEffect
  useEffect(() => {
    const validatePage = () => {
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        const tabId = tabs[0]?.id;
        const tabUrl = tabs[0].url || "";

        const isYouTubepage = tabUrl?.startsWith(
          APP_CONFIG.YOUTUBE_HOMEPAGE_URL,
        );
        const isYouTubeVideo =
          tabUrl?.startsWith(APP_CONFIG.YOUTUBE_WATCH_URL) ||
          tabUrl?.startsWith(APP_CONFIG.YOUTUBE_SHORTS_URL);

        if (tabId && tabUrl && isYouTubepage) {
          setIsValidPage(true);
          setActiveTabId(tabId);
          setActiveTabUrl(tabUrl);
          if (isYouTubeVideo) {
            setIsEnabled(true);
            console.log("youTube Video");
            return;
          }
          setIsEnabled(false);
          console.log("youTube Main");
        } else {
          setIsValidPage(false);
          setIsEnabled(false);
          setActiveTabId(null);
          setActiveTabUrl("");
          console.log("NON YouTube");
        }
      });
    };

    validatePage();

    chrome.tabs.onActivated.addListener(validatePage);
    chrome.tabs.onUpdated.addListener(validatePage);

    return () => {
      chrome.tabs.onActivated.removeListener(validatePage);
      chrome.tabs.onUpdated.removeListener(validatePage);
    };
  }, []);

  // Fetch video data from chrome storage
  useEffect(() => {
    const fetchVideoData = async () => {
      setIsLoading(true);
      const data = await chrome.storage.local.get("videoData");
      const config = data as StoredConfig;
      setVideoData(config.videoData || {});
      setIsLoading(false);
    };
    fetchVideoData();
  }, [activeTabUrl]);

  useEffect(() => {
    const sync = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes.videoData) {
        setVideoData((changes.videoData.newValue as VideoData) || {});
      }
    };
    chrome.storage.onChanged.addListener(sync);
    return () => chrome.storage.onChanged.removeListener(sync);
  }, []);

  if (isLoading) return <p>Loading...</p>;

  const isAtVideoStorageLimit =
    Object.keys(videoData).length >= STORAGE_LIMITS.FREE_TIER_MAX_VIDEOS;

  if (isValidPage && !isEnabled)
    return (
      <MainYouTubePage
        videoData={videoData}
        isAtVideoStorageLimit={isAtVideoStorageLimit}
      />
    );

  const youTubeVideoId: string = getYouTubeVideoIdFromUrl(activeTabUrl);
  const isAlreadyInStorage = Object.keys(videoData).includes(youTubeVideoId);

  if (
    isValidPage &&
    isEnabled &&
    activeTabId &&
    isAtVideoStorageLimit &&
    !isAlreadyInStorage
  ) {
    return (
      <MainYouTubePage
        videoData={videoData}
        isAtVideoStorageLimit={isAtVideoStorageLimit}
      />
    );
  }

  const videoEntry: VideoEntry = videoData?.[youTubeVideoId] || {};

  if (
    isValidPage &&
    isEnabled &&
    activeTabId &&
    (!isAtVideoStorageLimit || (isAtVideoStorageLimit && isAlreadyInStorage))
  )
    return (
      <YouTubeVideoPage
        key={youTubeVideoId}
        activeTabId={activeTabId}
        youTubeVideoId={youTubeVideoId}
        videoEntry={videoEntry}
      />
    );

  return <InvalidPage />;
}
