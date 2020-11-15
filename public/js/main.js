$(function () {
  
  let myId = null;

  $('#random').on("click",()=> {
    peer = new Peer({
      key: '7f53637a-de6d-4969-9cb8-5169c04e7144',
      debug: 3
    });

    peer.on('open', () => {
      myId = peer.id;
      $('#my-id').text(myId),
        
        peer.listAllPeers((peers) => {
          peers = peers.filter((value) => {
            return value != myId;
          });
          console.log(peers);

          $.each(peers, (i, value) => {

          });
        });
    });

  });



});