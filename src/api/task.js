import request from '@/utils/request'

export function getData(id) {
  return request({
    url: `task/${id}`,
    method: 'get'
  })
}

export function getDatas(data) {
  return request({
    url: 'task',
    method: 'get',
    params: data
  })
}

export function addData(data) {
  return request({
    url: 'task',
    method: 'post',
    data
  })
}

export function updateData(id, data) {
  return request({
    url: `task/${id}`,
    method: 'put',
    data
  })
}

export function deleteData(id) {
  return request({
    url: `task/${id}`,
    method: 'delete'
  })
}

export function batchDisable(data) {
  return request({
    url: `task/batchDisable`,
    method: 'post',
    data
  })
}

export function getInit() {
  return request({
    url: `task/getInit`,
    method: 'post'
  })
}
