const toggleOnTitle = 'Enable Simplify';
const toggleOffTitle = 'Temporarily disable Simplify';

const toggledOnIcon = {
    16: "img/icon16.png",
    24: "img/icon24.png",
    32: "img/icon32.png",
    48: "img/icon48.png",
    128: "img/icon128.png"
}

const toggledOffIcon = {
    16: "img/icon16_off.png",
    24: "img/icon24_off.png",
    32: "img/icon32_off.png",
    48: "img/icon48_off.png",
    128: "img/icon128_off.png"
}

function updatePageAction(tabId, toggled) {
    chrome.pageAction.setTitle({
        tabId: tabId,
        title: toggled ? toggleOffTitle : toggleOnTitle
    });

    chrome.pageAction.setIcon({
        tabId: tabId,
        path: toggled ? toggledOnIcon : toggledOffIcon
    });
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'activate_page_action') {
        const tabId = sender.tab.id;

        updatePageAction(tabId, true);
        chrome.pageAction.show(tabId);
    }
});

chrome.pageAction.onClicked.addListener(function (tab) {
    toggleSimplify(tab.id);
});

chrome.commands.onCommand.addListener(function(command) {
    if (command === 'toggle-simpl') {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            toggleSimplify(tabs[0].id);    
        });
    }
});

function toggleSimplify(tabId) {
    chrome.tabs.sendMessage(tabId, {action: 'toggle_simpl'}, function(response) {
        if (chrome.runtime.lastError) {
            console.log(`Error sending request to content script: ${chrome.runtime.lastError.message}`);
            return;
        }

        updatePageAction(tabId, response.toggled);
    });
}