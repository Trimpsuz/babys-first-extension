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
