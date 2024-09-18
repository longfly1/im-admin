import { NAvatar, NTag, NFlex, NText } from 'naive-ui'
import apiGroupUser from '@/views/group/user/api'
import apiUser from '@/views/user/list/api'

export const useUserSelect = ({ modalForm, modalAction }) => {
  const userOptions = ref()
  const userLoading = ref(false)

  /** 查找用户 */
  function userHandleSearch(query = '') {
    userLoading.value = true
    let params = {}
    if (modalAction && modalAction.value == 'groupConfig') {
      params = {
        pageNum: 1,
        pageSize: 30,
        groupId: modalForm.value.groupId,
        originNick: query,
        type: modalForm.value.type,
        sortField: 'createTime',
        sortType: 'desc',
        ignore: ['type'],
        op: { groupId: 'eq' },
      }
    } else {
      params = {
        pageNum: 1,
        pageSize: 30,
        name: query,
        sortField: 'createTime',
        sortType: 'desc',
        op: {},
      }
    }
    const apiCall = modalAction && modalAction.value === 'groupConfig' ? apiGroupUser : apiUser
    apiCall
      .fetchData(params)
      .then((res) => {
        userOptions.value = res.data.list
      })
      .finally(() => {
        userLoading.value = false
      })
  }

  function renderUserSelectTag({ option, handleClose }) {
    return h(
      NTag,
      {
        style: {
          padding: '0 6px 0 4px',
        },
        round: true,
        closable: true,
        onClose: (e) => {
          e.stopPropagation()
          handleClose()
        },
      },
      {
        default: () =>
          h(
            'div',
            {
              style: {
                display: 'flex',
                alignItems: 'center',
              },
            },
            [
              h(NAvatar, {
                src: option.avatar,
                round: true,
                size: 22,
                style: {
                  marginRight: '4px',
                },
              }),
              option.originNick || option.name,
            ]
          ),
      }
    )
  }
  function renderUserLabel(option) {
    return h(
      NFlex,
      {
        align: 'center',
      },
      [
        h(NAvatar, {
          src: option.avatar,
          round: true,
          size: 'small',
        }),
        h(
          'div',
          {
            style: {
              marginLeft: '10px',
              padding: '4px 0',
            },
          },
          [
            h('div', null, [
              modalAction && modalAction.value === 'groupConfig'
                ? option.originNick || option.name
                : option.name,
              ' _ ',
              option.phone,
            ]),
            h(
              NText,
              { depth: 3, tag: 'div' },
              {
                default: () => option.id,
              }
            ),
          ]
        ),
      ]
    )
  }

  return {
    userOptions,
    userLoading,
    userHandleSearch,
    renderUserSelectTag,
    renderUserLabel,
  }
}
