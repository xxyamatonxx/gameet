@extends('layouts.app')

@section('content')
  <video id="my-video" width="400px" autoplay muted playsinline></video>
  <p id="my-id"></p>
  <input type="hidden" id="their-id"></input>
  <button id="make-call">発信</button>
  <video id="their-video" width="400px" autoplay muted playsinline></video>
  
@endsection
