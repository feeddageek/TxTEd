function Background (){this.windows_ =[];this.files_=[]}
Background.prototype.launchHandler = function (launchData){
    chrome.app.window.create("main.html",
    {
        frame: 'none',
        minWidth: 400,
        minHeight: 400,
        width: 700,
        height: 700
    });
};

var background = new Background();
chrome.app.runtime.onLaunched.addListener(background.launchHandler.bind(background));