# User Script: HSBC - Account History Re-Render

## Description

The script re-render the account history page in 2 ways:
- style: it removes some useless spacing and informations, making the transactions listing way more readable. You can then see 60 transactions on the page (instead of 5...)
- history: it stores locally (localStorage) the transactions history so you can consult more than the last 90 days offered by HSBC (so lame!)

Note: I can imagine some people being scared of having their transaction history on their localStorage, but I dont :)
I'd even like to sync this transactions history to a cloud based service

This script also add a 'Display chart' button at the top, offering a visual output of the account transactions


## Install

### Install a UserScript extension on your browser
- For firefox, there is [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)
- For Chromium, there is [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)

### Install this script
If you hit [the raw script url](https://github.com/jobwat/hsbc-account-history-rerender.user.js/raw/master/hsbc-account-history-rerender.user.js), the extension should explicitly offer to install the script. Click 'Install' :)

### All done!
Now when on the account summary page of HSBC, the page should appear way more compact and the old transactions (prior to 90days) should also be part of it!


## Screenshots

![Screenshot](https://github.com/jobwat/hsbc-account-history-rerender.user.js/raw/master/screenshots/without_script.jpg)
![Screenshot](https://github.com/jobwat/hsbc-account-history-rerender.user.js/raw/master/screenshots/with_script.jpg)
![Screenshot](https://github.com/jobwat/hsbc-account-history-rerender.user.js/raw/master/screenshots/with_script_displaying_chart.jpg)

