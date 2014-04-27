/**
 * @constructor
 * @this {TxtWin}
 */
function TxtWin(){
  this.id = "";
  this.tabs_=[];
  this.tabContainer;
  this.win;
  this.editor;
}

/**
 * Callback to initialize the application when the window is ready
 * @param {object} launchData
 */
TxtWin.prototype.init = function (launchData){
  this.win = chrome.app.window.current();
  this.tabContainer = document.getElementById("tab-container");
  this.editor = document.getElementsByClassName("editor")[0];
  document.getElementById("new-tab").addEventListener("click",this.openTab.bind(this));
  document.getElementById("maximize").addEventListener("click",this.maximize.bind(this));
  document.getElementById("close").addEventListener("click",this.close.bind(this));
  this.id = chrome.app.window.current().id;
  if(launchData&&launchData.items){
    for(var i in launchData.items){
      this.openTab(launchData.items[i]);
    }
  }else{
    this.openTab();
    this.activateTab(this.tabs_[0]);
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
 * Toggle the maximize state
 */
TxtWin.prototype.maximize = function(){
  if(this.win.isMaximized()){
    this.win.restore();
  }else{
    this.win.maximize();
  }
};

/**
 * Open a new tab
 * @param {FileEntry} file - File to open in the new tab
 */
TxtWin.prototype.openTab = function(file){
  var tab = new Tab(file);
  tab.element.addEventListener("click",this.activateTab.bind(this,tab));
  tab.element.lastElementChild.addEventListener("click",this.closeTab.bind(this,tab));
  this.tabs_.push(tab);
  tab.hide();
  this.tabContainer.appendChild(tab.element);
  setTimeout(function(){
    window.getComputedStyle(this.element).opacity;
    this.show();
  }.bind(tab),0);
  console.log("Tab opened: ",tab,file);
};

/**
 * Close a tab
 * @param {Tab} tab - Tab to close
 * @param {Event} event - the event that cause the tab to close if any
 */
TxtWin.prototype.closeTab = function(tab,event){
  tab.close(function(){
    event && event.stopPropagation();
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

/**
 * Set a tab as the active tab
 * @param {Tab} tab - tab to activate
 */
TxtWin.prototype.activateTab = function(tab){
  this.tabs_.forEach(function(cur){if(cur===tab){cur.activate()}else{cur.inactivate()}});
  this.editor.parentNode.replaceChild(tab.editor.element,this.editor);
  this.editor = tab.editor.element;
};

txtWin = new TxtWin();
document.addEventListener('DOMContentLoaded',txtWin.init.bind(txtWin,launchData));