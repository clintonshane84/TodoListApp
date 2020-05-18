/*
 * Seperated the parts of my mytodo object to be loaded like modules
 * 
 * @name dialog.js
 * @namespace mytodo
 * @author Clinton Wright <clintonshanewright@gmail.com>
 */
mytodo.waitForMe(function () {
    mytodo.handlers.dialogs.default = {
        id : "modal-edit-task",
        close : function() {
            var el = document.getElementById(this.id);
            if (el) {
                el.classList.remove("is-open");
            }        
        },
        open : function() {
            var el = document.getElementById(this.id);
            if (el) {
                el.classList.remove("is-open");
                el.classList.add("is-open");
            }
        },
        loadRecord : function(item) {
            if (Object.prototype.call.toString(item) === "[object Object]" && item) {
                var myId = item.id.toString();
                if (item.id)
                    document.getElementById("edit-task-input-hidden-id").value = item.id;
                if (item.id)
                    document.getElementById("edit-task-input-hidden-list-id").value = item.list_id;
                if (item.label)
                    document.getElementById("edit-task-input-label-").value = item.label;
                if (item.due_date)
                    document.getElementById("task-input-date").value = item.date;
                if (item.priority)
                    document.getElementById("task-priority-" + myId).value = (item.priority) ? item.priority : document.getElementById("task-priority-" + myId).value;
                if (item.description)
                    document.getElementById("task-description-" + myId).value = item.description;
                
            }
        }
    }
}, mytodo, mytodo.allprops);

/*
    tasks: {
        id: null,
        list_id: null,
        user_id: null,
        label: "",
        complete: false,
        description: "",
        priority: 0,
        due_date: null,
        showOptions: false
    },

*/