let editorChanged = false;
let hasMouseMoved = false;

function heartbeat() {
  browser.storage.local.get('authCode').then((item) => {
    const authCode = item.authCode;
    const data = {
      project_name: document.title,
      language: 'GLSL',
      editor_name: 'Shadertoy',
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

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      editorChanged = true;
    }
  });
});

observer.observe(document.querySelector('.CodeMirror-code'), { childList: true, subtree: true });

function handleFirstAction() {
  document.removeEventListener('click', handleFirstAction);
  heartbeat();

  //Check if mouse moves
  document.addEventListener('mousemove', () => {
    hasMouseMoved = true;
  });
}

//Check if extension is enabled
browser.storage.local.get('extensionStatus').then((item) => {
  if (Object.entries(item).length === 0 || item.extensionStatus) {
    //Send heartbeat on first action
    document.addEventListener('click', handleFirstAction);
  }
});
