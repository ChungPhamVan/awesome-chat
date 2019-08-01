let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;
let originUserInfo = {};


function updateUserInfo() {  
  $('#input-change-avatar').bind("change", function() {
    let fileData = $(this).prop("files")[0];
    let math = ["image/png", "image/jpg", "image/jpeg"];
    let limit = 1048576;
    if($.inArray(fileData.type, math) === -1) {
      alertify.notify("Kiểu file ảnh không hợp lệ, chỉ chấp nhận jpg, png & jpeg", "error", 7);
      $(this).val(null);
      return false;
    }
    if(fileData.size > limit) {
      alertify.notify("Chỉ cho phép upload ảnh kích thước tối đa 1MB", "error", 7);
      $(this).val(null);
      return false;
    }
    if(typeof (FileReader) != "undefined") {
      let imagePreview = $('#image-edit-profile');
      imagePreview.empty();
      let fileReader = new FileReader();
      fileReader.onload = function(element) {
        $('<img>', {
          "src": element.target.result,
          "class": "avatar img-circle",
          "id": "user-modal-avatar",
          "alt": "avatar"
        }).appendTo(imagePreview);
      }
      imagePreview.show();
      fileReader.readAsDataURL(fileData);

      let formData = new FormData();
      formData.append("avatar", fileData);
      userAvatar = formData;
    } else {
      alertify.notify("Trình duyệt không hỗ trợ việc hiển thị ảnh lập tức", "error", 7);
    }
  });

  $('#input-change-username').bind('change', function() {
    let username = $(this).val();
    let regexUsername = new RegExp("^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$");
    
    if(!regexUsername.test(username) || username.length < 3 || username.length > 17) {
      alertify.notify('Username chỉ từ 3-17 ký tự, không được chứa ký tự đặc biệt', 'error', 7);
      $(this).val(originUserInfo.username);
      delete userInfo.username;
      return false;
    }
    
    userInfo.username = username;
  });
  $('#input-change-gender-male').bind('click', function() {
    let gender = $(this).val();
    if(gender !== "male") {
      alertify.notify('Dữ liệu giới tính có vấn đề, bạn không được chỉnh sửa', 'error', 7);
      $(this).val(originUserInfo.gender);
      delete userInfo.gender;
      return false;
    }
    userInfo.gender = gender;
  });
  $('#input-change-gender-female').bind('click', function() {
    let gender = $(this).val();
    if(gender !== "female") {
      alertify.notify('Dữ liệu giới tính có vấn đề, bạn không được chỉnh sửa', 'error', 7);
      $(this).val(originUserInfo.gender);
      delete userInfo.gender;
      return false;
    }

    userInfo.gender = $(this).val();
  });
  $('#input-change-address').bind('change', function() {
    let address = $(this).val();
    if(address.length < 3 || address.length > 30) {
      alertify.notify('Address chỉ từ 3-30 ký tự', 'error', 7);
      $(this).val(originUserInfo.address);
      delete userInfo.address;
      return false;
    }

    userInfo.address = address;
  });
  $('#input-change-phone').bind('change', function() {
    let phone = $(this).val();
    let regexPhone = new RegExp("^(0)[0-9]{9,10}$");
    if(!regexPhone.test(phone)) {
      alertify.notify('Phone phải bắt đầu bằng 0, giới hạn 10-11 số', 'error', 7);
      $(this).val(originUserInfo.phone);
      delete userInfo.phone;
      return false;
    }

    userInfo.phone = phone;
  });
}

function callUpdateUserAvatar () {
  $.ajax({
    type: "put",
    url: "/user/update-avatar",
    cache: false,
    contentType: false,
    processData: false,
    data: userAvatar,
    success: function(result) {
      $('.user-modal-alert-success').find('span').text(result.message);
      $('.user-modal-alert-success').css('display', 'block');
      $('#navbar-avatar').attr('src', result.imageSrc);
      originAvatarSrc = result.imageSrc;
      $('#input-btn-cancel-update-user').click();
    },
    error: function(error) {
      $('.user-modal-alert-error').find('span').text(error.responseText);
      $('.user-modal-alert-error').css('display', 'block');
      $('#input-btn-cancel-update-user').click();
    }
  });
}

function callUpdateUserInfo () {
  $.ajax({
    type: "put",
    url: "/user/update-info",
    data: userInfo,
    success: function(result) {
      $('.user-modal-alert-success').find('span').text(result.message);
      $('.user-modal-alert-success').css('display', 'block');

      originUserInfo = Object.assign(originUserInfo, userInfo);
      $('#navbar-username').text(originUserInfo.username);

      $('#input-btn-cancel-update-user').click();
    },
    error: function(error) {
      $('.user-modal-alert-error').find('span').text(error.responseText);
      $('.user-modal-alert-error').css('display', 'block');
      $('#input-btn-cancel-update-user').click();
    }
  });
}


$(document).ready(function() {
  
  originAvatarSrc = $('#user-modal-avatar').attr("src");
  originUserInfo = {
    username: $('#input-change-username').val(),
    gender: ($('#input-change-gender-male').is(":checked")) ? $('#input-change-gender-male').val() : $('#input-change-gender-female').val(),
    address: $('#input-change-address').val(),
    phone: $('#input-change-phone').val()
  };
  updateUserInfo();

  $('#input-btn-update-user').bind("click", function() {
    if($.isEmptyObject(userInfo) && !userAvatar) {
      alertify.notify('Thông tin chưa được thay đổi', 'error', 7);
      return false;
    }
    if(userAvatar) {
      callUpdateUserAvatar();
    }
    if(!$.isEmptyObject(userInfo)) {
      callUpdateUserInfo();
    }
    console.log(userInfo);
  });
  $('#input-btn-cancel-update-user').bind("click", function() {
    userInfo = {};
    userAvatar = null;

    $('#input-change-avatar').val(null);
    $('#user-modal-avatar').attr('src', originAvatarSrc);

    $('#input-change-username').val(originUserInfo.username);
    (originUserInfo.gender === 'male' ? $('#input-change-gender-male').click() : $('#input-change-gender-female').click());
    $('#input-change-address').val(originUserInfo.address);
    $('#input-change-phone').val(originUserInfo.phone);
  });
});