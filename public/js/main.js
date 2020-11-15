let peer = null;
let peers = null;

$(function () {
  $('#random').on("click",()=> {
    peer = new Peer({
      key: '7f53637a-de6d-4969-9cb8-5169c04e7144',
      debug: 3
    });
    peer.on('open', () => {
      $('#my-id').text(peer.id),
        peer.listAllPeers((peers) => {
          console.log(peers);
        });
    });

  });



});