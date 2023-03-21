<template>
  <div>
    <el-form ref="generateForm" :size="data.config.size" :model="models" :rules="rules"
      :label-position="data.config.labelPosition" :label-width="data.config.labelWidth + 'px'" @submit.native.prevent>
      <template v-for="item in data.list">
        <template v-if="item.type == 'grid'">
          <el-row :key="item.key" type="flex" :gutter="item.options.gutter ? item.options.gutter : 0"
            :justify="item.options.justify" :align="item.options.align">
            <el-col v-for="(col, colIndex) in item.columns" :key="colIndex" :span="col.span">
              <template v-for="citem in col.list">
                <el-form-item v-if="citem.type == 'blank'" @clearValidate="clearValidate" :label="citem.name"
                  :prop="citem.model" :key="citem.key">
                  <slot :name="citem.model" :model="models"></slot>
                </el-form-item>
                <template v-else>
                  <!--  <genetate-form-item v-if="!citem.control || citem.control.indexOf('=')>-1 ? models[citem.control.split('=')[0]] == citem.control.split('=')[1] : models[citem.control.split('!')[0]] != citem.control.split('!')[1]" :ref="citem.type=='selectCreate' ? 'genetateFormItem':''" @clearValidate="clearValidate" @accountEdit="accountEdit" :key="citem.key" :models.sync="models" :remote="remote" :rules="rules" :widget="citem"  :isEdit="isEdit" :action="action?action:'http://192.168.3.64/workbox-master/file/upload'"></genetate-form-item> -->
                  <genetate-form-item v-if="test(citem)" :ref="citem.type == 'selectCreate' ? 'genetateFormItem' : ''"
                    @clearValidate="clearValidate" @accountEdit="accountEdit" :key="citem.key" :models.sync="models"
                    :remote="remote" :rules="rules" :widget="citem" :isEdit="isEdit" :uploadType="uploadType"
                    :action="action ? action : 'http://192.168.3.64/workbox-master/file/upload'"></genetate-form-item>
                </template>
              </template>
            </el-col>
          </el-row>
        </template>

        <template v-else-if="item.type == 'blank'">
          <el-form-item :label="item.name" @clearValidate="clearValidate" :prop="item.model" :key="item.key">
            <slot :name="item.model" :model="models"></slot>
          </el-form-item>
        </template>

        <template v-else>
          <genetate-form-item v-if="test(item)" :ref="item.type == 'selectCreate' ? 'genetateFormItem' : ''"
            :key="item.key" @clearValidate="clearValidate" @accountEdit="accountEdit" :models.sync="models" :rules="rules"
            :widget="item" :remote="remote" :isEdit="isEdit" :uploadType="uploadType"
            :action="action ? action : 'http://192.168.3.64/workbox-master/file/upload'"></genetate-form-item>
        </template>
      </template>
    </el-form>
  </div>
</template>

