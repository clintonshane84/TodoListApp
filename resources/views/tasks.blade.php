@extends('layouts.main')
@section('title')
<title>To Do - Manage Tasks</title>
@endsection
@section('styles')
	<link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">
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
          <div class="container-fluid">
            <div class="navbar-header">
              <div></div>
            </div>
          </div>
        </nav>
        <div class="todo-list-container">
			<ul id="todo-app">
                <li v-for="todo in todos">
					<form id="form-${ todo.id }" method="post" enctype="multipart/form-data" class="col-md-12">
					@csrf
					<div class="row">
        				<div class="col-sm-11 col-md-11 col-xs-11">
            				<input id="task-complete-${ todo.id }" type="checkbox"
                          		v-on:change="checkbox(todo)"
                          		v-bind:checked="todo.complete">
                          	</input>
            				<input v-bind:id="'task-label-'+ todo.id" v-bind:value="todo.label">
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
					<div name="task-1-options" class="col-sm-12 col-md-12 col-xs-12"
						v-if="todo.showOptions">
						<div class="row">
    							<div class="col-md-6">
    								<label for="task-1-description">Description</label>
    								<textarea id="task-1-description" rows="8" cols="50" placeholder="Add some notes here"></textarea>
    							</div>
    							<div class="col-md-6">
                                    <div class="form-group">
                                        <label for="task-1-due-date">Due Date</label>
                                        <input id="task-1-due-date" type="date" class="form-control">
                                    </div>
                                    <div class="form-group">
                                        <label for="task-1-priority">Priority</label>
                                        <input id="task-1-priority" class="form-control" type="range" min="0" max="9" step="1">
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
<script src="{{ asset('vendor/vuejs/vue.min.js') }}" defer></script>
<script src="{{ asset('js/app.js') }}" defer></script>
@endsection