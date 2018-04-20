import {Component, OnInit} from '@angular/core';
import {ROOT_URL, TYPE} from '../../config';
import {HttpService} from '../../http-service.service';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  isVisible = false;//加载中弹窗是否显示
  show = false;//显示文档

  apiInfo: any; // 文档基本信息
  apiModules: any; // 功能模块信息列表
  apiModule: any; // 某个功能模块信息

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
  ERROR_MSG: any = '请求地址错误,服务器无响应或JavaScript跨域错误';

  /**
   * 清空缓存
   */
  private clearCache() {
    this.isVisible = true;
    this.method = null;
    this.mapingUrl = null;
    this.apiUrl = null;
    this.showRequestParams = true;
    this.buildeReqParams = null;
    this.buildRespParams = null;
    this.demoReqParams = null;
    this.demoUrl = null;
    this.demoRespParams = null;
    this.showDemoRespParams = null;
  }


  constructor(private http: HttpService,
              private  messageService: NzMessageService) {
  }

  ngOnInit() {
    scroll(0, 0);
    this.getData();
  }

  getData() {
    this.isVisible = true;
    this.http.get('/apidoc/api/' + TYPE).subscribe(
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
    console.log('/apidoc/detail?methodUUID=' + moduleItem.methoduuid);
    this.http.get('/apidoc/detail?methodUUID=' + moduleItem.methoduuid).subscribe(
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

// 展示某个功能详情
  showApiDetail(rootMapping, module) {
    console.log(JSON.stringify(module));

    this.apiModule = module;
    if (!this.apiModule.reqParams) {
      this.apiModule.reqParams = {type: 'url'};//默认为url
    }
    this.method = module.method;
    this.apiUrl = "/" + rootMapping + this.apiModule.mapping;


    //组装请求参数 和 响应参数
    this.buildRequestParams(module);
  }

  //构建请求参数
  buildRequestParams(module) {
    const type = module.reqParams.type;//请求类型
    const reqparams = module.reqParams.params;//请求参数
    const respparams = module.respParams.params;//请求参数

    //判断请求类型
    if (type === 'url') {
      if (this.apiModule && this.apiModule.reqParams && this.apiModule.reqParams.params &&
        this.apiModule.reqParams.params.length > 0) {
        this.mapingUrl = ROOT_URL + this.apiUrl + '/这里写你的参数';
      }else {
        this.mapingUrl = ROOT_URL + this.apiUrl;
      }
      this.showRequestParams = false;
    } else if (type === 'json') {
      this.mapingUrl = ROOT_URL + this.apiUrl;
    }
    this.buildeReqParams = this.fromtJSON(this.bulidParams(reqparams, {}));
    this.buildRespParams = this.fromtJSON(this.bulidParams(respparams, {}));

    this.demoReqParams = JSON.parse(JSON.stringify(this.buildeReqParams));//得到一个拷贝，给演示功能用 目的：隔段双向绑定
    this.demoUrl = JSON.parse(JSON.stringify(this.mapingUrl));//得到一个拷贝
  }

  //构建参数
  private bulidParams(params, result): any {
    if (params) {
      for (const value of params) {
        if (value.list && value.list.length > 0) {

          if(value.dataType==="object"){//对象
            result[value.name] = {};
            this.bulidParams(value.list, result[value.name]);
          }

          if(value.dataType==="array"){//数组
            result[value.name] = [{}];
            this.bulidParams(value.list, result[value.name][0]);
          }

        } else {
          result[value.name] = value.defaultValue;
        }
      }
    }
    return result;
  }

  //发送测试方法
  sendTest() {
    this.isVisible = true;
    console.log('请求方式', this.method);
    console.log('请求地址', this.demoUrl);

    switch (this.method) {
      case 'get':
        this.http.get(this.demoUrl).subscribe(data => this.success(data), error => this.error(error));
        break;
      case 'post':
        this.http.post(this.apiUrl, JSON.parse(this.demoReqParams)).subscribe(data => this.success(data), error => this.error(error));
        break;
      case 'put':
        this.http.put(this.apiUrl, this.demoReqParams).subscribe(data => this.success(data), error => this.error(error));
        break;
      case 'delete':
        this.http.delete(this.apiUrl).subscribe(data => this.success(data), error => this.error(error));
        break;
    }

  }

  /**
   * 请求成功调用方法
   * @param data 响应数据
   */
  private success(data) {
    this.isVisible = false;
    this.demoRespParams = this.fromtJSON(data);
    this.showDemoRespParams = true;
  }

  /**
   * 请求失败调用方法
   * @param error
   */
  private error(error) {
    this.isVisible = false;
    console.log(error);
    this.demoRespParams = this.ERROR_MSG + "   " + JSON.stringify(error);
  }

  //格式化json数据
  private fromtJSON(josn): any {
    return JSON.stringify(josn, null, 2);
  }


}
