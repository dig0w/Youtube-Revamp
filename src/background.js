const Filters = [
	"*://*.doubleclick.net/*",
	"*://partner.googleadservices.com/*",
	"*://*.googlesyndication.com/*",
	"*://*.google-analytics.com/*",
	"*://creative.ak.fbcdn.net/*",
	"*://*.adbrite.com/*",
	"*://*.exponential.com/*",
	"*://*.quantserve.com/*",
	"*://*.scorecardresearch.com/*",
	"*://*.zedo.com/*"
]

chrome.webRequest.onBeforeRequest.addListener(
    function(details) { return { cancel: true } },
    { urls: Filters },
    ["blocking"]
);

// Download Video
chrome.runtime.onInstalled.addListener(function() {
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([{
			conditions: [
				new chrome.declarativeContent.PageStateMatcher({
					pageUrl: { hostContains: 'youtube'}
				})
			],
			actions: [ new chrome.declarativeContent.ShowPageAction() ]
		}]);
	});
});

chrome.runtime.onMessage.addListener(function(message) {
	var url = "http://localhost:4000/download?";
	var queryString = Object.keys(message).map(key => key + "=" + message[key]).join('&');
	url += queryString;
	chrome.downloads.download({url:url,
		filename: message.filename+".mp4"}, function(downID) {
			chrome.downloads.show(downID);
	});
});