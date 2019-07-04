/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

$(document).ready(function(event){
    $('#cadvei').hide();
    $('#ideal').hide();
    $('#listveiculo').hide();
    $('#cadastro').hide();
    $('#listgasto').hide();
    $('#camanu').hide();
    $('#listmanu').hide();
});

$(".1").click(function(event){
    event.preventDefault();
    $('#cadvei').show();
});
$(".2").click(function(event){
    event.preventDefault();
    $('#listveiculo').show();
});
$(".3").click(function(event){
    event.preventDefault();
    $('#cadastro').show();
});

$(".4").click(function(event){
    event.preventDefault();
    $('#listgasto').show();
});
$(".5").click(function(event){
    event.preventDefault();
    $('#camanu').show();
});
$(".6").click(function(event){
    event.preventDefault();
    $('#listmanu').show();
});
$(".7").click(function(event){
    event.preventDefault();
    $('#ideal').show();
});

var db = null;
document.addEventListener("deviceready", function(){
    db = window.sqlitePlugin.openDatabase({name: "veiculo.db"});
    db.transaction(function(tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS carro (id integer primary key, marca text, modelo text, ano number, cor text, km text, val number)");
        tx.executeSql("CREATE TABLE IF NOT EXISTS gast (id integer primary key, gasto text, data text, valor number)");
        tx.executeSql("CREATE TABLE IF NOT EXISTS manut (id integer primary key, manu text, km number)");
        veiculo_consulta();
        gasto_consulta();
        manu_consulta();
    }, function(err){
        alert("Um erro ocorreu durante a inicialização do app");
    });
}, false);
function add(){
    var marca = document.getElementById("cadmarca").value;
    var modelo = document.getElementById("cadmodelo").value;
    var ano = document.getElementById("cadano").value;
    var cor = document.getElementById("cadcor").value;
    var km = document.getElementById("cadkm").value;
    var val = document.getElementById("cadval").value;
    if(marca == "") {
        alert("Por favor entre com a Marca do Veículo");
        return;
    }
    if(modelo == ""){
        alert("Por favor entre com o Modelo do Veículo");
        return;
    }
    if(ano == ""){
        alert("Por favor entre com o Ano do Veículo");
        return;
    }
    if(cor == ""){
        alert("Por favor entre com a Cor do Veículo");
        return;
    }
    if(km == ""){
        alert("Por favor entre com a Quilometragem do Veículo");
        return;
    }
    if(val == ""){
        alert("Por favor entre com o Valor do Veículo");
        return;
    }
    db.transaction(function(tx) {
        tx.executeSql("INSERT INTO carro (marca, modelo, ano, cor, km, val) VALUES (?,?,?,?,?,?)", [marca, modelo, ano, cor, km, val], function(tx,res){
            alert("Dados cadastrados com sucesso!");    
        });
    }, function(err){
        alert("Um erro ocorreu durante a inicialização do app");
    });
}
function veiculo_consulta(){
    db.transaction(veiculo_consulta_database, erroDB);
}
function veiculo_consulta_database(tx){
    tx.executeSql('SELECT * FROM carro', [],veiculo_consulta_dados, erroDB);
}
function veiculo_consulta_dados(tx, results){
    $("#veiculo-listagem").empty();
    var len = results.rows.length;
    //alert("Tabela Carro: "+len+" linhas encontradas");
    for (var i=0; i<len; i++){
        $("#veiculo-listagem").append("<tr>"+
        "<td>"+results.rows.item(i).marca+"</td>"+
        "<td>"+results.rows.item(i).modelo+"</td>"+
        "<td>"+results.rows.item(i).ano+"</td>"+
        "<td>"+results.rows.item(i).cor+"</td>"+
        "<td>"+results.rows.item(i).km+"</td>"+
        "<td>"+results.rows.item(i).val+"</td>"+
        "<td><input type='button' class='btn btn-lg btn-danger indigo darken-4' value='X' onclick='veiculo_delete("+results.rows.item(i).id +")'><input type='button' class='btn btn-lg btn-warning indigo darken-4' value='E' onclick='veiculo_edicao_abrir_tela("+results.rows.item(i).id+")'></td>"+ 
        "</tr>"
        );
    }
}
function erroDB(tx, err) {
    alert("Erro ao processar o SQL: "+err);
}
function veiculo_delete(veiculo_id){
    var id_delete = document.querySelector("#veiculo_id_delete").value = veiculo_id;
    db.transaction(function(tx) {
        tx.executeSql('DELETE FROM carro WHERE id ='+ id_delete +'');
        veiculo_consulta();
    }, function(err){
        alert(err.message);
        alert("Um erro ocorreu durante a inicialização do app");
    }
    );
}
function veiculo_edicao_fechar_tela(){
            $("#edvei").hide();
            $("#listveiculo").show();
}
$(document).ready(function(){ 
    $('#edvei').hide();
    });
