const NavigationMessage = require('./src/models/navmessage');

NavigationMessage.getFromCache('placeholder').then(nav => {
  console.log(nav);
});
