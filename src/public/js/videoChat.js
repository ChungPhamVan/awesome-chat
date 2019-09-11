

function videoChat(divId) {
  $(`#video-chat-${divId}`).unbind('click').on('click', function() {
    let targetId = $(this).data('chat');
    let callerName = $('#navbar-username').text();
    
    let dataToEmit = {
      listenerId: targetId,
      callerName: callerName
    };
    //buoc 1: kiem tra co online khong
    socket.emit('caller-check-listener-online-or-not', dataToEmit);




  });
}
$(document).ready(function () {
  //buoc 2: caller
  socket.on('server-send-listener-is-offline', function() {
    alertify.notify('Người dùng hiện không trực tuyến', 'error', 4);
  });
  //buoc 3: listener
  let getPeerId = "";
  const peer = new Peer();  
  peer.on('open', function(peerId) {
    getPeerId = peerId;
  });
  socket.on('server-resquest-peer-id-of-listener', function (response) {
    let listenerName = $('#navbar-username').text();
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: listenerName,
      listenerPeerId: getPeerId
    };

    // buoc 4: listener
    socket.emit('listener-emit-peer-id-to-server', dataToEmit);
  });

  //buoc 5: 
  socket.on('server-send-peer-id-of-listener-to-caller', function(response) {
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: response.listenerName,
      listenerPeerId: response.listenerPeerId
    };
    //buoc 6: caller
    socket.emit('caller-request-call-to-server', dataToEmit);
    let timerInterval;
    Swal.fire({
      title: `Đang gọi cho &nbsp<span style="color: #2ECC71">${response.listenerName}</span> &nbsp &nbsp <i class="fa fa-volume-control-phone"></i>`,
      html: `
        Thời gian: <strong style="color: #D43F3A">10</strong>s. <br/><br/>
        <button id="btn-cancel-call" class="btn btn-danger">
          Hủy cuộc gọi
        </button>
      `,
      backdrop: 'rgba(85, 85, 85, 0.5)',
      width: "52rem",
      allowOutsideClick: false,
      timer: 30000,
      onBeforeOpen: () => {
        $('#btn-cancel-call').unbind('click').on('click', function() {
          Swal.close();
          clearInterval(timerInterval);
          //buoc 7: of caller
          socket.emit('caller-cancel-request-call-to-server', dataToEmit);
        });

        Swal.showLoading();
        timerInterval = setInterval(() => {
          Swal.getContent().querySelector('strong').textContent = Math.ceil(Swal.getTimerLeft() / 1000);
        }, 1000);
      },
      onOpen: () => {
        //buoc 12: 
        socket.on('server-send-reject-call-to-caller', function(response) {
          Swal.close();
          clearInterval(timerInterval);
          Swal.fire({
            type: 'info',
            title: `<span style="color: #2ECC71">${response.listenerName}</span> &nbsp hiện tại đang bận...`,
            backdrop: 'rgba(85, 85, 85, 0.5)',
            width: "52rem",
            allowOutsideClick: true,
            confirmButtonColor: '#2ECC71',
            confirmButtonText: 'Xác nhận'
          });
        });

        //buoc 13: 
        socket.on('server-send-accept-call-to-caller', function(response) {
          Swal.close();
          clearInterval(timerInterval);
          console.log('caller dong');
        });
      },
      onClose: () => {
        clearInterval(timerInterval);
      }
    }).then(result => {
      return false;
    });
  });

  // buoc 8: of listener
  socket.on('server-send-request-call-to-listener', function(response) {
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: response.listenerName,
      listenerPeerId: response.listenerPeerId
    };
    let timerInterval;
    Swal.fire({
      title: `<span style="color: #2ECC71">${response.callerName}</span> &nbsp đang gọi cho bạn &nbsp &nbsp <i class="fa fa-volume-control-phone"></i>`,
      html: `
        Thời gian: <strong style="color: #D43F3A">10</strong>s. <br/><br/>
        <button id="btn-reject-call" class="btn btn-danger">
          Từ chối
        </button>
        <button id="btn-accept-call" class="btn btn-success">
          Đồng ý
        </button>
      `,
      backdrop: 'rgba(85, 85, 85, 0.5)',
      width: "52rem",
      allowOutsideClick: false,
      timer: 30000,
      onBeforeOpen: () => {
        $('#btn-reject-call').unbind('click').on('click', function() {
          Swal.close();
          clearInterval(timerInterval);
          //buoc 10: of listener
          socket.emit('listener-reject-request-call-to-server', dataToEmit);
        });

        $('#btn-accept-call').unbind('click').on('click', function() {
          Swal.close();
          clearInterval(timerInterval);
          //buoc 11: of listener
          socket.emit('listener-accept-request-call-to-server', dataToEmit);
        });

        Swal.showLoading();
        timerInterval = setInterval(() => {
          Swal.getContent().querySelector('strong').textContent = Math.ceil(Swal.getTimerLeft() / 1000);
        }, 1000);
      },
      onOpen: () => {
        // buoc 9: of listener
        socket.on('server-send-cancel-request-call-to-listener', function(response) {
          Swal.close();
          clearInterval(timerInterval);
        });

        // buoc 14: of listener
        socket.on('server-send-accept-call-to-listener', function(response) {
          Swal.close();
          clearInterval(timerInterval);
          console.log('listender dong');
        });
      },
      onClose: () => {
        clearInterval(timerInterval);
      }
    }).then(result => {
      return false;
    });
  });





});