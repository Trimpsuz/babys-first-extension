//tämä osa hoitaa tekstien käännökset
document.addEventListener('DOMContentLoaded', function () {
  var AuthCodeLabel = browser.i18n.getMessage('AuthCodeLabel');
  var ProjectNameLabel = browser.i18n.getMessage('ProjectNameLabel');
  var Homepage = browser.i18n.getMessage('Homepage');
  var ToggleLabel = browser.i18n.getMessage('ToggleLabel');

  var ToggleLabelElement = document.getElementById('toggle-label');
  ToggleLabelElement.textContent = ToggleLabel;

  var AuthCodeLabelElement = document.getElementById('auth-code-label');
  AuthCodeLabelElement.textContent = AuthCodeLabel;

  var ProjectNameLabelElement = document.getElementById('project-name-label');
  ProjectNameLabelElement.textContent = ProjectNameLabel;

  var HomepageElement = document.getElementById('Homepage');
  HomepageElement.textContent = Homepage;

  var form = document.getElementById('time-form'); //ei aavistustakaan mikä tää 'time-form' on ja miksi tää toimii, en uskalla koskea ettei kaikki hajoa
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var authCode = document.getElementById('auth-code').value;

    browser.storage.local.set({ authCode }).then(() => {
      console.log('Authcode set in local storage.');
    });

    form.reset();
  });
});

//tää osa vaihtaa kuvia ja tekstejä on/off
document.addEventListener('DOMContentLoaded', function () {
  var StatusOff = browser.i18n.getMessage('StatusOff');
  var StatusOn = browser.i18n.getMessage('StatusOn');

  var statusText = document.getElementById('status-text');
  var statusImage = document.getElementById('statusimg');

  var enabledCheckbox = document.getElementById('enabled');

  enabledCheckbox.addEventListener('change', function () {
    if (enabledCheckbox.checked) {
      statusText.textContent = StatusOn;
      statusImage.style.backgroundImage = 'url("assets/time-on.png")';
      browser.browserAction.setIcon({ path: 'assets/toolbar-on.png' });
    } else {
      statusText.textContent = StatusOff;
      statusImage.style.backgroundImage = 'url("assets/time-off.png")';
      browser.browserAction.setIcon({ path: 'assets/toolbar-off.png' });
    }
  });

  // Initialize the toggle state
  enabledCheckbox.checked = false;
});