function veiculo_edicao_abrir_tela(veiculo_id){
        $("#listveiculo").hide();
        $("#edvei").show();
        var id_update = document.querySelector("#veiculo_id_update").value = veiculo_id;
        db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM carro WHERE id = ?", [id_update], function(tx, resultado){
                var marca = resultado.rows.item(0).marca;
                var modelo = resultado.rows.item(0).modelo;
                var ano = resultado.rows.item(0).ano;
                var cor = resultado.rows.item(0).cor;
                var km = resultado.rows.item(0).km;
                var val = resultado.rows.item(0).val;
               // alert("Codigo: "+id_update+" Marca: "+marca);
                document.getElementById("editmarca").value = marca;
                document.getElementById("editmodelo").value = modelo;
                document.getElementById("editano").value = ano;
                document.getElementById("editcor").value = cor;
                document.getElementById("editkm").value = km;
                document.getElementById("editval").value = val;
                
            });
        }, function(err){
            alert(err.message);
            alert("Um erro ocorreu durante a inicialização do app");
        });
}
function veiculo_atualizar(){
    var veiculo_id_novo = document.getElementById("veiculo_id_update").value;
    var veiculo_marca_novo = document.getElementById("editmarca").value;
    var veiculo_modelo_novo = document.getElementById("editmodelo").value;
    var veiculo_ano_novo = document.getElementById("editano").value;
    var veiculo_cor_novo = document.getElementById("editcor").value;
    var veiculo_km_novo = document.getElementById("editkm").value;
    var veiculo_val_novo = document.getElementById("editval").value;
    db.transaction(function(tx) {
        tx.executeSql('UPDATE carro SET marca = "'+veiculo_marca_novo+'", modelo = "'+veiculo_modelo_novo+'", ano = "'+veiculo_ano_novo+'", cor = "'+veiculo_cor_novo+'", km = "'+veiculo_km_novo+'", val = "'+veiculo_val_novo+'" WHERE id = "'+veiculo_id_novo+'" ');
        alert("Dados alterados com sucesso");
        veiculo_edicao_fechar_tela();
        veiculo_consulta();
    }, function(err){
        alert(err.message);
        alert("Um erro ocorreu durante a inicialização do app");
    });
}
    
            
function addgasto(){
    var gasto = document.getElementById("cadgasto").value;
    var data = document.getElementById("caddata").value;
    var val = document.getElementById("cadvalor").value;
    if(gasto == "") {
        alert("Por favor entre com o Gasto do Veículo");
        return;
    }
    if(data == ""){
        alert("Por favor entre com a Data deste Gasto");
        return;
    }
    if(val == ""){
        alert("Por favor entre com o Valor do Gasto");
        return;
    } 
    db.transaction(function(tx) {
        tx.executeSql("INSERT INTO gast (gasto, data, valor) VALUES (?,?,?)", [gasto, data, val], function(tx,res){
            alert("Dados cadastrados com sucesso!");    
        });
    }, function(err){
        alert("Um erro ocorreu durante a inicialização do app");
    });
}
function gasto_consulta(){
    db.transaction(gasto_consulta_database, erroDB);
}
function gasto_consulta_database(tx){
    tx.executeSql('SELECT * FROM gast', [],gasto_consulta_dados, erroDB);
}
function gasto_consulta_dados(tx, results){
    $("#gasto-listagem").empty();
    var len = results.rows.length;
    for (var i=0; i<len; i++){
        $("#gasto-listagem").append("<tr>"+
        "<td>"+results.rows.item(i).gasto+"</td>"+
        "<td>"+results.rows.item(i).data+"</td>"+
        "<td>"+results.rows.item(i).valor+"</td>"+
        "<td><input type='button' class='btn btn-lg btn-danger indigo darken-4' value='X' onclick='gasto_delete("+results.rows.item(i).id +")'><input type='button' class='btn btn-lg btn-warning indigo darken-4' value='E' onclick='gasto_edicao_abrir_tela("+results.rows.item(i).id+")'></td>"+ 
        "</tr>"
        );
    }
}
function erroDB(tx, err) {
    alert("Erro ao processar o SQL: "+err);
}
function gasto_delete(gasto_id){
    var id_delete = document.querySelector("#gasto_id_delete").value = gasto_id;
    db.transaction(function(tx) {
        tx.executeSql('DELETE FROM gast WHERE id ='+ id_delete +'');
        gasto_consulta();
    }, function(err){
        alert(err.message);
        alert("Um erro ocorreu durante a inicialização do app");
    }
    );
}
function gasto_edicao_fechar_tela(){
            $("#edigasto").hide();
            $("#listgasto").show();
}
$(document).ready(function(){ 
    $('#edigasto').hide();
    });
