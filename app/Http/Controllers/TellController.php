<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TellController extends Controller
{

    //ランダム通話発火
    public function create(){
        return view('random_tell');
    }
}
