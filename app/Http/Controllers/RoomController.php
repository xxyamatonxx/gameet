<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Room;
use App\Http\Requests\StoreRoom;

class RoomController extends Controller
//APIコントローラー
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //status0 = 通話募集中
        //status1 = 通話中
        $rooms = Room::where('status',0)->get();
        return response()->json([
            'message' => 'ok',
            'data' => $rooms
        ], 200, [], JSON_UNESCAPED_UNICODE);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreRoom $request)
    {
         $room = Room::create($request->all());
        return response()->json([
            'message' => 'Room created successfully',
            'data' => $room
        ], 201, [], JSON_UNESCAPED_UNICODE);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $room = Room::find($id);
        if ($room) {
            return response()->json([
                'message' => 'ok',
                'data' => $room
            ], 200, [], JSON_UNESCAPED_UNICODE);
        } else {
            return response()->json([
                'message' => 'Room not found',
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update($roomName)
    {
         $update = [
            'status' => 1,
        ];
        $room = Room::where('name', $roomName)->update($update);
        if ($room) {
            return response()->json([
                'message' => 'Room updated successfully',
            ], 200);
        } else {
            return response()->json([
                'message' => 'Room not found',
            ], 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($roomName)
    {
        $room = Room::where('name', $roomName)->delete();
        if ($room) {
            return response()->json([
                'message' => 'Room deleted successfully',
            ], 200);
        } else {
            return response()->json([
                'message' => 'Room not found',
            ], 404);
        }
    }
}
