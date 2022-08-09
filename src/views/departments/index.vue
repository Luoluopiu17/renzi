<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <el-card class="card">
        <TreeTool :is-root="true" :tree-data="company" @getDepartments="getDepartments" @handleAddDepts="handleAddDepts" @handleEditDepts="handleEditDepts" />
      </el-card>
      <el-tree default-expand-all :data="departs" :props="defaultProps">
        <template v-slot="{ data }">
          <TreeTool :is-root="false" :tree-data="data" @getDepartments="getDepartments" @handleAddDepts="handleAddDepts" @handleEditDepts="handleEditDepts" />
          <!-- <el-row type="flex" justify="space-between" style="width: 100%">
            <el-col>{{ data.name }}</el-col>
            <el-col :span="8">
              <el-row type="flex">
                <el-col>{{ data.manager }}</el-col>
                <el-col>
                  <el-dropdown>
                    <span class="el-dropdown-link">
                      操作<i class="el-icon-arrow-down el-icon--right" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>添加子部门</el-dropdown-item>
                      <el-dropdown-item>编辑部门</el-dropdown-item>
                      <el-dropdown-item>删除部门</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
            </el-col>
          </el-row> -->
        </template>
      </el-tree>
    </div>

    <AddDept ref="addDept" :is-show-add-dept.sync="isShowAddDept" :current-node="currentNode" @getDepartments="getDepartments" />
  </div>
</template>

<script>
import AddDept from './components/add-dept.vue'
import { transListToTreeNew } from '@/utils'
import { getDepartments } from '@/api/departments'
import TreeTool from './components/tree-tool.vue'
export default {
  name: 'Departments',
  components: {
    TreeTool,
    AddDept
  },
  data() {
    return {
      loading: false,
      isShowAddDept: false,
      currentNode: {},
      departs: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人', id: '' }
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      this.loading = true
      try {
        const res = await getDepartments()
        this.departs = transListToTreeNew(res.depts, '')
        this.company = {
          name: res.companyName,
          manager: '负责人',
          id: ''
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    handleAddDepts(node) {
      this.isShowAddDept = true
      this.currentNode = node
    },
    handleEditDepts(node) {
      this.isShowAddDept = true
      this.currentNode = node
      this.$refs.addDept.getDetailById(node.id)
    }
  }
}
</script>

<style scoped lang="scss">
.dashboard-container {
  display: flex;
  justify-content: center;
  margin-top: 50px;
  .app-container {
    .card {
      width: 898px;
    }
  }
}
</style>
