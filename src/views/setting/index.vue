<template>
  <div class="setting-container">
    <el-card>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="角色管理" name="first">
          <el-button type="primary" icon="el-icon-plus" @click="isShowDialog = true">新增角色</el-button>
          <el-table
            :data="list"
            style="width: 100%; margin-top: 20px"
            border
          >
            <el-table-column label="序号" type="index" />
            <el-table-column prop="name" label="角色名称" />
            <el-table-column prop="description" label="描述" />
            <el-table-column label="操作">
              <template v-slot="{ row }">
                <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                <el-button size="small" type="primary" @click="edit(row.id)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row type="flex" justify="center" style="margin-top: 20px">
            <el-pagination
              :page-size="pageInfo.pagesize"
              layout="total, prev, pager, next"
              :total="total"
              @current-change="handleCurrentChange"
            />
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="公司信息" name="second">
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
            :closable="false"
          />
          <el-form label-width="120px" style="margin-top: 50px">
            <el-form-item label="公司名称">
              <el-input v-model="formData.name" disabled style="width: 400px" />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input v-model="formData.companyAddress" disabled style="width: 400px" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="formData.mailbox" disabled style="width: 400px" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                v-model="formData.remarks"
                type="textarea"
                :rows="3"
                disabled
                style="width: 400px"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
      :title="`${roleFormData.id ? '编辑角色':'新增角色'}`"
      :visible="isShowDialog"
      width="80%"
      @close="close"
    >
      <el-form ref="roleForm" label-width="120px" :model="roleFormData" :rules="roleRules">
        <el-form-item label="角色" prop="name">
          <el-input v-model="roleFormData.name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="roleFormData.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="showPermissionDialog">
      <el-tree
        ref="treeRef"
        :data="permissionList"
        :props="defaultProps"
        show-checkbox
        default-expand-all
        check-strictly
        :default-checked-keys="checkedKeys"
        node-key="id"
      />
      <template #footer>
        <el-button @click="btnPermClose">取消</el-button>
        <el-button type="primary" @click="btnPermOK">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole, assignPerm } from '@/api/setting'
import { getPermissionList } from '@/api/permisson'
import { transListToTree } from '@/utils/index'
export default {
  data() {
    return {
      activeName: 'first',
      list: [],
      pageInfo: {
        page: 1,
        pagesize: 2
      },
      total: 0,
      formData: {},
      isShowDialog: false,
      roleFormData: {},
      roleRules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      showPermissionDialog: false,
      permissionList: [],
      defaultProps: {
        label: 'name'
      },
      checkedKeys: [],
      currentRoleId: null
    }
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    async getRoleList() {
      const { rows, total } = await getRoleList(this.pageInfo)
      this.list = rows
      this.total = total
    },
    handleCurrentChange(newPage) {
      this.pageInfo.page = newPage
      this.getRoleList()
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.$store.getters.conpanyId)
    },
    async deleteRole(id) {
      await this.$confirm('确定删除吗')
      const len = this.list.length
      await deleteRole(id)
      if (len === 1 && this.pageInfo.page > 1) {
        this.pageInfo.page--
      }
      this.$message.success('删除成功')
      await this.getRoleList()
    },
    async edit(id) {
      this.isShowDialog = true
      this.roleFormData = await getRoleDetail(id)
    },
    close() {
      this.isShowDialog = false
      this.$refs.roleForm.resetFields()
      this.roleFormData = {
        name: '',
        description: ''
      }
    },
    async submit() {
      await this.$refs.roleForm.validate()
      if (this.roleFormData.id) {
        await updateRole(this.roleFormData)
      } else {
        await addRole(this.roleFormData)
      }
      this.$message.success('成功')
      await this.getRoleList()
      this.close()
    },
    // 点击分配权限按钮
    async assignPerm(id) {
      this.currentRoleId = id
      this.permissionList = transListToTree(await getPermissionList(), '0')
      // console.log(this.permissionList)
      const res = await getRoleDetail(id)
      this.checkedKeys = res.permIds
      this.showPermissionDialog = true
    },
    // 点击分配权限弹层的确定按钮
    async btnPermOK() {
      const checkedKeys = this.$refs.treeRef.getCheckedKeys()
      await assignPerm({
        id: this.currentRoleId,
        permIds: checkedKeys
      })
      this.$message.success('分配权限成功')
      this.btnPermClose()
    },
    btnPermClose() {
      this.showPermissionDialog = false
      this.checkedKeys = []
    }
  }
}
</script>

<style scoped lang="scss">
.setting-container {
  padding: 20px;
}
</style>
