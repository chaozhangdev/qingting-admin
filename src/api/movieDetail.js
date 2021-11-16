import request from '@/utils/request'

export function getDetailData(id) {
  return request({
    url: `movieDetail/${id}`,
    method: 'get'
  })
}

export function getDetailDatas(data) {
  return request({
    url: 'movieDetail',
    method: 'get',
    params: data
  })
}

export function addDetailData(data) {
  return request({
    url: 'movieDetail',
    method: 'post',
    data
  })
}

export function updateDetailData(id, data) {
  return request({
    url: `movieDetail/${id}`,
    method: 'put',
    data
  })
}

export function deleteDetailData(id) {
  return request({
    url: `movieDetail/${id}`,
    method: 'delete'
  })
}

export function batchDetailDisable(data) {
  return request({
    url: `movieDetail/batchDisable`,
    method: 'post',
    data
  })
}