function gasto_edicao_abrir_tela(gasto_id){
        $("#listgasto").hide();
        $("#edigasto").show();
        var id_update = document.querySelector("#gasto_id_update").value = gasto_id;
        db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM gast WHERE id = ?", [id_update], function(tx, resultado){
                var gasto = resultado.rows.item(0).gasto;
                var data = resultado.rows.item(0).data;
                var val = resultado.rows.item(0).valor;
                document.getElementById("editgasto").value = gasto;
                document.getElementById("editdata").value = data;
                document.getElementById("editvalor").value = val;
            });
        }, function(err){
            alert(err.message);
            alert("Um erro ocorreu durante a inicialização do app");
        });
}
function gasto_atualizar(){
    var gasto_id_novo = document.getElementById("gasto_id_update").value;
    var gasto_novo = document.getElementById("editgasto").value;
    var data_novo = document.getElementById("editdata").value;
    var val_novo = document.getElementById("editval").value;
    db.transaction(function(tx) {
        tx.executeSql('UPDATE gast SET gasto = "'+gasto_novo+'", data = "'+data_novo+'", val = "'+val_novo+'" WHERE id = "'+gasto_id_novo+'" ');
        alert("Dados alterados com sucesso");
        gasto_edicao_fechar_tela();
        gasto_consulta();
    }, function(err){
        alert(err.message);
        alert("Um erro ocorreu durante a inicialização do app");
    });
}            
    

