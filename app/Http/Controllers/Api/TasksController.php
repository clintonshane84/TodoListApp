<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Tasks;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TasksController extends Controller
{
    private static $respJson = array(
        "status" => "",
        "message" => "No results",
        "data" => ""
    );
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $respJson = self::$respJson;
        try {
            $respJson["data"] = Tasks::getAll()->toJson();
        } catch(\Exception $e){
            $respJson["status"] = "Error";
            $respJson["message"] = $e->getMessage();
            $respJson["line"] = strval($e->getLine());
            $respJson["trace"] = $e->getTraceAsString();
        }
        return response()->json($respJson);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        $respJson = self::$respJson;
        try {
            $params = $request->all();
            $keys = ["label"];
            $params = array_intersect_key($params, array_flip($keys));
            if (empty($params) === false) {
                $label = filter_var($params["label"], FILTER_SANITIZE_STRING);
                if (empty($label) === false) {
                    DB::table("tasks")->insert(["label" => $label]);
                    dd($label);
                }
            }
            $respJson["data"] = Tasks::getAll()->toJson();
        } catch(\Exception $e){
            $respJson["status"] = "Error";
            $respJson["message"] = $e->getMessage();
            $respJson["line"] = strval($e->getLine());
            $respJson["trace"] = $e->getTraceAsString();
        }
        return response()->json($respJson);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\tasks  $tasks
     * @return \Illuminate\Http\Response
     */
    public function show(tasks $tasks)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\tasks  $tasks
     * @return \Illuminate\Http\Response
     */
    public function edit(tasks $tasks)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\tasks  $tasks
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, tasks $tasks)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\tasks  $tasks
     * @return \Illuminate\Http\Response
     */
    public function destroy(tasks $tasks)
    {
        //
    }
}
