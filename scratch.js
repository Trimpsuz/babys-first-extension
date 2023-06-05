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
