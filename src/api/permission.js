import request from '@/utils/request'

export function getData(id) {
  return request({
    url: `permission/${id}`,
    method: 'get'
  })
}

export function getDatas(data) {
  return request({
    url: 'permission',
    method: 'get',
    params: data
  })
}

export function addData(data) {
  return request({
    url: 'permission',
    method: 'post',
    data
  })
}

export function updateData(id, data) {
  return request({
    url: `permission/${id}`,
    method: 'put',
    data
  })
}

export function deleteData(id) {
  return request({
    url: `permission/${id}`,
    method: 'delete'
  })
}

export function batchDisable(data) {
  return request({
    url: `permission/batchDisable`,
    method: 'post',
    data
  })
}

export function getParentOptions() {
  return request({
    url: `permission/getParentOptions`,
    method: 'post'
  })
}

export function getRoutes() {
  return request({
    url: `permission/getRoutes`,
    method: 'post'
  })
}
