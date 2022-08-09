<template>
  <div class="detail-container">
    <el-card>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="登录账户设置" name="first">
          <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" class="form">
            <el-form-item label="姓名" prop="username">
              <el-input v-model="form.username" style="width: 40%" />
            </el-form-item>
            <el-form-item label="密码" prop="password2">
              <el-input v-model="form.password2" style="width: 40%" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateUserInfo">更新</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="个人详情" name="second">
          <!-- <UserInfo /> -->
          <component :is="UserInfo" />
        </el-tab-pane>
        <el-tab-pane label="岗位信息" name="third">
          <component :is="JobInfo" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import UserInfo from './user-info.vue'
import JobInfo from './job-info.vue'
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
export default {
  components: {
    UserInfo,
    JobInfo
  },
  data() {
    return {
      UserInfo: 'UserInfo',
      JobInfo: 'JobInfo',
      activeName: 'first',
      form: {
        username: '',
        password2: ''
      },
      rules: {
        username: [{
          required: true,
          message: '姓名不能为空',
          trigger: 'blur'
        }],
        password2: [{
          required: true,
          message: '密码不能为空',
          trigger: 'blur'
        }, {
          min: 6,
          max: 9,
          message: '密码长度6-9位',
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    handleClick(tab, event) {
    //   console.log(tab, event)
    },
    async getUserDetailById() {
      this.form = await getUserDetailById(this.$route.params.id)
    },
    async updateUserInfo() {
      try {
        await this.$refs.formRef.validate()
        await saveUserDetailById({
          ...this.form,
          password: this.form.password2
        })
        this.$message.success('更新成功')
      } catch (e) {
        this.$message.error(e.message || '更新失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-container {
    padding: 20px
}

.form {
    margin-top: 20px;
}
</style>
