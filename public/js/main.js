$(() => {


  let localStream;
  let myId;
  let allPeers;
  let randPeer="";

  // カメラ映像取得
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      // 成功時にvideo要素にカメラ映像をセットし、再生
      $('#my-video').get(0).srcObject = stream;
      localStream = stream;
      // 着信時に相手にカメラ映像を返せるように、グローバル変数に保存しておく
      localStream = stream;
    }).catch(error => {
      // 失敗時にはエラーログを出力
      console.error('mediaDevice.getUserMedia() error:', error);
      return;
    });


  const peer = new Peer({
    key: '7f53637a-de6d-4969-9cb8-5169c04e7144',
    debug: 3
  });

  function choosen_one()  {
    const getPeer = peer.on('open', () => {
      myId = peer.id;
      $('#my-id').text(myId);
      peer.listAllPeers(function (list) {
        allPeers = list;
        notMyPeer = allPeers.filter((value) => {
          return value != myId;
        });
        randPeer = notMyPeer[Math.floor(Math.random() * notMyPeer.length)];
        $('#their-id').val(randPeer);
      });
    });
    return getPeer;
  }
  choosen_one();


  $('#make-call').on('click', () => {
    const theirID = $('#their-id').val();
    const mediaConnection = peer.call(theirID, localStream);
    setEventListener(mediaConnection);
  });

  // イベントリスナを設置する関数
  const setEventListener = mediaConnection => {
    mediaConnection.on('stream', stream => {
      // video要素にカメラ映像をセットして再生
      $('#their-video').get(0).srcObject = stream;
    });
  }
  peer.on('call', mediaConnection => {
    mediaConnection.answer(localStream);
    setEventListener(mediaConnection);
  });
  peer.on('error', err => {
    alert(err.message);
  });
  peer.on('close', () => {
    alert('通信が切断しました。');
  });

});