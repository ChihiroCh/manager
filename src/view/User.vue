<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form :inline="true" :model="user" ref="form">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="user.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="用户状态" prop="state">
          <el-select v-model="user.state" style="width: 80px">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate">新增</el-button>
        <el-button
          type="danger"
          @click="handlePatchDelete"
          v-has="'user-patch-delete'"
          >批量删除</el-button
        >
      </div>
      <el-table
        :data="userList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
              v-has="'user-edit'"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="handelDelete(scope.row)"
              v-has="'user-delete'"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        layout="prev, pager, next"
        :total="pager.total"
        class="pagination"
        :page-size="pager.pageSize"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <el-dialog
      :title="action === 'add' ? '用户新增' : '编辑用户'"
      v-model="showModal"
      :before-close="handleCloseDialog"
    >
      <el-form
        :model="userForm"
        label-width="120px"
        ref="dialogForm"
        :rules="rules"
      >
        <el-form-item prop="userName" label="用户名">
          <el-input
            placeholder="请输入用户名称"
            v-model="userForm.userName"
            :disabled="action == 'edit'"
          />
        </el-form-item>
        <el-form-item prop="userEmail" label="邮箱">
          <el-input
            placeholder="请输入用户邮箱"
            v-model="userForm.userEmail"
            :disabled="action == 'edit'"
          >
            <template #append> @jason.com </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机号">
          <el-input placeholder="请输入手机号" v-model="userForm.mobile" />
        </el-form-item>
        <el-form-item prop="job" label="岗位">
          <el-input placeholder="请输入岗位" v-model="userForm.job" />
        </el-form-item>
        <el-form-item prop="state" label="状态">
          <el-select v-model="userForm.state">
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="roleList" label="系统角色">
          <el-select
            v-model="userForm.roleList"
            placeholder="请选择用户角色"
            multiple
            style="width: 100%"
          >
            <el-option
              v-for="role in roleList"
              :key="role._id"
              :label="role.roleName"
              :value="role._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="deptId" label="部门">
          <el-cascader
            v-model="userForm.deptId"
            placeholder="请选择所属部门"
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref, onMounted, getCurrentInstance, toRaw } from "vue";
import utils from "../utils/utils";
export default {
  name: "User",
  setup() {
    const { proxy } = getCurrentInstance();
    const user = reactive({ state: 1 });
    const userList = ref([]);
    // 选中用户id
    const checkedUserIds = ref([]);
    const columns = reactive([
      {
        label: "用户ID",
        prop: "userId",
      },
      {
        label: "用户名",
        prop: "userName",
      },
      {
        label: "用户邮箱",
        prop: "userEmail",
      },
      {
        label: "用户角色",
        prop: "role",
        formatter(row, column, value) {
          return {
            0: "管理员",
            1: "普通用户",
          }[value];
        },
      },
      {
        label: "用户状态",
        prop: "state",
        formatter(row, column, value) {
          return {
            1: "在职",
            2: "离职",
            3: "试用期",
          }[value];
        },
      },
      {
        label: "注册时间",
        prop: "createTime",
        formatter(row, column, value) {
          return utils.formateDate(new Date(value));
        },
      },
      {
        label: "最后登录时间",
        prop: "lastLoginTime",
        formatter(row, column, value) {
          return utils.formateDate(new Date(value));
        },
      },
    ]);
    const pager = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 10,
    });
    const action = ref("add");
    const showModal = ref(false);
    const rules = reactive({
      userName: [
        {
          required: true,
          message: "请输入用户名称",
          trigger: "blur",
        },
      ],
      userEmail: [
        {
          required: true,
          message: "请输入邮箱",
          trigger: "blur",
        },
      ],
      deptId: [
        {
          required: true,
          message: "请选择部门",
          trigger: "blur",
        },
      ],
      mobile: [
        {
          pattern: /1[3-9]\d{9}/,
          message: "请输入正确的手机号格式",
          trigger: "blur",
        },
      ],
    });
    const userForm = reactive({
      state: 1,
    });
    const deptList = ref([]);
    const getDeptList = async () => {
      const list = await proxy.$api.getDeptList();
      console.log("getDeptList", list);
      deptList.value = list;
    };
    const roleList = ref([]);
    const getRoleList = async () => {
      const list = await proxy.$api.getRoleList();
      roleList.value = list;
    };
    const handleReset = (val) => {
      proxy.$refs[val].resetFields();
    };
    const handleQuery = () => {
      getUserlist(user);
    };
    const getUserlist = async () => {
      let params = { ...user, ...pager };
      try {
        const { page, list } = await proxy.$api.userList(params);
        // list.forEach((item) => {
        //   userList.push(item);
        // });
        userList.value = list;
        pager.total = page.total;
      } catch (error) {}
    };
    onMounted(() => {
      getUserlist();
      getDeptList();
      getRoleList();
    });
    const handleSelectionChange = (e) => {
      checkedUserIds.value = e.map((it) => it.userId);
      // console.log("handleSelectionChange", e, checkedUserIds.value);
    };
    // 新增
    const handleCreate = () => {
      action.value = "add";
      showModal.value = true;
    };
    // 批量删除
    const handlePatchDelete = async () => {
      if (checkedUserIds.value.length == 0) {
        proxy.$message.error("请选择要删除的用户");
        return;
      }
      const res = await proxy.$api.userDelete({
        userIds: checkedUserIds.value,
      });
      if (res.modifiedCount > 0) {
        proxy.$message.success("删除成功");
        getUserlist();
      } else {
        proxy.$message.error("删除失败");
      }
    };
    // 编辑
    const handleEdit = (row) => {
      action.value = "edit";
      showModal.value = true;
      proxy.$nextTick(() => {
        // console.log(row);
        row.state = Number(row.state);
        Object.assign(userForm, row);
      });
    };
    // 删除当前数据
    const handelDelete = async (row) => {
      const res = await proxy.$api.userDelete({
        userIds: [row.userId],
      });
      // 接后端接口注意返回删除数量的字段
      if (res.modifiedCount > 0) {
        proxy.$message.success("删除成功");
        getUserlist();
      } else {
        proxy.$message.error("删除失败");
      }
    };
    // 改变页码
    const handleCurrentChange = (current) => {
      pager.pageNum = current;
      getUserlist();
    };
    const handleCloseDialog = () => {
      showModal.value = false;
      handleReset("dialogForm");
    };
    const handleClose = () => {
      showModal.value = false;
      handleReset("dialogForm");
    };
    const handleSubmit = () => {
      proxy.$refs.dialogForm.validate(async (validate) => {
        if (validate) {
          // if (action.value === "add") {
          let params = toRaw(userForm);
          // let params = userForm;
          params.userEmail += "@jason.com";
          params.action = action.value;
          let res = await proxy.$api.userSubmit(params);
          if (res) {
            showModal.value = false;
            proxy.$message.success("新增用户成功");
            handleReset("dialogForm");
            getUserlist();
          }
        }
        // }
      });
    };
    return {
      user,
      userList,
      columns,
      pager,
      checkedUserIds,
      action,
      showModal,
      userForm,
      rules,
      deptList,
      roleList,
      getRoleList,
      getDeptList,
      handleReset,
      handleQuery,
      handleSelectionChange,
      handleCreate,
      handlePatchDelete,
      handleEdit,
      handelDelete,
      handleCurrentChange,
      handleCloseDialog,
      handleClose,
      handleSubmit,
    };
  },
};
</script>

<style>
</style>