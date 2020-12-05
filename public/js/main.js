/* eslint-disable require-jsdoc */
'use strict'


$(function () {
  // Peer object
  const peer = new Peer({
    key: "7f53637a-de6d-4969-9cb8-5169c04e7144",
    debug: 3,
  });


  let roomName;
  let localStream;
  let room;
  let rooms;
  let roomNames = [];
  let userName = $('#my-name').html();
  let userID = $('#my-id').val();


  peer.on('open', () => {
    console.log('Peer接続完了')
    // Get things started
    step1();
  });

  peer.on('error', err => {
    alert(err.message);
    // Return to step 2 if error occurs
    step2();
  });

  getRooms();

  $('#make-call').on('submit', e => {
    e.preventDefault();
    roomName = $('#join-room').val();
    if (!roomName) {
      return;
    }
    room = peer.joinRoom('mesh_multi_' + roomName, { stream: localStream });
    //入室処理後
    joinedRoom()
    step3(room);
  });

  $('#make-room').on('submit', e => {
    e.preventDefault();
    roomName = $('#make-room-name').val();
    if (!roomName) {
      return;
    }
    room = peer.joinRoom('mesh_multi_' + roomName, { stream: localStream });
    step3(room);
  });

  $('#end-call').on('click', () => {
    $('#chatbox-' + room.name).hide() // 切断時にチャットボックスを隠す
    room.close();
    //DBのroomsから該当する部屋名消す。
    $.ajax({
      url: 'https://ec2-13-115-207-61.ap-northeast-1.compute.amazonaws.com/api/room/' + roomName,
      type: 'DELETE',
      dataType: 'json',
      timeout: 3000,
    }).done(function (data) {
      location.reload();
      alert("退出しました。");
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
      location.reload();
      alert("退出しました。");
    })
    step2();
    //切断後部屋をランダムピック
    getRooms();
  });


  //部屋を作成
  $('#make-room').on('submit', e => {
    e.preventDefault();
    roomName = $('#make-room-name').val();
    if (!roomName) {
      return;
    }
    $.ajax({
      url: 'https://ec2-13-115-207-61.ap-northeast-1.compute.amazonaws.com/api/room',
      type: 'POST',
      dataType: 'json',
      data: { name: roomName, status: 0 },
      timeout: 3000,
    }).done(function (data) {
      alert("通話を募集しました");
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
      alert("この部屋名は他のユーザーが使用しております。");
      return
    });
  });

  //再検索ボタン
  $('#serch-botton').on('click', () => {
    getRooms();
    alert('再検索しました。')
    if (getRooms() >= 1) {
      $('#make-call').show();
    }
  })
  //自分情報
  $('#my-name').on('click', () => {
    userShow();
  })
  //ユーザー詳細
  $('body').on('click', '.user-data',()=>{
    userShow();
  })

  //ユーザー一覧
  $('#users').on('click', () => {
    users()
  })

  //初期画面
  $('.gameet , #closeUserDetail').on('click', () => {
    gameet()
  })

  //いいねボタン
  $('#good-button').on('click', () => {
    let id = $('#good-button').val()
    addGood(id)
  })





  // Retry if getUserMedia fails
  $('#step1-retry').on('click', () => {
    $('#step1-error').hide();
    step1();
  });

  // set up audio and video input selectors
  const audioSelect = $('#audioSource');
  const videoSelect = $('#videoSource');
  const selectors = [audioSelect, videoSelect];

  navigator.mediaDevices.enumerateDevices()
    .then(deviceInfos => {
      const values = selectors.map(select => select.val() || '');
      selectors.forEach(select => {
        const children = select.children(':first');
        while (children.length) {
          select.remove(children);
        }
      });

      for (let i = 0; i !== deviceInfos.length; ++i) {
        const deviceInfo = deviceInfos[i];
        const option = $('<option>').val(deviceInfo.deviceId);

        if (deviceInfo.kind === 'audioinput') {
          option.text(deviceInfo.label ||
            'Microphone ' + (audioSelect.children().length + 1));
          audioSelect.append(option);
        } else if (deviceInfo.kind === 'videoinput') {
          option.text(deviceInfo.label ||
            'Camera ' + (videoSelect.children().length + 1));
          videoSelect.append(option);
        }
      }

      selectors.forEach((select, selectorIndex) => {
        if (Array.prototype.slice.call(select.children()).some(n => {
          return n.value === values[selectorIndex];
        })) {
          select.val(values[selectorIndex]);
        }
      });

      videoSelect.on('change', step1);
      audioSelect.on('change', step1);
    });

  function step1() {
    // Get audio/video stream
    const audioSource = $('#audioSource').val();
    const videoSource = $('#videoSource').val();
    const constraints = {
      audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
      video: { deviceId: videoSource ? { exact: videoSource } : undefined },
    };
    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
      $('#my-video').get(0).srcObject = stream;
      localStream = stream;

      if (room) {
        room.replaceStream(stream);
        return;
      }

      step2();
    }).catch(err => {
      $('#step1-error').show();
      console.error(err);
    });
  }

  function step2() {
    $('#their-videos').empty();
    $('#step1, #step3').hide();
    $('#step2').show();
    $('#join-room').on(focus());
    gameet();
  }

  function step3(room) {
    // chatboxを追加する
    const chatbox = $('<div></div>').addClass('chatbox').attr('id', 'chatbox-' + room.name);
    const messages = $('<div style="color: #8B8B8B"><em>チャットログ</em></div>').addClass('messages');
    chatbox.append(messages);
    $('#chatframe').append(chatbox);

    // メッセージ送信部分
    $('#sendtextform').on('submit', e => {
      e.preventDefault(); // form送信を抑制
      const msg = $('#mymessage').val();
      // ルームに送って自分のところにも反映
      room.send(msg);
      messages.prepend('<div><span class="you">あなた: </span>' + msg + '</div>');
      $('#mymessage').val('');
    });

    // チャットとかファイルが飛んできたらdataでonになる
    // ここではファイルは使わないのでもとのサンプルのif文はけしておく
    room.on('data', message => {
      messages.prepend('<div style="background-color: #5C2929 margin:0"><span class="peer">あいて</span>: ' + message.data + '</div>');
    });

    room.on('peerJoin', () => {
      messages.prepend('<div><span class="peer">あいて</span>と通話が開始しました。</div>');
    });

    room.on('peerLeave', () => {
      messages.prepend('<div><span class="peer">あいて</span>が退出しました。新しく通話を募集してください。</div > ');
    });

    // streamが飛んできたら相手の画面を追加する
    room.on('stream', stream => {
      const peerId = stream.peerId;
      const id = 'video_' + peerId + '_' + stream.id.replace('{', '').replace('}', '');

      $('#their-videos').append($(
        '<div class="their-video"' + peerId + '" id="' + id + '">' +
        '<button class="user-data">ユーザー情報</button>' +
        '<video class="remoteVideos" autoplay playsinline>' +
        '</div>'));
      const el = $('#' + id).find('video').get(0);
      el.srcObject = stream;
      el.play();
    });

    room.on('removeStream', function (stream) {
      const peerId = stream.peerId;
      $('#video_' + peerId + '_' + stream.id.replace('{', '').replace('}', '')).remove();
    });

    // UI stuff
    room.on('close', step2);
    room.on('peerLeave', peerId => {
      $('.video_' + peerId).remove();
    });
    $('#step1, #step2').hide();
    $('#step3').show();
  }
  //部屋一覧
  function getRooms() {
    $.getJSON({
      url: 'https://ec2-13-115-207-61.ap-northeast-1.compute.amazonaws.com/api/room',
    })
      .done(function (data) {
        console.log("接続");
        rooms = data.data;
        //部屋あったら、部屋をランダムピック
        if (rooms != null) {
          for (let i = 0; i < rooms.length; i++) {
            roomNames[i] = rooms[i].name;
          }
          $('#join-room').val(roomNames[Math.floor(Math.random() * roomNames.length)]);
        } else {
          alert('通話を募集してください');
        };

        if (roomNames.length == 0) {
          $('#make-call').hide()//通話参加を隠す
          $('#room-number').text('通話募集数が0です。通話を募集してください');
        } else {
          $('#room-number').text('通話募集数' + roomNames.length)
        }

      })
      .fail(function (XMLHttpRequest, textStatus, errorThrown) {
        alert("error");
      });
    return roomNames.length;
  };

  //入室後処理
  function joinedRoom() {
    console.log(roomName);
    $.ajax({
      url: 'https://ec2-13-115-207-61.ap-northeast-1.compute.amazonaws.com/api/room/' + roomName,
      type: 'PUT',
      dataType: 'json',
      timeout: 3000,
    }).done(function (data) {
      alert("通話を開始します。");
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
      alert("error");
    })
  }

  //ユーザー詳細
  function userShow() {
    $.ajax({
      url: 'https://ec2-13-115-207-61.ap-northeast-1.compute.amazonaws.com/api/user/' + userID,
      type: 'get',
      dataType: 'json',
      timeout: 3000,
    }).done(function (data) {
      alert('user');
      $('#userDetailName').text(data.data.name);
      $('#userDetail').show();
      return data;
    }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
      alert("error");
    })
  }

  //初期画面
  function gameet() {
    $('#tell-area').show();
    $('.users').hide();
    $('#userDetail').hide();
  }

  //ユーザー一覧
  function users() {
    $('#tell-area').hide();
    $('.users').show();
  }

  //いいね機能
  function addGood(id) {
    
  }

});