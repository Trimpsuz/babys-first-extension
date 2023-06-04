const projectName = document.title.replace(' - Google Sheets', '');

let editorText = '';

//Check if extension is enabled
browser.storage.local.get('extensionStatus').then((item) => {
  if (Object.entries(item).length === 0 || item.extensionStatus) {
    //Send heartbeat
    setInterval(() => {
      if (document.getElementById('waffle-rich-text-editor').children[0]) {
        if (!document.hidden && editorText != document.getElementById('waffle-rich-text-editor').children[0].textContent) {
          editorText = document.getElementById('waffle-rich-text-editor').children[0].textContent;

          const data = {
            project_name: projectName,
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
