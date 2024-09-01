var Diacritics = require('diacritic');

export function highlight(text) {
  let inputTextElements = document.getElementsByClassName("highlightable");

  for (var i = 0; i < inputTextElements.length; i++) {
    let inputText = inputTextElements[i];
    let plainText = inputText.innerText;

    if (!text?.trim()) {
      inputText.innerHTML = plainText;
      continue;
    }

    const searchWords = Diacritics.clean(text.trim()).toLowerCase().split(' ');

    const newhtml = plainText.split(' ').reduce((pre, cur) => {
      const currentHtml = Diacritics.clean(cur).toLowerCase(); // ?
      // find the matching search words , order by the length of each word
      const matchedWords = searchWords.filter(x => currentHtml.indexOf(x) >= 0).sort((a, b) => b.length - a.length);

      if (matchedWords.length > 0) {
        const longest = matchedWords[0];
        const wordIndex = currentHtml.indexOf(longest);
        // highlight the longest matching word only
        pre.push(cur.substring(0, wordIndex) +
          "<span class='highlight'>" + cur.substring(wordIndex, wordIndex + longest.length) +
          "</span>" + cur.substring(wordIndex + longest.length));
        return pre;
      } else {
        pre.push(cur);
      }
      return pre;
    }, []).join(' ');

    inputText.innerHTML = newhtml;
  }
}

export function getLadderNotificationObject(ladder, toSubmit, allPlayers) {
  return {
    submittedBy: toSubmit.submittedByFullName,
    ladderName: ladder.name,
    winnerTeam: `${allPlayers.find(x => x.playerId === toSubmit.winner1).displayName} + ${allPlayers.find(x => x.playerId === toSubmit.winner2).displayName}`,
    losingTeam: `${allPlayers.find(x => x.playerId === toSubmit.loser1).displayName} + ${allPlayers.find(x => x.playerId === toSubmit.loser2).displayName}`,
    score: `${+toSubmit.gameWonByWinners} - ${+toSubmit.gameWonByLosers}`,
    // toAddresses: [],
    toAddresses: [
      allPlayers.find(x => x.playerId === toSubmit.winner1).email,
      allPlayers.find(x => x.playerId === toSubmit.winner2).email,
      allPlayers.find(x => x.playerId === toSubmit.loser1).email,
      allPlayers.find(x => x.playerId === toSubmit.loser2).email,
    ],
  }
}