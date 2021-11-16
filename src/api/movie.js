import request from '@/utils/request'

export function getData(id) {
  return request({
    url: `movie/${id}`,
    method: 'get'
  })
}

export function getDatas(data) {
  return request({
    url: 'movie',
    method: 'get',
    params: data
  })
}

export function addData(data) {
  return request({
    url: 'movie',
    method: 'post',
    data
  })
}

export function updateData(id, data) {
  return request({
    url: `movie/${id}`,
    method: 'put',
    data
  })
}

export function deleteData(id) {
  return request({
    url: `movie/${id}`,
    method: 'delete'
  })
}

export function batchDisable(data) {
  return request({
    url: `movie/batchDisable`,
    method: 'post',
    data
  })
}

export function getTypeOptions() {
  return request({
    url: `movie/getTypeOptions`,
    method: 'post'
  })
}
