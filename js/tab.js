/**
 * @constructor
 * @this {Tab}
 * @param {FileEntry} file - File to open
 */
function Tab(file){
  this.element = document.createElement("li");
  this.element.classList.add("tab");
  this.element.innerHTML = "<div class=name></div><div class=close></div>";
  if(file&&file.name){
    this.element.firstElementChild.textContent = file.name;
  }else{
    this.element.firstElementChild.textContent = "Untiteld";
  this.element.classList.add("unsaved");
  }
  this.element.draggable = true;
  this.editor = new Editor();
}

/**
 *  Request to close the tab, if it content is not save, the tab may not be closed
 * @param {function} callback - Callback to remove the tab from any parent container if the tab was succesfully closed
 */
Tab.prototype.close = function(callback){
  /*TODO if unsaved ask for confirmation*/
  callback && callback();
  this.element.addEventListener("transitionend", this.remove.bind(this));
  this.hide();
};

/**
 * Remove the tab from the DOM when it transition is finished
 */
Tab.prototype.remove = function(event){
  if(event.propertyName=="max-width"){
    this.element.remove();
  }
};

Tab.prototype.hide = function(){
  this.element.classList.add("hide");
};

Tab.prototype.show = function(){
  this.element.classList.remove("hide");
};

Tab.prototype.activate = function(){
  this.element.classList.add("active");
};

Tab.prototype.inactivate = function(){
  this.element.classList.remove("active");
};