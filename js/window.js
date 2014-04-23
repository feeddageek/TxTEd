/**
 * @constructor
 * @this {TxtWin}
 */
function TxtWin(){
  this.id = "";
  this.tabs_=[];
  this.tabbar;
}

/**
 * Callback to initialize the application when the window is ready
 * @param {object} launchData
 */
TxtWin.prototype.init = function (launchData){
  this.tabbar = document.getElementById("tabs");
  this.id = chrome.app.window.current().id;
  if(launchData&&launchData.items){
    for(var i in launchData.items){
      this.openTab(launchData.items[i]);
    }
  }else{
    this.openTab();
  }
  chrome.runtime.getBackgroundPage(function(bg){bg.background.windowCreated(this)}.bind(this));
  console.log("TxTWin initialized: ",this);
};

/**
 * Close the window
 */
TxtWin.prototype.close = function(){
  /*TODO check if all tabs are saved and if not ask for confirmation*/
  window.close();
};

/**
 * Open a new tab
 * @param {FileEntry} file - File to open in the new tab
 */
TxtWin.prototype.openTab = function(file){
  var tab = new Tab(file);
  this.tabs_.push(tab);
  tab.hide();
  this.tabbar.appendChild(tab.element);
  setTimeout(function(){
    window.getComputedStyle(this.element).opacity;
    this.show();
  }.bind(tab),0);
  console.log("Tab opened: ",tab,file);
};

/**
 * Close a tab
 * @param {Tab} tab - Tab to close
 */
TxtWin.prototype.closeTab = function(tab){
  tab.close(function(){
    for (var i = 0; i < this.tabs_.length; i++) {
      if (tab === this.tabs_[i]) {
        this.tabs_.splice(i, 1);
      }
    }
    console.log("Tab closed: ",tab);
    //If there is no more tab, close the window
    if(this.tabs_.length===0){
      this.close();
    }
  }.bind(this));
};

txtWin = new TxtWin();
document.addEventListener('DOMContentLoaded',txtWin.init.bind(txtWin,launchData));