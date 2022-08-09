<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :limit="1"
      :class="{completed: isCompleted}"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent" :percentage="percentage" style="width: 180px" />
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'

const cos = new COS({
  SecretId: 'AKIDAGAqIURAmBMI0UkmZ6OSmsjOs9C2d078', // 身份识别 ID
  SecretKey: 'tY1JOObcQ2RdeT5WlmcJn362mKhqmV1J' // 身份密钥
})

export default {
  name: 'ImageUpload',
  data() {
    return {
      showPercent: false,
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [
        {
          url: 'https://img2.woyaogexing.com/2022/08/03/0cca1624684e02e8!400x400.jpg'
        }
      ],
      percentage: 0
    }
  },
  computed: {
    isCompleted() {
      return this.fileList.length >= 1
    }
  },
  created() {
  },
  methods: {
    handleRemove(file, fileList) {
    //   this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      this.fileList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    changeFile(file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList
    },
    beforeUpload(file) {
      console.log(file)
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('文件类型不匹配')
        return false
      }

      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('文件太大了')
        return false
      }
      this.showPercent = true
    },
    upload(params) {
      const { file } = params
      if (!file) return
      // 执行上传操作
      cos.putObject({
        Bucket: '123456-1313213431', // 存储桶
        Region: 'ap-nanjing', // 地域
        Key: file.name, // 文件名
        Body: file, // 要上传的文件对象
        StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
        // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
        onProgress: ({ percent }) => {
          console.log(this.fileList)
          this.percentage = percent * 100
        }
      }, (err, data) => {
        // data返回数据之后 应该如何处理
        if (err) {
          return this.$message.error(err?.message || '上传出错')
        }
        this.fileList.forEach(item => {
          if (item.uid === file.uid) {
            item.url = `http://${data.Location}`
            // 只有成功获取到了服务器端图片链接的时候,加一个标识
            // 目的:提交更新的时候,进行判断,如果当前文件对象里面没有upload属性,不进行提交
            item.upload = true
          }
        })
        setTimeout(() => {
          this.showPercent = false
          this.percentage = 0
        }, 2000)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.completed {
  ::v-deep .el-upload--picture-card {
    display: none;
  }
}
</style>
