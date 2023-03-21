export const basicComponents = [
  {
    type: 'input',
    name: '单行文本',
    tooltip: '',
    control: '',
    icon: 'icon-input',
    delAble: true,
    options: {
      width: '100',
      defaultValue: '',
      required: false,
      dataType: 'string',
      pattern: '',
      placeholder: '',
      disabled: false,
      passwordDisabled: true,
      isEdit: true,
      isEncryption: false,
      patternError: ''
    }
  },
  {
    type: 'textarea',
    name: '多行文本',
    tooltip: '',
    control: '',
    icon: 'icon-diy-com-textarea',
    delAble: true,
    options: {
      width: '100',
      rows: '5',
      defaultValue: '',
      required: false,
      disabled: false,
      pattern: '',
      placeholder: '',
      patternError: ''
    }
  },
  {
    type: 'number',
    name: '计数器',
    tooltip: '',
    control: '',
    icon: 'icon-number',
    delAble: true,
    options: {
      width: '100',
      required: false,
      defaultValue: 0,
      min: 0,
      max: 100,
      step: 1,
      disabled: false,
      controlsPosition: ''
    }
  },
  {
    type: 'radio',
    name: '单选框组',
    tooltip: '',
    control: '',
    icon: 'icon-radio-active',
    delAble: true,
    options: {
      inline: false,
      defaultValue: '',
      showLabel: false,
      showTooltip: false,
      disabled: false,
      options: [
        {
          value: '选项1',
          label: '选项1',
          tooltip: ''
        },
        {
          value: '选项2',
          label: '选项2',
          tooltip: ''
        },
        {
          value: '选项3',
          label: '选项3',
          tooltip: ''
        }
      ],
      required: false,
      width: '100',
      remote: false,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label'
      },
      remoteFunc: ''
    }
  },
  {
    type: 'checkbox',
    name: '多选框组',
    tooltip: '',
    control: '',
    icon: 'icon-check-box',
    delAble: true,
    options: {
      inline: false,
      defaultValue: [],
      showLabel: false,
      showTooltip: false,
      disabled: false,
      options: [
        {
          value: '选项1',
          label: '选项1',
          tooltip: ''
        },
        {
          value: '选项2',
          label: '选项2',
          tooltip: ''
        },
        {
          value: '选项3',
          label: '选项3',
          tooltip: ''
        }
      ],
      required: false,
      width: '100',
      remote: false,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label'
      },
      remoteFunc: ''
    }
  },
  {
    type: 'time',
    name: '时间选择器',
    tooltip: '',
    control: '',
    icon: 'icon-time',
    delAble: true,
    options: {
      defaultValue: '',
      readonly: false,
      disabled: false,
      editable: true,
      clearable: true,
      placeholder: '',
      startPlaceholder: '',
      endPlaceholder: '',
      isRange: false,
      arrowControl: true,
      format: 'HH:mm:ss',
      required: false,
      width: '100',
    }
  },
  {
    type: 'date',
    name: '日期选择器',
    tooltip: '',
    control: '',
    icon: 'icon-date',
    delAble: true,
    options: {
      defaultValue: '',
      readonly: false,
      disabled: false,
      editable: true,
      clearable: true,
      placeholder: '',
      startPlaceholder: '',
      endPlaceholder: '',
      type: 'date',
      format: 'yyyy-MM-dd',
      timestamp: false,
      required: false,
      width: '100',
    }
  },
  // {
  //   type: 'rate',
  //   name: '评分',
  //   icon: 'icon-icon-test',
  //   delAble:true,
  //   options: {
  //     defaultValue: null,
  //     max: 5,
  //     disabled: false,
  //     allowHalf: false,
  //     required: false
  //   }
  // },
  // {
  //   type: 'color',
  //   name: '颜色选择器',
  //   icon: 'icon-color',
  //   delAble:true,
  //   options: {
  //     defaultValue: '',
  //     disabled: false,
  //     showAlpha: false,
  //     required: false
  //   }
  // },
  {
    type: 'select',
    name: '下拉选择框',
    tooltip: '',
    control: '',
    icon: 'icon-select',
    delAble: true,
    options: {
      defaultValue: '',
      multiple: false,
      disabled: false,
      clearable: false,
      placeholder: '',
      required: false,
      showLabel: false,
      width: '100',
      options: [
        {
          value: '下拉框1',
          label: '下拉框1'
        },
        {
          value: '下拉框2',
          label: '下拉框2'
        }, {
          value: '下拉框3',
          label: '下拉框3'
        }
      ],
      remote: false,
      filterable: false,
      remoteOptions: [],
      batchString: '',//批量新增选项
      props: {
        value: 'value',
        label: 'label'
      },
      remoteFunc: ''
    }
  },
  {
    type: 'selectCreate',
    name: '账号',
    tooltip: '',
    control: '',
    icon: 'icon-select',
    delAble: true,
    options: {
      defaultValue: '',
      multiple: false,
      disabled: false,
      clearable: false,
      placeholder: '',
      required: false,
      createAble: true,
      width: '100',
      classType: '1',
      passwordDisabled: true,
      isEdit: true,
      isEncryption: false,
      selectTransit: false,
      isAddAccount: false,
      singleOptions: {
        userName: '',
        userPassword: ''
      },
      classOptions: [
        {
          value: '1',
          label: '账号'
        }
      ],
      options: [

      ],
      remote: true,
      filterable: true,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label'
      },
      remoteFunc: ''
    }
  },
  {
    type: 'switch',
    name: '开关',
    tooltip: '',
    control: '',
    icon: 'icon-switch',
    delAble: true,
    options: {
      defaultValue: false,
      required: false,
      disabled: false,
    }
  },
  {
    type: 'slider',
    name: '滑块',
    tooltip: '',
    control: '',
    icon: 'icon-slider',
    delAble: true,
    options: {
      defaultValue: 0,
      disabled: false,
      required: false,
      min: 0,
      max: 100,
      step: 1,
      showInput: false,
      range: false,
      width: '100',
    }
  },
  {
    type: 'fileupload',
    name: '文件',
    tooltip: '',
    control: '',
    icon: 'icon-tupian',
    delAble: true,
    options: {
      defaultValue: [],
      fileList: [],
      width: '100',
      required: false,
      headers: '',
      accep: '',
      action: 'http://192.168.3.78:18081/file/upload',
      disabled: false,
      length: 1,
      multiple: true,
      uploadText: '将文件拖到此处，或点击上传'
    }
  },
  {
    type: 'outFileupload',
    name: '外部文件',
    tooltip: '',
    control: '',
    icon: 'icon-tupian',
    delAble: true,
    options: {
      defaultValue: [],
      fileList: [],
      width: '100',
      required: false,
      headers: {},
      accep: '',
      action: 'http://192.168.3.78/file/upload',
      disabled: false,
      length: 1,
      multiple: true,
      uploadText: '将文件拖到此处，或点击上传'
    }
  },
  {
    type: 'dir',
    name: '文件夹',
    tooltip: '',
    control: '',
    icon: 'el-icon-folder-opened',
    delAble: true,
    options: {
      width: '100',
      defaultValue: '',
      required: false,
      dataType: 'string',
      pattern: '',
      placeholder: '请输入文件夹路径',
      disabled: false
    }
  }
]

