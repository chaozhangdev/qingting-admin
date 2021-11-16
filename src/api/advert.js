import request from '@/utils/request'

export function getData(id) {
  return request({
    url: `advert/${id}`,
    method: 'get'
  })
}

export function getDatas(data) {
  return request({
    url: 'advert',
    method: 'get',
    params: data
  })
}

export function addData(data) {
  return request({
    url: 'advert',
    method: 'post',
    data
  })
}

export function updateData(id, data) {
  return request({
    url: `advert/${id}`,
    method: 'put',
    data
  })
}

export function deleteData(id) {
  return request({
    url: `advert/${id}`,
    method: 'delete'
  })
}

export function batchDisable(data) {
  return request({
    url: `advert/batchDisable`,
    method: 'post',
    data
  })
}

export function getTypeOptions() {
  return request({
    url: `advert/getTypeOptions`,
    method: 'post'
  })
}
