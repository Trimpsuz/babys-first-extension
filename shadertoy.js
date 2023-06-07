let editorChanged = false;

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      editorChanged = true;
    }
  });
});

observer.observe(document.querySelector('.CodeMirror-code'), { childList: true, subtree: true });
