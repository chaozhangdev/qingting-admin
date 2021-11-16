import request from '@/utils/request'

export function getData(id) {
  return request({
    url: `admin/${id}`,
    method: 'get'
  })
}

export function getDatas(data) {
  return request({
    url: 'admin',
    method: 'get',
    params: data
  })
}

export function addData(data) {
  return request({
    url: 'admin',
    method: 'post',
    data
  })
}

export function updateData(id, data) {
  return request({
    url: `admin/${id}`,
    method: 'put',
    data
  })
}

export function deleteData(id) {
  return request({
    url: `admin/${id}`,
    method: 'delete'
  })
}

export function updateProfile(data) {
  return request({
    url: `admin/profile`,
    method: 'post',
    data
  })
}

export function adminLog(data) {
  return request({
    url: `admin/adminLog`,
    method: 'post',
    data
  })
}
