function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  let formattedTime = '';
  if (hours > 0) {
    formattedTime += `${hours}h `;
  }
  if (minutes > 0) {
    formattedTime += `${minutes}m `;
  }
  if (remainingSeconds > 0) {
    formattedTime += `${remainingSeconds}s`;
  }

  return formattedTime.trim();
}

//tämä osa hoitaa tekstien käännökset
var AuthCodeLabel = browser.i18n.getMessage('AuthCodeLabel');
var Homepage = browser.i18n.getMessage('Homepage');
var ToggleLabel = browser.i18n.getMessage('ToggleLabel');
var ProgrammedToday = browser.i18n.getMessage('ProgrammedToday');

var ToggleLabelElement = document.getElementById('toggle-label');
ToggleLabelElement.textContent = ToggleLabel;

var AuthCodeLabelElement = document.getElementById('auth-code-label');
AuthCodeLabelElement.textContent = AuthCodeLabel;

var HomepageElement = document.getElementById('Homepage');
HomepageElement.textContent = Homepage;

var ProgrammedTodayElement = document.getElementById('ProgrammedToday');
ProgrammedTodayElement.textContent = ProgrammedToday;

const authCodeInput = document.getElementById('auth-code');

var authCode = null;

//Hide and unhide authcode on focus change
authCodeInput.addEventListener('focus', function () {
  this.type = 'text';
});

authCodeInput.addEventListener('blur', function () {
  this.type = 'password';
});

//Set text of authcode field to authcode stored
browser.storage.local.get('authCode').then((result) => {
  authCodeInput.value = result.authCode;
  authCode = result.authCode;

  //Set current programming time
  const start = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime() / 1000 - new Date().getTimezoneOffset() * 60;

  fetch(`https://api.testaustime.fi/users/@me/activity/data?from=${start}`, {
    headers: {
      Authorization: `Bearer ${authCode}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.length > 0) {
        const totalSeconds = data.reduce((acc, cur) => acc + cur.duration, 0);
        ProgrammedTodayElement.textContent = ProgrammedToday.replace('0s', formatTime(totalSeconds));
      } else {
        ProgrammedTodayElement.textContent = ProgrammedToday;
      }
    });
});

var form = document.getElementById('time-form');
form.addEventListener('submit', function (event) {
  event.preventDefault();

  authCode = authCodeInput.value;

  browser.storage.local.set({ authCode: authCode }).then(() => {
    console.log('Authcode set in local storage.');
  });
});

var StatusOff = browser.i18n.getMessage('StatusOff');
var StatusOn = browser.i18n.getMessage('StatusOn');

var statusText = document.getElementById('status-text');
var statusImage = document.getElementById('statusimg');

var enabledCheckbox = document.getElementById('enabled');

//Load toggle state
browser.storage.local.get('extensionStatus').then((result) => {
  if (Object.entries(result).length === 0) {
    //Set on on first use
    statusText.textContent = StatusOn;
    statusImage.style.backgroundImage = 'url("assets/time-on.png")';
    browser.browserAction.setIcon({ path: 'assets/toolbar-on.png' });
    enabledCheckbox.checked = true;
    browser.storage.local.set({ extensionStatus: true });
  } else if (result.extensionStatus) {
    statusText.textContent = StatusOn;
    statusImage.style.backgroundImage = 'url("assets/time-on.png")';
    browser.browserAction.setIcon({ path: 'assets/toolbar-on.png' });
    enabledCheckbox.checked = true;
  } else if (!result.extensionStatus) {
    statusText.textContent = StatusOff;
    statusImage.style.backgroundImage = 'url("assets/time-off.png")';
    browser.browserAction.setIcon({ path: 'assets/toolbar-off.png' });
    enabledCheckbox.checked = false;
  }
});

//tää osa vaihtaa kuvia ja tekstejä on/off
enabledCheckbox.addEventListener('change', function () {
  if (enabledCheckbox.checked) {
    statusText.textContent = StatusOn;
    statusImage.style.backgroundImage = 'url("assets/time-on.png")';
    browser.browserAction.setIcon({ path: 'assets/toolbar-on.png' });
    //Save toggle state
    browser.storage.local.set({ extensionStatus: true });
  } else {
    statusText.textContent = StatusOff;
    statusImage.style.backgroundImage = 'url("assets/time-off.png")';
    browser.browserAction.setIcon({ path: 'assets/toolbar-off.png' });
    //Save toggle state
    browser.storage.local.set({ extensionStatus: false });
  }
});
