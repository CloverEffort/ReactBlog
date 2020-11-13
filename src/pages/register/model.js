import * as api from './service';
import { msg } from '@/components/Message/index';
import { routerRedux } from 'dva/router';
import { JSEncrypt } from 'jsencrypt/bin/jsencrypt';
export default {
    namespace: 'register',
    state: {
        isError: false,
    },
    effects: {
        *register({ payload }, { call, put }) {
            const { password, ...rest } = payload;
            const result = yield call(api.getPublicKey);
            let encryptor = new JSEncrypt();
            encryptor.setPublicKey(result.data.resultmap); // 设置公钥
            const res = yield call(api.register, {
                password: encryptor.encrypt(password),
                ...rest,
            });
            switch (res.data.status) {
                case 'USERNAME_REPERATED':
                    msg('warning', '用户名重复，请重新登录。');
                    break;
                case 'EMAIL_REPEATED':
                    msg('warning', '邮箱重复');
                    break;
                case 'SUCCESS':
                    msg('success', '注册成功，请登录～', 2, yield put(routerRedux.push('/login')));
                    break;
            }
        },
    },
    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        },
    },
};
