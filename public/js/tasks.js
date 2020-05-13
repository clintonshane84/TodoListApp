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
// Vue.component("vtask",
mytodo.apis.tasks = {
  /**
	 * Fetch the task records and load into the page
	 * 
	 * @function mytodo.handlers.vue.tasks.load
	 * @memberto mytodo
	 * @return Promise
	 */
	 getAll: function() {
		 return mytodo.handlers.ajax.get("/api/task/all");
	 },
  insert: function(lbl) {
      var cForm = new FormData();
      cForm.append("label", lbl);
  return mytodo.handlers.ajax.post.form(cForm, "/api/task/new");
  },
  /**
	 * Using the given todo object attempt to update the record
	 * 
	 * @function mytodo.handlers.vue.tasks.update
	 * @memberto mytodo
	 * @return Promise
	 */
  update: function(fdata) {
      return mytodo.handlers.ajax.put.form(fdata, "/api/task/update/" + fdata.get("id"));
  },
  /**
	 * Using the given todo object attempt to delete the record
	 * 
	 * @function mytodo.handlers.vue.tasks.load
	 * @memberto mytodo
	 * @return Promise
	 */
  delete: function(todo) {
	  return mytodo.handlers.ajax.delete("/api/task/delete/" + todo.id);
  }
 }
 // Setup our Vue components for Tasks
 // mytodo.handlers.vue.tasks = new Vue({
Vue.component("vtasks", {
  delimiters: ['${', '}'],
  data: {
   todos: []
  },
  methods: {
	   load : function() {
		   return mytodo.handlers.ajax.standardAjaxHandler(() => {
			   return mytodo.apis.tasks.getAll();
		   }).then((resolved) => {
		       if (resolved.hasOwnProperty("data")) {
        	   var rd = JSON.parse(resolved.data);
               mytodo.handlers.vue.tasks.$data.todos = [];
               if (rd.length > 0) {
                   for(var i in rd) {
                	   var t = rd[i];
                	   var o = mytodo.factory.make("todo");
                	   o = JSON.parse(JSON.stringify(t));
                	   o.id = t.id; o.label = t.label;
                	   o.complete = t.complete;
                	   o.priority = t.priority;
                	   o.description = t.description;
                	   o.due_date = t.due_date;
                	   mytodo.handlers.vue.tasks.$data.todos.push(o);
                   }
               }
	       }
	   });
   },
   /**
	 * Toggle the complete checkbox for a task
	 * 
	 * @function mytodo.handlers.vue.tasks.checkbox
	 * @memberto mytodo
	 * @param Object
	 *            todo
	 */
   checkbox: function(todo) {
    todo.complete = !todo.complete;
    mytodo.apis.tasks.update(mytodo.factory.makeFormData({"id" : todo.id, "complete" : ((todo.complete) ? 1 : 0)}));
   },
  /**
	 * Vue Tasks component update a record
	 * 
	 * @function mytodo.handlers.vue.tasks.update
	 * @memberof mytodo
	 * @param Object
	 * @return Promise
	 */
update: function(todo, f) {
	if (f && mytodo.helper.types.isString(f)) {
	  var el = document.getElementById("task-" + f + "-" + todo.id);
	  console.log(el);
	  if (el) {
		  todo[f] = el.value;
		  var data = {"id" : todo.id};
  			  data[f] = todo[f];
  			  mytodo.apis.tasks.update(mytodo.factory.makeFormData(data));
  		  }
  		}
  	},
   /**
	 * Toggle the visibility of the options for this task
	 * 
	 * @function mytodo.handlers.vue.tasks.option
	 * @memberof mytodo
	 * @param Object
	 *            todo
	 */
   option: function(todo) {
    todo.showOptions = !todo.showOptions;
   },
   /**
	 * Vue Tasks component create new record method
	 * 
	 * @function mytodo.handlers.vue.tasks.create
	 * @memberof mytodo
	 * @param string
	 *            lbl
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
   /**
	 * Vue Tasks component delete a record
	 * 
	 * @function mytodo.handlers.vue.tasks.delete
	 * @memberof mytodo
	 * @param Object
	 *            params
	 * @return Promise
	 */
   remove: function(todo) {
	   return mytodo.handlers.ajax.standardAjaxHandler(() => {
		   return mytodo.apis.tasks.delete(todo);
	   }).then((resolved) => {
	       if (resolved.hasOwnProperty("data")) {
    	   var rd = JSON.parse(resolved.data);
    	   if (rd.hasOwnProperty("id")) {
        		   var found = -1, data = mytodo.handlers.vue.tasks.$data.todos;
        		   for(var i in data) {
        			   if (data[i].id == rd.id) {
        				   found = i;
        				   break;
        			   }
        		   }
        		   if (found !== -1) {
        			   data.splice(found, 1);
        		   }
        	   }
	       }
	   });
   },
   /**
	 * Generate a number for a new task item based off the highest determined id
	 * from the list and increment it by 1
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
  },
  template: '<li v-for="todo in todos" :key="todo.label"><form v-bind:id="\'form-\' + todo.id" method="post" enctype="multipart/form-data" class="col-md-12"> @csrf <div class="row"><div class="col-sm-10 col-md-10 col-xs-10"><input v-bind:id="\'task-complete-\' + todo.id" type="checkbox" v-on:change="checkbox(todo)" v-bind:checked="todo.complete"></input><input v-bind:id="\'task-label-\'+ todo.id" v-bind:value="todo.label" v-on:change="update(todo, \'label\')"></div><div class="col-sm-2 col-md-2 col-xs-2"><div class="btn-group m-r-2"><button type="button" class="btn btn-default" v-on:click="option(todo)"><span class="caret"></span></button></div><div class="btn-group"><button type="button" class="btn btn-danger" v-bind:id="\'task-delete-\' + todo.id" v-on:click="remove(todo)"><span class="glyphicon glyphicon-remove"></span></button></div></div></div><div v-bind:name="\'task-options-\' + todo.id" class="col-sm-12 col-md-12 col-xs-12" v-if="todo.showOptions"><div class="row"><div class="col-md-6"><label v-bind:for="\'task-description-\' + todo.id">Description</label><textarea v-bind:id="\'task-description-\' + todo.id" rows="8" cols="50" v-on:change="update(todo, \'description\')" v-bind:value="todo.description"></textarea></div><div class="col-md-6"><div class="form-group"><label v-bind:for="\'task-due_date-\' + todo.id">Due Date</label><input v-bind:id="\'task-due_date-\' + todo.id" type="date" class="form-control" v-bind:value="todo.due_date" v-on:change="update(todo, \'due_date\')"></div><div class="form-group"><label v-bind:for="\'task-priority-\' + todo.id">Priority</label><input v-bind:id="\'task-priority-\' + todo.id" class="form-control" type="range" min="0" max="9" step="1" v-bind:value="todo.priority" v-on:input="update(todo, \'priority\')"></div></div></div></div></form></li>';
 });
mytodo.handlers.vue.tasks = new Vue()
 // A self executing function that loads the tasks when ready
 (function(){
	 mytodo.handlers.vue.tasks.load();
 })();
});