import {Component, OnInit} from '@angular/core';
import {ROOT_URL, TYPE} from '../../config';
import {HttpService} from '../../http-service.service';
import {NzMessageService} from 'ng-zorro-antd';

/**
 * 首先声明：该前端代码用了最新的angular版本，语法是最新的
 * 但是： 细节处理和算法上非常粗糙，哈哈哈，时间有限，公司急着用，先实现再说吧，后期优化
 * 如果你看到某个算法，觉得傻逼，没事，本来应该写一天的功能，我20分钟就实现了，理解下下。  /偷笑  :)
 *
 */
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  URL = ROOT_URL + "/";
  isVisible = false;//加载中弹窗是否显示
  show = false;//显示文档

  apiInfo: any; // 文档基本信息
  apiModules: any; // 功能模块信息列表
  apiModule: any; // 某个功能模块信息
  paramType;//请求参数类型

  //示例功能--------构建的数据
  method: any; // 请求方法
  mapingUrl: string;  // 接口地址
  apiUrl: string; //请求地址
  showRequestParams = true;//是否显示请求参数

  buildeReqParams; //构建的请求参数
  buildRespParams; //构建的响应数据

  //演示功能-------请求得到的数据
  demoReqParams;//请求参数
  demoUrl;//请求url
  demoRespParams: any;//请求后得到的数据
  showDemoRespParams = false;//是否显示响应数据
  ERROR_MSG = '发送错误或异常：造成错误的原因可能是 请求地址错误,服务器无响应或JavaScript跨域错误，具体如下：';
  file;
  showBlob = false;//是否显示数据流
  blobUrl;


  //上传文件


  constructor(private http: HttpService,
              private  messageService: NzMessageService) {
    this.URL = ROOT_URL + "/";
  }

  ngOnInit() {
    scroll(0, 0);
    this.getData();
  }

  getData() {
    this.isVisible = true;
    this.http.get(this.URL + '/apidoc/api/' + TYPE).subscribe(
      data => {
        this.isVisible = false;
        if (data && data["info"]) {
          this.apiInfo = data['info'];
          this.apiModules = data['models'];
        } else {
          this.show = true;
        }
      },
      error => {
        console.error(error);
        this.isVisible = false;
        this.messageService.error('初始化数据加载失败');
      }
    );
  }

  //获取功能详情
  getApiDetail(rootMapping, moduleItem) {
    //清空缓存
    this.clearCache();
    console.log(this.URL + '/apidoc/detail?methodUUID=' + moduleItem.methoduuid);
    this.http.get(this.URL + '/apidoc/detail?methodUUID=' + moduleItem.methoduuid).subscribe(
      data => {
        this.isVisible = false;
        this.showApiDetail(rootMapping, data);
      },
      error => {
        this.isVisible = false;
        console.error(error);
        this.messageService.error('获取功能详情失败');
      }
    );

  }

  /**
   * 清空缓存
   */
  private clearCache() {
    this.isVisible = true;
    this.method = null;
    this.mapingUrl = "/";
    this.apiUrl = null;
    this.showRequestParams = true;
    this.buildeReqParams = null;
    this.buildRespParams = null;
    this.demoReqParams = null;
    this.demoUrl = null;
    this.demoRespParams = null;
    this.showDemoRespParams = null;
    this.paramType = null;
  }