function addmanu(){
    var manuu = document.getElementById("cadmanu").value;
    var kmm = document.getElementById("cadkm").value;
    if(manuu == "") {
        alert("Por favor entre com um tipo de Manutenção de Veículo");
        return;
    }
    if(kmm == ""){
        alert("Por favor entre com a Quilometragem");
        return;
    }
    db.transaction(function(tx) {
        tx.executeSql("INSERT INTO manut (manu, km) VALUES (?,?)", [manuu, kmm], function(tx,res){
            alert("Dados cadastrados com sucesso!");    
        });
    }, function(err){
        alert("Um erro ocorreu durante a inicialização do app");
    });
}
function manu_consulta(){
    db.transaction(manu_consulta_database, erroDB);
}
function manu_consulta_database(tx){
    tx.executeSql('SELECT * FROM manut', [],manu_consulta_dados, erroDB);
}
function manu_consulta_dados(tx, results){
    $("#manu-listagem").empty();
    var len = results.rows.length;
    //alert("Tabela Carro: "+len+" linhas encontradas");
    for (var i=0; i<len; i++){
        $("#manu-listagem").append("<tr>"+
        "<td>"+results.rows.item(i).manu+"</td>"+
        "<td>"+results.rows.item(i).km+"</td>"+
        "<td><input type='button' class='btn btn-lg btn-danger indigo darken-4' value='X' onclick='manu_delete("+results.rows.item(i).id +")'><input type='button' class='btn btn-lg btn-warning indigo darken-4' value='E' onclick='manu_edicao_abrir_tela("+results.rows.item(i).id+")'></td>"+ 
        "</tr>"
        );
    }
}
function erroDB(tx, err) {
    alert("Erro ao processar o SQL: "+err);
}
function manu_delete(manu_id){
    var id_delete = document.querySelector("#manu_id_delete").value = manu_id;
    db.transaction(function(tx) {
        tx.executeSql('DELETE FROM manut WHERE id ='+ id_delete +'');
        manu_consulta();
    }, function(err){
        alert(err.message);
        alert("Um erro ocorreu durante a inicialização do app");
    }
    );
}
function manu_edicao_fechar_tela(){
            $("#edimanu").hide();
            $("#listmanu").show();
}
$(document).ready(function(){ 
    $('#edimanu').hide();
    });
function manu_edicao_abrir_tela(manu_id){
        $("#listmanu").hide();
        $("#edimanu").show();
        var id_update = document.querySelector("#manu_id_update").value = manu_id;
        db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM manut WHERE id = ?", [id_update], function(tx, resultado){
                var manu = resultado.rows.item(0).manu;
                var km = resultado.rows.item(0).km;
                document.getElementById("editmanu").value = manu;
                document.getElementById("editkmm").value = km;
                alert("Codigo: "+id_update+" Manutenção: "+manu);
            });
        }, function(err){
            alert(err.message);
            alert("Um erro ocorreu durante a inicialização do app");
        });
}
function manu_atualizar(){
    var manu_id_novo = document.getElementById("manu_id_update").value;
    var manu_novo = document.getElementById("editmanu").value;
    var manu_km_novo = document.getElementById("editkmm").value;
    db.transaction(function(tx) {
        tx.executeSql('UPDATE manut SET manu = "'+manu_novo+'", km = "'+manu_km_novo+'" WHERE id = "'+manu_id_novo+'" ');
        alert("Dados alterados com sucesso");
        manu_edicao_fechar_tela();
        manu_consulta();
    }, function(err){
        alert(err.message);
        alert("Um erro ocorreu durante a inicialização do app");
    });
}
function teste(){
    var n1 = document.querySelector("#num1").value;
    var n2 = document.querySelector("#num2").value;
    var res = parseFloat(n1) / parseFloat(n2);
    
    if(res.toFixed(1)<0.7){
        document.querySelector("#res").value = "Alcool - "+res.toFixed(2);
    }
    else{
        document.querySelector("#res").value = "Gasolina - "+res.toFixed(2);
    } 
}
const Calendar = document.querySelector('.datepicker');
M.Datepicker.init(Calendar,{
    format:'dd/mmmm/yyyy',
    showClearBtb: true,
    i18n: {
        today: 'Hoje',
        clear: 'Limpar',
        done: 'Ok',
        nextMonth: 'Próximo mês',
        previousMonth: 'Mês anterior',
        weekdaysAbbrev: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
        weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        weekdays: ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'],
        monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    }
});   