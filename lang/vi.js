export const transValidation = {
  email_incorrect: "Email phải có dạng example@gmail.com",
  gender_incorrect: "Không được sửa trường giới tính",
  password_incorrect: "Mật khẩu phải chứa ít nhất 8 ký tự gồm: chữ hoa, chữ thường, chữ số và ký tự đặc biệt",
  password_confirmation_incorrect: "Mật khẩu nhập lại không đúng"
};
export const transErrors = {
  account_in_use: "Email này đã được sử dụng",
  account_removed: "Tài khoản này đã bị gỡ khỏi hệ thống, bạn có thể liên hệ phía bộ phận hỗ trợ để được giải đáp",
  account_not_active: "Email này đã được đăng ký nhưng chưa active, vui lòng active tài khoản bằng cách vào email và làm theo hướng dẫn",
  token_undefined: "Email này đã được kích hoạt rồi!",
  login_failed: "Sai tài khoản hoặc mật khẩu",
  server_error: "Có lỗi ở phía máy chủ. Vui lòng liên hệ bộ phận hỗ trợ của chúng tôi"
}
export const transSuccess = {
  userCreated: (userEmail) => {
    return `Tài khoản <strong>${userEmail}</strong> đã được tạo, vui lòng kiểm tra email của bạn để kích hoạt tài khoản. Xin cảm ơn!`;
  },
  account_active: "Kích hoạt tài khoản thành công. Bạn có thể đăng nhập ứng dụng",
  loginSuccess: (username) => {
    return `Xin chào ${username}, chúc bạn một ngày tốt lành!`;
  },
  logout_success: "Đăng xuất thành công"
};
export const transMail = {
  subject: "Awesome-chat: Xác nhận kết quả tài khoản",
  template: (linkVerify) => {
    return `
      <h2>Bạn nhận được thư này do đăng ký tài khoản trên ứng dụng awesome-chat</h2>
      <h3>Vui lòng kích hoạt tài khoản bằng cách click vào liên kết dưới đây</h3>
      <h3><a href="${linkVerify}" target="blank">${linkVerify}</a></h3>
      <h4>Nếu email này nhầm lẫn hãy bỏ qua nó. Trân trọng!</h4>
    `;
  },
  send_failed: "Có lỗi trong quá trình gửi email, vui lòng liên hệ bộ phận hỗ trợ của chúng tôi!"
}