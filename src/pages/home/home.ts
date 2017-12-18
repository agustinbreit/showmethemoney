import { ListaGastosPage } from './../lista-gastos/lista-gastos';
import { BarChartData } from './../../models/barChartData';
import { ApiProvider } from './../../providers/api/api';
import { GastoPage } from './../gasto/gasto';
import { Storage } from '@ionic/storage';
import { AuthProvider } from './../../providers/auth/auth';
import { Component, ViewChild } from '@angular/core';
import { NavController, MenuController, ModalController, ToastController } from 'ionic-angular';
import { Chart } from 'chart.js';
declare var idbKeyval;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('barCanvas') barCanvas;
  @ViewChild('doughnutCanvas') doughnutCanvas;

  barChart: any;
  doughnutChart: any;
  gastosMensuales:any;
  gastosTotales:any;
  date = new Date();
  firstDay:any;
  lastDay:any;
  token:any;

  constructor(public navCtrl: NavController,private authProvider: AuthProvider,public modalCtrl: ModalController, 
          private menuCtrl:MenuController,private storage:Storage,private api:ApiProvider,private toastCtrl:ToastController) {
    //this.user = this.afAuth.authState;
    this.firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    this.lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
  }
  ionViewWillEnter() {
        idbKeyval.get('uid').then((token)=>{
          this.token=token;
          this.getGastos(); 
        });
 
  }

  getGastos(){
    if(this.token){
      this.api.findGastosByGruposByPeriod(this.token, this.getFormattedDate(this.firstDay),this.getFormattedDate(this.lastDay)).then((res)=>{
        let data = new BarChartData(res);
        this.gastosMensuales=data.gastos;
        this.gastosMensuales.sort(function(a,b) {return (b.id > a.id) ? 1 : ((a.id > b.id) ? -1 : 0);} );
        idbKeyval.set('gastos',this.gastosMensuales);
        setTimeout(()=> {
          this.createBarChart(data);
          this.createDoughnutChart(data);
        }, 50); 
        
      }).catch((e)=>{
        this.presentToast("Ocurrio un error al intentar recuperar los datos del servidor, mostrando desde caché");
        idbKeyval.get('gastos').then((gastos)=>{
          this.gastosMensuales=gastos;
        });
      });
    }
    
  }

  presentToast(mensaje) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
  }


  logout() {
    idbKeyval.remove('uid');
    idbKeyval.remove('userName');
  }
  
  openGastoModal(){
    const profileModal = this.modalCtrl.create(GastoPage);
    profileModal.present();
    profileModal.onDidDismiss(data => {
      this.getGastos();
    });
  }


getFormattedDate(date) {
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return day + '-' + month + '-' + year;
}

createBarChart(data:BarChartData){
  let labels =[];
  let gastos = [];
  let colores = [];
  for(let categoria of data.categoryNamesAndGastosTotales){
    labels.push(categoria.categoria);
    gastos.push(categoria.gastos);
    colores.push(categoria.color);
  } 
  this.barChart = new Chart(this.barCanvas.nativeElement, {
               type: 'bar',
               data: {
                 labels:labels,
                 datasets: [{
                     data: gastos,
                     backgroundColor: colores,
                     borderColor: colores,
                     borderWidth: 1
                 }]
             },
               options: {
                title: {
                  display: false,
                  text: 'Custom Chart Title'
              },
                  scales: {
                       yAxes: [{
                           ticks: {
                               beginAtZero:true
                           }
                       }],
                       xAxes: [{
                            ticks: {
                                fontSize: 5
                            },
                            display: false
                        }]
                  },
                  legend: {
                    display: false
                  }
                }
    
           });
   
}

createDoughnutChart(data){
  let labels =[];
  let gastos = [];
  let colores = [];
  for(let categoria of data.categoryNamesAndGastosTotales){
    labels.push(categoria.categoria);
    gastos.push(categoria.gastos);
    colores.push(categoria.color);
  } 
  this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
    
               type: 'doughnut',
               data: {
                   labels: labels,
                   datasets: [{
                       label: '# of Votes',
                       data:gastos,
                       backgroundColor: colores,
                       hoverBackgroundColor:colores
                   }]
               },
               options: {
                responsive: true,
                maintainAspectRatio: false, 
                legend:{
                  labels: {
                    fontSize: 12
                }
                 }

                }
           });
}

verDetalles(){

  let modal = this.modalCtrl.create(ListaGastosPage,{gastos:this.gastosMensuales});
  modal.present();
  modal.onDidDismiss(data => {
    this.getGastos();
  });
}


}
