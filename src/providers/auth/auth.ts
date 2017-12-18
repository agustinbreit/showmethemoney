import { GenericResponse } from './../../models/genericResponse';
import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams, Response,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
@Injectable()
export class AuthProvider {
  user:any;
  //constructor(public afAuth: AngularFireAuth,http: ) {}
  baseUrl:string;
  constructor(public http: Http) {
    this.baseUrl="https://smtm-server-side.herokuapp.com/api/";
    
    // this.baseUrl="http://localhost:8080/api/"; 
  }
  // loginUser(newEmail: string, newPassword: string): firebase.Promise<any> {
  //   return this.afAuth.auth.signInWithEmailAndPassword(newEmail, newPassword);
  // }

 
  getLoggedUserData(){
   return this.user;
  }
  setLoggedUserData(user:any){
    this.user=user;
   }

   public loginUser(user: string, newPassword: string){
    //return this.afAuth.auth.signInWithEmailAndPassword(newEmail, newPassword);
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append("Access-Control-Allow-Origin", "*");
    let options = new RequestOptions({ headers: headers ,withCredentials: true });
    
    let body = {username:user,password:newPassword,rememberMe:true}
    return this.http.post(this.baseUrl+'authenticate',JSON.stringify(body),options).map((response: Response) => {
      var rta = response.json();
      return (<any>rta);
    }).toPromise().then(function(res) {
    let genericResponse=new GenericResponse(res);
          genericResponse.isOk=true;
    return genericResponse;
    }).catch(function(err) {
      let genericResponse=new GenericResponse();
          genericResponse.isOk=err.ok;
          genericResponse.status=err.status;
          genericResponse.statusText=err.statusText;
          
      return genericResponse;
    });
  }


  public registerUser(user: string, email:string,password: string){
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append("Access-Control-Allow-Origin", "*");
    let options = new RequestOptions({ headers: headers ,withCredentials: true });
    
    let body = {login:user,password:password,email:email,langKey:'es'}
    return this.http.post(this.baseUrl+'register',JSON.stringify(body),options).map((response: Response) => {
      return (<any>response);
    }).toPromise().then((res) =>{
    return this.loginUser(user,password);
    }).catch(function(err) {
      let genericResponse=new GenericResponse();
          genericResponse.isOk=err.ok;
          genericResponse.status=err.status;
          genericResponse.statusText=err.statusText;
      return genericResponse;
    });
  }

}
