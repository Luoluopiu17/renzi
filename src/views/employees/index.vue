<template>
  <div class="dashboard-container">
    <div class="app-container">
      <ToolBar :show-before="true">
        <span slot="before">共166条记录</span>
        <template slot="after">
          <el-button size="small" type="warning" @click="$router.push('/import')">导入</el-button>
          <el-button size="small" type="danger" @click="exportToExcel">导出</el-button>
          <el-button size="small" type="primary" @click="showAddDialogVisible = true">新增员工</el-button>
        </template>
      </ToolBar>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table border :data="list">
          <el-table-column type="index" label="序号" sortable />
          <el-table-column prop="username" label="姓名" sortable />
          <el-table-column label="头像" align="center">
            <template v-slot="{row}">
              <el-avatar :src="row.staffPhoto" style="width: 80px; height: 80px" @click.native="showQrCode(row.staffPhoto)">
                <img src="@/assets/common/bigUserHeader.png" alt="">
              </el-avatar>
            </template>
          </el-table-column>
          <el-table-column prop="workNumber" label="工号" sortable />
          <el-table-column prop="formOfEmployment" :formatter="formatter" label="聘用形式" sortable />
          <el-table-column prop="departmentName" label="部门" sortable />
          <el-table-column label="入职时间" sortable>
            <template v-slot="{ row }">
              {{ row.correctionTime | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable />
          <el-table-column label="操作" sortable fixed="right" width="280">
            <template v-slot="{ row }">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="showRoles(row.id)">角色</el-button>
              <el-button type="text" size="small" :disabled="checkPermission('DELETE_USERS')" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            :total="total"
            :page-size="pageInfo.size"
            :current-page.sync="pageInfo.page"
            layout="total, prev, pager, next"
            @current-change="getEmpList"
          />
        </el-row>
      </el-card>
      <AddDemployee :show-add-dialog-visible.sync="showAddDialogVisible" />
      <el-dialog
        title="头像预览"
        :visible.sync="showAvatar"
        width="30%"
      >
        <el-row type="flex" justify="center">
          <canvas ref="myCanvas" />
        </el-row>
      </el-dialog>
      <AssignRole ref="roleRef" :show-dialog.sync="showDialog" :current-id="currentId" />
    </div>
  </div>
</template>

<script>
import { mixins } from '@/utils/mixins'
import AssignRole from '@/views/employees/components/assign-role.vue'
import qrCode from 'qrcode'
import { formatDate } from '@/filters'
import AddDemployee from './components/add-employee.vue'
import EmployeeEnum from '@/api/constant/employees'
import { getEmployeeList, delEmployee } from '@/api/employees'
export default {
  name: 'Employees',
  components: {
    AddDemployee,
    AssignRole
  },
  mixins: [mixins],
  data() {
    return {
      list: [],
      pageInfo: {
        page: 1,
        size: 10
      },
      total: 0,
      showAddDialogVisible: false,
      showAvatar: false,
      showDialog: false,
      currentId: ''
    }
  },
  created() {
    this.getEmpList()
  },
  methods: {
    async getEmpList() {
      const { rows, total } = await getEmployeeList(this.pageInfo)
      this.list = rows
      this.total = total
    },
    formatter(row, column, cellValue) {
      // console.log(row, column, cellValue)
      const currentData = EmployeeEnum.hireType.find(item => item.id === cellValue)?.value
      return currentData || '未知'
    },
    async delEmployee(id) {
      await this.$confirm('确定删除吗')
      await delEmployee(id)
      this.$message.success('删除成功')
      this.getEmpList()
    },
    async exportToExcel() {
      console.log(import('@/utils/Export2Excel')) // 魔法注释 打包自定义文件
      const { export_json_to_excel } = await import(/* webpackChunkName:"lodash" */'@/utils/Export2Excel')
      const { rows } = await getEmployeeList({ page: 1, size: this.total })
      console.log(rows)
      const headers = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      const resData = this.formData(rows, headers)
      export_json_to_excel({
        header: Object.keys(headers),
        data: resData,
        filename: 'excel-list', // 非必填
        autoWidth: true, // 非必填
        bookType: 'xlsx' // 非必填
      })
    },
    formData(rows, headers) {
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          if (['timeOfEntry', 'correctionTime'].includes(headers[key])) {
            return formatDate(item[headers[key]])
          }
          if (headers[key] === 'formOfEmployment') {
            return EmployeeEnum.hireType.find(child => +child.id === +item[headers[key]])?.value || '未知'
          }
          return item[headers[key]]
        })
      })
    },
    showQrCode(url) {
      this.showAvatar = true
      this.$nextTick(() => {
        qrCode.toCanvas(this.$refs.myCanvas, url)
      })
    },
    /* 点击角色按钮 */
    async showRoles(id) {
      this.currentId = id
      await this.$refs.roleRef.getCurrentRoleIds(id)
      this.showDialog = true
    }
  }
}
</script>

<style>

</style>
