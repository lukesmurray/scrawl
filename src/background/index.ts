import { sendMessageToTabs } from '@/app/sendMessageToTabs'
import browser from 'webextension-polyfill'

// notify tabs when the url changes
browser.webNavigation.onHistoryStateUpdated.addListener((details) => {
  sendMessageToTabs(
    {
      action: 'historyUpdated',
    },
    { filterTabs: (tab) => tab.id === details.tabId },
  )
})
