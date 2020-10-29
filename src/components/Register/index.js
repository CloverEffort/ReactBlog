/**
 * @author Clover
 * @email 378406712@qq.com
 * @version  1.0.1
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
      visible: false,
      getPasswordStatus: this.getPasswordStatus.bind(this),
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, onSubmit } = this.props;
    form.validateFields({ force: true }, (errors, values) => {
      onSubmit(errors, values);
    });
  };
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
    const { visible } = this.state;

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
    const CheckPass = async (rule, value, callback) => {
      const confirm = form.getFieldValue('confirm');
      this.setState({
        visible: true,
      });
      if (confirm && confirm !== value) {
        callback('两次输入不一致！');
      } else {
        callback();
      }
    };
    const RecheckPass = async (rule, value, callback) => {
      const password = form.getFieldValue('password');
      try {
        if (password && password !== value) {
          callback('两次输入不一致');
        } else {
          callback();
        }
      } catch (error) {
        callback(error);
      }
    };
    return (
      <div className={styles.register_form}>
        <Form layout={'vertical'} onSubmit={this.handleSubmit}>
          <FormItem label="用户名">
            {fd('username', {
              rules: [
                { required: true, message: '用户名不能为空' },
                { max: 10, message: '用户名长度不能多于10位' },
                { min: 4, message: '用户名长度不能少于4位' },
              ],
            })(<Input autoComplete="off" size="large" type="text" />)}
          </FormItem>
          <FormItem label="密码">
            <Popover
              content={
                <div>
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
                    pattern: /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)\S{8,}$/,
                    message: '密码须由数字,大写字母,小写字母,至少其中两种组成',
                  },
                  {
                    validator: CheckPass,
                  },
                ],
                validateTrigger: 'onBlur',
              })(<Input.Password autoComplete="off" size="large" type="password" />)}
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
                  validator: RecheckPass,
                },
              ],
              validateTrigger: 'onBlur',
            })(<Input.Password autoComplete="off" size="large" type="password" />)}
          </FormItem>

          <FormItem label="邮箱">
            {fd('e_mail', {
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
              validateTrigger: 'onBlur',
            })(<Input autoComplete="off" size="large" />)}
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
