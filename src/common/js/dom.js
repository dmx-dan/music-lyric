let elementStyle = document.createElement('div').style
let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    } else {
      return false
    }
  }
})()

export function prefixStlye(style) {
  if (vendor === false) {
    return false
  } else if (vendor === 'standard') {
    return stye
  } else {
    return vendor + style.charAt(0).toUpperCase() + style.substr(1)
  }

}