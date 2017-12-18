import { GenericResponse } from './../../models/genericResponse';
import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response,URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ApiProvider {
  baseUrl:string;
  constructor(public http: Http) {
    this.baseUrl="https://smtm-server-side.herokuapp.com/api/";
    
    // this.baseUrl="http://localhost:8080/api/";  

  }

  public getCategorias(tokenId){
     
     var headers = new Headers();
     headers.append('Content-Type', 'application/json');
     headers.append('Accept', 'application/json');
     headers.append('Authorization','Bearer '+tokenId);
     //headers.append("Access-Control-Allow-Origin", "*");
 
     let options = new RequestOptions({ headers: headers ,withCredentials: true });
     
     return this.http.get(this.baseUrl+'smtm/getCategorias',options).map((response: Response) => {
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


  public findGrupos(tokenId,grupo){
    
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization','Bearer '+tokenId);
    //headers.append("Access-Control-Allow-Origin", "*");
    let options = new RequestOptions({ headers: headers ,withCredentials: true });
    
    return this.http.get(this.baseUrl+'smtm/findGruposByNameLike/'+grupo,options).map((response: Response) => {
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

 createGroup(tokenId,grupo){
  var headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Authorization','Bearer '+tokenId);
  //headers.append("Access-Control-Allow-Origin", "*");
  let options = new RequestOptions({ headers: headers ,withCredentials: true });
  
  let body = {nombre:grupo}
  return this.http.post(this.baseUrl+'smtm/createGroupForUser',JSON.stringify(body),options).map((response: Response) => {
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


updateGroup(token ,grupo){
  var headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Authorization','Bearer '+token);
  //headers.append("Access-Control-Allow-Origin", "*");
  let options = new RequestOptions({ headers: headers ,withCredentials: true });
  
  let body = {id:grupo.id,nombre:grupo.nombre};
  return this.http.put(this.baseUrl+'smtm/updateGroupWithUser',JSON.stringify(body),options).map((response: Response) => {
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


agregarGasto(tokenId,gasto){
  var headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Authorization','Bearer '+tokenId);
  //headers.append("Access-Control-Allow-Origin", "*");
  let options = new RequestOptions({ headers: headers ,withCredentials: true });
  
  return this.http.post(this.baseUrl+'smtm/addGasto',JSON.stringify(gasto),options).map((response: Response) => {
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

public findGastosByGruposByPeriod(tokenId,startDate,endDate){
  
  var headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Authorization','Bearer '+tokenId);
  //headers.append("Access-Control-Allow-Origin", "*");
  let p = new URLSearchParams();
  p.set('startDate', startDate);
  p.set('endDate',endDate);
  let options = new RequestOptions({ headers: headers ,withCredentials: true,search:p});
  //options.search =p;


  return this.http.get(this.baseUrl+'smtm/getAllGastosByGrupoIdAndDatesBetween',options).map((response: Response) => {
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





}
