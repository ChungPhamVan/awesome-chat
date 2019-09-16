let searchConversation = (element) => {
  if(element.which == 13) {
    let keyword = $('input.searchBox').val();
    let regexKeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
    if(!keyword.length) {
      alertify.notify('Chưa nhập nội dung tìm kiếm', "error", 7);
      return false;
    }
    if(!regexKeyword.test(keyword) || keyword.length > 17) { 
      alertify.notify("Lỗi từ khóa tìm kiếm, chỉ cho phép nhập chữ cái, số, khoảng cách và không quá 17 ký tự", "error", 7);
      return false;
    }
    let conversations = $('#all-chat ul').find('a');
    let allConversationIds = [];
    conversations.each(function(element) {
      allConversationIds.push($(this).find('li').data('chat'));
    });


    $.get(`/conversation/find-conversations?keyword=${keyword}&allConversationIds=${allConversationIds}`, function(data) {
      $('#search-results .search_content ul').html(data);
      $('#search-results').css('display', 'block');
      $('input.searchBox').focusin(function() {
        $('#search-results').css('display', 'block');
      });

      $(document).mouseup(function (e){
        var container = $(".navbar-left.no-padding-start li");
        if (!container.is(e.target) && container.has(e.target).length === 0){
          $('#search-results').hide();
        }
      });

      $('#search-results ul li').unbind('click').on('click', function() {
        let dataChat = $(this).data('uid');
        $('input.searchBox').val('');
        $('ul.people').find(`a[href = "#uid_${dataChat}"]`).click();
        $('#search-results').css('display', 'none');
      });
      
    }).fail(function(response) {
      alertify.notify(response.responseText, "error", 7);
    });
  }
}

$(document).ready(function () {
  $('input.searchBox').bind('keypress', searchConversation);
});