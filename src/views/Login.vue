<script lang="tsx" setup>
import type { FormInstance, FormItemRule } from 'element-plus'
import { ElButton, ElForm, ElFormItem, ElInput } from 'element-plus'
import { reactive, ref } from 'vue'
import { t } from '@/i18n'
import { useVocabStore } from '@/store/useVocab'
import { resetForm } from '@/utils/elements'
import { checkUsername, noEmptyPassword } from '@/utils/validation'

const { login } = useVocabStore()
const ruleFormRef = ref<FormInstance>()

function checkUsernameLogin(rule: FormItemRule | FormItemRule[], username: string, callback: (arg0?: Error) => void) {
  checkUsername(rule, username, callback)
  callback()
}

function validatePass(rule: FormItemRule | FormItemRule[], password: string, callback: (arg0?: Error) => void) {
  noEmptyPassword(rule, password, callback)
  callback()
}

const ruleForm = reactive({
  username: '',
  password: '',
})
const rules = reactive({
  username: [{ validator: checkUsernameLogin, trigger: 'blur' }],
  password: [{ validator: validatePass, trigger: 'blur' }],
})
let errorMsg = $ref('')

function submitForm(formEl: FormInstance | undefined) {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (!valid) return

    if (!(await login(ruleForm))) {
      errorMsg = t('incorrectUserPassword')
    }
  })
}
</script>

<template>
  <div class="flex flex-row">
    <div class="mx-auto py-6">
      <div class="flex w-80 justify-center rounded-md bg-white py-5 shadow-lg ">
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-position="top"
          label-width="100px"
          class="max-w-[460px] [&>.el-form-item_label]:font-bold"
          status-icon
        >
          <el-form-item
            :label="t('Name')"
            prop="username"
            :error="errorMsg"
          >
            <el-input
              v-model.number="ruleForm.username"
              class="!text-base md:!text-xs"
            />
          </el-form-item>
          <el-form-item
            :label="t('Password')"
            prop="password"
          >
            <el-input
              v-model="ruleForm.password"
              type="password"
              autocomplete="off"
              class="!text-base md:!text-xs"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm(ruleFormRef)"
            >
              {{ t('Submit') }}
            </el-button>
            <el-button @click="resetForm(ruleFormRef)">
              {{ t('Reset') }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
