console.log('getResponse is loaded');

function put(url, data) {
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", url);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify(data));
}

(function (){
  const putted = {};

  var origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function() {
    // console.log('request started!', arguments);
    const args = arguments;
    const pattern = /.*:\/\/www.hackerrank.com\/rest\/contests\/.*\/challenges\/.*\/submissions\/.*/g;
    
    if (args[1] && pattern.test(args[1])) {
      this.addEventListener('load', function() {
          try {
            const data = JSON.parse(this.responseText);
            const model = data.model;
            const score = Number(model.display_score);

            if (!putted[model.id] || putted[model.id] < score) {
              put('http://hc.dung.codes/api/submission/put', {
                score,
                hackerId: model.hacker_id,
                lang: model.language,
                statusText: model.status,
                challengeId: model.challenge_id,
                challengeName: model.name,
                challengeSlug: model.slug,
                contestSlug: model.contest_slug,
                updatedAt: model.updated_at
              });
              
              putted[model.id] = score;
            }

          } catch {
            console.log('Parse fail!');
            console.log(this.responseText);
          }
      });
    }

    origOpen.apply(this, arguments);
  };
})();