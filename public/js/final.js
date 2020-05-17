/*
 * Initializes the VueJS app
 * 
 * @name final.js
 * @namespace mytodo
 * @author  Clinton Wright <clintonshanewright@gmail.com>
 */
mytodo.waitForMe(() => {
    mytodo.handlers.vue = new Vue({
        el: "#list-app",
        data: {
            lists: [],
            tasks: [],
            csrf: mytodo.csrfToken
        },
        delimiters: ["${", "}"],
        methods: {
            /*
             * Runs all the available api calls to fetch the data for the
             * objects we need asynchronously
             * 
             * @function load
             */
            load: async () => {
                var d = [];
                for (i in mytodo.handlers.vue.$data) {
                    if (mytodo.helper.types.isArray((mytodo.handlers.vue.$data[i])))
                        d.push(i);
                }
                // Using Promise.all run all the api calls for the objects available in var d
                const status = await Promise.all(d.map(async name => await mytodo.handlers.vue.loadData(name)));
            },
            /*
             * Runs all the available api calls to fetch the data for the
             * objects we need asynchronously
             * 
             * @function load
             * @param string n
             * @return Promise
             */
            loadData: function (n) {
                return mytodo.handlers.ajax.standardAjaxHandler(() => {
                    return mytodo.apis[n].getAll();
                }).then((resolved) => {
                    if (resolved.hasOwnProperty("data")) {
                        var rd = JSON.parse(resolved.data);
                        mytodo.handlers.vue.$data[n] = [];
                        if (rd.length > 0) {
                            for (var i in rd) {
                                var t = rd[i];
                                var o = mytodo.factory.make(i);
                                o = JSON.parse(JSON.stringify(t));
                                mytodo.handlers.vue.$data[n].push(o);
                            }
                        }
                    }
                });
            }
        }
    });
    (() => {
        mytodo.handlers.vue.load();
    })();
}, mytodo, mytodo.allprops);