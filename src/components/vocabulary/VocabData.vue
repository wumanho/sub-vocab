<script lang="ts" setup>
import { computed, nextTick, shallowRef } from 'vue'
import { TransitionPresets, until } from '@vueuse/core'
import { ElInput, ElPagination, ElTable, ElTableColumn } from 'element-plus'
import { pipe } from 'fp-ts/function'
import { filter } from 'fp-ts/Array'
import { t } from '@/i18n'
import SegmentedControl from '@/components/SegmentedControl.vue'
import { isMobile, orderBy, paging, selectWord } from '@/utils/utils'
import type { MyVocabRow, Sieve, Sorting } from '@/types'
import DateTime from '@/components/DateTime'
import ToggleButton from '@/components/vocabulary/ToggleButton.vue'
import { useDebounceTransition } from '@/composables/useDebounce'
import { useElHover, useStateCallback, watched } from '@/composables/utilities'
import { find } from '@/utils/vocab'

const {
  myVocab = [],
  tableName
} = defineProps<{
  myVocab: Sieve[],
  tableName: string,
}>()
type TableSegment = typeof segments[number]['value']
const [seg, setSeg] = $(useStateCallback<TableSegment>(sessionStorage.getItem(`${tableName}-segment`) as TableSegment | null || 'all', (v) => {
  disabledTotal = true
  sessionStorage.setItem(`${tableName}-segment`, String(v))
  requestAnimationFrame(() => nextTick().then(() => disabledTotal = false))
}))
let dirty = $ref(false)
const isHovered = $(watched(useElHover('.el-table__body-wrapper'), (isHovered) => {
  if (!dirty) return
  if (!isHovered || rowsDisplay.value.length === 0) {
    rowsDisplay.value = rows
    dirty = false
  }
}))
const search = $ref('')
const defaultSort: Sorting = { order: 'descending', prop: 'vocab.time_modified' }
let sortBy = $ref(defaultSort)
const setSortBy = ({ order, prop }: Sorting) => sortBy = order && prop ? { order, prop } : defaultSort
const currPage = $ref(1)
const pageSize = $ref(100)
const rowsDisplay = shallowRef<MyVocabRow[]>([])
let total = $ref(0)
let disabledTotal = $ref(false)
const { output: totalTransit, inTransition } = $(useDebounceTransition($$(total), {
  disabled: $$(disabledTotal),
  transition: TransitionPresets.easeOutCirc,
}))
const srcRows = $computed(() => myVocab.map((r) => ({ vocab: r })))
const rowsSearched = $(watched(computed(() => pipe(srcRows,
  seg === 'mine' ? filter((r) => Boolean(r.vocab.acquainted && r.vocab.is_user)) :
    seg === 'top' ? filter((r) => Boolean(r.vocab.acquainted && !r.vocab.is_user)) :
      seg === 'recent' ? filter((r) => !r.vocab.acquainted && r.vocab.is_user !== 2) : filter((r) => !!r.vocab.acquainted),
  find(search),
)), (newSearched) => until($$(inTransition)).toBe(false).then(() => total = newSearched.length), { immediate: true }))
const rows = $(watched(computed(() => pipe(rowsSearched,
  orderBy(sortBy.prop, sortBy.order),
  paging(currPage, pageSize),
)), (v) => {
  if (!isHovered || rowsDisplay.value.length === 0) {
    rowsDisplay.value = v
  } else {
    dirty = true
  }
}, { immediate: true }))
const segments = $computed(() => [
  { value: 'all', label: t('all') },
  { value: 'mine', label: t('mine') },
  { value: 'top', label: t('top') },
  { value: 'recent', label: t('recent') },
] as const)
</script>

<template>
  <div class="flex grow flex-col overflow-hidden rounded-xl border bg-white shadow will-change-transform md:mx-0">
    <segmented-control
      :name="tableName"
      :segments="segments"
      :value="seg"
      class="w-full grow-0 pt-3 pb-2"
      :onChoose="setSeg"
    />
    <div class="h-px w-full grow">
      <el-table
        :data="rowsDisplay"
        :row-key="(row)=>row.vocab.w"
        class="!h-full !w-full md:w-full [&_th_.cell]:font-compact [&_th_.cell]:tracking-normal [&_*]:overscroll-contain [&_.el-table\_\_inner-wrapper]:!h-full"
        size="small"
        @sort-change="setSortBy"
      >
        <el-table-column
          :label="t('rank')"
          class-name="!text-center [th&>.cell]:!pr-0"
          width="64"
          prop="vocab.rank"
          sortable="custom"
        >
          <template #default="{row}">
            <div class="tabular-nums text-neutral-500">
              {{ row.vocab.rank }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('Vocabulary')"
          prop="vocab.w"
          min-width="70"
          sortable="custom"
          class-name="select-none [&>.cell]:!pr-0"
        >
          <template #header>
            <el-input
              v-model="search"
              class="!w-[calc(100%-26px)] !text-base md:!text-xs"
              size="small"
              :placeholder="t('search')"
              @click.stop
            />
          </template>
          <template #default="{row}">
            <span
              class="cursor-text select-text text-[16px] tracking-wide text-neutral-800"
              v-on="isMobile ? {} : { mouseover: selectWord }"
              @click.stop
            >
              {{ row.vocab.w }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('length')"
          prop="vocab.w.length"
          width="67"
          sortable="custom"
          class-name="!text-right [th&>.cell]:!p-0"
        >
          <template #default="{row}">
            <div class="tabular-nums">
              {{ row.vocab.w.length }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="32"
          class-name="overflow-visible !text-center [&_.cell]:!px-0"
        >
          <template #default="{row}">
            <toggle-button :row="row.vocab" />
          </template>
        </el-table-column>
        <el-table-column
          :label="t('distance')"
          class-name="[td&_.cell]:!pr-0"
          width="82"
          prop="vocab.time_modified"
          sortable="custom"
        >
          <template #default="{row}">
            <div class="font-compact tabular-nums tracking-normal ffs-[normal]">
              <date-time :time="row.vocab.time_modified" />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="min-h-9 w-full">
      <el-pagination
        v-model:currentPage="currPage"
        v-model:page-size="pageSize"
        :page-sizes="[100, 200, 500, 1000, Infinity]"
        :pager-count="5"
        :small="true"
        :total="~~totalTransit"
        class="shrink-0 flex-wrap gap-y-1.5 !p-1.5 tabular-nums [&_*]:!rounded-md [&_.is-active]:bg-neutral-100 [&_.el-pagination\_\_sizes.is-last]:!m-0 [&_.el-pagination\_\_total]:mx-[10px]"
        layout="prev, pager, next, ->, total, sizes"
      />
    </div>
  </div>
</template>
