import request from '@/utils/request'

export function saveData(data) {
  return request({
    url: 'system/save',
    method: 'post',
    data
  })
}

export function getData() {
  return request({
    url: 'system/all',
    method: 'get'
  })
}
