export const loadJs = (url) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = url
    script.type = 'text/javascript'
    document.body.appendChild(script)
    script.onload = () => {
      resolve()
    }
  }) 
}

export const loadCss = (url) => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = url
    document.head.appendChild(link)
    link.onload = () => {
      resolve()
    }
  })
}

export const generateUUID = () => {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x7|0x8)).toString(16);
  });
  return uuid;
}

export const regEn = /[`~!@#$%^&*()+<>?:"{},=\\.\/;'[\]]/im
export const regCn = /[·！#￥（——）：；“”‘、。，|《》？、 【】[\]]/im

/**
 * 文件名特殊字符校验
 * @param name
 * @returns {boolean}
 */
export function checkFileName(name){
    const regEn = /[`~!@#$%^&*()+<>?:"{},=\\.\/;'[\]]/im,
        regCn = /[·！#￥（——）：；“”‘、。，|《》？、 【】[\]]/im;
    console.log(name)
    var list = name.split('.');
    if (list.length>2){
        return false;
    } else {
        if (regEn.test(list[0]) || regCn.test(list[0])) {
            return false;
        }
    }
    return true;
}