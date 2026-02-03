import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getEmbedUrl = (url: string) => {
  try {
    const urlObj = new URL(url)

    // Instagram Embed
    if (urlObj.hostname.includes('instagram.com')) {
      const pathname = urlObj.pathname.replace(/\/$/, '')
      return `${urlObj.origin}${pathname}/embed`
    }

    // TikTok Embed
    if (urlObj.hostname.includes('tiktok.com')) {
      // Extract video ID from path: /@username/video/VIDEO_ID
      const videoIdMatch = urlObj.pathname.match(/video\/(\d+)/)
      if (videoIdMatch && videoIdMatch[1]) {
        return `https://www.tiktok.com/player/v1/${videoIdMatch[1]}?music_info=1&description=1`
      }
    }

    return url
  } catch (e) {
    return url
  }
}
