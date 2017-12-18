export class BarChartData {
    gastos:any;
    categoryNamesAndGastosTotales:[{categoria:any,gastos:number,color:any}]=[{categoria:"",gastos:0,color:""}];
    constructor(gastos?: any) {
      this.gastos=gastos.rawResponse;
      this.createCatecategoryNamesAndGastosTotales(this.gastos);
    }


    createCatecategoryNamesAndGastosTotales(gastos){
        let categorias = this.createCategoryGroups(gastos);
        let gastosAux =  this.totalGastosByCategory(categorias,gastos);
    }



    createCategoryGroups(gastos){
      let categorias=[];
      let categoryNames=[];

      for(let gasto of gastos){
       categorias.push(gasto.categoria);
      }

      for(let categoria of categorias){
        if(!(categoryNames.indexOf(categoria.categoria) > -1)){
          categoryNames.push(categoria.categoria);
        }
      }
      return categoryNames;
    }


    totalGastosByCategory(categorias,gastos){
      this.categoryNamesAndGastosTotales.pop();
      for(let categoria of categorias){
        let catGast = {
          categoria:categoria,
          gastos:this.findGastoTotal(categoria,gastos),
          color:this.dynamicColors()
        }
        this.categoryNamesAndGastosTotales.push(catGast);
      }
    }

    findGastoTotal(categoria,gastos){
      let _gasto=0;
      for(let gasto of gastos){
        if(gasto.categoria.categoria==categoria){
          _gasto=_gasto+gasto.monto;
        }
      }
      return _gasto;
    }
  
    dynamicColors (){
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      let color ="rgb(" + r + "," + g + "," + b + ")" ;
      return color;
    }
  }
  