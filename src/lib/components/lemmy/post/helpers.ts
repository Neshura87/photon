import { getInstance } from '$lib/lemmy.js'
import type { View } from '$lib/settings'
import { isImage, isVideo } from '$lib/ui/image'
import type { CommentView, PersonView, Post, PostView } from 'lemmy-js-client'

export const isCommentMutable = (comment: CommentView, me: PersonView) =>
  me.person.id == comment.creator.id

export const bestImageURL = (
  post: Post,
  compact: boolean = true,
  width: number = 1024
) => {
  if (width > 1024) {
    if (post.url) return `${post.url}?format=webp`
    else if (post.thumbnail_url) return `${post.thumbnail_url}?format=webp`
  }

  if (compact && post.thumbnail_url)
    return `${post.thumbnail_url}?thumbnail=256&format=webp`
  else if (compact && post.url) return `${post.url}?thumbnail=256&format=webp`

  if (post.url) return `${post.url}?thumbnail=${width}&format=webp`
  else if (post.thumbnail_url)
    return `${post.thumbnail_url}?thumbnail=${width}&format=webp`

  return post.url ?? ''
}

const YOUTUBE_REGEX = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(\w|-){11}$/

export const isYoutubeLink = (url?: string): boolean => {
  if (!url) return false

  return YOUTUBE_REGEX.test(url)
}

export const postLink = (post: Post) => `/post/${getInstance()}/${post.id}`

export type MediaType = 'video' | 'image' | 'iframe' | 'embed' | 'none'
export type IframeType = 'youtube' | 'none'

export const mediaType = (post: Post, view: View = 'cozy'): MediaType => {
  if (post.url) {
    if (isImage(post.url)) return 'image'
    if (isVideo(post.url)) return 'video'
    if (isYoutubeLink(post.url)) return 'iframe'
    return 'embed'
  }

  return 'none'
}