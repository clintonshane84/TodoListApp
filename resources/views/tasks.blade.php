@extends('layouts.main')
@section('title')
<title>To Do - Manage Tasks</title>
@endsection
@section('styles')
	<link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">
	<link href="{{ asset('vendor/alertify/css/alertify.min.css') }}" rel="stylesheet">
	<link href="{{ asset('vendor/alertify/css/themes/bootstrap.rtl.min.css') }}" rel="stylesheet">
	<link href="{{ asset('css/app.css') }}" rel="stylesheet">
	<link href="{{ asset('css/tasks.css') }}" rel="stylesheet">
@endsection
@section('content')
<div class="content">
    <nav class="navbar navbar-default">
        <div class="navbar-header p-a-1">
          <button type="button" class="btn btn-default" onclick="event.preventDefault(); mytodo.handlers.dialogs.prompt.open('Label', 'Create New Task', function(evt, value){if(value){mytodo.handlers.vue.tasks.create(value)}},function(){mytodo.handlers.dialogs.error('Cancelled')})"><span class="glyphicon glyphicon-plus-sign m-r-1"></span>New Task</button>
        </div>
    </nav>
    <div id="list-app" class="flex-lists">
    	<div v-for="item in lists" :key="name" class="flex-list-child">
    		<div class="row">
    			<span>${item.name}</span>
    		</div>
            <div class="todo-list-container">
    			<ul id="todo-app">
                    <li v-for="todo in todos" :key="todo.label">
    					<form v-bind:id="'form-' + todo.id" method="post" enctype="multipart/form-data" class="col-md-12">
    					@csrf
    					<div class="row">
            				<div class="col-sm-10 col-md-10 col-xs-10">
                				<input v-bind:id="'task-complete-' + todo.id" type="checkbox"
                              		v-on:change="checkbox(todo)"
                              		v-bind:checked="todo.complete">
                              	</input>
                				<input v-bind:id="'task-label-'+ todo.id" v-bind:value="todo.label"
                				v-on:change="update(todo, 'label')">
            				</div>
            				<div class="col-sm-2 col-md-2 col-xs-2">
                                <div class="btn-group m-r-2">
                                  <button type="button" class="btn btn-default"
                                  		v-on:click="option(todo)">
            						<span class="caret"></span>
                                  </button>
                                </div>
                                <div class="btn-group">
                                  <button type="button" class="btn btn-danger" v-bind:id="'task-delete-' + todo.id"
                                  	v-on:click="remove(todo)">
            							<span class="glyphicon glyphicon-remove"></span>
                                  </button>
                                </div>
            				</div>
    					</div>
    					<div v-bind:name="'task-options-' + todo.id" class="col-sm-12 col-md-12 col-xs-12"
    						v-if="todo.showOptions">
    						<div class="row">
        							<div class="col-md-6">
        								<label v-bind:for="'task-description-' + todo.id">Description</label>
        								<textarea v-bind:id="'task-description-' + todo.id" rows="8" cols="50"
        									v-on:change="update(todo, 'description')" v-bind:value="todo.description"></textarea>
        							</div>
        							<div class="col-md-6">
                                        <div class="form-group">
                                            <label v-bind:for="'task-due_date-' + todo.id">Due Date</label>
                                            <input v-bind:id="'task-due_date-' + todo.id" type="date"
                                            class="form-control" v-bind:value="todo.due_date"
                                            v-on:change="update(todo, 'due_date')">
                                        </div>
                                        <div class="form-group">
                                            <label v-bind:for="'task-priority-' + todo.id">Priority</label>
                                            <input v-bind:id="'task-priority-' + todo.id" class="form-control"
                                            type="range" min="0" max="9" step="1" v-bind:value="todo.priority"
                                            v-on:input="update(todo, 'priority')">
                                        </div>
        							</div>
    						</div>
    					</div>
    					</form>
                    </li>
    			</ul>
            </div>
    	</div>
    </div>
</div>
@endsection
@section('scripts')
<script src="{{ asset('vendor/alertify/alertify.min.js') }}" defer></script>
<script src="{{ asset('js/app.js') }}" defer></script>
<script src="{{ asset('js/tasks.js') }}" defer></script>
@endsection