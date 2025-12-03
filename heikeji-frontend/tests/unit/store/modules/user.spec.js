import { shallowMount } from '@vue/test-utils'
import userStore from '@/store/modules/user'
import { login, logout, getInfo } from '@/api/login'
import {
  getUserList,
  getUserDetail,
  updateUserStatus,
  getUserLevelList,
  getUserAddressList,
  getUserStatistics,
  updateUserInfo,
  addUser,
  deleteUser,
  batchDeleteUser,
} from '@/api/user'
import { getUserRoles, assignUserRoles, getEnabledRoles, getUserRoleIds } from '@/api/system'
import { getToken, setToken, removeToken } from '@/utils/auth'

// Mock all API calls
jest.mock('@/api/login')
jest.mock('@/api/user')
jest.mock('@/api/system')
jest.mock('@/utils/auth')

describe('User Store Module', () => {
  let store

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()

    // Setup a minimal store for testing
    store = {
      commit: jest.fn(),
      dispatch: jest.fn(),
      state: {},
    }
  })

  describe('State Initialization', () => {
    it('should have correct initial state', () => {
      expect(userStore.state.token).toBeUndefined()
      expect(userStore.state.name).toBe('')
      expect(userStore.state.avatar).toBe('')
      expect(userStore.state.roles).toEqual([])
      expect(userStore.state.permissions).toEqual([])
      expect(userStore.state.userList).toEqual([])
      expect(userStore.state.userTotal).toBe(0)
      expect(userStore.state.userDetail).toEqual({})
      expect(userStore.state.userLevelList).toEqual([])
      expect(userStore.state.userAddressList).toEqual([])
      expect(userStore.state.userStatistics).toEqual({})
      expect(userStore.state.userRoles).toEqual([])
      expect(userStore.state.enabledRoles).toEqual([])
      expect(userStore.state.userRoleIds).toEqual([])
    })
  })

  describe('Mutations', () => {
    let state

    beforeEach(() => {
      state = {
        token: '',
        name: '',
        avatar: '',
        roles: [],
        permissions: [],
        userList: [],
        userTotal: 0,
        userDetail: {},
        userLevelList: [],
        userAddressList: [],
        userStatistics: {},
        userRoles: [],
        enabledRoles: [],
        userRoleIds: [],
      }
    })

    it('SET_TOKEN should update token', () => {
      userStore.mutations.SET_TOKEN(state, 'test-token')
      expect(state.token).toBe('test-token')
    })

    it('SET_NAME should update name', () => {
      userStore.mutations.SET_NAME(state, 'test-user')
      expect(state.name).toBe('test-user')
    })

    it('SET_AVATAR should update avatar', () => {
      userStore.mutations.SET_AVATAR(state, 'test-avatar')
      expect(state.avatar).toBe('test-avatar')
    })

    it('SET_ROLES should update roles', () => {
      const roles = ['ADMIN', 'USER']
      userStore.mutations.SET_ROLES(state, roles)
      expect(state.roles).toEqual(roles)
    })

    it('SET_PERMISSIONS should update permissions', () => {
      const permissions = ['read', 'write']
      userStore.mutations.SET_PERMISSIONS(state, permissions)
      expect(state.permissions).toEqual(permissions)
    })

    it('SET_USER_LIST should update userList', () => {
      const userList = [{ id: 1, name: 'User 1' }]
      userStore.mutations.SET_USER_LIST(state, userList)
      expect(state.userList).toEqual(userList)
    })

    it('SET_USER_TOTAL should update userTotal', () => {
      userStore.mutations.SET_USER_TOTAL(state, 10)
      expect(state.userTotal).toBe(10)
    })

    it('SET_USER_DETAIL should update userDetail', () => {
      const userDetail = { id: 1, name: 'User 1' }
      userStore.mutations.SET_USER_DETAIL(state, userDetail)
      expect(state.userDetail).toEqual(userDetail)
    })

    it('SET_USER_LEVEL_LIST should update userLevelList', () => {
      const userLevelList = [{ id: 1, levelName: 'Level 1' }]
      userStore.mutations.SET_USER_LEVEL_LIST(state, userLevelList)
      expect(state.userLevelList).toEqual(userLevelList)
    })

    it('SET_USER_ADDRESS_LIST should update userAddressList', () => {
      const userAddressList = [{ id: 1, address: 'Address 1' }]
      userStore.mutations.SET_USER_ADDRESS_LIST(state, userAddressList)
      expect(state.userAddressList).toEqual(userAddressList)
    })

    it('SET_USER_STATISTICS should update userStatistics', () => {
      const userStatistics = { totalUsers: 100, activeUsers: 50 }
      userStore.mutations.SET_USER_STATISTICS(state, userStatistics)
      expect(state.userStatistics).toEqual(userStatistics)
    })

    it('SET_USER_ROLES should update userRoles', () => {
      const userRoles = [{ id: 1, name: 'Role 1' }]
      userStore.mutations.SET_USER_ROLES(state, userRoles)
      expect(state.userRoles).toEqual(userRoles)
    })

    it('SET_ENABLED_ROLES should update enabledRoles', () => {
      const enabledRoles = [{ id: 1, name: 'Role 1' }]
      userStore.mutations.SET_ENABLED_ROLES(state, enabledRoles)
      expect(state.enabledRoles).toEqual(enabledRoles)
    })

    it('SET_USER_ROLE_IDS should update userRoleIds', () => {
      const userRoleIds = [1, 2, 3]
      userStore.mutations.SET_USER_ROLE_IDS(state, userRoleIds)
      expect(state.userRoleIds).toEqual(userRoleIds)
    })

    // Test null/undefined handling
    it('SET_USER_LIST should handle null values', () => {
      userStore.mutations.SET_USER_LIST(state, null)
      expect(state.userList).toEqual([])
    })
  })

  describe('Auth Actions', () => {
    describe('Login', () => {
      it('should login successfully', async () => {
        const userInfo = { username: 'test', password: '123456', code: '1234', uuid: 'uuid-1234' }
        const response = { token: 'test-token' }

        login.mockResolvedValue(response)
        setToken.mockImplementation(() => {})

        await userStore.actions.Login(store, userInfo)

        expect(login).toHaveBeenCalledWith('test', '123456', '1234', 'uuid-1234')
        expect(setToken).toHaveBeenCalledWith('test-token')
        expect(store.commit).toHaveBeenCalledWith('SET_TOKEN', 'test-token')
      })

      it('should handle login failure', async () => {
        const userInfo = { username: 'test', password: 'wrong', code: '1234', uuid: 'uuid-1234' }
        const error = new Error('Login failed')

        login.mockRejectedValue(error)

        await expect(userStore.actions.Login(store, userInfo)).rejects.toThrow('Login failed')
        expect(setToken).not.toHaveBeenCalled()
        expect(store.commit).not.toHaveBeenCalled()
      })
    })

    describe('GetInfo', () => {
      it('should get user info successfully with roles', async () => {
        const token = 'test-token'
        const response = {
          user: { nickName: 'test-user', avatar: 'test-avatar.jpg' },
          roles: ['ADMIN', 'USER'],
          permissions: ['read', 'write'],
        }

        store.state.token = token
        getInfo.mockResolvedValue(response)

        await userStore.actions.GetInfo(store)

        expect(getInfo).toHaveBeenCalledWith(token)
        expect(store.commit).toHaveBeenCalledWith('SET_ROLES', ['ADMIN', 'USER'])
        expect(store.commit).toHaveBeenCalledWith('SET_PERMISSIONS', ['read', 'write'])
        expect(store.commit).toHaveBeenCalledWith('SET_NAME', 'test-user')
        expect(store.commit).toHaveBeenCalledWith('SET_AVATAR', 'test-avatar.jpg')
      })

      it('should handle null avatar correctly', async () => {
        const token = 'test-token'
        const response = {
          user: { nickName: 'test-user', avatar: null },
          roles: ['ADMIN'],
          permissions: ['read'],
        }

        store.state.token = token
        getInfo.mockResolvedValue(response)

        await userStore.actions.GetInfo(store)

        expect(store.commit).toHaveBeenCalledWith(
          'SET_AVATAR',
          'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
        )

      it('should set default role when no roles provided', async () => {
        const token = 'test-token'
        const response = {
          user: { nickName: 'test-user', avatar: 'test-avatar.jpg' },
          roles: [],
          permissions: [],
        }

        store.state.token = token
        getInfo.mockResolvedValue(response)

        await userStore.actions.GetInfo(store)

        expect(store.commit).toHaveBeenCalledWith('SET_ROLES', ['ROLE_DEFAULT'])
      })

      it('should handle getInfo failure', async () => {
        const token = 'test-token'
        const error = new Error('Get info failed')

        store.state.token = token
        getInfo.mockRejectedValue(error)

        await expect(userStore.actions.GetInfo(store)).rejects.toThrow('Get info failed')
      })
    })

    describe('LogOut', () => {
      it('should logout successfully', async () => {
        const token = 'test-token'

        store.state.token = token
        logout.mockResolvedValue({})
        removeToken.mockImplementation(() => {})

        await userStore.actions.LogOut(store)

        expect(logout).toHaveBeenCalledWith(token)
        expect(store.commit).toHaveBeenCalledWith('SET_TOKEN', '')
        expect(store.commit).toHaveBeenCalledWith('SET_ROLES', [])
        expect(store.commit).toHaveBeenCalledWith('SET_PERMISSIONS', [])
        expect(removeToken).toHaveBeenCalled()
      })

      it('should handle logout failure', async () => {
        const token = 'test-token'
        const error = new Error('Logout failed')

        store.state.token = token
        logout.mockRejectedValue(error)

        await expect(userStore.actions.LogOut(store)).rejects.toThrow('Logout failed')
        expect(removeToken).not.toHaveBeenCalled()
      })
    })

    describe('FedLogOut', () => {
      it('should perform frontend logout', async () => {
        removeToken.mockImplementation(() => {})

        await userStore.actions.FedLogOut(store)

        expect(store.commit).toHaveBeenCalledWith('SET_TOKEN', '')
        expect(removeToken).toHaveBeenCalled()
      })
    })
  })

  describe('User Management Actions', () => {
    describe('getUserList', () => {
      it('should get user list successfully', async () => {
        const params = { page: 1, limit: 10 }
        const response = {
          list: [
            { id: 1, name: 'User 1' },
            { id: 2, name: 'User 2' },
          ],
          total: 100,
        }

        getUserList.mockResolvedValue(response)

        const result = await userStore.actions.getUserList(store, params)

        expect(getUserList).toHaveBeenCalledWith(params)
        expect(store.commit).toHaveBeenCalledWith('SET_USER_LIST', response.list)
        expect(store.commit).toHaveBeenCalledWith('SET_USER_TOTAL', response.total)
        expect(result).toEqual(response)
      })

      it('should handle getUserList failure', async () => {
        const params = { page: 1, limit: 10 }
        const error = new Error('Get user list failed')

        getUserList.mockRejectedValue(error)

        await expect(userStore.actions.getUserList(store, params)).rejects.toThrow(
          'Get user list failed'
        )
      })

    describe('updateUserStatus', () => {
      it('should update user status successfully', async () => {
        const payload = { id: 1, status: true }
        const response = { success: true }

        updateUserStatus.mockResolvedValue(response)

        const result = await userStore.actions.updateUserStatus(store, payload)

        expect(updateUserStatus).toHaveBeenCalledWith(1, true)
        expect(result).toEqual(response)
      })

      it('should handle updateUserStatus failure', async () => {
        const payload = { id: 1, status: true }
        const error = new Error('Update user status failed')

        updateUserStatus.mockRejectedValue(error)

        await expect(userStore.actions.updateUserStatus(store, payload)).rejects.toThrow(
          'Update user status failed'
        )
      })

    describe('User Role Management', () => {
      it('should get user roles successfully', async () => {
        const userId = 1
        const roles = [{ id: 1, name: 'Role 1' }]

        getUserRoles.mockResolvedValue({ data: roles })

        const result = await userStore.actions.getUserRoles(store, userId)

        expect(getUserRoles).toHaveBeenCalledWith(userId)
        expect(store.commit).toHaveBeenCalledWith('SET_USER_ROLES', roles)
        expect(result).toEqual(roles)
      })

      it('should assign user roles successfully', async () => {
        const payload = { userId: 1, roleIds: [1, 2, 3] }
        const response = { success: true }

        assignUserRoles.mockResolvedValue(response)

        const result = await userStore.actions.assignUserRoles(store, payload)

        expect(assignUserRoles).toHaveBeenCalledWith(1, [1, 2, 3])
        expect(result).toEqual(response)
      })

      it('should get enabled roles successfully', async () => {
        const roles = [{ id: 1, roleName: 'Role 1' }]

        getEnabledRoles.mockResolvedValue({ data: roles })

        const result = await userStore.actions.getEnabledRoles(store)

        expect(getEnabledRoles).toHaveBeenCalled()
        expect(store.commit).toHaveBeenCalledWith('SET_ENABLED_ROLES', roles)
        expect(result).toEqual(roles)
      })

      it('should handle getEnabledRoles failure and return mock data', async () => {
        const error = new Error('Get enabled roles failed')

        getEnabledRoles.mockRejectedValue(error)

        const result = await userStore.actions.getEnabledRoles(store)

        expect(store.commit).toHaveBeenCalledWith('SET_ENABLED_ROLES', expect.any(Array))
        expect(result).toEqual(expect.any(Array))
        expect(result.length).toBe(5) // Should return 5 mock roles
      })
    })

    describe('User CRUD Operations', () => {
      it('should add user successfully', async () => {
        const userData = { username: 'newuser', email: 'new@example.com' }
        const response = { success: true, id: 10 }

        addUser.mockResolvedValue(response)

        const result = await userStore.actions.addUser(store, userData)

        expect(addUser).toHaveBeenCalledWith(userData)
        expect(result).toEqual(response)
      })

      it('should update user successfully', async () => {
        const payload = { userId: 1, username: 'updateduser', email: 'updated@example.com' }
        const response = { success: true }

        updateUserInfo.mockResolvedValue(response)

        const result = await userStore.actions.updateUser(store, payload)

        expect(updateUserInfo).toHaveBeenCalledWith(1, {
          username: 'updateduser',
          email: 'updated@example.com',
        })
        expect(result).toEqual(response)
      })

      it('should delete user successfully', async () => {
        const payload = { userId: 1 }
        const response = { success: true }

        deleteUser.mockResolvedValue(response)

        const result = await userStore.actions.deleteUser(store, payload)

        expect(deleteUser).toHaveBeenCalledWith(1)
        expect(result).toEqual(response)
      })

      it('should batch delete users successfully', async () => {
        const payload = { userIds: [1, 2, 3] }
        const response = { success: true }

        batchDeleteUser.mockResolvedValue(response)

        const result = await userStore.actions.batchDeleteUsers(store, payload)

        expect(batchDeleteUser).toHaveBeenCalledWith([1, 2, 3])
        expect(result).toEqual(response)
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle getUserRoleIds failure and return empty array', async () => {
      const userId = 1
      const error = new Error('Get user role IDs failed')

      getUserRoleIds.mockRejectedValue(error)

      const result = await userStore.actions.getUserRoleIds(store, userId)

      expect(store.commit).toHaveBeenCalledWith('SET_USER_ROLE_IDS', [])
      expect(result).toEqual([])
    })

    it('should handle addUser failure with error logging', async () => {
      const userData = { username: 'newuser' }
      const error = new Error('Add user failed')

      console.error = jest.fn()
      addUser.mockRejectedValue(error)

      await expect(userStore.actions.addUser(store, userData)).rejects.toThrow('Add user failed')
      expect(console.error).toHaveBeenCalledWith('添加用户失败:', error)
    })
  })
})
