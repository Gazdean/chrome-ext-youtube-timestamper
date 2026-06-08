export interface ExtSettings {
    showUserInfoModal: boolean
    isDarkMode: boolean
}

export interface VideoTimestamp {
    timeInSeconds: number;
    description?: string
    created_at: number
}

export type VideoTimeStamps = VideoTimestamp[]

export interface VideoEntry {
    title: string;
    maxTimestamps: number;
    videoTimestamps: VideoTimeStamps
    created_at: number
}

export type VideoData = Record<string, VideoEntry>

export interface StoredConfig {
    extSettings?: ExtSettings;
    videoData?: VideoData;
}