import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router} from "@angular/router";
import { NzMessageService} from 'ng-zorro-antd';
import {HttpService,uploadurl,imgUrl} from "../../service/http/http.service";
import { DomSanitizer } from '@angular/platform-browser';
import { FileUploader } from 'ng2-file-upload';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
@Component({
  selector: 'app-editmodel',
  templateUrl: './editmodel.component.html',
  styleUrls: ['./editmodel.component.less']
})
export class EditmodelComponent implements OnInit {
  id:string;
  title:string;
  describe:string;
  num:string;
  brandid:string;
  colors:string;
  status:string='1';
  parmlen:number;
  validateForm: FormGroup;
  pagename:string;
  versionid:number=0;
  secondaryFaultList:any;
  secondaryFL:string;
  faultid:string;
  faultpid:string;
  ftitle:string;
  cost:string;
  price:string;
  fee:string;
  constructor(
  	public router:ActivatedRoute,
  	private msg: NzMessageService,
  	private httpl:HttpService,
  	private fb: FormBuilder,
  	public rou:Router,
    private sanitizer: DomSanitizer) {
	  this.router.queryParams.subscribe(Params=>{
	  	  this.parmlen=Object.keys(Params).length;
        this.id=Params['id'];
        this.brandid=Params['brandid'];
        });
  	}
  ngOnInit() {
  	  this.httpl.httpmenderget("repairmanagemnet/getfaultinfo/"+this.versionid)
      .subscribe(data=>{
      	console.log(data);
      	if(data.result == '0000'){
				  this.secondaryFaultList=data.data.SecondaryFaultList;
      	}else{
      		this.msg.error(data.msg);
      	}
      });
  	if(this.parmlen==2){
  		this.pagename='编辑';
  	 /*获取配件分类详情*/
     this.httpl.httpmenderget("repairmanagemnet/versiondetail/"+this.id)
      .subscribe(data=>{
      	console.log(data);
      	if(data.result == '0000'){
						this.title=data.data.title;
						this.describe=data.data.describe;
						this.num=data.data.num;
						this.colors=data.data.colors;
						this.img=this.imgUrl+data.data.img;
						this.status=data.data.status.toString();
      	}else{
      		this.msg.error(data.msg);
      	}
      });
  	}else{
  		this.pagename='新增';
  	}
      
       /*表单验证设置*/
    this.validateForm = this.fb.group({
      title: [ this.title, [ Validators.required ] ],
      describe:[this.describe, [ Validators.required ]],
      num: [ this.num, [ Validators.required ] ],
      status:[this.status,[ Validators.required ]],
      colors:[this.colors],
      secondaryFL:[this.secondaryFL],
      mkey:[this.mkey],
     });
  }
  
    /*提交表单*/
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    }
    if (this.validateForm.invalid) return;
    if(this.parmlen==2){
    /*编辑*/
	  this.httpl.httpmender("repairmanagemnet/updateversion",{"describe":this.describe,"id": this.id,"num":this.num,"status":this.status,"title":this.title,"img":this.mkey,"colors":this.colors,"brandid":this.brandid,"list":JSON.parse(this.secondaryFL)})
      .subscribe(data=>{
      	if(data.result == "0000"){
					this.msg.success('修改成功!');
					this.rou.navigateByUrl("home/model");
      	}else{
      		this.msg.error(data.msg);
      	}
      });
    }else{   	
    /*新增*/
	  this.httpl.httpmender("repairmanagemnet/addversion",{"describe":this.describe,"num":this.num,"status":this.status,"title":this.title,"img":this.mkey,"colors":this.colors,"brandid":this.brandid,"list":JSON.parse(this.secondaryFL)})
      .subscribe(data=>{
      	if(data.result == "0000"){
					this.msg.success('新增成功!');
					this.rou.navigateByUrl("home/model");
      	}else{
      		this.msg.error(data.msg);
      	}
      });
    }
  }


  /*图片上传*/
  img:any;//图片
  uploadurl:string=uploadurl; 
  imgUrl:string=imgUrl;
  fileList; //附件
	mkey:string='';//上成功后返回数据
	picturesc:boolean=false;//上传按钮
	public uploadFileZQ(event){ 
	this.fileList = event.target.files; 
	this.img=this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(this.fileList[0]));
	this.picturesc=true;
	}
	
	uploader:FileUploader = new FileUploader({
    url: this.uploadurl+ "attachment/upload",
    method: "POST",
    itemAlias: "file",
    autoUpload: false,
    removeAfterUpload:true
  });
  
    uploadFile() {// 上传
    let self=this;//为闭包函数重新指定this
    this.uploader.queue[0].onSuccess = function (response, status, headers) {
      // 上传文件成功
      if (status == 200) {
        // 上传文件后获取服务器返回的数据
        self.picturesc=false;
        let tempRes = JSON.parse(response);
        self.mkey=tempRes.data;
        self.msg.success("文件上传成功！");
      } else {
        self.msg.error("文件上传失败！");
        // 上传文件后获取服务器返回的数据错误
      }
    };
    this.uploader.queue[0].upload(); // 开始上传
  }
  
  changeFile(){
  	this.picturesc=false;
  	this.img='';
  }
}
