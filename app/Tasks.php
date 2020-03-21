<?php

namespace App;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use App\Models\Extensions\TraitEnum;

class Tasks extends Model
{
    use TraitEnum;
    public static function getAll() {
        return DB::table("tasks")->select(DB::raw("id, label, description, created_at, due_date, complete"))
        ->orderBy("complete", "desc")
        ->orderBy("label", "asc")
        ->get();
    }
}
