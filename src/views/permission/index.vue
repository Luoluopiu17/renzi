<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <ToolBar>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPermission('0',1)">添加权限</el-button>
        </template>
      </ToolBar>
      <!-- 表格 -->
      <el-table border :data="list" row-key="id">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template v-slot="{ row }">
            <el-button v-if="row.type === 1" type="text" @click="addPermission(row.id,2)">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :visible.sync="showDialog" :title="`${title}权限`" @close="close">
      <el-form ref="formRef" label-width="120px" :model="formData" :rules="rules">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" />
        </el-form-item>
        <el-form-item label="是否开启">
          <el-switch
            v-model="formData.enVisible"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOk">确定</el-button>
          <el-button size="small" @click="close">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList, addPermission, delPermission, getPermissionDetail, updatePermission } from '@/api/permisson'
import { transListToTree } from '@/utils/index'
export default {
  name: 'Permission',
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      // 新增或者编辑弹框的校验规则，
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    // 获取权限列表
    async getPermissionList() {
      const res = await getPermissionList()
      this.list = transListToTree(res, '0')
      // console.log(this.list)
    },
    // 添加权限
    addPermission(pid, type) {
      this.showDialog = true
      this.formData.pid = pid
      this.formData.type = type
    },
    // 点击确定按钮
    async btnOk() {
      try {
        await this.$refs.formRef.validate()
        if (this.formData.id) {
          await updatePermission(this.formData)
        } else {
          await addPermission(this.formData)
        }
        this.$message.success(`${this.title}权限成功`)
        this.close()
        await this.getPermissionList()
      } catch (e) {
        this.$message.error('修改失败')
      }
    },
    // 弹层关闭
    close() {
      this.$refs.formRef.resetFields()
      console.log(123)
      this.formData = {
        name: '',
        code: '',
        description: '',
        type: '',
        pid: '',
        enVisible: '0'
      }
      this.showDialog = false
    },
    // 点击删除按钮
    async delPermission(id) {
      await this.$confirm('确定删除吗')
      await delPermission(id)
      this.$message.success('删除成功')
      await this.getPermissionList()
    },
    // 点击编辑按钮
    async editPermission(id) {
      this.showDialog = true
      this.formData = await getPermissionDetail(id)
    }
  }
}
</script>

<style>

</style>
