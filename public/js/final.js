/*
 * Initializes the VueJS app
 * 
 * @name final.js
 * @namespace mytodo
 * @author  Clinton Wright <clintonshanewright@gmail.com>
 */
waitForMyToDo(function() {
	mytodo.vue = new Vue({
		el: "#list-app",
		data : {
			lists : [],
			tasks : []
		},
		delimiters : ["${", "}"]
	});
	components : {
		"todo-lists" : todo-lists,
		"todo-tasks" : todo-tasks
	}
});