import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Solution Hub'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
