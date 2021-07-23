import { sendMessageToTabs } from '@/app/sendMessageToTabs'

// notify tabs when the url changes
chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  sendMessageToTabs(
    {
      action: 'historyUpdated',
    },
    { filterTabs: (tab) => tab.id === details.tabId },
  )
})
