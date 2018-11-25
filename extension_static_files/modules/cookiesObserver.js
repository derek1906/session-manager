_export("cookiesObserver", async () => {
    let {debounceFunction} = await _require("utils");

    chrome.cookies.onChanged.addListener(debounceFunction(300, console.log));
});