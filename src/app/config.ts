

/**
 * 定义网站url根路由
 * @type {string}
 */
export const ROOT_URL = getUrl();


/**
 * 获取查询参数，用以区别不同的文档
 * @type {string}
 */
export const TYPE = getType();

//获取网站url根路径
function getUrl() {
  return window.location.protocol + "//" + window.location.host;//例：http://localhost:4200
}

//获取查询参数
function getType() {
  //获取查询参数
  let search = window.location.search;//例：  ?type=admin
  search = search.substr(search.indexOf("=")+1,search.length);
  return search;
}
