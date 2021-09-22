
export const getName = () => {
    return 'this is  a name!'
}

import { useCallback, useRef } from 'react'
import { debounce } from 'lodash'

// export interface DebouncedState<T extends (pushData: T[]) => ReturnType<T[]>> {
//   (...args: Parameters<T>): ReturnType<T[]> | []
// }

type debounceBack<T> = (pushData: T) => void

interface DebounceOptions {
  wait?: number
  leading?: boolean
  maxWait?: number
  trailing?: boolean
}

/**
 * cache recievd params and func The function to debounce.
 * 缓存推送数据, 使用debounce执行callback,并将缓存数据传给回调函数
 * @export
 * @template T
 * @params {Function} callback
 * @params {DebounceOptions} options  debounce options params
 * @params {Function} handler 实时处理推送数据的函数
 * @returns return a debounced callback
 */
export function useDebounceCache<T>(
  callback: (a: T[]) => void,
  options?: DebounceOptions,
  handler?: (a: T) => any
): debounceBack<T> {
// ): DebouncedState<any> {
  const cacheData = useRef<T[]>([])

  const wait = options?.wait ?? 500

  // 将缓存的数据作为回调函数的参数并回调
  // 清空缓存数据
  const clearCacheCall = useCallback(
    (datas: T[]) => {
      callback(datas)
      cacheData.current = []
    },
    [callback]
  )

  // add debounce func
  const onDebouncePushData = useCallback(
    debounce(clearCacheCall, wait, options ?? { maxWait: 2000 }),
    [clearCacheCall]
  )

  // 拦截入参，并根据参数类型区分取值方式 并缓存
  const debounceCallback = useCallback(
    (pushData: T) => {
      let newData: T | T[] | undefined = pushData

      // handler 函数有返回值,则将返回值 认为是 要进行缓存的数据
      // 如果没有返回值， 则默认 缓存推送的数据
      async function getHandleResult() {
        if (handler && typeof handler === 'function') {
          newData = await handler(pushData)
        }
      }
      getHandleResult()

      newData = newData ?? (pushData as T | T[])

      if (Array.isArray(newData)) {
        cacheData.current = [...newData, ...cacheData.current]
      } else {
        cacheData.current = [newData, ...cacheData.current]
      }
      onDebouncePushData(cacheData.current)
    },
    [onDebouncePushData, handler]
  )

  return debounceCallback
}
