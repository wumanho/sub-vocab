import { PropType, defineComponent } from 'vue'
import type { Source } from '@/types'

function source(src: Source) {
  const lines: [number, [number, number][]][] = []
  src.sort((a, b) => a[0] - b[0] || a[1] - b[1])

  for (const [sid, start, count] of src) {
    if (lines[lines.length - 1]?.[0] === sid) {
      lines[lines.length - 1][1].push([start, count])
    } else {
      lines.push([sid, [[start, count]]])
    }
  }

  return lines
}

function line(sentence: string, idxes: [number, number][]) {
  let progress = 0
  return (
    <>
      {idxes.map(([start, count]) => (
        <>
          <span>{sentence.slice(progress, start)}</span>
          <span class="font-bold italic">{sentence.slice(start, progress = start + count)}</span>
        </>
      ))}
      <span>{sentence.slice(progress)}</span>
    </>
  )
}

function examples(sentences: string[], src: Source) {
  return (
    <div class="mb-1 ml-5 mr-3">
      {source(src).map(([no, idx], index) => (
        <div
          key={index}
          class="break-words"
          style="word-break: break-word;"
        >
          {line(sentences[no], idx)}
        </div>
      ))}
    </div>
  )
}

export default defineComponent({
  props: {
    sentences: { type: Array as PropType<string[]>, default: () => [''] },
    src: { type: Array as PropType<Source>, default: () => [[0, 0]] },
  },
  setup(props: { sentences: string[]; src: Source }) {
    return () => examples(props.sentences, props.src)
  },
})
