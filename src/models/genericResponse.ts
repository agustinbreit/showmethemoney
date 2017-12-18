export class GenericResponse {
    status:number;
    isOk:boolean;
    statusText:string;  
    responseBody:any=[];
    rawResponse:any;
    constructor(fields?: any) {
      // Quick and dirty extend/assign fields to this model
      this.rawResponse=fields;
      for (let f in fields) {
        this.responseBody.push(fields[f]);
      }
    }
  
  }
  