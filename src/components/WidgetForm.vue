<template>
  <div class="widget-form-container upload-container">
    <el-form :size="data.config.size" :label-position="data.config.labelPosition" :label-width="data.config.labelWidth + 'px'">
      
      <draggable class="widget-form-list" 
        
        v-model="data.list" 
        :options="{group:'people', ghostClass: 'ghost',animation:400}"
        @end="handleMoveEnd"
        @add="handleWidgetAdd"
      >

        <template v-for="(element, index) in data.list">
          <template v-if="element.type == 'grid'">
            <div v-if="element && element.key"  class="widget-grid-container data-grid" :key="element.key" style="position: relative;">
              <el-row class="widget-grid "
                type="flex"
                :class="{active: selectWidget.key == element.key}"
                :gutter="element.options.gutter ? element.options.gutter : 0"
                :justify="element.options.justify"
                :align="element.options.align"
                @click.native="handleSelectWidget(index)">
                <el-col  v-for="(col, colIndex) in element.columns" :key="colIndex" :span="col.span ? col.span : 0">
                  <div style="border: 1px dashed #999;">
                    <draggable
                      class="widget-form-list" 
                      style="padding-bottom: 50px;"
                      v-model="col.list"
                      filter="widget-grid-container"
                      :options="{group:'people', ghostClass: 'ghost',animation:400}"
                      @end="handleMoveEnd"
                      @add="handleWidgetColAdd($event, element, colIndex)"
                    >
                      <widget-form-item 
                        v-for="(el, i) in col.list"
                        :key="el.key"
                        v-if="el.key"
                        :element="el" 
                        :select.sync="selectWidget" 
                        :index="i" 
                        :data="col"></widget-form-item>
                    </draggable>
                  </div>
                </el-col>
                
              </el-row>
              <el-button title="删除" style="bottom: -20px;" @click.stop="handleWidgetDelete(index)" class="widget-action-delete" v-if="selectWidget.key == element.key" circle plain type="danger">
                <!-- <icon name="icon-trash" style="width: 12px;height: 12px;"></icon> -->
                <i style="font-size:16px;" class="el-icon-delete"></i>
              </el-button>
            </div>
          </template>
          <template v-else>
            <widget-form-item v-if="element && element.key"  :key="element.key" :element="element" :select.sync="selectWidget" :index="index" :data="data"></widget-form-item>
          </template>
        </template>
            
      </draggable>
    </el-form>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import WidgetFormItem from './WidgetFormItem'

