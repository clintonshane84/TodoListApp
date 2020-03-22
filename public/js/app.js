/*
 * This is our main frontend controller
 * 
 * @name MyToDo
 * @namespace mytodo
 * @author  Clinton Wright <clintonshanewright@gmail.com>
 */
// Set dialog defaults for alertify
if (alertify !== undefined || alertify !== null) {
 alertify.defaults.transition = "slide";
 alertify.defaults.theme.ok = "btn btn-primary";
 alertify.defaults.theme.cancel = "btn btn-danger";
 alertify.defaults.theme.input = "form-control";
}
// Initialize our main object
var mytodo = {
 "helper": {
  "types": {
   "isString": function(val) {
    if (Object.prototype.toString.call(val) === "[object String]")
     return true;
    return false;
   }
  },
  "objs": {
   "cloneObj": function(o) {
    return Object.create(o);
   }
  }
 },
 "factory": {
  "make": function(name) {
   if (mytodo.helper.types.isString(name)) {
    if (mytodo.objs.hasOwnProperty(name)) {
     return mytodo.helper.objs.cloneObj(mytodo.objs[name]);
    }
   }
   return undefined;
  }
 },
 "objs": {
  todo: {
   id: null,
   label: "",
   complete: false,
   showOptions: false
  }
 },
 "apis": {},
 "handlers": {
  "vue": {},
  "dialogs": {
  "success": function(msg) {
	    if (msg && mytodo.helper.types.isString(msg))
	        alertify.success(msg);
  },
   "error": function(msg) {
    if (msg && mytodo.helper.types.isString(msg))
     alertify.error(msg);
   },
   "alert": {
    "open": function(msg) {
     if (msg && mytodo.helper.types.isString(msg))
      alertify.alert().set('message', msg).showModal();
    },
    "close": function() {
     alertify.alert().close();
    }
   },
   "prompt": {
    "open": function(title, msg, ok, no) {
     if (mytodo.helper.types.isString(title) && title && mytodo.helper.types.isString(msg) && msg) {
    	console.log("prompt open");
      alertify.prompt(title, msg, "", function(evt, value) {
       ok(evt, value);
      }, function(){no()});
     }
    },
    "close": function() {
     alertify.prompt().close();
    }
   },
   "notify": {
    "open": function(msg, status) {
     alertify.notify(msg, 'success', 5, function() {});
    },
    "close": function() {
     alertify.notify().close();
    }
   },
   "confirm": {
    "open": function(title, msg) {
     if (msg && mytodo.helper.types.isString(msg) &&
      mytodo.helper.types.isString(title)) {
      alertify.confirm(title, msg, function() {
       alertify.success('Ok')
      }, function() {
       alertify.error('Cancel')
      });
     }
    },
    "close": function() {
     alertify.confirm().close();
    }
   }
  },
  "ajax": {
   standardAjaxHandler: async function(cb) {
    try {
    	console.log("std ajax handler");
    	console.log("cb:");
    	console.log(cb);
     response = await cb();
     if (response !== null) {
      await mytodo.handlers.ajax.notifications.notify(response);
      return response;
     } else {
      throw new Error("No response found");
     }
    } catch (err) {
     console.log(err);
     return err;
    }
   },
   post: {
    json: function(json, url) {
     return new Promise((resolve, reject) => {
      $.ajax({
       type: "POST",
       url: url,
       processData: false,
       contentType: "application/json",
       cache: false,
       data: json,
       headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
       },
       success: function(response, status, jqXHR) {
        resolve(jqXHR);
       }
      }).fail(function(jqXHR, textStatus) {
       reject(jqXHR);
      });
     });
    },
    form: function(fd, url) {
     return new Promise((resolve, reject) => {
      $.ajax({
       type: "POST",
       url: url,
       processData: false,
       contentType: false,
       enctype: "multipart/form-data",
       cache: false,
       data: fd,
       headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
       },
       success: function(response, status, jqXHR) {
        resolve(jqXHR);
       }
      }).fail(function(jqXHR, textStatus) {
       reject(jqXHR);
      });
     });
    }
   },
   get: function(url) {
    return new Promise((resolve, reject) => {
     $.ajax({
      type: "GET",
      url: url,
      processData: false,
      contentType: false,
      cache: false,
      headers: {
       'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      },
      success: function(response, status, jqXHR) {
       resolve(jqXHR);
      }
     }).fail(function(jqXHR, textStatus) {
      reject(jqXHR);
     });
    });
   },
   "notifications": {
    notify: function(jqXHR) {
     return new Promise(function(resolve, reject) {
      try {
       var msg, alertState = "danger";

       if (jqXHR.hasOwnProperty("status")) {
        var st = jqXHR.status.toLowerCase();
        if (st == "success") {
         alertState = st;
        } else {
         alertState = "danger";
        }
       }

       if (jqXHR.hasOwnProperty("message")) {
        msg = jqXHR.message;
       }

       mytodo.handlers.dialogs.notify.open(msg, alertState);
       resolve(jqXHR);
      } catch (err) {
       reject(err);
      }
     });
    },
    convert: {
     "xhr": {
      toerror: function(jqXHR) {
       var msg = "An error has occured: ";
       if (jqXHR !== null) {

        if (jqXHR.hasOwnProperty("status")) {
         msg += jqXHR.status;
        }

        if (jqXHR.hasOwnProperty("statusText")) {
         msg = (msg) ? msg + " " + jqXHR.statusText :
          jqXHR.statusText;
        }

        if (jqXHR.hasOwnProperty("responseJSON")) {
         if (jqXHR.responseJSON.hasOwnProperty("message")) {
          msg = (msg) ? msg + ", Message: " +
           jqXHR.responseJSON.message :
           jqXHR.responseJSON.message;
         }

         if (jqXHR.responseJSON.hasOwnProperty("file")) {
          msg = (msg) ? msg + ", File: " +
           jqXHR.responseJSON.file :
           jqXHR.responseJSON.file;
         }

         if (jqXHR.responseJSON.hasOwnProperty("line")) {
          msg = (msg) ? msg + ", Line: " +
           jqXHR.responseJSON.line :
           jqXHR.responseJSON.line;
         }

         if (jqXHR.responseJSON.hasOwnProperty("exception")) {
          msg = (msg) ? msg + ", Exception: " +
           jqXHR.responseJSON.exception :
           jqXHR.responseJSON.exception;
         }
        }
       }
       return msg;
      }
     }
    }
   }
  }
 }
};