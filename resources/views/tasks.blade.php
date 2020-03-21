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
<div class="flex-center position-ref full-height">
    <div class="content">
        <div class="title m-b-md">
            <span class="glyphicon glyphicon-check p-r-2"></span>My To Do
        </div>
        <nav class="navbar navbar-default">
            <div class="navbar-header p-a-1">
              <button type="button" class="btn btn-default" onclick="event.preventDefault(); mytodo.handlers.vue.tasks.create();"><span class="glyphicon glyphicon-plus-sign m-r-1"></span>New Task</button>
            </div>
        </nav>
        <div class="todo-list-container">
			<ul id="todo-app">
                <li v-for="todo in todos">
					<form v-bind:id="'form-' + todo.id" method="post" enctype="multipart/form-data" class="col-md-12">
					@csrf
					<div class="row">
        				<div class="col-sm-11 col-md-11 col-xs-11">
            				<input v-bind:id="'task-complete-' + todo.id" type="checkbox"
                          		v-on:change="checkbox(todo)"
                          		v-bind:checked="todo.complete">
                          	</input>
            				<input v-bind:id="'task-label-'+ todo.id" v-bind:value="todo.label"
            				v-on:change="save(todo)">
        				</div>
        				<div class="col-sm-1 col-md-1 col-xs-1">
                            <div class="btn-group">
                              <button type="button" class="btn btn-default"
                              		v-on:click="option(todo)">
        						<span class="caret"></span>
                              </button>
                            </div>
        				</div>
					</div>
					<div v-bind:name="'task-options-' + todo.id" class="col-sm-12 col-md-12 col-xs-12"
						v-if="todo.showOptions">
						<div class="row">
    							<div class="col-md-6">
    								<label v-bind:for="'task-description-' + todo.id">Description</label>
    								<textarea v-bind:id="'task-description-' + todo.id" rows="8" cols="50" placeholder="Add some notes here"></textarea>
    							</div>
    							<div class="col-md-6">
                                    <div class="form-group">
                                        <label v-bind:for="'task-due-date-' + todo.id">Due Date</label>
                                        <input v-bind:id="'task-due-date-' + todo.id" type="date" class="form-control">
                                    </div>
                                    <div class="form-group">
                                        <label vibind:for="'task-priority-' + todo.id">Priority</label>
                                        <input vbind:id="'task-priority-' + todo.id" class="form-control" type="range" min="0" max="9" step="1">
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
@endsection
@section('scripts')
<!-- Latest compiled and minified JavaScript -->
<script src="https://code.jquery.com/jquery-3.4.1.min.js" defer></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js" integrity="sha384-aJ21OjlMXNL5UyIl/XNwTMqvzeRMZH2w8c5cRVpzpU8Y5bApTppSuUkhZXN0VxHd" crossorigin="anonymous" defer></script>
<script src="{{ asset('vendor/alertify/alertify.min.js') }}" defer></script>
<script src="{{ asset('vendor/vuejs/vue.min.js') }}" defer></script>
<script src="{{ asset('js/app.js') }}" defer></script>
<script src="{{ asset('js/tasks.js') }}" defer></script>

@endsection