export default {
  components: {
    Draggable,
    WidgetFormItem
  },
  props: ['data', 'select'],
  data () {
    return {
      selectWidget: this.select
    }
  },
  mounted () {
    document.body.ondrop = function (event) {
      let isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
      if (isFirefox) {
        event.preventDefault()
        event.stopPropagation()
      }
    }
  },
  methods: {
    handleMoveEnd ({newIndex, oldIndex}) {
      console.log('index', newIndex, oldIndex)
    },
    handleSelectWidget (index) {
      console.log(index, '#####')
      this.selectWidget = this.data.list[index]
    },
    handleWidgetAdd (evt) {
      console.log('add', evt)
      console.log('end', evt)
      const newIndex = evt.newIndex
      const to = evt.to
      console.log(to)
      
      //为拖拽到容器的元素添加唯一 key
      const key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999);
      let remoteFuncName = '';
      let modelName = '';
      if(this.data.list[newIndex].type === 'selectCreate'){
        remoteFuncName = 'selectCreate';
      }else{
        remoteFuncName = key;
      }
      if(this.data.list[newIndex].model){
        modelName = this.data.list[newIndex].model;
      }else{
        modelName = this.data.list[newIndex].type + '_' + key;
      }
      this.$set(this.data.list, newIndex, {
        ...this.data.list[newIndex],
        options: {
          ...this.data.list[newIndex].options,
          remoteFunc: 'func_' + remoteFuncName
        },
        key,
        // 绑定键值
        model: modelName,
        rules: []
      })
      if (this.data.list[newIndex].type === 'radio' || this.data.list[newIndex].type === 'checkbox' || this.data.list[newIndex].type === 'select' || this.data.list[newIndex].type === 'table') {
        this.$set(this.data.list, newIndex, {
          ...this.data.list[newIndex],
          options: {
            ...this.data.list[newIndex].options,
            options: this.data.list[newIndex].options.options.map(item => ({
              ...item
            }))
          }
        })
      }

      if(this.data.list[newIndex].type === 'table'){
          this.$set(this.data.list, newIndex, {
          ...this.data.list[newIndex],
          options: {
            ...this.data.list[newIndex].options,
            labelOptions: this.data.list[newIndex].options.labelOptions.map(item => ({
              ...item
            }))
          }
        })
      }

      if (this.data.list[newIndex].type === 'grid') {
        this.$set(this.data.list, newIndex, {
          ...this.data.list[newIndex],
          columns: this.data.list[newIndex].columns.map(item => ({...item}))
        })
      }

      this.selectWidget = this.data.list[newIndex]
    },
    handleWidgetColAdd ($event, row, colIndex) {
      console.log('coladd', $event, row, colIndex)
      const newIndex = $event.newIndex
      const oldIndex = $event.oldIndex
      const item = $event.item

      // 防止布局元素的嵌套拖拽
      if (item.className.indexOf('data-grid') >= 0) {

        // 如果是列表中拖拽的元素需要还原到原来位置
        item.tagName === 'DIV' && this.data.list.splice(oldIndex, 0, row.columns[colIndex].list[newIndex])

        row.columns[colIndex].list.splice(newIndex, 1)

        return false
      }

      console.log('from', item)

      const key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)
      let remoteFuncName = '';
      let modelName = '';
      if(row.columns[colIndex].list[newIndex].type === 'selectCreate'){
        remoteFuncName = 'selectCreate';
      }else{
        remoteFuncName = key;
      }

      if(row.columns[colIndex].list[newIndex].model){
        modelName = row.columns[colIndex].list[newIndex].model;
      }else{
        modelName = row.columns[colIndex].list[newIndex].type + '_' + key;
      }
      this.$set(row.columns[colIndex].list, newIndex, {
        ...row.columns[colIndex].list[newIndex],
        options: {
          ...row.columns[colIndex].list[newIndex].options,
          remoteFunc: 'func_' + remoteFuncName
        },
        key,
        // 绑定键值
        model: modelName,
        rules: []
      })

      if (row.columns[colIndex].list[newIndex].type === 'radio' || row.columns[colIndex].list[newIndex].type === 'checkbox' || row.columns[colIndex].list[newIndex].type === 'select' || row.columns[colIndex].list[newIndex].type === 'table') {
        this.$set(row.columns[colIndex].list, newIndex, {
          ...row.columns[colIndex].list[newIndex],
          options: {
            ...row.columns[colIndex].list[newIndex].options,
            options: row.columns[colIndex].list[newIndex].options.options.map(item => ({
              ...item
            }))
          }
        })
      }

      if(row.columns[colIndex].list[newIndex].type === 'table'){
          this.$set(row.columns[colIndex].list, newIndex, {
          ...row.columns[colIndex].list[newIndex],
          options: {
            ...row.columns[colIndex].list[newIndex].options,
            labelOptions: row.columns[colIndex].list[newIndex].options.labelOptions.map(item => ({
              ...item
            }))
          }
        })
      }

      this.selectWidget = row.columns[colIndex].list[newIndex]
    },
    handleWidgetDelete (index) {
      if (this.data.list.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {}
        } else {
          this.selectWidget = this.data.list[index - 1]
        }
      } else {
        this.selectWidget = this.data.list[index + 1]
      }

      this.$nextTick(() => {
        this.data.list.splice(index, 1)
      })
    },
  },
  watch: {
    select (val) {
      this.selectWidget = val
    },
    selectWidget: {
      handler (val) {
        this.$emit('update:select', val)
      },
      deep: true
    }
  }
}
</script>
