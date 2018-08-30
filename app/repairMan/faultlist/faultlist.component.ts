import { Component, OnInit } from '@angular/core';
import {HttpService} from "../../service/http/http.service";
import {Router} from '@angular/router';
import {CookieService} from "ngx-cookie-service";
import { NzMessageService} from 'ng-zorro-antd';
import 'ztree';
import 'jquery'
declare var $: any;
@Component({
  selector: 'app-faultlist',
  templateUrl: './faultlist.component.html',
  styleUrls: ['./faultlist.component.less']
})
export class FaultlistComponent implements OnInit {
  pageIndex = 1;
  pageSize = 10;
  total = 1;
  dataSet = [];
  loading = true;
  pid:string='1';
  title:string;
  status:string;
  tree:any;
  constructor(public http:HttpService,public router:Router,public cookieservice:CookieService,public message:NzMessageService) {
  }
  searchData(): void {
    this.loading = true;
     this.http.httpmender("repairmanagemnet/faultlist",{"currentPage":this.pageIndex,"id":this.pid,"pageSize":this.pageSize,"title":this.title,"status":this.status},this.cookieservice.get("token"))
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
  add(){//新增门店
  	this.router.navigateByUrl("home/editfault");
  }
  EditRow(item:any):void{//编辑门店
  	console.log(item);
	  this.router.navigate(["home/editfault"],{queryParams:{'id':item}});
  }
  deleteRow(item:string):void{//删除门店
  	 this.http.httpmenderdel("repairmanagemnet/deletefault/"+item,this.cookieservice.get("token"))
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
  
  setting = {
    data: {
      simpleData: {
        enable: true,
				idKey: "id",
				pIdKey: "pid",
				rootPId: 0
      }
    },
    callback: {
		onClick:(event:any,treeId:any,treeNode:any)=>{
		  this.pid=treeNode.id;
		  this.pageIndex = 1;
		  this.searchData();
		}
	  }
  };

  
  ngOnInit(): void {
    this.searchData();
     this.http.httpmenderget("repairmanagemnet/faulttreelist/",this.cookieservice.get("token"))
      .subscribe(data=>{
      	console.log(data);
      	if(data.result == "0000"){
          this.tree=data.data;
          console.log(this);
          $.fn.zTree.init($("#ztree"), this.setting, this.tree);
      	}else{
      		this.message.error(data.msg);
      	}
      });
  }

}
