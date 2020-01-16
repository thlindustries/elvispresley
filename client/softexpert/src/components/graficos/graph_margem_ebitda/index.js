
// //API ---->   https://financialmodelingprep.com/api/v3/financials/income-statement/{{SIMBOLO DA EMPRESA}}
//-----------------------------------------------------------------------------------------------------
import React, { Component } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Grid from '@material-ui/core/Grid';

//Comunicação com a API
import axios from 'axios';

//variaveis para manipular o grafico
const data_API=[];
let page_init = 0;
let lista_margem_ebitda=[];
let simbolo;

//função para criar o array object (data_API) com as informações da API
function createData(EBITDAMargin) {
  return { EBITDAMargin};
}

//função que remove os espaços das Keys do JSON retornado pela API
function replaceKeys(object) {
  Object.keys(object).forEach(function (key) {
      var newKey = key.replace(/\s+/g, '');
      if (object[key] && typeof object[key] === 'object') {
          replaceKeys(object[key]);
      }
      if (key !== newKey) {
          object[newKey] = object[key];
          delete object[key];
      }
  });
}

export default class GraphMargemEbitda extends Component {
  constructor(props) {
    
    simbolo=props.simbolo[0];
    // console.log(simbolo);

    super(props);
    this.state={
      dados_empresa:[]
    }
    //Chamando a API via Axios
    axios.get('https://financialmodelingprep.com/api/v3/financials/income-statement/'+simbolo).then(resultado=>{
      this.setState({
        dados_empresa:resultado.data,

        //Criando uma variável Series e salvando no state da página 
        series: [
          {
            name:'Margem EBITDA '+simbolo,
            data:lista_margem_ebitda
            // data:[5,4,3,2,1]
          },
        ]
      })
    })
  }

  render() {
    let data=this.state.dados_empresa.financials;

    //Condição para evitar que a página carregue as informações mais de uma vez e duplique os dados no array data_API
    if(data!==undefined && page_init===0){
      
      replaceKeys(data)
      data.map(function(item,i){
        data_API.push(createData(data[i].EBITDAMargin,))
      })
      page_init++;

      data_API.map(function(item,i){
        lista_margem_ebitda.push(parseFloat(data_API[i].EBITDAMargin))
      })
      // console.log(data)
    }
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div>
            <HighchartsReact 
              highcharts={Highcharts}
              options={{
                title: {
                  text: 'Margem EBITDA da empresa '+simbolo,
                },
                series:this.state.series,
                legend: {
                  layout: 'vertical',
                  align: 'right',
                  verticalAlign: 'middle'
                },
                responsive: {
                  rules: [{
                    condition: {
                      maxWidth: 500
                    },
                    chartOptions: {
                      legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                      }
                    }
                  }]
                },
                yAxis: {
                  title: {
                    text: 'Valores'
                  }
                },
                xAxis: {
                  accessibility: {
                    rangeDescription: [2010,2011,2012]
                  }
                }
              }}
            />
          </div>
        </Grid>
      </Grid>
    );
  }
}
