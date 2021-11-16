import request from '@/utils/request'

export function getData(id) {
  return request({
    url: `topic/${id}`,
    method: 'get'
  })
}

export function getDatas(data) {
  return request({
    url: 'topic',
    method: 'get',
    params: data
  })
}

export function addData(data) {
  return request({
    url: 'topic',
    method: 'post',
    data
  })
}

export function updateData(id, data) {
  return request({
    url: `topic/${id}`,
    method: 'put',
    data
  })
}

export function deleteData(id) {
  return request({
    url: `topic/${id}`,
    method: 'delete'
  })
}

export function batchDisable(data) {
  return request({
    url: `topic/batchDisable`,
    method: 'post',
    data
  })
}

export function getTopicList(data) {
  return request({
    url: 'topic',
    method: 'get',
    params: data
  })
}
