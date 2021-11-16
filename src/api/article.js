import request from '@/utils/request'

export function getData(id) {
  return request({
    url: `article/${id}`,
    method: 'get'
  })
}

export function getDatas(data) {
  return request({
    url: 'article',
    method: 'get',
    params: data
  })
}

export function addData(data) {
  return request({
    url: 'article',
    method: 'post',
    data
  })
}

export function updateData(id, data) {
  return request({
    url: `article/${id}`,
    method: 'put',
    data
  })
}

export function deleteData(id) {
  return request({
    url: `article/${id}`,
    method: 'delete'
  })
}

export function batchDisable(data) {
  return request({
    url: `article/batchDisable`,
    method: 'post',
    data
  })
}

export function getTypeOptions() {
  return request({
    url: `article/getTypeOptions`,
    method: 'post'
  })
}
