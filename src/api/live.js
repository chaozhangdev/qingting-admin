import request from '@/utils/request'

export function getDatas(data) {
  return request({
    url: 'live',
    method: 'get',
    params: data
  })
}

export function getDatasHistory(data) {
  return request({
    url: 'live/history',
    method: 'get',
    params: data
  })
}

