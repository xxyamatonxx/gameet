@extends('layouts.app')

@section('content')

<div class="pure-g">

  <!-- Video area -->
  <div class="pure-u-2-3" id="video-container">
    <div id="their-videos"></div>
    <video id="my-video" muted="true" autoplay playsinline></video>
  </div>

  <!-- Steps -->
  <div class="pure-u-1-3">
    <h2>ランダム通話</h2>

    <div class="select">
      <label for="audioSource">Audio input source: </label><select id="audioSource"></select>
    </div>

    <div class="select">
      <label for="videoSource">Video source: </label><select id="videoSource"></select>
    </div>

    <!-- Get local audio/video stream -->
    <div id="step1">
      <p>Please click `allow` on the top of the screen so we can access your webcam and microphone for calls.</p>
      <div id="step1-error">
        <p>Failed to access the webcam and microphone. Make sure to run this demo on an http server and click allow when asked for permission by the browser.</p>
        <a href="#" class="pure-button pure-button-error" id="step1-retry">Try again</a>
      </div>
    </div>

    <p>Your id: <span id="my-id">...</span></p>
    <!-- Make calls to others -->
    <div id="step2">
      <h3>Make a call</h3>
      <form id="make-call" class="pure-form">
        <input type="text" placeholder="Join room..." id="join-room">
        <button class="pure-button pure-button-success" type="submit">通話に参加する</button>
      </form>
      <form id="make-room" class="pure-form">
        <input type="text" placeholder="Make room..." id="make-room-name">
        <button class="pure-button pure-button-success" type="submit">通話を募集する</button>
      </form>
      <p><strong>Warning:</strong> You may connect with people you don't know if you both use the same room name.</p>
      <p><strong>注意：</strong>同じルーム名を使用した場合、知らない人と接続する可能性があります。</p>
    </div>

    <!-- Call in progress -->
    <div id="step3">
      <p>Currently in room <span id="room-id">...</span></p>
      <p><a href="#" class="pure-button pure-button-error" id="end-call">End call</a></p>

      <!-- テキスト入力 -->
      <h4>Text chat</h4>
      <form id="sendtextform" class="pure-form">
        <input id="mymessage" type="text" placeholder="Enter message">
        <button class="pure-button pure-button-primary" type="submit">Send</button>
      </form>

      <!-- チャット -->
      <div id="chatframe"></div>

    </div>

  </div>

  <!-- Chat area -->


</div>


@endsection
