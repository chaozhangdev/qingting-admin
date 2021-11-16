import request from '@/utils/request'

export function getData(id) {
  return request({
    url: `category/${id}`,
    method: 'get'
  })
}

export function getDatas(data) {
  return request({
    url: 'category',
    method: 'get',
    params: data
  })
}

export function addData(data) {
  return request({
    url: 'category',
    method: 'post',
    data
  })
}

export function updateData(id, data) {
  return request({
    url: `category/${id}`,
    method: 'put',
    data
  })
}

export function deleteData(id) {
  return request({
    url: `category/${id}`,
    method: 'delete'
  })
}

export function batchDisable(data) {
  return request({
    url: `category/batchDisable`,
    method: 'post',
    data
  })
}

export function getParentCategoryOptions() {
  return request({
    url: `category/getParentCategoryOptions`,
    method: 'post'
  })
}

export function getCategoryOptions() {
  return request({
    url: `category/getCategoryOptions`,
    method: 'post'
  })
}
