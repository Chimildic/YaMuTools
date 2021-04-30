document.addEventListener('DOMContentLoaded', onLoadedPage);

function onLoadedPage() {
    manifestData = chrome.runtime.getManifest();
    version.innerText = `${getMessage('ext_current_ver')}: ${manifestData.version}`;
    author.innerText = `${manifestData.author}, ${new Date().getFullYear()}`;
}
