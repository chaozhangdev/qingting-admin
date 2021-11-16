import request from '@/utils/request'

export function getDatas(data) {
  return request({
    url: 'users',
    method: 'get',
    params: data
  })
}

export function addData(data) {
  return request({
    url: 'users',
    method: 'post',
    data
  })
}

export function updateData(id, data) {
  return request({
    url: `users/${id}`,
    method: 'put',
    data
  })
}

export function deleteData(id) {
  return request({
    url: `users/${id}`,
    method: 'delete'
  })
}

export function updateProfile(data) {
  return request({
    url: `users/profile`,
    method: 'post',
    data
  })
}

export function batchDisable(data) {
  return request({
    url: `users/batchDisable`,
    method: 'post',
    data
  })
}

export function refer(data) {
  return request({
    url: `users/refer`,
    method: 'post',
    data
  })
}

export function accountLog(data) {
  return request({
    url: `users/accountLog`,
    method: 'post',
    data
  })
}

export function withdrawLog(data) {
  return request({
    url: `users/withdrawLog`,
    method: 'post',
    data
  })
}

export function accountType(data) {
  return request({
    url: `users/accountType`,
    method: 'post',
    data
  })
}
