<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Tasks;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Mytodo\Helpers\ParamHelper;

class TasksController extends Controller
{
    private static $respJson = array(
        "status" => "Success",
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
            $respJson["message"] = "Successfully fetched all task records";
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
        $respJson["message"] = "No record inserted";
        $respJson["status"] = "Error";
        try {
            $params = $request->all();
            $keys = ["label"];
            $params = array_intersect_key($params, array_flip($keys));
            if (empty($params) === false) {
                $label = filter_var($params["label"], FILTER_SANITIZE_STRING);
                if (empty($label) === false) {
                    $task = new Tasks();
                    $result = DB::table("tasks")->select("*")
                        ->where("id", "=", $task->id)
                        ->get();
                    $task->label = $label;
                    if ($task->save() === true) {
                        $respJson["status"] = "Success";
                        $respJson["message"] = "Created new record successfully with id: $task->id";
                        $respJson["data"] = $result->toJson();
                    } else {
                        throw new \Exception("Failed to insert record");
                    }
                }
            }
        } catch(\Exception $e){
            $respJson["status"] = "Error";
            $respJson["message"] = $e->getMessage();
            $respJson["line"] = strval($e->getLine());
            $respJson["trace"] = $e->getTraceAsString();
        }
        return response()->json($respJson);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\tasks  $tasks
     * @return \Illuminate\Http\Response
     */
    public function get(string $id)
    {
        $respJson = self::$respJson;
        $respJson["message"] = "No record found";
        $respJson["status"] = "Success";
        $id = filter_var($id, FILTER_VALIDATE_INT);
        
        if ($id !== false) {
            try {
                $result = Tasks::where("id", "=", $id)
                ->limit(1)
                ->get();
                if ($result->isEmpty() === false) {
                    $respJson["message"] = "Fetched record successfully with id: $id";
                    $respJson["data"] = json_encode($result[0]);
                }
            } catch(\Exception $e){
                $respJson["status"] = "Error";
                $respJson["message"] = $e->getMessage();
                $respJson["line"] = strval($e->getLine());
                $respJson["trace"] = $e->getTraceAsString();
            }
        }
        return response()->json($respJson);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  string                    $id
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update($id, Request $request)
    {
        //
        $respJson = self::$respJson;
        $respJson["message"] = "No record updated";
        $respJson["status"] = "Error";
        try {
            $params = $request->all();
            $id = filter_var($id, FILTER_VALIDATE_INT);
            if (empty($id) === false) {
                $result = Tasks::where("id", "=", $id)
                ->limit(1)
                ->get();
                if ($result->isEmpty() === true)
                    throw new \Exception("Could not find the task record for id: $id");
                $task = $result[0];
                $task->wrapArray($params);
                if ($task->update() === true) {
                    $task = Tasks::where("id", "=", $id)
                    ->limit(1)
                    ->get()[0];
                    $respJson["status"] = "Success";
                    $respJson["message"] = "Updated record successfully with id: $id";
                    $respJson["data"] = $task->toJson();
                } else {
                    throw new \Exception("Failed to insert record with id: $id");
                }
            }
        } catch(\Exception $e){
            $respJson["status"] = "Error";
            $respJson["message"] = $e->getMessage();
            $respJson["line"] = strval($e->getLine());
            $respJson["trace"] = $e->getTraceAsString();
        }
        return response()->json($respJson);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  string $id
     * @return \Illuminate\Http\Response
     */
    public function delete(string $id)
    {
        $respJson = self::$respJson;
        $respJson["message"] = "No record deleted";
        $respJson["status"] = "Error";
        try {
            // Validate our id
            $id = filter_var($id, FILTER_VALIDATE_INT);
            if (empty($id) === false) {
                $result = DB::table("tasks")->where("id", "=", $id)
                ->delete();
                if ($result) {
                    $respJson["status"] = "Success";
                    $respJson["message"] = "Successfully Deleted record with id: $id";
                    $respJson["data"] = json_encode(["id" => $id]);
                } else {
                    throw new \Exception("Failed to delete record with id: $id");
                }
            }
        } catch(\Exception $e){
            $respJson["status"] = "Error";
            $respJson["message"] = $e->getMessage();
            $respJson["line"] = strval($e->getLine());
            $respJson["trace"] = $e->getTraceAsString();
        }
        return response()->json($respJson);
    }
}
