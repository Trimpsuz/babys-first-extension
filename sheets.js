const projectName = document.title.replace(' - Google Sheets', '');

let editorText = '';

//Send heartbeat
setInterval(() => {
  if (document.getElementById('waffle-rich-text-editor').children[0]) {
    if (!document.hidden && editorText != document.getElementById('waffle-rich-text-editor').children[0].textContent) {
      editorText = document.getElementById('waffle-rich-text-editor').children[0].textContent;

      const data = {
        projectName,
        language: 'Google Sheets',
        editor_name: 'browser',
        hostname: 'browser',
      };

      browser.storage.local.get('authCode').then((item) => {
        const authCode = item.authCode;
        fetch('https://api.testaustime.fi/activity/update', data, {
          Headers: {
            Authorization: `Bearer ${authCode}`,
          },
        });
      });
      console.log('Heartbeat');
    }
  }
}, 30_000);
