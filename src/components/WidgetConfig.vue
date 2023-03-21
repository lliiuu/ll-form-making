<template>
    <div v-if="show">
        <el-form label-position="top">
            <el-form-item label="标题" v-if="data.type != 'grid'">
                <el-input size="mini" maxlength="20" placeholder="不能超过20个字" v-model="data.name"></el-input>
            </el-form-item>
            <el-form-item label="组件提示说明" v-if="data.type != 'grid'">
                <el-input size="mini" maxlength="50" placeholder="不能超过50个字" v-model="data.tooltip"></el-input>
            </el-form-item>
            <el-form-item label="组件之间联动" v-if="data.type != 'grid'">
                <el-input size="mini" maxlength="50" placeholder="必须是a=1&&(b=[1]||c!1)的格式"
                    v-model="data.control"></el-input>
            </el-form-item>
            <el-form-item label="宽度(百分比)" v-if="Object.keys(data.options).indexOf('width') >= 0">
                <!-- <el-input  size="mini" v-model="data.options.width"></el-input> -->
                <el-input-number size="mini" :precision="0" :min="0" :max="100" v-model="data.options.width"
                    @change="numberChange('width', 100)" :step="1"></el-input-number>
            </el-form-item>

            <el-form-item label="高度" v-if="Object.keys(data.options).indexOf('height') >= 0">
                <el-input size="mini" v-model="data.options.height"></el-input>
            </el-form-item>
            <el-form-item label="多行文本行数(1-10)" v-if="Object.keys(data.options).indexOf('rows') >= 0">
                <el-input-number size="mini" :precision="0" :min="1" :max="10" v-model="data.options.rows"
                    @change="numberChange('width', 10)" :step="1"></el-input-number>
            </el-form-item>
            <el-form-item label="大小" v-if="Object.keys(data.options).indexOf('size') >= 0">
                宽度：<el-input size="mini" style="width: 90px" type="number"
                    v-model.number="data.options.size.width"></el-input>
                高度：<el-input size="mini" style="width: 90px" type="number"
                    v-model.number="data.options.size.height"></el-input>
            </el-form-item>

            <el-form-item label="占位内容" v-if="
                Object.keys(data.options).indexOf('placeholder') >= 0 &&
                data.type != 'time' &&
                data.type != 'date'
            ">
                <el-input size="mini" maxlength="20" placeholder="不能超过20个字" v-model="data.options.placeholder"></el-input>
            </el-form-item>
            <el-form-item label="布局方式" v-if="Object.keys(data.options).indexOf('inline') >= 0">
                <el-radio-group size="mini" v-model="data.options.inline">
                    <el-radio-button :label="false">块级</el-radio-button>
                    <el-radio-button :label="true">行内</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="显示输入框" v-if="Object.keys(data.options).indexOf('showInput') >= 0">
                <el-switch v-model="data.options.showInput"></el-switch>
            </el-form-item>
            <el-form-item size="mini" label="最小值" v-if="Object.keys(data.options).indexOf('min') >= 0">
                <el-input-number :min="-10000000" :precision="0" :max="data.options.max" v-model="data.options.min"
                    @change="numberChange('min', 0)" :step="1"></el-input-number>
            </el-form-item>
            <el-form-item size="mini" label="最大值" v-if="Object.keys(data.options).indexOf('max') >= 0">
                <el-input-number :min="data.options.min" :precision="0" :max="10000000" v-model="data.options.max"
                    @change="numberChange('max', 100)" :step="1"></el-input-number>
            </el-form-item>
            <el-form-item size="mini" label="步长" v-if="Object.keys(data.options).indexOf('step') >= 0">
                <el-input-number :min="1" :precision="0" :max="data.options.max - data.options.min"
                    v-model="data.options.step" @change="numberChange('step', 1)" :step="1"></el-input-number>
            </el-form-item>
            <el-form-item label="是否多选" v-if="data.type == 'select'">
                <el-switch v-model="data.options.multiple" @change="handleSelectMuliple"></el-switch>
            </el-form-item>
            <el-form-item label="是否可搜索" v-if="data.type == 'select'">
                <el-switch v-model="data.options.filterable"></el-switch>
            </el-form-item>
            <el-form-item label="允许半选" v-if="Object.keys(data.options).indexOf('allowHalf') >= 0">
                <el-switch v-model="data.options.allowHalf"> </el-switch>
            </el-form-item>
            <el-form-item label="支持透明度选择" v-if="Object.keys(data.options).indexOf('showAlpha') >= 0">
                <el-switch v-model="data.options.showAlpha"> </el-switch>
            </el-form-item>
            <el-form-item label="是否显示标签" v-if="
                Object.keys(data.options).indexOf('showLabel') >= 0 &&
                data.type != 'select' &&
                data.type != 'table'
            ">
                <el-switch v-model="data.options.showLabel"> </el-switch>
            </el-form-item>
            <el-form-item label="是否显示每项提示" v-if="data.type == 'radio' || data.type == 'checkbox'">
                <el-switch v-model="data.options.showTooltip"> </el-switch>
            </el-form-item>
            <!--  <el-form-item label="选项类型" v-if="data.type == 'selectCreate'">
          <el-select v-model="data.options.classType">
            <el-option v-for="(item,index) in data.options.classOptions" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      <el-form-item  label="选项" v-if="data.type=='selectCreate'">
        <el-radio-group  size="mini" style="margin-bottom:10px;">
          <el-radio-button >远端数据</el-radio-button>
        </el-radio-group>
        <template>
          <div>
            <el-input size="mini" disabled v-model="data.options.remoteFunc">
              <template slot="prepend">远端方法</template>
            </el-input>
            <el-input size="mini" style="" disabled v-model="data.options.props.value">
              <template slot="prepend">值</template>
            </el-input>
            <el-input size="mini" disabled style="" v-model="data.options.props.label">
              <template slot="prepend">标签</template>
            </el-input>
          </div>
        </template>
      </el-form-item> -->
            <el-form-item :label="data.type != 'table' ? data.type === 'select' ? '选项(不超过100项)' : '选项(不超过10项)' : '单元格设置'"
                v-if="
                    Object.keys(data.options).indexOf('options') >= 0 && data.type != 'selectCreate'
                ">
                <el-radio-group @change="optionChange" v-show="data.type != 'table'" v-model="data.options.remote"
                    size="mini" style="margin-bottom: 10px">
                    <el-radio-button :label="false">静态数据</el-radio-button>
                    <el-radio-button v-if="data.type == 'select'" :label="'add'">批量数据</el-radio-button>
                    <!--  <el-radio-button :label="true">远端数据</el-radio-button> -->
                </el-radio-group>
                <template v-if="data.options.remote === true">
                    <div v-if="false">
                        <el-input size="mini" maxlength="40" placeholder="不能超过40个字" style=""
                            v-model="data.options.remoteFunc">
                            <template slot="prepend">远端方法</template>
                        </el-input>
                        <el-input disabled="disabled" size="mini" style="" v-model="data.options.props.value">
                            <template slot="prepend">值</template>
                        </el-input>
                        <el-input disabled="disabled" size="mini" style="" v-model="data.options.props.label">
                            <template slot="prepend">标签</template>
                        </el-input>
                    </div>
                </template>
                <template v-else-if="data.options.remote === 'add'">
                    <div>
                        <el-input type="textarea" rows="5" size="mini" @blur="batchOnBlur"
                            v-model="data.options.batchString" maxlength="500" placeholder="多个选项之间必须用英文逗号隔开。"></el-input>
                    </div>
                </template>
                <template v-else>
                    <template v-if="
                        data.type == 'radio' ||
                        (data.type == 'select' && !data.options.multiple)
                    ">
                        <el-radio-group v-model="data.options.defaultValue">
                            <draggable element="ul" :list="data.options.options" :options="{
                                group: { name: 'options' },
                                ghostClass: 'ghost',
                                handle: '.drag-item'
                            }">
                                <li v-for="(item, index) in data.options.options.slice(0, 100)" :key="index">
                                    <el-radio :label="item.value" style="margin-right: 5px">
                                        <el-input @change="
                                            radioChange(item.value, data.options.defaultValue)
                                        " @input="itemTextChange(item.value, index)" maxlength="20"
                                            placeholder="不能超过20个字" :style="{
                                                width: data.options.showLabel ? '90px' : '190px'
                                            }" size="mini" v-model="item.value"></el-input>
                                        <el-input @input="itemTextChange(item.label, index)" maxlength="20"
                                            placeholder="不能超过20个字" style="width: 100px" size="mini"
                                            v-if="data.options.showLabel" v-model="item.label"></el-input>
                                        <br />
                                        <el-input maxlength="50" placeholder="提示信息不能超过50个字"
                                            style="width: 190px; float: right" size="mini" v-if="data.options.showTooltip"
                                            v-model="item.tooltip"></el-input>
                                        <!-- <input v-model="item.value"/> -->
                                    </el-radio>
                                    <i class="drag-item" style="font-size: 16px; margin: 0 5px; cursor: move"><i
                                            class="iconfont icon-icon_bars"></i></i>
                                    <el-button v-show="data.options.options.length > 1" @click="handleOptionsRemove(index)"
                                        circle plain type="danger" size="mini" icon="el-icon-minus"
                                        style="padding: 4px; margin-left: 5px"></el-button>
                                </li>
                            </draggable>
                        </el-radio-group>
                    </template>

                    <template v-if="
                        data.type == 'checkbox' ||
                        (data.type == 'select' && data.options.multiple)
                    ">
                        <el-checkbox-group v-model="data.options.defaultValue">
                            <draggable element="ul" :list="data.options.options" :options="{
                                group: { name: 'options' },
                                ghostClass: 'ghost',
                                handle: '.drag-item'
                            }">
                                <li v-for="(item, index) in data.options.options" :key="index">
                                    <el-checkbox :label="item.value" style="margin-right: 5px">
                                        <el-input @change="checkboxChange(data.options.defaultValue)"
                                            @input="itemTextChange(item.value, index)" maxlength="20" placeholder="不能超过20个字"
                                            :style="{
                                                width: data.options.showLabel ? '90px' : '190px'
                                            }" size="mini" v-model="item.value"></el-input>
                                        <el-input @input="itemTextChange(item.label, index)" maxlength="20"
                                            placeholder="不能超过20个字" style="width: 100px" size="mini"
                                            v-if="data.options.showLabel" v-model="item.label"></el-input>
                                        <br />
                                        <el-input maxlength="50" placeholder="提示信息不能超过50个字"
                                            style="width: 190px; float: right" size="mini" v-if="data.options.showTooltip"
                                            v-model="item.tooltip"></el-input>
                                    </el-checkbox>
                                    <i class="drag-item" style="font-size: 16px; margin: 0 5px; cursor: move"><i
                                            class="iconfont icon-icon_bars"></i></i>
                                    <el-button v-show="data.options.options.length > 2" @click="handleOptionsRemove(index)"
                                        circle plain type="danger" size="mini" icon="el-icon-minus"
                                        style="padding: 4px; margin-left: 5px"></el-button>
                                </li>
                            </draggable>
                        </el-checkbox-group>
                    </template>

                    <template v-if="data.type == 'table'">
                        <div>
                            <label :style="{
                                width: '30px',
                                'font-size': '12px',
                                display: 'inline-block'
                            }">过滤</label>
                            <label :style="{
                                width: data.options.showLabel ? '90px' : '190px',
                                'font-size': '12px',
                                display: 'inline-block'
                            }">名称</label>
                            <label :style="{
                                width: data.options.showLabel ? '90px' : '190px',
                                'font-size': '12px',
                                display: 'inline-block'
                            }">标题</label>
                        </div>
                        <draggable element="ul" :list="data.options.labelOptions" :options="{
                            group: { name: 'options' },
                            ghostClass: 'ghost',
                            handle: '.drag-item'
                        }">
                            <li v-for="(item, index) in data.options.labelOptions"
                                style="margin-bottom: 10px; list-style: none" :key="index">
                                <el-checkbox v-model="item.isSearch" style="margin-right: 5px">
                                </el-checkbox>
                                <el-input :style="{ width: data.options.showLabel ? '90px' : '190px' }" size="mini"
                                    v-model="item.value"></el-input>
                                <el-input style="width: 100px" size="mini" v-if="data.options.showLabel"
                                    v-model="item.label"></el-input>
                                <i class="drag-item" style="font-size: 16px; margin: 0 5px; cursor: move"><i
                                        class="iconfont icon-icon_bars"></i></i>
                                <el-button @click="handleOptionsRemove(index)" circle plain type="danger" size="mini"
                                    icon="el-icon-minus" style="padding: 4px; margin-left: 5px"></el-button>
                            </li>
                        </draggable>
                    </template>

                    <div v-if="data.type !== 'select' && data.options.options.length < 10" style="margin-left: 22px">
                        <el-button type="text" @click="handleAddOption">{{
                            data.type != 'table' ? '添加选项' : '添加单元格'
                        }}</el-button>
                    </div>
                    <div v-if="data.type === 'select' && data.options.options.length < 100" style="margin-left: 22px">
                        <el-button type="text" @click="handleAddOption">{{
                            data.type != 'table' ? '添加选项' : '添加单元格'
                        }}</el-button>
                    </div>
                </template>
            </el-form-item>

            <el-form-item label="远端数据" v-if="data.type == 'cascader'">
                <div>
                    <el-input size="mini" style="" v-model="data.options.remoteFunc">
                        <template slot="prepend">远端方法</template>
                    </el-input>
                    <el-input size="mini" style="" v-model="data.options.props.value">
                        <template slot="prepend">值</template>
                    </el-input>
                    <el-input size="mini" style="" v-model="data.options.props.label">
                        <template slot="prepend">标签</template>
                    </el-input>
                    <el-input size="mini" style="" v-model="data.options.props.children">
                        <template slot="prepend">子选项</template>
                    </el-input>
                </div>
            </el-form-item>

            <el-form-item label="默认值" v-if="
                Object.keys(data.options).indexOf('defaultValue') >= 0 &&
                (data.type == 'textarea' ||
                    data.type == 'input' ||
                    data.type == 'rate' ||
                    data.type == 'color' ||
                    data.type == 'switch')
            ">
                <el-input size="mini" maxlength="50" placeholder="不能超过50个字" v-if="data.type == 'textarea'" type="textarea"
                    :rows="5" v-model="data.options.defaultValue"></el-input>
                <el-input size="mini" maxlength="50" placeholder="不能超过50个字" v-if="data.type == 'input'"
                    v-model="data.options.defaultValue"></el-input>
                <el-rate v-if="data.type == 'rate'" style="display: inline-block; vertical-align: middle"
                    :max="data.options.max" :allow-half="data.options.allowHalf"
                    v-model="data.options.defaultValue"></el-rate>
                <el-button type="text" v-if="data.type == 'rate'"
                    style="display: inline-block; vertical-align: middle; margin-left: 10px"
                    @click="data.options.defaultValue = 0">清空</el-button>
                <el-color-picker v-if="data.type == 'color'" v-model="data.options.defaultValue"
                    :show-alpha="data.options.showAlpha"></el-color-picker>
                <el-switch v-if="data.type == 'switch'" active-value="true" inactive-value="false"
                    v-model="data.options.defaultValue"></el-switch>
            </el-form-item>

            <template v-if="data.type == 'time' || data.type == 'date'">
                <el-form-item label="显示类型" v-if="data.type == 'date'">
                    <el-select size="mini" @change="dataSelect(data.options.type)" v-model="data.options.type">
                        <el-option value="year"></el-option>
                        <el-option value="month"></el-option>
                        <el-option value="date"></el-option>
                        <el-option value="dates"></el-option>
                        <!-- <el-option value="week"></el-option> -->
                        <el-option value="datetime"></el-option>
                        <el-option value="datetimerange"></el-option>
                        <el-option value="daterange"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否为范围选择" v-if="data.type == 'time'">
                    <el-switch v-model="data.options.isRange"> </el-switch>
                </el-form-item>
                <!-- <el-form-item label="是否获取时间戳" v-if="data.type == 'date'">
          <el-switch
            v-model="data.options.timestamp"
          >
          </el-switch>
        </el-form-item> -->
                <el-form-item label="占位内容" v-if="
                    (!data.options.isRange && data.type == 'time') ||
                    (data.type != 'time' &&
                        data.options.type != 'datetimerange' &&
                        data.options.type != 'daterange')
                ">
                    <el-input size="mini" maxlength="20" placeholder="不超过20个字"
                        v-model="data.options.placeholder"></el-input>
                </el-form-item>
                <el-form-item label="开始时间占位内容" v-if="
                    data.options.isRange ||
                    data.options.type == 'datetimerange' ||
                    data.options.type == 'daterange'
                ">
                    <el-input size="mini" maxlength="20" placeholder="不超过20个字"
                        v-model="data.options.startPlaceholder"></el-input>
                </el-form-item>
                <el-form-item label="结束时间占位内容" v-if="
                    data.options.isRange ||
                    data.options.type == 'datetimerange' ||
                    data.options.type == 'daterange'
                ">
                    <el-input size="mini" maxlength="20" placeholder="不超过20个字"
                        v-model="data.options.endPlaceholder"></el-input>
                </el-form-item>
                <el-form-item label="格式">
                    <el-input disabled="disabled" size="mini" v-model="data.options.format"></el-input>
                </el-form-item>
                <el-form-item label="默认值" v-if="data.type == 'time' && Object.keys(data.options).indexOf('isRange') >= 0">
                    <el-time-picker key="1" style="width: 100%" v-if="!data.options.isRange"
                        v-model="data.options.defaultValue" :arrowControl="data.options.arrowControl"
                        :value-format="data.options.format">
                    </el-time-picker>
                    <el-time-picker key="2" v-if="data.options.isRange" style="width: 100%"
                        v-model="data.options.defaultValue" is-range :arrowControl="data.options.arrowControl"
                        :value-format="data.options.format">
                    </el-time-picker>
                </el-form-item>
            </template>

            <template v-if="data.type == 'imgupload'">
                <el-form-item label="最大上传数">
                    <el-input type="number" v-model.number="data.options.length"></el-input>
                </el-form-item>
                <el-form-item label="Domain" :required="true">
                    <el-input v-model="data.options.domain"></el-input>
                </el-form-item>
                <el-form-item label="获取七牛Token方法" :required="true">
                    <el-input v-model="data.options.tokenFunc"></el-input>
                </el-form-item>
            </template>
            <template v-if="data.type == 'fileupload' || data.type == 'outFileupload'">

                <el-form-item v-if="data.type == 'outFileupload'" label="上传路径action" :required="true">
                    <template slot="label">
                        上传路径action
                        <el-tooltip class="item" effect="dark"
                            content="上传成功返回格式：{code: 200, data: 'https://.....',success: true}" placement="top"> <i
                                class="el-icon-warning" style="color:#E6A23C;"></i>
                        </el-tooltip>
                    </template>
                    <el-input size="mini" @blur="modelOnBlur('action')" type="url" maxlength="80"
                        placeholder="必须是url地址,且不能超过80个字" v-model="data.options.action"></el-input>
                </el-form-item>

                <el-form-item label="上传文件提示信息">
                    <el-input size="mini" type="text" maxlength="20" placeholder="不能超过20个字"
                        v-model="data.options.uploadText"></el-input>
                </el-form-item>
                <el-form-item label="上传文件类型(逗号隔开)">
                    <el-input size="mini" type="text" maxlength="40" placeholder="不能超过40个字"
                        v-model="data.options.accep"></el-input>
                </el-form-item>

                <el-form-item label="最大上传数">
                    <el-input size="mini" type="number" min="0" @input="
                        data.options.length = data.options.length > 8 ? 8 : data.options.length
                    " max="8" disabled onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode) ) )"
                        v-model.number="data.options.length"></el-input>
                </el-form-item>
            </template>
            <template v-if="data.type == 'blank'">
                <el-form-item label="绑定数据类型">
                    <el-select v-model="data.options.defaultType">
                        <el-option value="String" label="字符"></el-option>
                        <el-option value="Object" label="对象"></el-option>
                        <el-option value="Array" label="数组"></el-option>
                    </el-select>
                </el-form-item>
            </template>

            <template v-if="data.type == 'grid'">
                <el-form-item label="栅格间隔">
                    <el-tooltip class="item" effect="dark" content="栅格间隔不能超过400" placement="top">
                        <!-- <el-input size="mini" type="number" min="0" @input="data.options.gutter = data.options.gutter>400 ? 400 : data.options.gutter" max="400" onkeypress='return( /[\d]/.test(String.fromCharCode(event.keyCode) ) )' v-model.number="data.options.gutter"></el-input> -->

                        <el-input-number size="mini" :precision="0" v-model.number="data.options.gutter"
                            @change="numberChange('gutter', 0)" :min="0" :max="400" :step="1"></el-input-number>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="列配置项(不能超过5列)">
                    <draggable element="ul" :list="data.columns" :options="{
                        group: { name: 'options' },
                        ghostClass: 'ghost',
                        handle: '.drag-item'
                    }">
                        <li v-for="(item, index) in data.columns" :key="index">
                            <i class="drag-item" style="font-size: 16px; margin: 0 5px; cursor: move"><i
                                    class="iconfont icon-icon_bars"></i></i>
                            <el-tooltip class="item" effect="dark" content="栅格值只能是0-24之间的整数" placement="left">
                                <el-input @input="itemColumnsChange(item.span, index)" min="0" max="24" placeholder="栅格值"
                                    size="mini" style="width: 100px" type="text" v-model="item.span"></el-input>
                            </el-tooltip>
                            <el-button @click="handleOptionsRemove(index)" circle plain type="danger" size="mini"
                                icon="el-icon-minus" style="padding: 4px; margin-left: 5px"></el-button>
                        </li>
                    </draggable>
                    <div style="margin-left: 22px">
                        <el-button type="text" v-if="data.columns.length < 5" @click="handleAddColumn">添加列</el-button>
                    </div>
                </el-form-item>
                <el-form-item label="水平排列方式">
                    <el-select size="mini" v-model="data.options.justify">
                        <el-option value="start" label="左对齐"></el-option>
                        <el-option value="end" label="右对齐"></el-option>
                        <el-option value="center" label="居中"></el-option>
                        <el-option value="space-around" label="两侧间隔相等"></el-option>
                        <el-option value="space-between" label="两端对齐"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="垂直排列方式">
                    <el-select size="mini" v-model="data.options.align">
                        <el-option value="top" label="顶部对齐"></el-option>
                        <el-option value="middle" label="居中"></el-option>
                        <el-option value="bottom" label="底部对齐"></el-option>
                    </el-select>
                </el-form-item>
            </template>
            <template v-if="data.type == 'table'">
                <el-form-item label="数据获取接口" :required="true">
                    <el-input size="mini" v-model="data.options.action"></el-input>
                </el-form-item>
            </template>
            <template v-if="data.type != 'grid'">
                <el-form-item label="数据绑定Key" :required="true">
                    <el-input @blur="modelOnBlur('model')" size="mini" maxlength="40" placeholder="不能超过40个字"
                        v-model="data.model"></el-input>
                </el-form-item>
                <el-form-item v-if="data.type != 'table'" label="操作属性">
                    <el-checkbox v-model="data.options.readonly" v-if="
                        Object.keys(data.options).indexOf('readonly') >= 0 &&
                        !data.options.required
                    ">完全只读</el-checkbox>
                    <el-checkbox v-model="data.options.disabled" v-if="
                        Object.keys(data.options).indexOf('disabled') >= 0 &&
                        !data.options.required
                    ">禁用
                    </el-checkbox>
                    <el-checkbox v-model="data.options.editable"
                        v-if="Object.keys(data.options).indexOf('editable') >= 0">文本框可输入</el-checkbox>
                    <el-checkbox v-model="data.options.clearable"
                        v-if="Object.keys(data.options).indexOf('clearable') >= 0">显示清除按钮</el-checkbox>
                    <el-checkbox v-model="data.options.arrowControl"
                        v-if="Object.keys(data.options).indexOf('arrowControl') >= 0">使用箭头进行时间选择</el-checkbox>
                </el-form-item>
                <el-form-item v-if="data.type == 'input'" label="是否加密">
                    <div>
                        <el-checkbox v-model="data.options.isEncryption">加密</el-checkbox>
                    </div>
                </el-form-item>
                <el-form-item v-if="data.type != 'table'" label="校验">
                    <div>
                        <el-checkbox v-if="!data.options.disabled && !data.options.readonly"
                            v-model="data.options.required">必填</el-checkbox>
                    </div>
                    <el-select v-if="Object.keys(data.options).indexOf('dataType') >= 0" v-model="data.options.dataType"
                        size="mini">
                        <el-option value="string" label="字符串"></el-option>
                        <el-option value="number" label="数字"></el-option>
                        <!-- <el-option value="boolean" label="布尔值"></el-option>
            <el-option value="integer" label="整数"></el-option>
            <el-option value="float" label="浮点数"></el-option> -->
                        <el-option value="url" label="URL地址"></el-option>
                        <el-option value="email" label="邮箱地址"></el-option>
                        <!-- <el-option value="hex" label="十六进制"></el-option> -->
                    </el-select>

                    <div v-if="
                        Object.keys(data.options).indexOf('pattern') >= 0 &&
                        data.options.dataType != 'number' &&
                        data.options.dataType != 'url' &&
                        data.options.dataType != 'email'
                    ">
                        <el-tooltip class="item" effect="dark" content="不能超过100个字" placement="top">
                            <el-input size="mini" maxlength="100" v-model.lazy="data.options.pattern" style="width: 240px"
                                placeholder="填写正则表达式"></el-input>
                        </el-tooltip>
                    </div>

                    <div v-if="Object.keys(data.options).indexOf('pattern') >= 0">
                        <el-tooltip class="item" effect="dark" content="不能超过50个字" placement="top">
                            <el-input size="mini" maxlength="50" v-model.lazy="data.options.patternError"
                                style="width: 240px" placeholder="请填写格式错误验证提示"></el-input>
                        </el-tooltip>
                    </div>
                </el-form-item>
            </template>
        </el-form>
    </div>
