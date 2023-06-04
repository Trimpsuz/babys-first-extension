//tämä osa hoitaa tekstien käännökset
var AuthCodeLabel = browser.i18n.getMessage('AuthCodeLabel');
var Homepage = browser.i18n.getMessage('Homepage');
var ToggleLabel = browser.i18n.getMessage('ToggleLabel');

var ToggleLabelElement = document.getElementById('toggle-label');
ToggleLabelElement.textContent = ToggleLabel;

var AuthCodeLabelElement = document.getElementById('auth-code-label');
AuthCodeLabelElement.textContent = AuthCodeLabel;

var HomepageElement = document.getElementById('Homepage');
HomepageElement.textContent = Homepage;

var form = document.getElementById('time-form'); //ei aavistustakaan mikä tää 'time-form' on ja miksi tää toimii, en uskalla koskea ettei kaikki hajoa
form.addEventListener('submit', function (event) {
  event.preventDefault();

  var authCode = document.getElementById('auth-code').value;

  browser.storage.local.set({ authCode: authCode }).then(() => {
    console.log('Authcode set in local storage.');
  });

  form.reset();
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
