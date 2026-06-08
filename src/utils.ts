import { APP_CONFIG, TIMESTAMP_CONSTANTS } from "./constants"
import type { VideoTimestamp } from "./types"

export const convertToHMS = (timeInSeconds: number) => {
    const timeArr = ['00', '00', '00']
    let remainingSeconds = timeInSeconds

    const hours = Math.floor(remainingSeconds / 3600)
    if (hours) {
        timeArr[0] = hours < 10 ? `0${hours}` : `${hours}` 
        remainingSeconds -= hours * 3600
    }

    const minutes = Math.floor(remainingSeconds / 60)
    if (minutes) {
        timeArr[1] = minutes < 10 ? `0${minutes}` : `${minutes}` 
        remainingSeconds -= minutes * 60
    }
    
    if (remainingSeconds) {
        timeArr[2] = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}` 
    }

    return timeArr.join(':')
}

export const sortVideoEntrysAscOrder = (videoStampArr: VideoTimestamp[]) => {
    return videoStampArr.sort((a, b) => {
        if (a.timeInSeconds < b.timeInSeconds) return -1
        else if (a.timeInSeconds > b.timeInSeconds) return 1
        return 0
    })
}

export const getYouTubeVideoIdFromUrl = (url: string) => {
    let idMatches;
    if (url.includes('shorts')) idMatches = url.match(/shorts\/([^/?#&]+)/)
    else if (url.includes('watch')) idMatches = url.match(/watch\?v=([^/?#&]+)/)
    return idMatches && idMatches.length === 2 ? idMatches[1] : ""
}

export const createYouTubeUrl = (youTubeId: string, timeInSeconds?: number) => {
    return `${APP_CONFIG.YOUTUBE_WATCH_URL}?v=${youTubeId}${timeInSeconds ? `&t=${timeInSeconds}s` : ""}`
}

export const formatTitle = (titleStr: string) => {
        return titleStr.length <= 38 ? titleStr : titleStr.slice(0, 35) + "...";
    };

export const CalculateMaxNumberOfTimestamps = (videoDuration: number, isPaidTier: boolean = false): number => {
    const videoLengthInMinutes = videoDuration / 60
    const minutesPerTimestamp = isPaidTier ? TIMESTAMP_CONSTANTS.PAID_TIER_MINUTES_PER_EXTRA_TIME_STAMP : TIMESTAMP_CONSTANTS.FREE_TIER_MINUTES_PER_EXTRA_TIME_STAMP
    const numberOfTimeStamps = Math.floor(videoLengthInMinutes / minutesPerTimestamp)

    return Math.max(numberOfTimeStamps, TIMESTAMP_CONSTANTS.BASE_NUMBER_TIMESTAMPS_PER_VIDEO)
}