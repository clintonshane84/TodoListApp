/*
 * @description
 * My To Do App - app.js
 * 
 * Ajax UX handling methods
 * Modal UI system
 * Form data serialization
 * 
 * @author  Clinton Wright <clintonshanewright@gmail.com>
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.mytodo = factory();
    }
}(this, function() {
	let mytodo = {
		"vueman" : {
			"tasks" : new Vue({
				  el: "#todo-app",
				  delimiters : ['${', '}'],
				  data: {
				    todos: [
				      { id: 1, label: "Wash Laundry", complete: false, showOptions: false },
				      { id: 2, label: "Clean Kitchen", complete: false, showOptions: false }
				    ]
				  },
				  methods: {
			  		checkbox : function(todo){
				    	todo.complete = !todo.complete
				    },
			  		option : function(todo){
				    	todo.showOptions = !todo.showOptions;
			  		} 
				  }
				})
		}
	};
}));
