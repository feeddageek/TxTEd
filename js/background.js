/**
 * @constructor
 * @this {Background}
 */
function Background (){
  this.windows_ ={};
  this.files_=[];
}

/**
 * Listener for the onLaunched event triggered by a user's request to open the app
 */
Background.prototype.launchHandler = function (launchData){
  chrome.app.window.create("main.html",
  {
    id:"TxTWin"+Object.keys(this.windows_).length,
    frame: 'none',
    minWidth: 400,
    minHeight: 400,
    width: 700,
    height: 700
  },function(createdWindow){
    console.log("Window created: ",createdWindow);
    createdWindow.contentWindow.launchData = launchData;
    createdWindow.onClosed.addListener(this.windowClosed.bind(this,createdWindow));
  }.bind(this));
};

/**
 * Handler for the DOMContentLoaded event triggerd when the window become ready after its creation
 * Called from the UI in window.js
 * @param {TxtWin} createdWindow
 */
Background.prototype.windowCreated = function(createdWindow){
  this.windows_[createdWindow.id] = createdWindow;
};

/**
 * Handler for the onClosed event
 * @param {AppWindow} closedWindow
 */
Background.prototype.windowClosed = function(closedWindow){
  console.log("Window closed: ",closedWindow);
  delete this.windows_[closedWindow.id];
};

var background = new Background();
chrome.app.runtime.onLaunched.addListener(background.launchHandler.bind(background));