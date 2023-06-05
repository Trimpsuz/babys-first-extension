const editor = document.getElementsByClassName('blocklyBlockCanvas')[0];
const projectName = document.title.replace(' on Scratch', '');

function heartbeat() {
  browser.storage.local.get('authCode').then((item) => {
    const authCode = item.authCode;
    const data = {
      project_name: projectName,
      language: 'Scratch',
      editor_name: 'browser',
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
}

//Check if extension is enabled
browser.storage.local.get('extensionStatus').then((item) => {
  if (Object.entries(item).length === 0 || item.extensionStatus) {
    //Send heartbeat on first action
    document.addEventListener('click', handleFirstAction);
  }
});
