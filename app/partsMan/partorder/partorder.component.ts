import { Component, OnInit } from '@angular/core';
import {HttpService} from "../../service/http/http.service";
import {Router} from '@angular/router';
import {CookieService} from "ngx-cookie-service";
import {NzMessageService} from 'ng-zorro-antd';
@Component({
  selector: 'app-partorder',
  templateUrl: './partorder.component.html',
  styleUrls: ['./partorder.component.less']
})
export class PartorderComponent implements OnInit {
  pageIndex = 1;
  pageSize = 10;
  total = 1;
  dataSet = [];
  loading = true;
  status:string;
	orderno:string;
	worker:string;
	shopname:string;
	courier:string;
//订单状态:(status)[0未生效 1待处理 2已发货 3待收货 4已完成 5退单 ]
  constructor(public http:HttpService,public router:Router,public cookieservice:CookieService,public message:NzMessageService) {
  }

  searchData(): void {
    this.loading = true;
     this.http.httpmender("partsmanagemnet/partsorderlist",{"currentPage":this.pageIndex,"pageSize":this.pageSize,"orderno":this.orderno,"worker":this.worker,"shopname":this.shopname,"courier":this.courier,"status":this.status},this.cookieservice.get("token"))
      .subscribe(data=>{
      	console.log(data);
      	if(data.result == "0000"){
        this.dataSet=data.data.list;
        this.loading = false;
        this.total = data.data.totalResult;
      	}else{
      	  this.message.error(data.msg);
      	}
      });
  }
  search(){
  	 this.pageIndex = 1;
  	 this.searchData();
  }
  EditRow(item:any):void{//编辑配件
	  this.router.navigate(["home/editpartorder"],{queryParams:{'orderno':item}});
  }
  deleteRow(item:string):void{//删除配件
  	 this.http.httpmenderdel("partsmanagemnet/deletepartsinfo/"+item,this.cookieservice.get("token"))
      .subscribe(data=>{
      	console.log(data);
      	if(data.result == "0000"){
					this.message.success(data.msg);
					this.searchData();
      	}else{
      		this.message.error(data.msg);
      	}
      });
  }
  
  ngOnInit(): void {
    this.searchData();
  }
  
}
