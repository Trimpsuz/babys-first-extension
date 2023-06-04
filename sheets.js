document.body.style.border = '5px solid red';

const projectName = document.title.replace(' - Google Sheets', '');

console.log(projectName);

browser.storage.local.get('authCode').then((item) => {
  console.log(item.authCode);
});
