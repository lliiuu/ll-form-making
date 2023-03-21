<template>
  <el-form-item class="generateFormItem upload-container" :class="{ 'formItemIsSingle': widget.options.selectTransit }"
    :prop="widget.model">
    <span slot="label">
      <span class="span-box">
        <span>{{ widget.name }}</span>
        <el-tooltip v-if="widget.tooltip" class="item" effect="dark" :content="widget.tooltip" placement="top">
          <i style="color: #FF9800;font-size: 18px;cursor:pointer;" class="el-icon-question"></i>
        </el-tooltip>
      </span>
    </span>
    <template v-if="widget.type == 'input'">
      <template v-if="widget.options.isEncryption">
        <div :style="{ width: widget.options.width + '%' }">
          <div style="position:relative;display:inline-block;"
            :style="{ 'width': widget.options.isEdit ? '80%' : '100%', 'float': 'left', 'margin-right': '10px' }">
            <el-input :key="passwordType.pwdType" ref="pwdType" :type="passwordType.pwdType" v-model.trim="dataModel"
              maxlength="500"
              :disabled="widget.options.disabled ? true : widget.options.isEdit ? widget.options.passwordDisabled : false"
              :placeholder="widget.options.placeholder"></el-input>
            <span class="show-pwd" @click="showPwd('pwdType')">
              <svg-icon :icon-class="passwordType.pwdType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </div>
          <el-checkbox-group style="float:left;" v-if="widget.options.isEdit" v-model="isEditArr">
            <el-checkbox :disabled="widget.options.disabled" @change="editChange" :label="1" name="type">修改
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </template>

      <el-input
        v-else-if="widget.options.dataType == 'number' || widget.options.dataType == 'integer' || widget.options.dataType == 'float'"
        :type="widget.options.dataType" v-model.number="dataModel"
        onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" maxlength="500"
        :disabled="widget.options.disabled" :placeholder="widget.options.placeholder"
        :style="{ width: widget.options.width + '%' }"></el-input>
      <el-input v-else :type="widget.options.dataType" v-model.trim="dataModel" maxlength="500"
        :disabled="widget.options.disabled" :placeholder="widget.options.placeholder"
        :style="{ width: widget.options.width + '%' }"></el-input>
    </template>

    <template v-if="widget.type == 'textarea'">
      <el-input type="textarea" :rows="widget.options.rows" v-model.trim="dataModel" maxlength="500"
        :disabled="widget.options.disabled" :placeholder="widget.options.placeholder"
        :style="{ width: widget.options.width + '%' }"></el-input>
    </template>



    <template v-if="widget.type == 'number'">
      <el-input-number v-model="dataModel" :precision="0" :style="{ width: widget.options.width + '%' }"
        :disabled="widget.options.disabled" :step="widget.options.step" :min="widget.options.min"
        :max="widget.options.max" controls-position="right"></el-input-number>
    </template>

    <template v-if="widget.type == 'radio'">
      <el-radio-group v-model="dataModel" :style="{ width: widget.options.width + '%' }">
        <el-radio :style="{ display: widget.options.inline ? 'inline-block' : 'block' }"
          :disabled="widget.options.disabled" :label="item.value"
          v-for="(item, index) in (widget.options.remote ? widget.options.remoteOptions : widget.options.options)"
          :key="index">
          <template v-if="widget.options.remote">
            <el-tooltip v-if="widget.options.showTooltip && item.tooltip" class="item" effect="dark"
              :content="item.tooltip" placement="top">
              <span>{{ item.label }}</span>
            </el-tooltip>
            <span v-else>{{ item.label }}</span>
          </template>
          <template v-else>
            <el-tooltip v-if="widget.options.showTooltip && item.tooltip" class="item" effect="dark"
              :content="item.tooltip" placement="top">
              <span>{{ widget.options.showLabel ? item.label : item.value }}</span>
            </el-tooltip>
            <span v-else>{{ widget.options.showLabel ? item.label : item.value }}</span>
          </template>
        </el-radio>
      </el-radio-group>
    </template>

    <template v-if="widget.type == 'checkbox'">
      <el-checkbox-group v-model="dataModel" :style="{ width: widget.options.width + '%' }">
        <el-checkbox :style="{ display: widget.options.inline ? 'inline-block' : 'block' }"
          :disabled="widget.options.disabled" :label="item.value"
          v-for="(item, index) in (widget.options.remote ? widget.options.remoteOptions : widget.options.options)"
          :key="index">
          <!-- <template v-if="widget.options.remote">{{item.label}}</template>
          <template v-else>{{widget.options.showLabel ? item.label : item.value}}</template>-->
          <template v-if="widget.options.remote">
            <el-tooltip v-if="widget.options.showTooltip && item.tooltip" class="item" effect="dark"
              :content="item.tooltip" placement="top">
              <span>{{ item.label }}</span>
            </el-tooltip>
            <span v-else>{{ item.label }}</span>
          </template>
          <template v-else>
            <el-tooltip v-if="widget.options.showTooltip && item.tooltip" class="item" effect="dark"
              :content="item.tooltip" placement="top">
              <span>{{ widget.options.showLabel ? item.label : item.value }}</span>
            </el-tooltip>
            <span v-else>{{ widget.options.showLabel ? item.label : item.value }}</span>
          </template>
        </el-checkbox>
      </el-checkbox-group>
    </template>

    <template v-if="widget.type == 'time'">
      <el-time-picker v-model="dataModel" :is-range="widget.options.isRange" :placeholder="widget.options.placeholder"
        :start-placeholder="widget.options.startPlaceholder" :end-placeholder="widget.options.endPlaceholder"
        :readonly="widget.options.readonly" :disabled="widget.options.disabled" :editable="widget.options.editable"
        :clearable="widget.options.clearable" :arrowControl="widget.options.arrowControl"
        :value-format="widget.options.format" :style="{ width: widget.options.width + '%' }"></el-time-picker>
    </template>

    <template v-if="widget.type == 'date'">
      <el-date-picker v-model="dataModel" :type="widget.options.type" :placeholder="widget.options.placeholder"
        :start-placeholder="widget.options.startPlaceholder" :end-placeholder="widget.options.endPlaceholder"
        :readonly="widget.options.readonly" :disabled="widget.options.disabled" :editable="widget.options.editable"
        :clearable="widget.options.clearable"
        :value-format="widget.options.timestamp ? 'timestamp' : widget.options.format" :format="widget.options.format"
        :style="{ width: widget.options.width + '%' }"></el-date-picker>
    </template>

    <template v-if="widget.type == 'rate'">
      <el-rate v-model="dataModel" :max="widget.options.max" :disabled="widget.options.disabled"
        :allow-half="widget.options.allowHalf"></el-rate>
    </template>

    <template v-if="widget.type == 'color'">
      <el-color-picker v-model="dataModel" :disabled="widget.options.disabled" :show-alpha="widget.options.showAlpha">
      </el-color-picker>
    </template>

    <template v-if="widget.type == 'select'">
      <el-select v-model="dataModel" :disabled="widget.options.disabled" :multiple="widget.options.multiple"
        :clearable="widget.options.clearable" :placeholder="widget.options.placeholder"
        :style="{ width: widget.options.width + '%' }" :filterable="widget.options.filterable">
        <el-option
          v-for="item in (widget.options.remote === true ? widget.options.remoteOptions : widget.options.remote === 'add' ? widget.options.batchString.split(',').map(itemChild => ({ value: itemChild })) : widget.options.options)"
          :key="item.value" :value="item.value"
          :label="widget.options.showLabel || widget.options.remote ? item.label : item.value"></el-option>
      </el-select>
    </template>
    <template v-if="widget.type == 'selectCreate'">
      <el-row :gutter="30" :style="{ width: widget.options.width + '%' }">
        <el-col :span="20" style="width:calc( 100% - 140px);">
          <template v-if="widget.options.selectTransit">
            <form size="mini" :model="dataModel">
              <el-col :span="12">
                <el-form-item label-width="40px" label="账号" :prop="widget.model + '.userName'" :rules="{
                  required: this.widget.options.required, message: '账号不能为空。', trigger: 'blur'
                }">
                  <el-input type="text" v-model.trim="dataModel.userName" maxlength="500"
                    :disabled="widget.options.disabled" placeholder="请输入账号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <template>
                  <el-form-item label-width="40px" label="密码" :prop="widget.model + '.userPassword'" :rules="{
                    required: this.widget.options.required, message: '密码不能为空。', trigger: 'blur'
                  }">
                    <div style="position:relative;display:inline-block;"
                      :style="{ 'width': widget.options.isEdit ? '60%' : '100%', 'float': 'left', 'margin-right': '10px' }">
                      <el-input v-model.trim="dataModel.userPassword" :key="passwordType.pwdType1" ref="pwdType1"
                        maxlength="500" :type="passwordType.pwdType1"
                        :disabled="widget.options.disabled ? true : widget.options.isEdit ? widget.options.passwordDisabled : false"
                        placeholder="请输入密码"></el-input>
                      <span class="show-pwd" @click="showPwd('pwdType1')">
                        <svg-icon :icon-class="passwordType.pwdType1 === 'password' ? 'eye' : 'eye-open'" />
                      </span>
                    </div>
                    <el-checkbox-group style="float:left;" v-if="widget.options.isEdit" v-model="isEditArr">
                      <el-checkbox :disabled="widget.options.disabled" @change="editChange" :label="1" name="type">修改
                      </el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </template>
              </el-col>
            </form>
          </template>
          <el-select v-else v-model="dataModel" :disabled="widget.options.disabled" :multiple="widget.options.multiple"
            :clearable="widget.options.clearable" :placeholder="widget.options.placeholder" style="width:100%;">
            <el-option v-for="item in (widget.options.remote ? widget.options.remoteOptions : widget.options.options)"
              :key="item.value" :value="item.value"
              :label="widget.options.showLabel || widget.options.remote ? item.label : item.value"></el-option>
          </el-select>
        </el-col>
        <el-col style="width:125px;">
          <el-button-group>
            <el-button size="mini" :title="transitInput" :disabled="widget.options.disabled" @click="selectTransitC">
              <i v-if="transitInput == '选择账号'" class="el-icon-circle-check" style="font-size:14px;"></i>
              <i v-else class="el-icon-edit-outline" style="font-size:14px;"></i>
            </el-button>
            <el-button size="mini" title="设置账号" :disabled="widget.options.disabled" @click="accountEdit">
              <i class="el-icon-setting" style="font-size:14px;"></i>
            </el-button>
          </el-button-group>
        </el-col>
      </el-row>
    </template>

    <template v-if="widget.type == 'switch'">
      <el-switch v-model="dataModel" active-value="true" inactive-value="false" :disabled="widget.options.disabled">
      </el-switch>
    </template>

    <template v-if="widget.type == 'slider'">
      <el-slider v-model="dataModel" :min="widget.options.min" :max="widget.options.max"
        :disabled="widget.options.disabled" :step="widget.options.step" :show-input="widget.options.showInput"
        :range="widget.options.range" :style="{ width: widget.options.width + '%' }"></el-slider>
    </template>

    <template v-if="widget.type == 'imgupload'">
      <fm-upload v-model="dataModel" :disabled="widget.options.disabled" :style="{ 'width': widget.options.width + '%' }"
        :width="widget.options.size.width" :height="widget.options.size.height" :token="widget.options.token"
        :domain="widget.options.domain"></fm-upload>
    </template>
    <template v-if="widget.type == 'fileupload'">
      <div v-if="uploadType === 'localFile'" class="upload-demo local-install-box"
        :style="{ 'width': widget.options.width + '%' }">
        <div @click="importPlugs" @drop="dropListener" @dragover.prevent tabindex="0" class="el-upload el-upload--text">
          <div class="el-upload-dragger"><i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或点击上传</div>
          </div><input type="file" name="file" multiple="multiple" class="el-upload__input">
        </div>
        <ul class="el-upload-list el-upload-list--text">
          <li v-if="dataModel && dataModel.length" class="el-upload-list__item is-success"
            style="margin-bottom: 20px;margin-top:0 ;line-height:1.4"><a class="el-upload-list__item-name">{{ dataModel
            }}</a><label class="el-upload-list__item-status-label"><i
                class="el-icon-upload-success el-icon-circle-check"></i></label> <i class="el-icon-close"
              @click="dataModel = ''"></i></li>
        </ul>
      </div>
      <el-upload v-else v-model="dataModel" :disabled="widget.options.disabled"
        :style="{ 'width': widget.options.width + '%' }" drag class="upload-demo" :action="action"
        :limit="widget.options.length ? widget.options.length : 1" :on-exceed="handleExceed"
        :before-upload="beforeAvatarUpload" :headers="widget.options.headers" :on-success="handleSuccess"
        :file-list="widget.options.fileList" :on-remove="handleRemove" multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">{{ widget.options.uploadText }}</div>
      </el-upload>
    </template>


    <template v-if="widget.type == 'outFileupload'">
      <el-upload v-model="dataModel" :disabled="widget.options.disabled" :style="{ 'width': widget.options.width + '%' }"
        drag class="upload-demo" :action="widget.options.action"
        :limit="widget.options.length ? widget.options.length : 1" :on-exceed="handleExceed"
        :before-upload="beforeAvatarUpload" :headers="widget.options.headers" :on-success="handleSuccess"
        :file-list="widget.options.fileList" :on-remove="handleRemove" :on-preview="handlePreview" multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">{{ widget.options.uploadText }}</div>
      </el-upload>
    </template>

    <template v-if="widget.type == 'dir'">
      <el-input v-model.trim="dataModel" :disabled="widget.options.disabled" :placeholder="widget.options.placeholder"
        :style="{ width: widget.options.width + '%' }">
        <el-button :disabled="widget.options.disabled" v-if="uploadType === 'localFile' || uploadType === ''"
          slot="append" @click="triggerFile" icon="el-icon-folder-opened" title="选择文件夹"></el-button>
      </el-input>
    </template>

    <template v-if="widget.type == 'editor'">
      <fm-editor v-model="dataModel" :width="widget.options.width + '%'" :height="widget.options.height"></fm-editor>
    </template>

    <template v-if="widget.type == 'cascader'">
      <el-cascader v-model="dataModel" :disabled="widget.options.disabled" :clearable="widget.options.clearable"
        :placeholder="widget.options.placeholder" :style="{ width: widget.options.width + '%' }"
        :options="widget.options.remoteOptions"></el-cascader>
    </template>
  </el-form-item>
