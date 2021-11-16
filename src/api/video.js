import request from '@/utils/request'

export function getData(id) {
  return request({
    url: `video/${id}`,
    method: 'get'
  })
}

export function getDatas(data) {
  return request({
    url: 'video',
    method: 'get',
    params: data
  })
}

export function addData(data) {
  return request({
    url: 'video',
    method: 'post',
    data
  })
}

export function updateData(id, data) {
  return request({
    url: `video/${id}`,
    method: 'put',
    data
  })
}

export function deleteData(id) {
  return request({
    url: `video/${id}`,
    method: 'delete'
  })
}

export function batchDisable(data) {
  return request({
    url: `video/batchDisable`,
    method: 'post',
    data
  })
}

