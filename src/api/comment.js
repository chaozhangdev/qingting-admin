import request from '@/utils/request'

export function getData(id) {
  return request({
    url: `comment/${id}`,
    method: 'get'
  })
}

export function getDatas(data) {
  return request({
    url: 'comment',
    method: 'get',
    params: data
  })
}

export function addData(data) {
  return request({
    url: 'comment',
    method: 'post',
    data
  })
}

export function updateData(id, data) {
  return request({
    url: `comment/${id}`,
    method: 'put',
    data
  })
}

export function deleteData(id) {
  return request({
    url: `comment/${id}`,
    method: 'delete'
  })
}

export function batchDisable(data) {
  return request({
    url: `comment/batchDisable`,
    method: 'post',
    data
  })
}
