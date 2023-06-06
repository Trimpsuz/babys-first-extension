let editorText = '';
let hasMouseMoved = false;

function heartbeat() {
  browser.storage.local.get('authCode').then((item) => {
    const authCode = item.authCode;
    const data = {
      project_name: document.title.replace(' - Google Sheets', ''),
      language: 'Spreadheet',
      editor_name: 'Google Sheets',
      hostname: 'browser',
    };
    fetch('https://api.testaustime.fi/activity/update', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authCode}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log('Heartbeat');
      })
      .catch((error) => {
        console.error(error);
      });
  });
}

function handleFirstAction() {
  document.removeEventListener('click', handleFirstAction);
  heartbeat();

  //Check if mouse moves
  document.addEventListener('mousemove', () => {
    hasMouseMoved = true;
  });

  //Send heartbeat every 30 seconds after first action
  setInterval(() => {
    if (!document.hidden && (editorText != document.getElementById('waffle-rich-text-editor').textContent || hasMouseMoved)) {
      editorText = document.getElementById('waffle-rich-text-editor').textContent;

      heartbeat();
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
        fetch('https://api.testaustime.fi/activity/flush', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authCode}`,
          },
        })
          .then(() => {
            console.log('Flushed');
          })
          .catch((error) => {
            console.error(error);
          });
      });
    };
  }
});
