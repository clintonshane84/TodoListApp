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
waitForMyToDo(function() {
 mytodo.apis.tasks = {
  getAll: function() {
	  return mytodo.handlers.ajax.get("/api/tasks/all");
  }
 }
 mytodo.handlers.vue.tasks = new Vue({
  el: "#todo-app",
  delimiters: ['${', '}'],
  data: {
   todos: []
  },
  methods: {
   load: function() {
	   return mytodo.handlers.ajax.standardAjaxHandler(() => {
		   return mytodo.apis.tasks.getAll();
	   }).then((resolved) => {
		   console.log('resolved');
		   console.log(resolved);
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
   checkbox: function(todo) {
    todo.complete = !todo.complete
   },
   option: function(todo) {
    todo.showOptions = !todo.showOptions;
   },
   create: function() {
    var d = mytodo.handlers.vue.tasks.$data.todos;
    if (d.length > 0) {
     var item = mytodo.factory.make("todo");
     var elId = d[0].id;
     for (var di in d) {
      elId = (elId < d[di].id) ? d[di].id : elId;
     }
     item.id = ++elId;
     item.label = "Task Item " + item.id;
     d.push(item);
    }
   }
  }
 });
 (function(){
	 mytodo.handlers.vue.tasks.load();
 })();
});