<template>
  <el-dialog
    title="新增员工"
    :visible="showAddDialogVisible"
    width="50%"
    @close="close"
  >
    <!-- 表单 -->
    <el-form ref="formRef" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:80%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:80%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:80%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:80%" placeholder="请选择">
          <el-option
            v-for="item in selectOptions"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:80%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <!-- <el-input v-model="formData.departmentName" style="width:80%" placeholder="请选择部门" /> -->
        <el-cascader
          v-model="formData.departmentName"
          :options="options"
          style="width:80%"
          :props="{label: 'name', value: 'name', checkStrictly: true, emitPath: false}"
          @focus="getDepartments"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:80%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small">取消</el-button>
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import EmployeeEnum from '@/api/constant/employees'
import { getDepartments } from '@/api/departments'
import { addEmployee } from '@/api/employees'
import { transListToTree } from '@/utils'
export default {
  name: 'AddDemployee',
  props: {
    showAddDialogVisible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      formData: {
        username: '', // 用户姓名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门名称
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      },
      options: [],
      selectOptions: EmployeeEnum.hireType
    }
  },
  created() {
  },
  methods: {
    close() {
      this.$emit('update:showAddDialogVisible', false)
      this.formData = {
        username: '', // 用户姓名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门名称
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      }
      this.$refs.formRef.resetFileds()
    },
    async getDepartments() {
      const { depts } = await getDepartments()
      this.options = transListToTree(depts, '')
    },
    async btnOk() {
      await this.$refs.formRef.validate()
      await addEmployee(this.formData)
      this.$message.success('新增员工成功')
      this.formData.formOfEmployment = Number(this.formData.formOfEmployment)
      this.close()
      this.$parent.getEmpList()
    }
  }
}
</script>

<style>

</style>
