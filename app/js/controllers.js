'use strict';

/* Controllers */

var phonecatControllers = angular.module('phonecatControllers', []);

phonecatControllers.controller('PhoneListCtrl', ['$scope', '$resource', 'Phone',
  function($scope, $resource, Phone) {
      $scope.rawData = null;
      $scope.bindData = null;

      $scope.selectedItem = null; //bind with UI. copied item.
      $scope.selectedOption = null; //bind with UI. copied item.

      $scope.selectedItemIndex = -1; //in order to find item in db.
      $scope.selectedOptionIndex = -1; //in order to find item in options.

      $scope.unitEnum = {
          m2:"m²",
          m:"m",
          piece:"个",
          sheet:"片",
          group:"组",
          suit:"套",
          item:"件",
          project:"项",
          lump: "块",
          step:"步"
      };

      $scope.basicConstructionGroupEnum = {
          DM: {label:'地面工程DM', sort:-1},
          QM: {label: '墙面工程DM', sort: -1},
          QT: {label: '其他工程QT', sort: -1},
          TP: {label: '天棚工程TP', sort: -1},
          TS: {label: '涂饰工程TS', sort:-1},
          CC: {label: "拆除工程CC", sort: -1},
          SD: {label: "水电工程SD", sort: -1}
      };

      $scope.isShowBomList = false;
      $scope.isShowEditBomUI = false;
      $scope.isShowEditOptionUI = false;

      $scope.onBomDelete = function(){
          var index = $scope.selectedItemIndex;
          utils.delete($scope.bindData, index);
          $scope.isShowEditBomUI = false;
          $scope.isShowEditOptionUI = false;
      }

      $scope.onBomSubmit = function(){
          var it = {
              "bomcategoryId": $scope.selectedItem.bomcategoryId,
              "bomcategoryLabel": $scope.selectedItem.bomcategoryLabel,
              "group": $scope.selectedItem.group,
              "projectOptions": $scope.selectedItem.projectOptions
          };

          var db = $scope.bindData;

          if($scope.selectedItemIndex == -1){
              utils.add(db, 0, it);
          }else{
              var index = $scope.selectedItemIndex;
              utils.edit(db, index, it);
          }

          $scope.isShowEditBomUI = false;
          $scope.isShowEditOptionUI = false;
      }

      $scope.onBomSelected = function(index){
          if(index != undefined){
              $scope.selectedItemIndex = index;
              var bomItm = $scope.bindData[index];
              $scope.selectedItem = angular.copy(bomItm);
          }else{
              $scope.selectedItemIndex = -1;
              var allData = $scope.rawData.basicConstruction2
                  .concat($scope.rawData.manualInputConstant)
                  .concat($scope.rawData.manualInput);
              var id = utils.getMaxId(allData) + 1;

              $scope.selectedItem = {
                  "bomcategoryId": id,
                  "bomcategoryLabel":"undefined",
                  "group":$scope.basicConstructionGroupEnum.DM,
                  "projectOptions": []
              }
          }

          $scope.isShowEditBomUI = true;
          $scope.isShowEditOptionUI = false;
      }















    $scope.onOptionDelete = function(){
        var index = $scope.selectedOptionIndex;
        var bomItem = $scope.selectedItem;
        utils.delete(bomItem.projectOptions, index);

        $scope.isShowEditOptionUI = false;
    }

    $scope.onOptionSubmit = function(){
        $scope.isShowEditOptionUI = false;
        var it = {
            "projectLabel": $scope.selectedOption.projectLabel,
            "projectUnit": $scope.selectedOption.projectUnit,
            "projectDesc": $scope.selectedOption.projectDesc,
            "projectSN": $scope.selectedOption.projectSN,
            "projectPrice": $scope.selectedOption.projectPrice
        };

        var bomItem = $scope.selectedItem;
        var db = bomItem.projectOptions;

        if($scope.selectedOptionIndex == -1){
            utils.add(db, 0, it);
        }else{
            var index = $scope.selectedOptionIndex;
            utils.edit(db, index, it);
        }
    }
    $scope.onOptionSelected = function(index){
        $scope.isShowEditOptionUI = true;
        if(index != undefined){
            $scope.selectedOptionIndex = index;
            $scope.selectedOption = angular.copy($scope.selectedItem.projectOptions[index]);
        }else{
            $scope.selectedOptionIndex = -1;
            $scope.selectedOption = {
                "projectLabel": "undefined",
                "projectUnit": "m2",
                "projectDesc": "undefined",
                "projectSN": "undefined",
                "projectPrice": 0
            }
        }
    }



















    $scope.onAutoTabClk = function(){
        $scope.bindData = $scope.rawData.basicConstruction2;
    }
    $scope.onCustomizeDynamicTabClk = function(){
        $scope.bindData = $scope.rawData.manualInput;
    }
    $scope.onCustomizeStaticTabClk = function(){
        $scope.bindData = $scope.rawData.manualInputConstant;
    }

    $scope.onUpload = function(){
        angular.element('.uploadForm input[type=file]').trigger('click');
    }
      $scope.onFileSelected = function(e){
          e.preventDefault();
          var f = e.target.files[0];

          var reader = new FileReader();
          reader.onload = function (event) {
              var target = event.target;
              var result = target.result;
              $scope.onDBLoad(result);
          }
          reader.readAsText(f);
      }

      $scope.onDBLoad = function(rawData){
          $scope.rawData = JSON.parse(rawData);
          $scope.bindData = $scope.rawData.basicConstruction2;

          $scope.isShowBomList = true;
          $scope.$apply();
      }


    $scope.onDownLoad = function(){
        var filename = 'basic_construction_rule_' + new Date().toUTCString() + '.json';
        var dumpdata = JSON.stringify($scope.rawData);
        var blob = new Blob([dumpdata], { type: "application/json;charset=" + document.characterSet });
        new saveAs(blob, filename);
    }
  }]);
