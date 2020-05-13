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
					<vtasks></vtasks>
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