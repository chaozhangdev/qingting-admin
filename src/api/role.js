import request from '@/utils/request'

export function getRoles() {
  return request({
    url: 'roles',
    method: 'get',
    params: { page: 1, limit: 100 }
  })
}

export function getDatas(data) {
  return request({
    url: 'roles',
    method: 'get',
    params: data
  })
}

export function addData(data) {
  return request({
    url: 'roles',
    method: 'post',
    data
  })
}

export function updateData(id, data) {
  return request({
    url: `roles/${id}`,
    method: 'put',
    data
  })
}

export function deleteData(id) {
  return request({
    url: `roles/${id}`,
    method: 'delete'
  })
}
