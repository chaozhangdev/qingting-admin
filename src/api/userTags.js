import request from '@/utils/request'

export function getData(id) {
  return request({
    url: `userTags/${id}`,
    method: 'get'
  })
}

export function getDatas(data) {
  return request({
    url: 'userTags',
    method: 'get',
    params: data
  })
}

export function addData(data) {
  return request({
    url: 'userTags',
    method: 'post',
    data
  })
}

export function updateData(id, data) {
  return request({
    url: `userTags/${id}`,
    method: 'put',
    data
  })
}

export function deleteData(id) {
  return request({
    url: `userTags/${id}`,
    method: 'delete'
  })
}

export function batchDisable(data) {
  return request({
    url: `userTags/batchDisable`,
    method: 'post',
    data
  })
}

export function getTypeOptions() {
  return request({
    url: `userTags/getTypeOptions`,
    method: 'post'
  })
}

export function getUserTags(data) {
  return request({
    url: 'userTags',
    method: 'get',
    params: data
  })
}
