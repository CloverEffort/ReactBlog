/**
 * @author M
 * @email mpw0311@163.com
 * @version  1.0.0
 * @description  用户注册组件
 */
import { Component } from 'react';
import { Link } from 'umi';
import { formatMessage } from 'umi/locale';
import { Form, Input, Button, Popover, Progress } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      visible: false,
      help: '',
      prefix: '86',
      getPasswordStatus: this.getPasswordStatus.bind(this),
    };
  }
  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };
  renderPasswordProgress = passwordProgressMap => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };
  render() {
    const { form, submitting } = this.props;

    const {
      // validateFields,
      getFieldDecorator: fd,
    } = form;
    const { count, help, visible } = this.state;

    const passwordStatusMap = {
      ok: (
        <div className={styles.success}>
          {formatMessage({ id: 'validation.password.strength.strong' })}
        </div>
      ),
      pass: (
        <div className={styles.warning}>
          {formatMessage({ id: 'validation.password.strength.medium' })}
        </div>
      ),
      poor: (
        <div className={styles.error}>
          {formatMessage({ id: 'validation.password.strength.short' })}
        </div>
      ),
    };
    const passwordProgressMap = {
      ok: 'success',
      pass: 'normal',
      poor: 'exception',
    };
    return (
      <div className={styles.register_form}>
        <Form layout={'vertical'}>
          <FormItem label="用户名" help={help}>
            {fd('name', {
              rules: [
                { required: true, message: formatMessage({ id: 'validation.password.required' }) },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(<Input size="large" type="text" />)}
          </FormItem>
          <FormItem label="密码" help={help}>
            <Popover
              content={
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress(passwordProgressMap)}
                  <div style={{ marginTop: 10 }}>
                    {formatMessage({ id: 'validation.password.strength.msg' })}
                  </div>
                </div>
              }
              overlayStyle={{ width: 240 }}
              placement="right"
              visible={visible}
            >
              {fd('password', {
                rules: [
                  {
                    validator: this.checkPassword,
                  },
                ],
              })(<Input size="large" type="password" />)}
            </Popover>
          </FormItem>
          <FormItem label="再次输入">
            {fd('confirm', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.password.required' }),
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(<Input size="large" type="password" />)}
          </FormItem>

          <FormItem label="邮箱">
            {fd('mail', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.email.required' }),
                },
                {
                  type: 'email',
                  message: formatMessage({ id: 'validation.email.wrong-format' }),
                },
              ],
            })(<Input size="large" />)}
          </FormItem>

          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              {formatMessage({ id: 'register.register' })}
            </Button>
            <Link className={styles.login} to="/login">
              {formatMessage({ id: 'register.sign-in' })}
            </Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(Register);
