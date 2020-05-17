/*
 * Seperated the parts of my mytodo object to be loaded like modules
 * 
 * @name tasks.js
 * @namespace mytodo
 * @author Clinton Wright <clintonshanewright@gmail.com>
 */

// Initiliaze the tasks module
mytodo.waitForMe(function () {
    // Setup our Task API calls
    mytodo.apis.tasks = {
        /**
         * Fetch the task records and load into the page
         * 
         * @function mytodo.handlers.vue.tasks.load
         * @memberto mytodo
         * @return Promise
         */
        getAll: function () {
            return mytodo.handlers.ajax.get("/api/task/all");
        },
        insert: function (lbl) {
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
        update: function (fdata) {
            return mytodo.handlers.ajax.put.form(fdata, "/api/task/update/" + fdata.get("id"));
        },
        /**
         * Using the given todo object attempt to delete the record
         * 
         * @function mytodo.handlers.vue.tasks.load
         * @memberto mytodo
         * @return Promise
         */
        delete: function (item) {
            return mytodo.handlers.ajax.delete("/api/task/delete/" + item.id);
        }
    }
    // Setup our Vue components for Tasks
    Vue.component("todo-tasks", {
        props: ["items", "list_id", "csrf"],
        delimiters: ["${", "}"],
        methods: {
            /**
             * Toggle the complete checkbox for a task
             * 
             * @function mytodo.handlers.vue.tasks.checkbox
             * @memberto mytodo
             * @param Object
             *            todo
             */
            checkbox: function (item) {
                item.complete = !item.complete;
                mytodo.apis.tasks.update(mytodo.factory.makeFormData({
                    "id": item.id,
                    "complete": ((item.complete) ? 1 : 0)
                }));
            },
            /**
             * Vue Tasks component update a record
             * 
             * @function mytodo.handlers.vue.tasks.update
             * @memberof mytodo
             * @param Object
             * @return Promise
             */
            update: function (item, f) {
                if (f && mytodo.helper.types.isString(f)) {
                    var el = document.getElementById("task-" + f + "-" + item.id);
                    console.log(el);
                    if (el) {
                        item[f] = el.value;
                        var data = {
                            "id": item.id
                        };
                        data[f] = item[f];
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
            option: function (item) {
                item.showOptions = !item.showOptions;
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
            create: function (lbl) {
                return mytodo.handlers.ajax.standardAjaxHandler(() => {
                    return mytodo.apis.tasks.insert((!mytodo.helper.types.isString(lbl) || !lbl) ? "Task Item " + this.generateId() : lbl)
                }).then((resolved) => {
                    if (resolved.hasOwnProperty("data")) {
                        var rd = JSON.parse(resolved.data);
                        var o = mytodo.factory.make("tasks");

                        for (var i in rd) {
                            var val = rd[i];
                            if (val !== undefined) {
                                if (Object.keys(rd).find(element => element === i) !== undefined) {
                                    o[i] = val;
                                }
                            }
                        }
                        mytodo.handlers.vue.$data.tasks.push(o);
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
            remove: function (item) {
                return mytodo.handlers.ajax.standardAjaxHandler(() => {
                    return mytodo.apis.tasks.delete(item);
                }).then((resolved) => {
                    if (resolved.hasOwnProperty("data")) {
                        var rd = JSON.parse(resolved.data);
                        if (rd.hasOwnProperty("id")) {
                            var found = -1,
                                data = mytodo.handlers.vue.$data.tasks;
                            for (var i in data) {
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
            generateId: function () {
                var d = mytodo.handlers.vue.$data.tasks;
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
        template: '<div class="t-list-container"><li v-for="item in items" :key="item.label" v-if="item.list_id == list_id"><form v-bind:id="\'form-\' + item.id" method="post" enctype="multipart/form-data" class="col-md-12"> <input type="hidden" name="_token" value="${csrf}"> <div class="row"><div class="col-sm-10 col-md-10 col-xs-10"><input v-bind:id="\'task-complete-\' + item.id" type="checkbox" v-on:change="checkbox(t)" v-bind:checked="item.complete"></input><input v-bind:id="\'task-label-\'+ item.id" v-bind:value="item.label" v-on:change="update(t, \'label\')"></div><div class="col-sm-2 col-md-2 col-xs-2"><div class="btn-group m-r-2"><button type="button" class="btn btn-default" v-on:click="option(t)"><span class="caret"></span></button></div><div class="btn-group"><button type="button" class="btn btn-danger" v-bind:id="\'task-delete-\' + item.id" v-on:click="remove(t)"><span class="glyphicon glyphicon-remove"></span></button></div></div></div><div v-bind:name="\'task-options-\' + item.id" class="col-sm-12 col-md-12 col-xs-12" v-if="item.showOptions"><div class="row"><div class="col-md-6"><label v-bind:for="\'task-description-\' + item.id">Description</label><textarea v-bind:id="\'task-description-\' + item.id" rows="8" cols="50" v-on:change="update(t, \'description\')" v-bind:value="item.description"></textarea></div><div class="col-md-6"><div class="form-group"><label v-bind:for="\'task-due_date-\' + item.id">Due Date</label><input v-bind:id="\'task-due_date-\' + item.id" type="date" class="form-control" v-bind:value="item.due_date" v-on:change="update(t, \'due_date\')"></div><div class="form-group"><label v-bind:for="\'task-priority-\' + item.id">Priority</label><input v-bind:id="\'task-priority-\' + item.id" class="form-control" type="range" min="0" max="9" step="1" v-bind:value="item.priority" v-on:input="update(t, \'priority\')"></div></div></div></div></form></li></div>'
    });
}, mytodo, mytodo.allprops);