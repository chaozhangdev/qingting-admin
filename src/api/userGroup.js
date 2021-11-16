import request from '@/utils/request'

export function getData(id) {
  return request({
    url: `userGroup/${id}`,
    method: 'get'
  })
}

export function getDatas(data) {
  return request({
    url: 'userGroup',
    method: 'get',
    params: data
  })
}

export function addData(data) {
  return request({
    url: 'userGroup',
    method: 'post',
    data
  })
}

export function updateData(id, data) {
  return request({
    url: `userGroup/${id}`,
    method: 'put',
    data
  })
}

export function deleteData(id) {
  return request({
    url: `userGroup/${id}`,
    method: 'delete'
  })
}

export function batchDisable(data) {
  return request({
    url: `userGroup/batchDisable`,
    method: 'post',
    data
  })
}
