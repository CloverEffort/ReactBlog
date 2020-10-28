import { message } from 'antd';

export const  msg = (type,...rest) => {
    return  message[type](...rest);
};
