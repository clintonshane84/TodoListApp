<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TasksController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
// Get a single task by id
Route::get("task/{id}", function($id){
    $contr = new TasksController();
    return $contr->get($id);
});
// Get a all tasks
Route::get("/tasks/all", function(){
    $contr = new TasksController();
    return $contr->index();
});
// Create a new task
Route::post("task/new", function(Request $request){
    $contr = new TasksController();
    return $contr->create($request);
});
// Update a task
Route::put("task/update/{id}", function($id, Request $request){
    $contr = new TasksController();
    return $contr->update($id, $request);
});
// Delete a task
Route::delete("task/delete/{id}", function($id){
    $contr = new TasksController();
    return $contr->delete($id);
});