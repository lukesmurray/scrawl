export function sendMessageToTabs(
  message: { action: string; payload?: any },
  {
    filterTabs = () => true,
  }: {
    filterTabs?: (tab: chrome.tabs.Tab) => boolean
  } = {},
) {
  chrome.tabs.query({}, (tabs) => {
    tabs.filter(filterTabs).forEach((tab) => {
      chrome.tabs.sendMessage(tab.id!, message)
    })
  })
}