export const advanceComponents = [
  {
    type: 'blank',
    name: '自定义',
    icon: 'icon-ic',
    options: {
      defaultType: 'String'
    }
  },
  {
    type: 'imgupload',
    name: '图片',
    icon: 'icon-tupian',
    options: {
      defaultValue: [],
      size: {
        width: 100,
        height: 100,
      },
      width: '100',
      tokenFunc: 'funcGetToken',
      token: '',
      domain: 'http://pfp81ptt6.bkt.clouddn.com/',
      disabled: false,
      length: 8,
      multiple: true
    }
  },
  {
    type: 'editor',
    name: '编辑器',
    icon: 'icon-fuwenbenkuang',
    options: {
      defaultValue: '',
      width: '100',
    }
  },
  {
    type: 'cascader',
    name: '级联选择器',
    icon: 'icon-jilianxuanze',
    options: {
      defaultValue: [],
      width: '100',
      placeholder: '',
      disabled: false,
      clearable: false,
      remote: true,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label',
        children: 'children'
      },
      remoteFunc: ''
    }
  }
]

export const layoutComponents = [
  {
    type: 'grid',
    name: '栅格布局',
    icon: 'icon-grid-',
    columns: [
      {
        span: 12,
        list: []
      },
      {
        span: 12,
        list: []
      }
    ],
    options: {
      gutter: 0,
      justify: 'start',
      align: 'top'
    }
  }
]
