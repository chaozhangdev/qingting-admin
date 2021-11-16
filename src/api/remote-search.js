import request from '@/utils/request'

export function searchUser(name) {
  return request({
    url: '/xinxing-admin/search/user',
    method: 'get',
    params: { name }
  })
}

export function transactionList(query) {
  return request({
    url: '/xinxing-admin/transaction/list',
    method: 'get',
    params: query
  })
}
