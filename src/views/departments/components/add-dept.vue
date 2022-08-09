<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="`${showTitle} 【${currentNode.name}】`" :visible="isShowAddDept" @close="close">
    <el-form ref="form" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入部门名称" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" placeholder="请输入部门编码" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" placeholder="请选择" @focus="getSimpleEmp">
          <el-option
            v-for="item in options"
            :key="item.value"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" placeholder="请输入部门介绍" />
      </el-form-item>
    </el-form>
    <template>
      <span class="dialog-footer">
        <el-button size="small" @click="close">取 消</el-button>
        <el-button type="primary" size="small" @click="submit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { getEmployeeSimple } from '@/api/employees'
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
export default {
  name: 'AddDept',
  props: {
    isShowAddDept: {
      type: Boolean,
      default: false
    },
    currentNode: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const checkName = async(rule, value) => {
      // 1.获取所有部门数据
      const { depts } = await getDepartments()
      // 2.找出当前点击部门的子部门数据有什么特点？ pid=当前点击部门的id
      let currentChildren = null
      if (this.formData.id) {
        currentChildren = depts.filter(item => {
          return item.pid === this.currentNode.pid && item.id !== this.currentNode.id
        })
      } else {
        currentChildren = depts.filter(item => item.pid === this.currentNode.id)
      }
      // 3.value值是否和筛选出来的数据结果里的name值重复
      const isRepeat = currentChildren.some(item => item.name === value)
      // return Promise也可以让表单校验拿到结果
      if (isRepeat) {
        return Promise.reject('部门名称不能重复')
      }
    }
    const checkCode = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      const isRepeat = depts.some(item => item.code === value && item.id !== this.currentNode.id)
      if (isRepeat) {
        return Promise.reject('部门编码不能重复')
      }
    }
    return {
      options: [],
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '部门名称不能为空',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 50,
            message: '部门名称需1-50字符长度',
            trigger: 'blur'
          },
          {
            validator: checkName,
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '部门编码不能为空',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 50,
            message: '部门编码需1-50字符长度',
            trigger: 'blur'
          },
          {
            validator: checkCode,
            trigger: 'blur'
          }
        ],
        manager: [
          {
            required: true,
            message: '部门负责人不能为空',
            trigger: 'blur'
          }
        ],
        introduce: [
          {
            required: true,
            message: '部门介绍不能为空',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 300,
            message: '部门介绍需1-300字符长度',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    async getSimpleEmp() {
      this.options = await getEmployeeSimple()
    },
    async submit() {
      await this.$refs.form.validate()
      if (this.formData.id) {
        await updateDepartments(this.formData)
      } else {
        await addDepartments({
          ...this.formData,
          pid: this.currentNode.id
        })
      }
      this.$message.success(`${this.showTitle}成功`)
      this.$emit('getDepartments')
      this.close()
    },
    close() {
      this.$refs.form.resetFields()
      // 重置数据  因为resetFields 只能重置 表单上的数据 非表单上的 比如 编辑中id 不能重置
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$emit('update:isShowAddDept', false)
    },
    async getDetailById(id) {
      this.formData = await getDepartDetail(id)
    }
  }
}
</script>

<style scoped lang="scss">
.dialog-footer {
  display: flex;
  justify-content: center;
}
</style>
