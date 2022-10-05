sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller , JSONModel, MessageToast) {
        "use strict";

        return Controller.extend("fioriegitimhw1.controller.InitialView", {
            onInit: function () {
                var oViewModel = new JSONModel({
                    busy: false,
                    credentials:{
                        username:{
                            value: "baris"
                        }
                    },
                    newToDo:{
                        item :{
                            value:"",
                            valueState: "None",
                            valueStateText: "",
                        },
                        date: {
                            value:"",
                            valueState: "None",
                            valueStateText: "",
                        }
                    },
                    newToDoAdd:{
                        number: "",
                        item: "",
                        date:"",
                        compDate:"Haven't done yet",
                        deletable:true,
                    },
                    toDoList: [
                    {
                       number: "1",
                       item:"deneme",
                       date:"28/12/2021",
                       compDate:"01/02/2022",
                       deletable:false,
                    },
                    {
                      number: "2",
                      item:"deneme",
                      date:"01/01/1999",
                      compDate:"08/01/1999",
                      deletable:false,
                   }

                    ]

                });
                this.getView().setModel(oViewModel, "initialViewModel");
            },
            onAddItem: function () {
                var oViewModel = this.getView().getModel("initialViewModel");
                var sItem = oViewModel.getProperty("/newToDo/item/value");
                var sDate = oViewModel.getProperty("/newToDo/date/value");
                
                oViewModel.setProperty("/newToDo/item/valueState", "None");
                oViewModel.setProperty("/newToDo/item/valueStateText", "");
      
                oViewModel.setProperty("/newToDo/date/valueState", "None");
                oViewModel.setProperty("/newToDo/date/valueStateText", "");
      
                if (!this._checkItem()) {
                  return;
                }
                if (!this._checkDate()) {
                  return;
                }
                var oViewModel = this.getView().getModel("initialViewModel");
                var aToDoLists = oViewModel.getProperty("/toDoList");
                var oNewTodo = oViewModel.getProperty("/newToDoAdd");
                oNewTodo.number = (parseInt(aToDoLists[aToDoLists.length-1].number) +1 )+ "";
                oNewTodo.item = sItem;
                oNewTodo.date = sDate;
                oNewTodo.deletable = true;

                aToDoLists.push(oNewTodo);
                MessageToast.show(this._getText("addedItem",oNewTodo.item));
                oViewModel.setProperty("/toDoList", aToDoLists);
                oViewModel.setProperty("/newToDoAdd", { compDate:"Haven't done yet",});

              },_checkItem: function () {
                var oViewModel = this.getView().getModel("initialViewModel");
                var sItem = oViewModel.getProperty("/newToDo/item/value");
                var bValid = true;
      
                if (sItem.trim() === "" || !sItem) {
                  oViewModel.setProperty("/newToDo/item/valueState", "Error");
                  oViewModel.setProperty(
                    "/newToDo/item/valueStateText",
                    this._getText("itemRequired", [])
                  );
                  bValid = false;
                }
                return bValid;
              },
              _checkDate: function () {
                var oViewModel = this.getView().getModel("initialViewModel");
                var sdate = oViewModel.getProperty("/newToDo/date/value");
                var bValid = true;
      
                if (!sdate) {
                  oViewModel.setProperty("/newToDo/date/valueState", "Error");
                  oViewModel.setProperty(
                    "/newToDo/date/value/valueStateText",
                    this._getText("dateRequired", [])
                  );
                  bValid = false;
                }
                return bValid;
              },

            onValueChange: function(event){
                var oSource = event.getSource();
                try {
                  oSource.setValueState("None");
                  oSource.setValueStateText("");
                } catch (e) {}
            },
            
            onDone: function(event){
              var oViewModel = this.getView().getModel("initialViewModel");
              var bindingContext = event.getSource().getBindingContext("initialViewModel")
              var object =  bindingContext.getObject();
              var sPath =   bindingContext.getPath();
              if(object.deletable){
                object.compDate = this._getDate();
                object.deletable = false;
                oViewModel.setProperty(sPath,object);
              }
              else{
                MessageToast.show(this._getText("alreadyDone",[]));
              }
              
            },
            onDelete: function(event){
              var oViewModel = this.getView().getModel("initialViewModel");
              var aToDoLists = oViewModel.getProperty("/toDoList");
              var object =  event.getSource().getBindingContext("initialViewModel").getObject();
              var sPath =   event.getSource().getBindingContext("initialViewModel").getPath();
              var deletable = object.deletable;

              if(!deletable){
                MessageToast.show(this._getText("notDeletedMsg",[]));
              }
              else{
                var aSplitedArr = sPath.split("/");
                var index = aSplitedArr[2];
                aToDoLists.splice(parseInt(index), 1 );
                oViewModel.setProperty("/toDoList", aToDoLists);
                MessageToast.show(this._getText("deletedMsg",[]));
              }
            },
            _getText: function (textId, params) {
                return this.getOwnerComponent()
                  .getModel("i18n")
                  .getResourceBundle()
                  .getText(textId, params);
              },
            _getDate: function(){
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth()+1; //January is 0!
                var yyyy = today.getFullYear();
                var today1 = ( dd+'/'+mm+'/'+yyyy);
                return today1;
            },
         
        });
    });
