console.log("IN CONTENT.TS")

const getActiveVideo = () => {
  // get all videos as youtube shorts page has more than one video element
  const videos = Array.from(document.querySelectorAll('video'));
  // Filter for the one that is actually being displayed to the user
  // Shorts videos that aren't active usually have 0 width/height or are hidden
  const activeVideo = videos.find((video) => {
    const rect = video.getBoundingClientRect();
    return (
      video.readyState >= 2 && // Has metadata/data
      rect.width > 0 && // Is physically visible width
      rect.height > 0 &&  // Is physically visible height
      video.paused === false   // Usually the active Short is the only one playing
    );
  }) || videos[0];

  return activeVideo
}

const createTimestamp = () => {
  const activeVideo = getActiveVideo()

  if (activeVideo) {
    console.log("Captured Time:", activeVideo.currentTime);
    return Math.floor(activeVideo.currentTime);
  }
  
  return null;
};

const getVideoTitle = () => {
  const mainTitle = document.title.replace(/\(\d+\)\s?/, "").replace(/\s?-\s?YouTube/, "").trim()

  const youTubeShortTitle = document.querySelector(".reel-video-info-renderer h2 span")?.textContent?.trim()
  
  const youTubeWatchTitle = document.querySelector("#title h1 yt-formatted-string")?.textContent?.trim()
                        || document.querySelector("h1.ytd-video-primary-info-renderer")?.textContent?.trim();
  
  return   youTubeWatchTitle || youTubeShortTitle || mainTitle
}

// Advert Observer
const advertObserver = new MutationObserver(() => {
  const player = document.querySelector('.html5-video-player');
    const isAd = !!(
      player?.classList.contains('ad-showing') || 
      document.querySelector('.ytp-ad-skip-button') ||
      document.querySelector('.ytp-ad-player-overlay')
    );
  chrome.runtime.sendMessage({ type: "AD_STATUS_CHANGED", isAd });
});

advertObserver.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] });

// Listen for messages sent from the SIDE PANEL
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Recieved message", request.type, sender)

  if (request.type === "CHECK_ADVERT_STATUS") {
    const player = document.querySelector('.html5-video-player');
    const isAd = !!(
      player?.classList.contains('ad-showing') || 
      document.querySelector('.ytp-ad-skip-button') ||
      document.querySelector('.ytp-ad-player-overlay')
    );
    sendResponse({ isAd });
  }
  else if (request.type === "MARK_TIMESTAMP") {
    sendResponse({time: createTimestamp(), videoTitle: getVideoTitle()});
  }
  else if (request.type === "GET_VIDEO_TITLE") {
    console.log("Get title")
    sendResponse({videoTitle: getVideoTitle()})
  }
});