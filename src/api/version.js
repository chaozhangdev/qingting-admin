import request from '@/utils/request'

export function getData(id) {
  return request({
    url: `version/${id}`,
    method: 'get'
  })
}

export function getDatas(data) {
  return request({
    url: 'version',
    method: 'get',
    params: data
  })
}

export function addData(data) {
  return request({
    url: 'version',
    method: 'post',
    data
  })
}

export function updateData(id, data) {
  return request({
    url: `version/${id}`,
    method: 'put',
    data
  })
}

export function deleteData(id) {
  return request({
    url: `version/${id}`,
    method: 'delete'
  })
}

export function batchDisable(data) {
  return request({
    url: `version/batchDisable`,
    method: 'post',
    data
  })
}
