_export("pageAction", async () => {
    const [datastore, utils] = await _require(["datastore", "utils"]);

    async function updatePageAction(tab) {
        console.log("Update page action", tab);

        if (tab.url && await datastore.isUrlBeingTracked(utils.parseUrl(tab.url))) {
            chrome.pageAction.show(tab.id);
            chrome.pageAction.setTitle({
                tabId: tab.id,
                title: "CookieManager is enabled for this domain."
            });
        } else {
            chrome.pageAction.hide(tab.id);
            chrome.pageAction.setTitle({
                tabId: tab.id,
                title: ""
            });
        }
    }

    chrome.tabs.onActivated.addListener(({ tabId, windowId }) => {
        chrome.tabs.get(tabId, tab => updatePageAction(tab));
    });

    chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
        if (changeInfo.status !== "complete") return;

        chrome.tabs.get(tabId, tab => {
            if (!tab.active) return;
            updatePageAction(tab);
        });
    });
});