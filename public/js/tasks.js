/*
 * Seperated the parts of my mytodo object to be loaded like modules
 * 
 * @name MyToDo
 * @namespace mytodo
 * @author Clinton Wright <clintonshanewright@gmail.com>
 */

// Initiliaze the tasks module
waitForMyToDo(function() {
	// Setup our Task API calls
 mytodo.apis.tasks = {
   /*
    * Fetch all tasks from our API
    * 
    * @function mytodo.apis.tasks.getAll
    * @memberto mytodo
    * @return Array
    */
  getAll: function() {
	  return mytodo.handlers.ajax.get("/api/tasks/all");
  },
  /*
   * Fetch the task records and load into the page
   * 
   * @function mytodo.handlers.vue.tasks.load
   * @memberto mytodo
   * @return Promise
   */
  insert: function(lbl) {
      var cForm = new FormData();
      cForm.append("label", lbl);
      return mytodo.handlers.ajax.post.form(cForm, "/api/task/new");
  }
  /*
   * Using the given todo object attempt to update
   * the record
   * 
   * @function mytodo.handlers.vue.tasks.load
   * @memberto mytodo
   * @return Promise
   */
  update: function(todo) {
      var cForm = new FormData();
      cForm.append("label", lbl);
      return mytodo.handlers.ajax.post.form(cForm, "/api/task/new");
  }
  /*
   * Using the given todo object attempt to delete
   * the record
   * 
   * @function mytodo.handlers.vue.tasks.load
   * @memberto mytodo
   * @return Promise
   */
  delete: function(todo) {
	  
      var cForm = new FormData();
      cForm.append("label", lbl);
      return mytodo.handlers.ajax.post.form(cForm, "/api/task/new");
  }
 }
 // Setup our Vue components for Tasks
 mytodo.handlers.vue.tasks = new Vue({
  el: "#todo-app",
  delimiters: ['${', '}'],
  data: {
   todos: []
  },
  methods: {
   /*
    * Fetch the task records and load into the page
    * 
    * @function mytodo.handlers.vue.tasks.load
    * @memberto mytodo
    */
   load: function() {
	   return mytodo.handlers.ajax.standardAjaxHandler(() => {
		   return mytodo.apis.tasks.getAll();
	   }).then((resolved) => {
	       if (resolved.hasOwnProperty("data")) {
        	   var rd = JSON.parse(resolved.data);
               mytodo.handlers.vue.tasks.$data.todos = [];
               if (rd.length > 0) {
                   for(var i in rd) {
                	   var o = mytodo.factory.make("todo");
                	   o.id = rd[i].id;
                	   o.label = rd[i].label;
                	   o.complete = rd[i].complete;
                	   mytodo.handlers.vue.tasks.$data.todos.push(o);
                   }
               }
	       }
	   });
   },
   /*
    * Toggle the complete checkbox for a task
    * 
    * @function mytodo.handlers.vue.tasks.checkbox
    * @memberto mytodo
    * @param Object todo
    */
   checkbox: function(todo) {
    todo.complete = !todo.complete
   },
   /*
    * Toggle the visibility of the options for this task
    * 
    * @function mytodo.handlers.vue.tasks.option
    * @memberof mytodo
    * @param Object todo
    */
   option: function(todo) {
    todo.showOptions = !todo.showOptions;
   },
   /*
    * Vue Tasks component create new record method
    * 
    * @function mytodo.handlers.vue.tasks.create
    * @memberof mytodo
    * @param string lbl
    * @return Promise
    */
   create: function(lbl) {
	   return mytodo.handlers.ajax.standardAjaxHandler(() => {
		   return mytodo.apis.tasks.insert((!mytodo.helper.types.isString(lbl) || !lbl) ? "Task Item " + this.generateId() : lbl)
	   }).then((resolved) => {
	       if (resolved.hasOwnProperty("data")) {
        	   var rd = JSON.parse(resolved.data);
        	   var o = mytodo.factory.make("todo");
        	   
        	   for(var i in rd) {
        		   var val = rd[i];
        		   if (val !== undefined) {
            		   if (Object.keys(rd).find(element => element === i) !== undefined) {
            			   o[i] = val;
            		   }
        		   }
        	   }
        	   mytodo.handlers.vue.tasks.$data.todos.push(o);
	       }
	   });
   },
   /*
    * Vue Tasks component update a record method
    * 
    * @function mytodo.handlers.vue.tasks.update
    * @memberof mytodo
    * @param string lbl
    * @return Promise
    */
   update: function(lbl) {
	   return mytodo.handlers.ajax.standardAjaxHandler(() => {
		   return mytodo.apis.tasks.insert((!mytodo.helper.types.isString(lbl) || !lbl) ? "Task Item " + this.generateId() : lbl)
	   }).then((resolved) => {
	       if (resolved.hasOwnProperty("data")) {
        	   var rd = JSON.parse(resolved.data);
        	   var o = mytodo.factory.make("todo");
        	   
        	   for(var i in rd) {
        		   var val = rd[i];
        		   if (val !== undefined) {
            		   if (Object.keys(rd).find(element => element === i) !== undefined) {
            			   o[i] = val;
            		   }
        		   }
        	   }
        	   mytodo.handlers.vue.tasks.$data.todos.push(o);
	       }
	   });
   },
   /*
    * Generate a number for a new task item
    * based off the highest determined id from
    * the list and increment it by 1
    *
    * @function generateId
    * @memberof mytodo
    * @return number|null
    */
   generateId: function(){
	    var d = mytodo.handlers.vue.tasks.$data.todos;
	    if (d.length > 0) {
	     var elId = d[0].id;
	     for (var di in d) {
	      elId = (elId < d[di].id) ? d[di].id : elId;
	     }
	     return ++elId;
	    }
	    return null;
   }
  }
 });
 // A self executing function that loads the tasks when ready
 (function(){
	 mytodo.handlers.vue.tasks.load();
 })();
});

/*
 * Ensures the main app.js script to finish loading and then
 * initiates the tasks module
 * 
 * @function waitForMyToDo
 * @param function cb
 */
function waitForMyToDo(cb) {
 if (Object.prototype.toString.call(cb) === "[object Function]") {
  var timeStart = Date.now();
  while (true) {
   if (typeof mytodo !== "undefined") {
    cb();
    break;
   } else if (((Date.now() - timeStart) / 1000) < 10) {
    break;
   }
  }
 }
}