</template>

<script>
import Draggable from 'vuedraggable';
import { regEn, regCn } from '@/util/index';

export default {
    components: {
        Draggable
    },
    props: ['data', 'listData'],
    data() {
        return {
            validator: {
                type: null,
                required: null,
                pattern: null,
                range: null,
                length: null
            }
        };
    },
    computed: {
        show() {
            if (this.data && Object.keys(this.data).length > 0) {
                return true;
            }
            return false;
        }
    },
    mounted() { },
    methods: {
        //单选框下拉框默认单选默认值删选
        radioChange(r, d) {
            if (r !== d) {
                this.data.options.defaultValue = '';
            }
        },
        //多选框下拉框默认多选默认值删选，必须是已有的下拉框
        checkboxChange(v) {
            this.data.options.defaultValue = this.data.options.defaultValue.filter(
                (item, index) => {
                    let result = this.data.options.options.some((citem) => {
                        if (item === citem.value) {
                            return true;
                        }
                    });
                    return result;
                }
            );
        },
        controlOnBlur() {
            const len = this.data.control.split('=').length,
                len1 = this.data.control.split('!').length;
            if (this.data.control && len != 2 && len1 != 2) {
                this.$message({
                    message: '组件之间联动格式不正确,必须是xx=xx或者xx!xx格式！',
                    type: 'error'
                });
                this.data.control = '';
            }
        },
        optionChange() {
            if (this.data.type === 'select' && this.data.options.remote === 'add') {
                // let batchArr = this.data.options.batchString.split(',').map(itemChild => ({value:itemChild,label:itemChild}));
                // this.data.options.options = batchArr;
                let batchString = '';
                this.data.options.options.forEach(
                    (item, index) =>
                    (batchString +=
                        index != this.data.options.options.length - 1
                            ? item.value + ','
                            : item.value)
                );

                this.data.options.batchString = batchString;
            }
        },
        batchOnBlur() {
            if (this.data.options.batchString.split(',').length > 100) {
                let total = 0;
                this.data.options.batchString.split(',').forEach((item, index) => {
                    if (index < 100) {
                        total += item.length;
                    }
                });
                this.data.options.batchString = this.data.options.batchString.slice(0, total + 99);
                this.$message({
                    message: '批量数据逗号分隔数量不能超过100个！',
                    type: 'error'
                });
            }
            let batchArr = this.data.options.batchString
                .split(',')
                .map((itemChild) => ({ value: itemChild, label: itemChild }));
            this.data.options.options = batchArr;
        },
        modelRepeat(list, word) {
            //判断数据key值不能有重复
            for (let i = 0; i < list.length; i++) {
                if (list[i].type === 'grid') {
                    list[i].columns.forEach((item) => {
                        this.modelRepeat(item.list, word);
                    });
                } else {
                    if (list[i].key != this.data.key && list[i].model == this.data[word]) {
                        this.$message({
                            message: '数据绑定key不能与其他组件的key值重复!',
                            type: 'error'
                        });
                        const key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999);
                        this.data[word] = this.data.type + '_' + key;
                    }
                }
            }
        },
        modelOnBlur(word) {
            let isRepeatMsg =
                '数据绑定key不能是默认参数列表中的"参数名称":centerUrl,fileUrl,taskRunTime,workspace,runId,stepNames,paramFile,stepParam!';
            let isRepeat =
                this.data[word] === 'centerUrl' ||
                this.data[word] === 'fileUrl' ||
                this.data[word] === 'taskRunTime' ||
                this.data[word] === 'workspace' ||
                this.data[word] === 'runId' ||
                this.data[word] === 'stepNames' ||
                this.data[word] === 'paramFile' ||
                this.data[word] === 'stepParam';

            if (!this.data[word] && word == 'model') {
                this.$message({
                    message: '数据绑定key不能为空!',
                    type: 'error'
                });
                const key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999);
                this.data[word] = this.data.type + '_' + key;
            } else if (this.data[word] && word == 'model') {
                if (isRepeat) {
                    this.$message({
                        message: isRepeatMsg,
                        type: 'error'
                    });
                    const key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999);
                    this.data[word] = this.data.type + '_' + key;
                } else {
                    this.modelRepeat(this.listData.list, word);
                }
            }
            if (!this.data.options[word] && word == 'action') {
                this.$message({
                    message: '上传路径action不能为空!',
                    type: 'error'
                });
                this.data.options[word] = 'http://192.168.3.78/file/upload';
            } else if (this.data.options[word] && word == 'action') {
                const reUrl01 = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/;
                if (!reUrl01.test(this.data.options[word])) {
                    this.$message({
                        message: '上传路径必须是url地址！',
                        type: 'error'
                    });
                    this.data.options.action = 'http://192.168.3.78/file/upload';
                }
            }
        },
        itemTextChange(item, index) {
            // const regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
            //      regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
            if (regEn.test(item) || regCn.test(item)) {
                this.$message({
                    message: '请输入中文、字母、数字、下划线、短横线！',
                    type: 'error'
                });
                this.data.options.options[index].value = this.data.options.options[index].value
                    .replace(/[`~!@#$%^&*()+<>?:"{},=\\.\/;'[\]]/g, '')
                    .replace(/[·！#￥（——）：；“”‘、|《》？、 【】[\]]/g, '');
                this.data.options.options[index].label = this.data.options.options[index].label
                    .replace(/[`~!@#$%^&*()+<>?:"{},=\\.\/;'[\]]/g, '')
                    .replace(/[·！#￥（——）：；“”‘、|《》？、 【】[\]]/g, '');
            }
        },
        itemColumnsChange(item, index) {
            this.data.columns[index].span = Number(item.replace(/[^\d]/g, ''));
            if (item > 24) {
                this.data.columns[index].span = 24;
            }
        },
        dataSelect(type) {
            if (type == 'year') {
                this.data.options.format = 'yyyy';
            } else if (type == 'month') {
                this.data.options.format = 'yyyy-MM';
            } else if (type == 'date' || type == 'dates' || type == 'daterange') {
                this.data.options.format = 'yyyy-MM-dd';
            } else if (type == 'datetimerange' || type == 'datetime') {
                this.data.options.format = 'yyyy-MM-dd HH:mm:ss';
            }
        },
        numberChange(attr, value) {
            this.$nextTick(() => {
                this.data.options[attr] =
                    this.data.options[attr] == undefined ? value : this.data.options[attr];
            });
        },
        handleOptionsRemove(index) {
            if (this.data.type === 'grid') {
                this.data.columns.splice(index, 1);
            } else {
                if (this.data.type === 'table') {
                    this.data.options.labelOptions.splice(index, 1);
                } else {
                    if (
                        this.data.type == 'checkbox' ||
                        (this.data.type == 'select' && this.data.options.multiple)
                    ) {
                        this.data.options.defaultValue = this.data.options.defaultValue.filter(
                            (item) => item != this.data.options.options[index].value
                        );
                    } else {
                        if (
                            this.data.options.defaultValue == this.data.options.options[index].value
                        ) {
                            this.data.options.defaultValue = '';
                        }
                    }
                    this.data.options.options.splice(index, 1);
                }
            }
        },
        handleAddOption() {
            if (this.data.options.showLabel) {
                if (this.data.type === 'table') {
                    this.data.options.labelOptions.push({
                        value: '新选项',
                        label: '新选项'
                    });
                } else {
                    this.data.options.options.push({
                        value: '新选项',
                        label: '新选项'
                    });
                }
            } else {
                if (this.data.type === 'table') {
                    this.data.options.labelOptions.push({
                        value: '新选项',
                        label: '新选项'
                    });
                } else {
                    this.data.options.options.push({
                        value: '新选项',
                        label: '新选项'
                    });
                }
            }
        },
        handleAddColumn() {
            this.data.columns.push({
                span: '',
                list: []
            });
        },
        generateRule() {
            this.data.rules = [];
            Object.keys(this.validator).forEach((key) => {
                if (this.validator[key]) {
                    this.data.rules.push(this.validator[key]);
                }
            });
        },
        handleSelectMuliple(value) {
            if (value) {
                if (this.data.options.defaultValue) {
                    this.data.options.defaultValue = [this.data.options.defaultValue];
                } else {
                    this.data.options.defaultValue = [];
                }
            } else {
                if (this.data.options.defaultValue.length > 0) {
                    this.data.options.defaultValue = this.data.options.defaultValue[0];
                } else {
                    this.data.options.defaultValue = '';
                }
            }
        },
        errorTipsRule() {
            if (this.data.options.required) {
                this.validator.required = {
                    required: true,
                    message: `${this.data.name}不能为空。`
                };
            } else {
                this.validator.required = null;
            }

            if (!this.show) {
                return false;
            }

            if (this.data.options.dataType) {
                if (this.data.options.dataType == 'number') {
                    this.validator.type = {
                        pattern: '^-?[0-9]+(.[0-9]+)?$',
                        message: this.data.options.patternError
                            ? this.data.options.patternError
                            : this.data.name + '格式不正确。'
                    };
                } else {
                    this.validator.type = {
                        type: this.data.options.dataType,
                        message: this.data.options.patternError
                            ? this.data.options.patternError
                            : this.data.name + '格式不正确。'
                    };
                }
            } else {
                this.validator.type = null;
            }

            if (this.data.options.pattern) {
                this.validator.pattern = {
                    pattern: this.data.options.pattern,
                    message: this.data.options.patternError
                        ? this.data.options.patternError
                        : this.data.name + '格式不匹配。'
                };
            } else {
                this.validator.pattern = null;
            }

            this.$nextTick(() => {
                this.generateRule();
            });
        }
    },
    watch: {
        'data.options.options': function (val) { },
        'data.options.isRange': function (val) {
            if (typeof val !== 'undefined') {
                if (val) {
                    this.data.options.defaultValue = null;
                } else {
                    if (Object.keys(this.data.options).indexOf('defaultValue') >= 0)
                        this.data.options.defaultValue = '';
                }
            }
        },
        'data.options.required': function (val) {
            if (val) {
                this.validator.required = {
                    required: true,
                    message: `${this.data.name}不能为空。`
                };
            } else {
                this.validator.required = null;
            }

            this.$nextTick(() => {
                this.generateRule();
            });
        },
        'data.options.dataType': function (val) {
            if (!this.show) {
                return false;
            }

            if (val) {
                if (val == 'number') {
                    this.validator.type = {
                        pattern: '^-?[0-9]+(.[0-9]+)?$',
                        message: this.data.options.patternError
                            ? this.data.options.patternError
                            : this.data.name + '格式不正确。'
                    };
                } else {
                    this.validator.type = {
                        type: val,
                        message: this.data.options.patternError
                            ? this.data.options.patternError
                            : this.data.name + '格式不正确。'
                    };
                }
            } else {
                this.validator.type = null;
            }

            this.generateRule();
        },
        'data.options.pattern': function (val) {
            if (!this.show) {
                return false;
            }

            if (val) {
                this.validator.pattern = {
                    pattern: val,
                    message: this.data.options.patternError
                        ? this.data.options.patternError
                        : this.data.name + '格式不匹配。'
                };
            } else {
                this.validator.pattern = null;
            }

            this.generateRule();
        },
        'data.name': function (val, oldVal) {
            if (this.data.name === undefined) return false;
            this.errorTipsRule();
            // const regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
            //       regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;

            if (regEn.test(val) || regCn.test(val)) {
                this.$message({
                    message: '请输入中文、字母、数字、下划线、短横线!',
                    type: 'error'
                });
                this.data.name = oldVal;
            }
        },
        'data.options.patternError': function (val) {
            if (this.data.patternError === undefined) return false;
            this.errorTipsRule();
        },
        'data.model': function (val, oldVal) {
            if (this.data.model === undefined) return false;
            const modelReg = /^[a-zA-Z]([a-zA-Z0-9_-]{0,50})$/;
            if (val && !modelReg.test(val)) {
                this.$message({
                    message: '请输入以字母开头,且只能包含数字、英文字母、短横线及下划线！',
                    type: 'error'
                });
                this.data.model = oldVal;
            }
            if (this.data.type !== 'selectCreate') {
                this.data.options.remoteFunc = 'func_' + this.data.model;
            }
        },
        // 'data.options.remoteFunc':function(val,oldVal){
        //   const modelReg = /^[a-zA-Z]([a-zA-Z0-9_-]{0,50})$/;
        //   if(val && !modelReg.test(val)) {
        //     this.$message({
        //       message: '远端方法必须以字母开头,只能包含数字、英文字母及下划线,且不超过40个字！',
        //       type: 'error'
        //     });
        //    this.data.options.remoteFunc = oldVal;
        //   }
        // },
        'data.options.placeholder': function (val, oldVal) {
            // const regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
            //       regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
            if (regEn.test(val) || regCn.test(val)) {
                this.$message({
                    message: '请输入中文、字母、数字、下划线、短横线！',
                    type: 'error'
                });
                this.data.options.placeholder = oldVal;
            }
        },
        'data.options.startPlaceholder': function (val, oldVal) {
            // const regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
            //       regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
            if (regEn.test(val) || regCn.test(val)) {
                this.$message({
                    message: '请输入中文、字母、数字、下划线、短横线！',
                    type: 'error'
                });
                this.data.options.startPlaceholder = oldVal;
            }
        },
        'data.options.endPlaceholder': function (val, oldVal) {
            // const regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
            //       regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
            if (regEn.test(val) || regCn.test(val)) {
                this.$message({
                    message: '请输入中文、字母、数字、下划线、短横线！',
                    type: 'error'
                });
                this.data.options.endPlaceholder = oldVal;
            }
        },
        'data.options.accep': function (val, oldVal) {
            const regEn = /^[A-Za-z0-9,]+$/;
            if (val && !regEn.test(val)) {
                this.$message({
                    message: '请输入字母、数字、英文逗号！',
                    type: 'error'
                });
                this.data.options.accep = oldVal;
            }
        },
        'data.options.uploadText': function (val, oldVal) {
            const regEn1 = /[`~!@#$%^&*()+<>?:"{},=\\.\/;'[\]]/im;
            const regCn1 = /[·！#￥（——）：；“”‘、。|《》？、 【】[\]]/im;
            if (regEn1.test(val) || regCn1.test(val)) {
                this.$message({
                    message: '请输入中文、字母、数字、下划线、短横线、中文逗号！',
                    type: 'error'
                });
                this.data.options.uploadText = oldVal;
            }
        }
    }
};
</script>
