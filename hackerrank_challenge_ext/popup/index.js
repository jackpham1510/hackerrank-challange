function createScoreCircle(el, score = 0, total = 50) {
  var bar = new ProgressBar.Circle(el, {
    color: '#ccc',
    // This has to be the same size as the maximum width to
    // prevent clipping
    strokeWidth: 6,
    trailWidth: 2,
    easing: 'easeInOut',
    duration: 1400,
    text: {
      autoStyleContainer: false
    },
    from: { color: '#4fc08d', width: 1 },
    to: { color: '#4fc08d', width: 6 },
    // Set default step function for all animate calls
    step: function(state, circle) {
      circle.path.setAttribute('stroke', state.color);
      circle.path.setAttribute('stroke-width', state.width);
  
      var value = Math.round(circle.value() * Math.max(total, score));
      if (value === 0) {
        circle.setText('0 / ' + total);
      } else {
        circle.setText(value + ' / ' + total);
      }
  
    }
  });

  bar.text.style.fontFamily = 'Helvetica, sans-serif';
  bar.text.style.fontSize = '1.5rem';
  bar.text.style.color = '#4fc08d';
  
  bar.animate(Math.min(score / total, 1.0));
}

chrome.storage.local.get(['username'], function(result) {
  console.log('username:', result.username);
  if (!result.username) {
    alert('Please refresh page and try again (make sure you are logged in).');
    return;
  }
  
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4) {
      const $ = q => document.querySelector(q);
      const $loading = $('#loading');

      if (this.status === 200) {
        $loading.remove();

        try {
          const res = JSON.parse(xhttp.responseText);
          const profile = res.body;

          console.log(res)

          $('#avatar').src = profile.avatar;
          $('#username').innerText= profile.username;
          createScoreCircle('#score', profile.totalScore);

          delete $('#result').classList.remove('hidden');
        } catch (ex) {
          console.error(ex);
          delete $('#error').classList.remove('hidden');
        }
      }
    }
  };

  xhttp.open("GET", "http://hc.phamdung.me/api/profile/getone?username="+result.username, true);
  xhttp.send();
});