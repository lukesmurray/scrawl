import browser from 'webextension-polyfill'
export function sendMessageToTabs(
  message: { action: string; payload?: any },
  {
    filterTabs = () => true,
  }: {
    filterTabs?: (tab: browser.Tabs.Tab) => boolean
  } = {},
) {
  browser.tabs.query({}).then((tabs) => {
    tabs.filter(filterTabs).forEach((tab) => {
      browser.tabs.sendMessage(tab.id!, message)
    })
  })
}
