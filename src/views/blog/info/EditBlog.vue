<template>
  <el-container>
    <el-header height="110px">
      <el-row :gutter="10">
        <el-col :span="4">
          <el-input
            v-model="blogInfo.blogTitle"
            placeholder="*输入文章标题(必填)"
          />
        </el-col>
        <el-col :span="4">
          <el-input
            v-model="blogInfo.blogSubUrl"
            placeholder="输入自定义路径"
          />
        </el-col>
        <el-col :span="4">

          <el-select v-model="blogInfo.blogTags" multiple placeholder="请选择文章标签">

            <el-option
              v-for="item in tagList"
              :key="item.tagId"
              :label="item.tagName"
              :value="item.tagName"
              @click.native="getTagId(item.tagId)"
            />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="blogInfo.blogCategoryName" placeholder="请选择文章分类">
            <el-option
              v-for="item in categoryList"
              :key="item.categoryId"
              :label="item.categoryName"
              :value="item.categoryName"
              @click.native="getCategoryId(item.categoryId)"
            />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-switch
            v-model="blogInfo.blogStatus"
            class="switch"
            active-text="发布"
            inactive-text="草稿"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-col>
        <el-col :span="4">
          <el-button
            type="success"
            circle
            :loading="loads"
            @click="submitBlog"
          >
            发布
          </el-button>

        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="16">
          <el-input
            v-model="blogInfo.blogPreface"
            placeholder="输入文章前言"
          />
        </el-col>
        <el-col :span="8">
          <el-switch
            v-model="blogInfo.enableComment"
            class="switch"
            active-text="允许评论"
            inactive-text="禁止评论"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <mavon-editor
        ref="md"
        v-model="blogInfo.blogContent"
        @imgAdd="$imgAdd"
      />
    </el-main>
  </el-container>
</template>
<script>
import { getBlogTagList } from '@/api/blogmanager/blogTag'
import { getBlogCategoryList } from '@/api/blogmanager/blogCategory'
import { editBlog, getBlogInfo, saveBlog, uploadFileByFastDFS } from '@/api/blogmanager/blog'
import qs from 'qs'

export default {
  name: 'EditBlog',
  data() {
    return {
      blogInfo: {
        blogTitle: '',
        blogSubUrl: '',
        blogPreface: '',
        blogContent: '',
        blogCategoryId: '',
        blogCategoryName: '',
        blogTags: '',
        blogLikes: 0,
        /**
         * 0-草稿 1-发布
         */
        blogStatus: true,
        /**
         * 0-允许评论 1-不允许评论
         */
        enableComment: true
      },
      tagList: [],
      categoryList: [],
      tagIds: [],
      loads: false,
      blogId: ''
    }
  },
  created() {
    this.getBlogTag()
    this.getBlogCategory()
    if (this.$route.query.blogId != null) {
      this.getBlogInfo()
    }
  },
  methods: {

    getBlogInfo() {
      this.blogId = this.$route.query.blogId
      const _this = this
      if (this.blogId !== '') {
        getBlogInfo(qs.stringify({
          blogId: this.blogId
        })).then(res => {
          _this.blogInfo = res.data
        })
      }
    },

    $imgAdd(pos, $file) {
      // 将图片上传到服务器.
      const formdata = new FormData()
      formdata.append('file', $file)
      uploadFileByFastDFS(formdata).then(res => {
        this.$refs.md.$img2Url(pos, res.data)
      })

      /*  axios({
          url: '/admin/uploadAuthorImg',
          method: 'post',
          data: formdata,
          headers: {'Content-Type': 'multipart/form-data'},
        }).then((res) => {
          this.$refs.md.$img2Url(pos, res.data.data);
        })*/
    },

    getTagId(id) {
      this.tagIds.push(id)
      console.info(this.tagIds)
    },

    getCategoryId(id) {
      this.blogInfo.blogCategoryId = id
    },

    submitBlog() {
      this.loads = true
      this.blogInfo.blogStatus = this.blogInfo.blogStatus ? 1 : 0
      this.blogInfo.enableComment = this.blogInfo.enableComment ? 1 : 0
      const _this = this
      if (this.blogId === '') {
        // 发布文章
        saveBlog(qs.stringify({
          tagIds: this.tagIds,
          blogTitle: this.blogInfo.blogTitle,
          blogSubUrl: this.blogInfo.blogSubUrl,
          blogPreface: this.blogInfo.blogPreface,
          blogContent: this.blogInfo.blogContent,
          blogCategoryId: this.blogInfo.blogCategoryId,
          blogCategoryName: this.blogInfo.blogCategoryName,
          blogTags: this.blogInfo.blogTags.toString(),
          blogStatus: this.blogInfo.blogStatus,
          enableComment: this.blogInfo.enableComment
        })
        ).then(res => {
          _this.loads = false
          if (res.code === 2000) {
            _this.loads = false
            this.$message({
              message: '发布成功',
              center: true,
              type: 'success'
            })
          }
        })
      } else {
        // 修改文章
        editBlog(qs.stringify({
          blogId: this.blogId,
          tagId: this.tagId,
          blogTitle: this.blogInfo.blogTitle,
          blogSubUrl: this.blogInfo.blogSubUrl,
          blogPreface: this.blogInfo.blogPreface,
          blogContent: this.blogInfo.blogContent,
          blogCategoryId: this.blogInfo.blogCategoryId,
          blogCategoryName: this.blogInfo.blogCategoryName,
          blogTags: this.blogInfo.blogTags,
          blogStatus: this.blogInfo.blogStatus,
          enableComment: this.blogInfo.enableComment
        })).then(res => {
          _this.loads = false
          if (res.code === 2000) {
            _this.loads = false
            this.$message({
              message: '修改成功',
              center: true,
              type: 'success'
            })
            this.$router.push(
              {
                path: '/blogList'
              })
          }
        })
      }
    },

    getBlogTag() {
      getBlogTagList().then(res => {
        this.tagList = res
      })
    },

    getBlogCategory() {
      getBlogCategoryList().then(res => {
        this.categoryList = res
      })
    }
  }
}
</script>

<style scoped>
.el-container .el-header .el-row {
  margin-top: 10px;
}

/* switch按钮样式 */
.switch .el-switch__label {
  position: absolute;
  display: none;
  color: #fff !important;
}

/*打开时文字位置设置*/
.switch .el-switch__label--right {
  z-index: 1;
}

/* 调整打开时文字的显示位子 */
.switch .el-switch__label--right span {
  margin-right: 9px;
}

/*关闭时文字位置设置*/
.switch .el-switch__label--left {
  z-index: 1;
}

/* 调整关闭时文字的显示位子 */
.switch .el-switch__label--left span {
  margin-left: 9px;
}

/*显示文字*/
.switch .el-switch__label.is-active {
  display: block;
}

/* 调整按钮的宽度 */
.switch.el-switch .el-switch__core,
.el-switch .el-switch__label {
  width: 70px !important;
  margin: 0;
}
</style>