// 展示某个功能详情
  showApiDetail(rootMapping, module) {
    console.log(JSON.stringify(module));
    //默认描述为 功能名称
    if (!module.description && module.name) {
      module.description = module.name;
    }
    this.apiModule = module;
    if (!this.apiModule.reqParams) {
      this.apiModule.reqParams = {type: 'url'};//默认为url
    }
    if (!this.apiModule.reqParams.params || this.apiModule.reqParams.params.length <= 0) {
      this.showRequestParams = false;
    }
    this.method = module.method;
    this.paramType = this.apiModule.reqParams.type;
    this.apiUrl = rootMapping + this.apiModule.mapping;


    //组装请求参数 和 响应参数
    this.buildRequestParams(module);
  }

  //构建请求参数
  buildRequestParams(module) {
    const type = module.reqParams.type;//请求类型
    if (!module.reqParams || !module.respParams) {
      return;
    }
    const reqparams = module.reqParams.params;//请求参数
    const respparams = module.respParams.params;//请求参数

    //判断请求类型
    if (type === 'url') {
      if (this.apiModule && this.apiModule.reqParams && this.apiModule.reqParams.params &&
        this.apiModule.reqParams.params.length > 0) {
        //拼接参数 以/隔开
        let url = this.apiUrl;
        for (const param of  this.apiModule.reqParams.params) {
          // console.log(url);
          param.description = param.description ? param.description : '参数';
          url = url + "/" + param.description;
        }
        this.mapingUrl = url;
      } else {
        this.mapingUrl = this.apiUrl;
      }
    } else if (type === 'url_param') {
      if (this.apiModule && this.apiModule.reqParams && this.apiModule.reqParams.params &&
        this.apiModule.reqParams.params.length > 0) {
        //拼接参数 以?隔开
        let url = this.apiUrl;
        let i = 0;
        for (const param of  this.apiModule.reqParams.params) {
          i++;
          console.log(url);
          param.description = param.description ? param.description : '参数';
          if (i === 1) {
            url = url + "?" + param.name + "=" + param.description;
          } else {
            url = url + "&" + param.name + "=" + param.description;
          }
        }
        this.mapingUrl = url;
      } else {
        this.mapingUrl = this.apiUrl;
      }
    } else if (type === 'json') {
      this.mapingUrl = this.apiUrl;
    } else if (type === 'url_blob') {
      this.showBlob = true;
      this.mapingUrl = this.apiUrl;
      this.blobUrl = this.URL + JSON.parse(JSON.stringify(this.mapingUrl));//得到一个拷贝
    } else {
      this.mapingUrl = this.apiUrl;
    }
    this.buildeReqParams = this.fromtJSON(this.bulidParams(reqparams, {}));
    this.buildRespParams = this.fromtJSON(this.bulidParams(respparams, {}));

    this.demoReqParams = JSON.parse(JSON.stringify(this.buildeReqParams));//得到一个拷贝，给演示功能用 目的：隔断双向绑定
    this.demoUrl = this.URL + JSON.parse(JSON.stringify(this.mapingUrl));//得到一个拷贝
    if (type === 'form') {
      console.log(Object.keys(JSON.parse(this.demoReqParams)));
      this.file = Object.keys(JSON.parse(this.demoReqParams))[0];
    }
  }

  //构建参数
  private bulidParams(params, result): any {
    if (params) {
      for (const value of params) {
        if (value.list && value.list.length > 0) {

          //把list递归
          if (value.dataType === "object") {//对象
            result[value.name] = {};
            this.bulidParams(value.list, result[value.name]);
          } else if (value.dataType === "array") {//数组
            result[value.name] = [{}];
            this.bulidParams(value.list, result[value.name][0]);
          }

        } else {
          //构建拼接参数
          if (value.dataType === "array") {
            result[value.name] = [];
          } else {
            result[value.name] = value.description ? value.description : "";//赋值为描述
          }
        }
      }
    }
    return result;
  }

  //发送测试方法
  sendTest() {
    console.log('请求方式', this.method);
    console.log('请求地址', this.demoUrl);
    //刷新图片验证码
    if (this.showBlob) {
      // this.blobUrl = this.blobUrl.substring(0, this.blobUrl.indexOf("?")) + "?" + new Date();
      this.blobUrl = this.blobUrl + "?" + new Date();
      console.log(this.blobUrl);
    }

    switch (this.method) {
      case 'get':
        this.http.get(this.demoUrl).subscribe(data => this.success(data), error => this.error(error));
        break;
      case 'post':
        this.http.post(this.demoUrl, JSON.parse(this.demoReqParams)).subscribe(data => this.success(data), error => this.error(error));
        break;
      case 'put':
        this.http.put(this.demoUrl, JSON.parse(this.demoReqParams)).subscribe(data => this.success(data), error => this.error(error));
        break;
      case 'delete':
        this.http.delete(this.demoUrl).subscribe(data => this.success(data), error => this.error(error));
        break;
    }

  }

  /**
   * 请求成功调用方法
   * @param data 响应数据
   */
  private success(data) {
    this.showDemoRespParams = true;
    console.log(data);
    this.demoRespParams = this.fromtJSON(data);
  }

  /**
   * 请求失败调用方法
   * @param error
   */
  private error(error) {
    this.showDemoRespParams = true;
    console.error(error);
    let msg = "";
    if (error.status) {
      msg = msg + "状态码：" + error.status + "\n";
    }
    if (error.url) {
      msg = msg + "请求路径：" + error.url + "\n";
    }
    if (error.message) {
      msg = msg + "提示信息：" + error.message + "\n";
    }
    this.demoRespParams = msg + "\n\n" + this.ERROR_MSG + "\n\n" + this.fromtJSON(error);
  }

  //格式化json数据
  private fromtJSON(json): any {
    return JSON.stringify(json, null, 2);
  }

  //上传文件
  sendfile($event) {
    this.http.upload(this.apiUrl, $event, this.file).subscribe(data => this.success(data), error => this.error(error));

  }

}
