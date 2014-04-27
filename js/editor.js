/**
 * @constructor
 * @this {Editor}
 * @param {FileEntry} file - File to open
 */
function Editor(){
  this.element = document.createElement("div");
  this.element.classList.add("editor");
  this.editor = ace.edit(this.element);
}