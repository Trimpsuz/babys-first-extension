const projectName = document.title.replace(' - Google Sheets', '');

let editorText = '';

function heartbeat() {
  browser.storage.local.get('authCode').then((item) => {
    const authCode = item.authCode;
    const data = {
      project_name: projectName,
      language: 'Google Sheets',
      editor_name: 'browser',
      hostname: 'browser',
    };
    fetch('https://api.testaustime.fi/activity/update', data, {
      Headers: {
        Authorization: `Bearer ${authCode}`,
      },
    });
    console.log('Heartbeat');
  });
}

function handleFirstAction() {
  document.removeEventListener('click', handleFirstAction);
  heartbeat();

  //Send heartbeat every 30 seconds after first action
  setInterval(() => {
    if (document.getElementById('waffle-rich-text-editor').children[0]) {
      if (!document.hidden && editorText != document.getElementById('waffle-rich-text-editor').children[0].textContent) {
        editorText = document.getElementById('waffle-rich-text-editor').children[0].textContent;

        heartbeat();
      }
    }
  }, 30_000);
}

//Check if extension is enabled
browser.storage.local.get('extensionStatus').then((item) => {
  if (Object.entries(item).length === 0 || item.extensionStatus) {
    //Send heartbeat on first action
    document.addEventListener('click', handleFirstAction);

    //Flush when closing window
    window.onbeforeunload = () => {
      browser.storage.local.get('authCode').then((item) => {
        const authCode = item.authCode;
        fetch('https://api.testaustime.fi/activity/flush', '', {
          Headers: {
            Authorization: `Bearer ${authCode}`,
          },
        });
      });
      console.log('Flushed');
    };
  }
});
