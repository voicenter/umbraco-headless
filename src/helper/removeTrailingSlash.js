export default function removeTrailingSlash(url) {
    let path = url;
    const reQuery = /[?&]+/;
    const urlArray = (url).split(reQuery);
    const location = urlArray[0];

    if (location[location.length - 1] === '/' && location !== '/') {
        // remove slashes
        path = location.slice(0, location.length - 1);
    }

    return path;
}