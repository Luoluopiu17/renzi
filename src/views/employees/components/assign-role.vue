<template>
  <el-dialog
    title="分配权限"
    :visible="showDialog"
    width="50%"
    @close="close"
  >
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <span slot="footer" class="dialog-footer">
      <el-button>取 消</el-button>
      <el-button type="primary" @click="btnOk">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { assignRoles } from '@/api/employees'
import { getUserDetailById } from '@/api/user'
import { getRoleList } from '@/api/setting'
export default {
  name: 'AssignRole',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    currentId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      roleIds: [],
      list: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    close() {
      this.roleIds = []
      this.$emit('update:showDialog', false)
    },
    // 获取角色列表
    async getRoleList() {
      const res = await getRoleList()
      this.list = res.rows
    },
    async getCurrentRoleIds(id) {
      const res = await getUserDetailById(id)
      this.roleIds = res.roleIds
    },
    // 点击确定按钮
    async btnOk() {
      await assignRoles({
        id: this.currentId,
        roleIds: this.roleIds
      })
      this.$message.success('编辑角色成功')
      this.close()
    }
  }
}
</script>

<style>

</style>