</template>

<script>
import FmUpload from "./Upload";
import FmEditor from "./Editor/tinymce";
import request from "../util/request.js";
import { Sm3Utils } from "../util/utils/SmCrypto.js";
import { checkFileName } from "../util/index"
import { async } from "q";
export default {
  props: ["widget", "models", "rules", "remote", "isEdit", "action", "uploadType"],
  components: {
    FmUpload,
    FmEditor
  },
  data() {
    return {
      passwordType: {
        pwdType: "password",
        pwdType1: "password"
      },
      isEditArr: [],
      transitInput: "输入账号",
      oldDataModel: "",
      dataModel: this.models[this.widget.model],
      restaurants: [],
      timeout: null
    };
  },
  created() {
    this.$nextTick(() => {
      this.oldDataModel = JSON.stringify(this.dataModel);
    });
    if (this.widget.type == "selectCreate") {
      if (this.dataModel && JSON.parse(this.dataModel).isSingle != undefined) {
        this.dataModel = JSON.parse(this.dataModel);
      }
    }

    if (this.widget.options.isAddAccount) {
      if (this.dataModel.isSingle != undefined) {
        this.widget.options.selectTransit = true;
      } else {
        this.widget.options.selectTransit = false;
      }
    } else {
      this.widget.options.selectTransit = false;
    }
    this.widget.options.passwordDisabled = true;

    this.createAccount();
    if (this.widget.type === "imgupload") {
      this.remote[this.widget.options.tokenFunc](data => {
        this.widget.options.token = data;
      });
    }
    if (this.widget.type === "table") {
      this.dataModel = JSON.parse(this.dataModel);
    }
  },
  mounted() {
    // this.restaurants = this.loadAll();
  },
  methods: {
    createAccount() {
      if (
        this.widget.options.remote &&
        this.remote[this.widget.options.remoteFunc]
      ) {
        this.remote[this.widget.options.remoteFunc](data => {
          this.widget.options.remoteOptions = data.map(item => {
            if (
              item.isDefault &&
              this.widget.type == "selectCreate" &&
              !this.isEdit
            ) {
              this.dataModel = item.value;
            }

            if (
              this.widget.type == "selectCreate" &&
              this.isEdit &&
              !this.widget.options.selectTransit &&
              this.dataModel
            ) {
              if (JSON.parse(item.value).id == JSON.parse(this.dataModel).id) {
                this.dataModel = item.value;
              }
            }
            return {
              value: item[this.widget.options.props.value],
              label: item[this.widget.options.props.label],
              children: item[this.widget.options.props.children]
            };
          });
        });
      }
    },
    showPwd(p) {
      if (this.passwordType[p] === "password") {
        this.passwordType[p] = "";
      } else {
        this.passwordType[p] = "password";
      }
      this.$nextTick(() => {
        this.$refs[p].focus();
      });
    },
    selectTransitC() {
      if (!this.widget.options.selectTransit) {
        this.dataModel = {
          userName: "",
          userPassword: "",
          isSingle: ""
        };
        this.transitInput = "选择账号";
      } else {
        this.dataModel = "";
        this.transitInput = "输入账号";
      }

      this.$emit("clearValidate", this.widget.model);

      this.$set(
        this.widget.options,
        "selectTransit",
        !this.widget.options.selectTransit
      );
    },
    accountEdit() {
      if (
        this.widget.options.remote &&
        this.remote[this.widget.options.remoteFunc]
      ) {
        this.$emit("accountEdit");
      } else {
        this.$message.warning(`当前页面不支持此功能!`);
      }
    },
    editChange() {
      if (this.isEditArr.length > 0) {
        this.oldDataModel = JSON.stringify(this.dataModel);
        this.widget.options.passwordDisabled = false;
        if (this.widget.type == "selectCreate") {
          this.dataModel.userPassword = "";
        } else {
          this.dataModel = "";
        }
      } else {
        this.widget.options.passwordDisabled = true;
        this.dataModel = JSON.parse(this.oldDataModel);
      }
    },
    beforeAvatarUpload(file) {
      let isJPG = true;
      if (this.widget.options.accep) {
        isJPG = this.widget.options.accep.split(",").some(item => {
          return item == file.name.split(".")[file.name.split(".").length - 1];
        });
      }
      const isLt2M = file.size / 1024 / 1024 <= 100;
      const isStr30 = file.name.split(".")[0].length <= 30;
      const isToken =
        this.widget.options.headers.token != undefined ||
        this.widget.options.headers.token != null;
      const isNone = file.size != 0;
      if (!isToken && this.widget.type == 'fileupload') {
        this.$message.warning("当前页面不支持此功能!");
        return false
      }
      if (!isLt2M) {
        this.$message.error("文件大小不能超过 100MB!");
        return false
      }

      if (!isJPG) {
        this.$message.error(
          `文件必须是 ${this.widget.options.accep} 结尾的文件!`
        );
        return false
      }
      if (!checkFileName(file.name)) {
        this.$message.error('文件名只能包含“-”特殊字符，不支持其他特殊字符!');
        return false;
      }
      if (!isStr30) {
        this.$message.error("文件名称长度不能超过30个字符！");
        return false
      }
      if (!isNone) {
        this.$message.error("文件大小不能为 0KB!");
        return false
      }

      if (this.widget.type == 'fileupload') {
        const date = new Date();
        const time = date.getTime();
        const sign = this.dataSign(date, {});
        this.widget.options.headers['Send-Time'] = time;
        this.widget.options.headers['Request-Sign'] = sign;
        return isLt2M && isJPG && isToken && isStr30 && isNone;
      }

      if (this.widget.type == 'outFileupload') {
        return isLt2M && isJPG && isStr30 && isNone;
      }
    },
    dataSign(date, params) {
      var paramNames = [];
      for (var pn in params) {
        paramNames.push(pn);
      }
      paramNames.sort();
      const time = date.getTime();
      const flag = time % 10 % 2;

      var s = '';
      for (let i = 0; i < paramNames.length; i++) {
        s += params[paramNames[i]];
      }
      if (flag === 0) {
        s += flag + '' + time;
      } else {
        s = time + s;
      }

      return Sm3Utils.encryptFromText(s);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`只能上传1个文件!`);
    },
    handleSuccess(response, file, fileList) {
      if (response.success || response.code == 200) {
        this.dataModel = response.data;
        this.$emit("clearValidate", this.widget.model);
      } else {
        this.dataModel = "";
        this.widget.options.fileList = [];
        this.$message.error(response.msg);
      }
    },
    //文件点击下载
    handlePreview() {
      if (this.dataModel && this.dataModel.length) {
        const ele = document.createElement('a');
        ele.setAttribute('href', this.dataModel); //设置下载文件的url地址
        ele.setAttribute('download', this.dataModel); //用于设置下载文件的文件名
        ele.click();
      }
    },
    handleRemove(file) {
      this.dataModel = "";
    },
    triggerFile() {
      // 选择文件
      const fileDirs = window.ipcSendSync('showOpenDialog', {
        properties: ['openDirectory']
      });
      if (!fileDirs[0]) return;
      this.dataModel = fileDirs[0];
    },
    importPlugs() {
      // 选择文件
      let fileArr = []
      if (this.widget.options.accep !== '') {
        fileArr = this.widget.options.accep.split(",");
      }
      console.log(fileArr)
      const fileDirs = window.ipcSendSync('showOpenDialog', {
        properties: ['openFile'],
        filters: [{ name: 'filter', extensions: fileArr }]
      });
      const fileDir = fileDirs[0];
      if (!fileDir) return;
      let isAllowFile = this.widget.options.accep.split(",").some(item => {
        return item == fileDir.split(".")[fileDir.split(".").length - 1];
      });
      if (isAllowFile || !this.widget.options.accep) {
        // 获取插件配置信息
        this.importPlugin(fileDir)
      } else {
        this.$message.error(`文件必须是 ${this.widget.options.accep} 结尾的文件!`)
      }

    },
    importPlugin(fileDir) {
      this.dataModel = fileDir;
      this.$message.success(`文件上传成功`)
    },
    dropListener(e) {
      //阻止默认行为
      e.preventDefault();
      //获取文件列表
      const files = e.dataTransfer.files;

      if (files && files.length > 0) {
        //获取文件路径
        const path = files[0].path;
        const fileName = files[0].name;
        let isAllowFile = this.widget.options.accep.split(",").some(item => {
          return item == fileName.split(".")[fileName.split(".").length - 1];
        });
        if (isAllowFile || !this.widget.options.accep) {
          this.importPlugin(path)
        } else {
          this.$message.error(`文件必须是 ${this.widget.options.accep} 结尾的文件!`)
        }
        console.log('path:', path);
      }
    }
  },
  watch: {
    dataModel: {
      deep: true,
      handler(val) {
        this.models[this.widget.model] = val;
        this.$emit("update:models", {
          ...this.models,
          [this.widget.model]: val
        });
      }
    },
    models: {
      deep: true,
      handler(val) {
        this.dataModel = val[this.widget.model];
      }
    }
  }
};
</script>
<style>
.formItemIsSingle>.el-form-item__content {
  margin-left: auto !important;
}

.formItemIsSingle>.el-form-item__label {
  display: none !important;
}

.formItemIsSingle .el-form-item {
  margin-bottom: 0;
}

.show-pwd {
  position: absolute;
  right: 10px;
  top: 0px;
  font-size: 16px;
  color: #999;
  cursor: pointer;
  user-select: none;
}
</style>
