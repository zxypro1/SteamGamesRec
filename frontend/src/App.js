import { Form, Input, Checkbox, Button, List, Card } from 'antd';
import './App.css';


function App() {
  const gameList = [{
    name: 'CSGO',
    price: '15.7'
  },{
    name: 'TF2',
    price: '17.8'
  }];
  return (
    <div className='App'>
      <header className='App-header'>

      </header>
      <div className='left'>
        <Form 
        className='gameForm'
        name='basic'
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        // onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className='right'>
        <div className='gameList'>
          <List
          dataSource={gameList} 
          grid={{ gutter: 16, 
            column: 4,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 6,
            xxl: 3,}}
          renderItem={ item => (
            <List.Item>
              <Card title={item.name}>{item.price}</Card>
            </List.Item>
          ) }/>
        </div>
      </div>
    </div>
  );
}

export default App;
