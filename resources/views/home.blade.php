@extends('layouts.app')

@section('content')

<div class="pure-g">


  <!-- Steps -->
  <div id="tell-area">
    <h2>ランダム通話</h2>

    <div class="select">
      <label for="audioSource">音声入力機器： </label><select id="audioSource"></select>
    </div>

    <div class="select">
      <label for="videoSource">映像入力機器：</label><select id="videoSource"></select>
    </div>

    <!-- Get local audio/video stream -->
    <div id="step1">
      <p>許可ボタンを押さないと通話できません。</p>
      <div id="step1-error">
        <p>許可してくだせぇ</p>
        <a href="#" class="pure-button pure-button-error" id="step1-retry">もう一度試す</a>
      </div>
    </div>

      <!-- Video area -->
  <div class="video-area" id="video-container">
    <div id="their-videos"></div>
    <div class="my-video-area">
      <video id="my-video" muted="true" autoplay playsinline></video>
      @auth
      <div><a href="#">ユーザー名: <span id="my-name" class="my-name">{{$user->name}}</span></a></div>
      @else
      @endauth
    </div>
  </div>

  @auth
    <!-- Make calls to others -->
    <div id="step2" class="button-area">
      <form id="make-call" class="">
        <input type="text" placeholder="Join room..." id="join-room">
        <button class="" type="submit">通話に参加する</button>
      </form>
      <button id="serch-botton">部屋を検索</button>
      <div id="room-number"></div>
      <form id="make-room" class="">
        <input type="text" placeholder="Make room..." id="make-room-name">
        <button class="" type="submit">通話を募集する</button>
      </form>
      <p><strong>注意：</strong>稀に3人同時接続する可能性があります。レアケースですのでお楽しみください。</p>
    </div>
    @else
    <button>
      <a href="{{route('login')}}">ログインしてください</a>
    </button>
    @endauth

    <!-- Call in progress -->
    <div id="step3" class="chat-area">
      <button id="end-call">切断</button>
      <!-- テキスト入力 -->
      <h4>チャット</h4>
      <form id="sendtextform" class="">
        <input id="mymessage" type="text" placeholder="Enter message">
        <button class="" type="submit">Send</button>
      </form>
      <!-- チャット -->
      <div id="chatframe"></div>
    </div>

  </div>

  <!-- ユーザー一覧 -->
  <div class="users">
    <h3>ユーザー一覧</h3>
    @foreach($users as $user)
    {{$user->name}}<br>
    <button id="good-button" value="{{$user->id}}">いいね</button>
    @endforeach
  </div>

  <div id="userDetail" class="userDetail">
    <h5 id="userDetailName"></h5>
    <ul id="games">
      <h5>好きなゲーム</h5>
    </ul>
    <button id="closeUserDetail">閉じる</button>
  </div>


</div>


@endsection
