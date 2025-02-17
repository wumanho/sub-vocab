<script lang="ts" setup>
import Cookies from 'js-cookie'
import { CaretBottom } from '@element-plus/icons-vue'
import en from 'element-plus/es/locale/lang/en'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import type { Language } from 'element-plus/es/locale'
import { ElConfigProvider, ElDropdown, ElDropdownItem, ElDropdownMenu, ElIcon } from 'element-plus'
import { i18n, t } from '@/i18n'
import { useVocabStore } from '@/store/useVocab'

let { locale } = $(i18n.global)
const localeMap: Record<string, Language> = {
  'en': en,
  'zh': zhCn,
}
const elLocale = $computed(() => localeMap[locale])
const { user } = $(useVocabStore())
const isLoggedIn = $computed(() => !!user)
const isWide = window.innerWidth >= 460

function handleCommand(command: typeof locale) {
  Cookies.set('_locale', command, { expires: 365, })
  locale = command
}
</script>

<template>
  <header class="z-50 box-border flex w-full min-w-[auto] items-center justify-center bg-white tracking-wide shadow [&_[href]]:tap-transparent">
    <nav class="box-border flex h-full w-full max-w-screen-xl justify-center">
      <div class="flex w-full items-center text-[14px]">
        <router-link
          to="/"
          class="flex h-full items-center px-4 hover:bg-gray-100"
        >
          {{ t('home') }}
        </router-link>
        <router-link
          to="/about"
          class="flex items-center rounded-full py-1 px-4 hover:bg-gray-100"
        >
          {{ t('about') }}
        </router-link>
        <div class="grow" />
        <router-link
          v-if="isLoggedIn||isWide"
          to="/mine"
          class="flex h-full items-center px-4 hover:bg-gray-100"
        >
          {{ user ? t('mine') : t('common') }}
        </router-link>
        <router-link
          v-if="isLoggedIn"
          to="/user"
          class="flex h-full items-center px-4 hover:bg-gray-100"
        >
          {{ user }}
        </router-link>
        <template v-else>
          <router-link
            to="/login"
            class="flex items-center rounded-md py-1 px-4 hover:bg-gray-100"
          >
            {{ t('login') }}
          </router-link>
          <router-link
            to="/register"
            class="s-btn ml-2 flex rounded py-2 px-3 text-white"
          >
            {{ t('signup') }}
          </router-link>
        </template>
        <el-dropdown @command="handleCommand">
          <div class="flex px-4 outline-none">
            文/Aa
            <el-icon class="el-icon--right">
              <CaretBottom class="text-slate-300" />
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu class="outline-none">
              <el-dropdown-item command="zh">
                中文
              </el-dropdown-item>
              <el-dropdown-item command="en">
                English
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-config-provider :locale="elLocale" />
      </div>
    </nav>
  </header>
</template>
