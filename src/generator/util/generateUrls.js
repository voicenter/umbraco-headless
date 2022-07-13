export default function generateUrls(data) {
  const root = '$'

  eachRecursive(data.SiteData, root, (obj, path) => {
    const urlIndex = data.urlList.findIndex(url => {
      return url.Jpath === path
    })

    if (urlIndex !== -1) {
      obj['url'] = data.urlList[urlIndex].url
    }
  })

  function eachRecursive(obj, path, fn) {
    if (Object.keys(obj).length !== 0 && obj.constructor === Object) {
      // If children (typeof object)
      if (obj.children && Object.keys(obj.children).length !== 0 && obj.children.constructor === Object) {
        Object.keys(obj.children).forEach(key => {
          const child = obj.children[key]
          const newPath = path + '.children.' + key

          if (Number(child.hidePage) === 0) fn(child, newPath)

          eachRecursive(child, newPath, fn)
        })
      } else {
        // Loop through arrays keys
        Object.keys(obj).forEach(key => {
          recursiveArray(obj, key)
        })

        function recursiveArray(obj, key) {
          if (Array.isArray(obj[key]) && obj[key].length) {
            obj[key].forEach(arrEl => {
              if (arrEl.ID !== undefined && Number(arrEl.hidePage) === 0 && arrEl.url === undefined) {
                arrEl.url = data.urlList.find(url => url.nodeID === arrEl.ID).url
              }

              Object.keys(arrEl).forEach(key => {
                recursiveArray(arrEl, key)
              })
            })
          }
        }
      }
    }
  }

  return data
}