<script>
import GenetateFormItem from "./GenerateFormItem";
import { loadJs } from "../util/index.js";
import { encryptPw } from "../util/utils/encryptUtil.js";
import request from "../util/request.js";
export default {
  name: "fm-generate-form",
  components: {
    GenetateFormItem
  },
  props: [
    "data",
    "remote",
    "value",
    "insite",
    "isEdit",
    "disabled",
    "token",
    "action",
    "sm2Public",
    "fileListUrl",
    "uploadType"
  ],
  data() {
    return {
      models: {},
      rules: {},
      isEncryptionModels: []
    };
  },
  created() {
    this.generateModle(this.data.list);
  },
  mounted() { },
  methods: {
    test(citem) {
      //组件之间的联动验证
      if (citem.control == undefined) {
        return true;
      }
      if (!citem.control) {
        return true;
      }

      var input = citem.control;

      var inputName = input.split(/&&|\|\|/g);
      var inputNameNew = inputName.map((item) =>
        item = item.replace(/\(/g, '').replace(/\)/g, '').trim()
      )

      for (var i = 0; i < inputNameNew.length; i++) {
        if (inputNameNew[i].includes('=')) {
          let splitArr = inputNameNew[i].split('=');
          var str = 'this.models["' + splitArr[0] + '"]' + '==' + "'" + splitArr[1] + "'";

          var str1 = '("' + splitArr[1][0] + '"== "[" && "' + splitArr[1][splitArr[1].length - 1] + '" == "]"' +
            '?this.models["' + splitArr[0] + '"]  &&' +
            'this.isEqual(' +
            'this.models["' + splitArr[0] + '"],'
            + splitArr[1].replace(/,/g, '","').replace("[", "[\"").replace("]", "\"]").replace(/ /g, "") +
            ')' +
            ':' + str + ')';
          input = input.replace(inputNameNew[i], str1);

        } else {

          let splitArr = inputNameNew[i].split('!');
          var str = 'this.models["' + splitArr[0] + '"]' + '!=' + "'" + splitArr[1] + "'";

          var str1 = '("' + splitArr[1][0] + '"== "[" && "' + splitArr[1][splitArr[1].length - 1] + '" == "]"' +
            '?this.models["' + splitArr[0] + '"]  &&' +
            '!this.isEqual(' +
            'this.models["' + splitArr[0] + '"],'
            + splitArr[1].replace(/,/g, '","').replace("[", "[\"").replace("]", "\"]").replace(/ /g, "") +
            ')' +
            ':' + str + ')';
          input = input.replace(inputNameNew[i], str1);
        }
      }
      return eval(input);
    },
    isEqual(a, b) {
      let m = new Map();
      if (a.constructor != Array) {
        return false;
      }
      a.forEach(o => m.set(o, (m.get(o) || 0) + 1));
      b.forEach(o => m.set(o, (m.get(o) || 0) - 1));
      for (var value of m.values()) {
        if (value !== 0) {
          return false;
        }
      }
      return true;
    },
    generateModle(genList) {
      for (let i = 0; i < genList.length; i++) {
        if (genList[i].type === "grid") {
          genList[i].columns.forEach(item => {
            this.generateModle(item.list);
          });
        } else {
          if (genList[i].type == "input" && genList[i].options.isEncryption) {
            genList[i].options.isEdit = this.isEdit;
            // if(!genList[i].options.passwordDisabled){
            //   this.isEncryptionModels.push(genList[i].model);
            // }
          }
          if (genList[i].type == "selectCreate") {
            genList[i].options.isEdit = this.isEdit;
          }
          if (genList[i].type == "fileupload") {
            genList[i].options.headers = {
              token: this.token,
              "X-Request-Time": "",
              "X-Request-Sign": ""
            };
          }
          if (this.disabled) {
            //判断为true表单全部禁止
            genList[i].options.disabled = true;
          }
          if (Object.keys(this.value).indexOf(genList[i].model) >= 0) {
            if (genList[i].type == "input") {
              if (
                genList[i].options.dataType == "number" ||
                genList[i].options.dataType == "integer" ||
                genList[i].options.dataType == "float"
              ) {
                this.value[genList[i].model] = Number(
                  this.value[genList[i].model]
                );
              }
            }
            if (genList[i].type == "number") {
              this.value[genList[i].model] = Number(
                this.value[genList[i].model]
              );
            }

            if (genList[i].type == "outFileupload") {
              const code = this.value[genList[i].model];
              if (code && code.length) {
                this.$set(genList[i].options.fileList, 0, {
                  name: this.value[genList[i].model]
                });
              }
            }

            if (genList[i].type == "fileupload") {
              let _this = this;
              // let url = genList[i].options.action.split("file")[0];
              let code = _this.value[genList[i].model];
              let urlString = _this.fileListUrl;
              if (code) {
                request.get(urlString, { params: { matchCode: code } }).then(res => {
                  if (res.success || res.code == 200) {
                    _this.$set(genList[i].options.fileList, 0, {
                      name: res.data[0].fileName
                    });
                  } else {
                    _this.error(res.msg);
                  }
                });
              }
            }
            if (genList[i].type == "selectCreate") {
              // if(this.value[genList[i].model] && JSON.parse(this.value[genList[i].model]).isSingle != undefined){
              //   this.value[genList[i].model] = JSON.parse(this.value[genList[i].model]);
              // }
              genList[i].options.isAddAccount = true;
            }

            // genList[i].type == "selectCreate" ? this.models[genList[i].model] = this.value[genList[i].model].id :this.models[genList[i].model] = this.value[genList[i].model]
            this.models[genList[i].model] = this.value[genList[i].model];
          } else {
            if (genList[i].type === "blank") {
              this.models[genList[i].model] =
                genList[i].options.defaultType === "String"
                  ? ""
                  : genList[i].options.defaultType === "Object"
                    ? {}
                    : [];
            } else {
              this.models[genList[i].model] =
                genList[i].type == "table"
                  ? genList[i].options.options
                  : genList[i].type == "selectCreate" &&
                    genList[i].options.isAddAccount &&
                    genList[i].options.selectTransit
                    ? genList[i].options.singleOptions
                    : genList[i].options.defaultValue;
            }
          }

          if (this.rules[genList[i].model]) {
            this.rules[genList[i].model] = [
              ...this.rules[genList[i].model],
              ...genList[i].rules.map(item => {
                if (item.pattern) {
                  return { ...item, pattern: new RegExp(item.pattern) };
                } else {
                  return { ...item };
                }
              })
            ];
          } else {
            this.rules[genList[i].model] = [
              ...genList[i].rules.map(item => {
                if (item.pattern) {
                  return { ...item, pattern: new RegExp(item.pattern) };
                } else {
                  return { ...item };
                }
              })
            ];
          }
        }
      }
    },
    formValidate() {
      return new Promise((resolve, reject) => {
        this.$refs.generateForm.validate(valid => {
          if (valid) {
            resolve();
          } else {
            reject(new Error("表单数据校验失败").message);
          }
        });
      });
    },
    clearValidate(value) {
      this.$refs.generateForm.clearValidate(value);
    },
    refreshAccount() {
      this.$refs.genetateFormItem.forEach((item, index) => {
        this.$refs.genetateFormItem[index].createAccount();
      });
    },
    accountEdit() {
      this.$emit("accountEdit");
    },
    getData() {
      let genList = this.data.list;
      return new Promise((resolve, reject) => {
        this.$refs.generateForm.validate(valid => {
          if (valid) {
            // for(let i in this.models){
            //   if(this.isEncryptionModels.length>0 && this.isEncryptionModels.includes(i)){
            //     this.models[i] = encryptPw(this.models[i]);
            //
            // }}

            for (let i = 0; i < genList.length; i++) {
              if (genList[i].type === "grid") {
                var _this = this;
                genList[i].columns.forEach(item => {
                  item.list.forEach(item1 => {
                    if (item1.type == "input" && item1.options.isEncryption) {
                      if (
                        !item1.options.passwordDisabled ||
                        !item1.options.isEdit
                      ) {
                        _this.models[item1.model] = encryptPw(
                          _this.sm2Public, _this.models[item1.model]
                        );
                      }
                    }

                    if (
                      item1.type == "selectCreate" &&
                      item1.options.selectTransit
                    ) {
                      if (
                        !item1.options.passwordDisabled ||
                        !item1.options.isEdit
                      ) {
                        _this.models[item1.model].userPassword = encryptPw(
                          _this.sm2Public, _this.models[item1.model].userPassword
                        );
                      }
                    }
                  });
                  //this.generateModle(item.list)
                });
              } else {
                if (
                  genList[i].type == "input" &&
                  genList[i].options.isEncryption
                ) {
                  if (
                    !genList[i].options.passwordDisabled ||
                    !genList[i].options.isEdit
                  ) {
                    this.models[genList[i].model] = encryptPw(
                      this.sm2Public, this.models[genList[i].model]
                    );
                  }
                }
                if (
                  genList[i].type == "selectCreate" &&
                  genList[i].options.selectTransit
                ) {
                  if (
                    !genList[i].options.passwordDisabled ||
                    !genList[i].options.isEdit
                  ) {
                    this.models[genList[i].model].userPassword = encryptPw(
                      this.sm2Public, this.models[genList[i].model].userPassword
                    );
                  }
                }
              }
            }

            resolve(this.models);
          } else {
            reject(new Error("表单数据校验失败").message);
          }
        });
      });
    },
    getNoEncryptionData() {
      let genList = this.data.list;
      return new Promise((resolve, reject) => {
        this.$refs.generateForm.validate(valid => {
          if (valid) {
            resolve(this.models);
          } else {
            reject(new Error("表单数据校验失败").message);
          }
        });
      });
    },
    refresh() { }
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        console.log(JSON.stringify(val));
        this.models = { ...this.models, ...val };
      }
    }
  }
};
</script>

<style lang="scss">
// @import '../styles/cover.scss';
</style>
