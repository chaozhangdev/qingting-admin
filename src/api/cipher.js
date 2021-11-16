import request from '@/utils/request'

export function getData(id) {
  return request({
    url: `cipher/${id}`,
    method: 'get'
  })
}

export function getDatas(data) {
  return request({
    url: 'cipher',
    method: 'get',
    params: data
  })
}

export function addData(data) {
  return request({
    url: 'cipher',
    method: 'post',
    data
  })
}

export function deleteData(id) {
  return request({
    url: `cipher/${id}`,
    method: 'delete'
  })
}

export function batchDisable(data) {
  return request({
    url: `cipher/batchDisable`,
    method: 'post',
    data
  })
}
