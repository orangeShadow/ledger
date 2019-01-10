import api from '@/services/api'

export default {
  fetchRequisites  () {
    return api().get('api/requisites')
  },
  saveRequisites (requisites) {
    return api().post(`api/requisites`, requisites)
  }
}
