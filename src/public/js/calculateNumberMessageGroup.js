function increaseNumberMessageGroup(divId) {
  let currentValue = +$(`.right[data-chat = ${divId}]`).find('span.show-number-message').text();
  currentValue = currentValue + 1;
  $(`.right[data-chat = ${divId}]`).find('span.show-number-message').html(currentValue);

}