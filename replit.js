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
waitForElement('[data-cy="header-repl-title"]', (element) => {
  const projectName = element.textContent;
});

waitForElement('.node.active', (element) => {
  //Get current editor and language
  const fileList = document.querySelector('.root-node');
  let currentFile = document.querySelector('.node.active');
  let currentEditor = null;
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
});
