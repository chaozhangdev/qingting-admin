import request from '@/utils/request'

export function saveData(data) {
  return request({
    url: 'config/save',
    method: 'post',
    data
  })
}

export function getData() {
  return request({
    url: 'config/all',
    method: 'get'
  })
}
