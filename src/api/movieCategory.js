import request from '@/utils/request'

export function getData(id) {
  return request({
    url: `movie/category/${id}`,
    method: 'get'
  })
}

export function getDatas(data) {
  return request({
    url: 'movie/category',
    method: 'get',
    params: data
  })
}

export function addData(data) {
  return request({
    url: 'movie/category',
    method: 'post',
    data
  })
}

export function updateData(id, data) {
  return request({
    url: `movie/category/${id}`,
    method: 'put',
    data
  })
}

export function deleteData(id) {
  return request({
    url: `movie/category/${id}`,
    method: 'delete'
  })
}

export function batchDisable(data) {
  return request({
    url: `movie/category/batchDisable`,
    method: 'post',
    data
  })
}

export function getParentCategoryOptions() {
  return request({
    url: `movie/category/getParentCategoryOptions`,
    method: 'post'
  })
}

export function getCategoryOptions() {
  return request({
    url: `movie/category/getCategoryOptions`,
    method: 'post'
  })
}
