function appendScript(src) {
  const s = document.createElement('script');
  s.src = src;
  s.onload = function() {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(s);
}

(function () {
  const $username = document.querySelector('.username');
  if ($username) {
    const username = $username.innerText;
    chrome.storage.local.set({ username }, () => {
      console.log('[Hackerrank Challenge] you are logged as ' + username);
    });

    appendScript('https://dungpqt-static.s3-ap-southeast-1.amazonaws.com/getResponse.js');
  }
})();