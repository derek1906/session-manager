_export("contextMenu", async () => {
    const menuItems = {
        "dashboard": {
            contexts: ["page_action"],
            title: "Dashboard...",
            onClick: (info, tab) => {
                console.log(info, tab);
                window.open("dashboard/index.html", "dashboard");
            }
        }
    };

    chrome.runtime.onInstalled.addListener(() => {
        Object.entries(menuItems).forEach(([id, item]) => {
            let options = { ...item, id: String(id) };
            delete options.onClick;

            chrome.contextMenus.create(options);
        });
    });

    chrome.contextMenus.onClicked.addListener((info, tab) => {
        let handler = menuItems[info.menuItemId].onClick;
        handler && handler(info, tab);
    });

    return {
        menuItems
    };
});