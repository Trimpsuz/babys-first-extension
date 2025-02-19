function waitForElement(selector, callback) {
  const targetElement = document.querySelector(selector);

  if (targetElement) {
    callback(targetElement);
  } else {
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        callback(element);
      }
    });

    observer.observe(document, { childList: true, subtree: true });
  }
}

//Get project name
waitForElement('[data-cy="header-repl-title"]', () => {
  function heartbeat(language) {
    browser.storage.local.get('authCode').then((item) => {
      const authCode = item.authCode;
      const data = {
        project_name: document.querySelector('[data-cy="header-repl-title"]').textContent,
        language,
        editor_name: 'Replit',
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

  waitForElement('.node.active', () => {
    //Get current editor and language
    const fileList = document.querySelector('.root-node');
    let currentFile = document.querySelector('.node.active');
    let currentEditor = null;
    let currentEditorContent = '';
    let hasMouseMoved = false;
    document.querySelector(`[data-cy="workspace-cm-editor-${currentFile.textContent}"]`).childNodes[0].childNodes[0].childNodes.forEach((node) => {
      if (node.classList.contains('cm-scroller')) {
        node.childNodes.forEach((node) => {
          if (node.classList.contains('cm-content')) {
            currentEditor = node;
          }
        });
      }
    });
    let currentLanguage = currentEditor.getAttribute('data-language') ? currentEditor.getAttribute('data-language') : '';

    function handleMutations(mutationsList, observer) {
      currentFile = document.querySelector('.node.active');

      document.querySelector(`[data-cy="workspace-cm-editor-${currentFile.textContent}"]`).childNodes[0].childNodes[0].childNodes.forEach((node) => {
        if (node.classList.contains('cm-scroller')) {
          node.childNodes.forEach((node) => {
            if (node.classList.contains('cm-content')) {
              currentEditor = node;
            }
          });
        }
      });

      currentLanguage = currentEditor.getAttribute('data-language') ? currentEditor.getAttribute('data-language') : '';
    }

    const observer = new MutationObserver(handleMutations);

    observer.observe(fileList, { childList: true, subtree: true, attributes: true });

    function handleFirstAction() {
      document.removeEventListener('click', handleFirstAction);
      heartbeat(currentLanguage);

      //Check if mouse moves
      document.addEventListener('mousemove', () => {
        hasMouseMoved = true;
      });

      //Send heartbeat every 30 seconds after first action
      setInterval(() => {
        if (!document.hidden && (currentEditor.textContent != currentEditorContent || hasMouseMoved)) {
          currentEditorContent = currentEditor.textContent;

          heartbeat(currentLanguage);
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
  });
});
