import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateReadingTime(text: string): string {
  if (!text) return "1 min read"

  // Strip HTML tags if any
  const plainText = text.replace(/<[^>]*>?/gm, '')

  // Average reading speed is around 200 words per minute
  const wordsPerMinute = 200
  const noOfWords = plainText.split(/\s/g).length
  const minutes = noOfWords / wordsPerMinute
  const readTime = Math.max(1, Math.ceil(minutes))

  return `${readTime} min read`
}
