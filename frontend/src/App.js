import { Form, Input, Checkbox, Button, List, Select, Slider, Card } from 'antd';
import React, { useState, useEffect } from 'react'
import axios from 'axios'
// import FormItem from 'antd/es/form/FormItem';
import './App.css';
const { Option } = Select;
const { Search, TextArea } = Input;


function App() {
  // 删除单条
  const [tableData, setTableData] = useState([]);
  const [data, setData] = useState()
  const [mode, setMode] = useState('0')
  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get('http://localhost:3001/user')
      console.log(data)
      const { user } = { ...data }
      setData(user)
    }
    getData()
  }, [])

  // this.mode1.current.style.display = 'block';
  // this.mode2.current.style.display = 'none';
  // this.mode3.current.style.display = 'none';

  const searchModes = [
    <Option key="0" value="0">Game-to-Game Recommendation</Option>,
    <Option key="1" value="1">User-to-Game Recommendation</Option>,
    <Option key="2" value="2">New-to-Game Recommendation</Option>,
  ]
  const gameList = [{
    id: 12,
    name: 'CSGO',
    price: '15.7'
  },{
    id: 13,
    name: 'TF2',
    price: '17.8'
  },{
    id: 14,
    name: 'TF2',
    price: '17.8'
  },{
    id: 15,
    name: 'TF2',
    price: '17.8'
  },{
    id: 16,
    name: 'TF2',
    price: '17.8'
  }];

  // useEffect(() => {
  //   const gameList = [{
  //     id: 12,
  //     name: 'CSGO',
  //     price: '15.7'
  //   },{
  //     id: 13,
  //     name: 'TF2',
  //     price: '17.8'
  //   },{
  //     id: 14,
  //     name: 'TF2',
  //     price: '17.8'
  //   },{
  //     id: 15,
  //     name: 'TF2',
  //     price: '17.8'
  //   },{
  //     id: 16,
  //     name: 'TF2',
  //     price: '17.8'
  //   }];
  //   setTableData(gameList);
  // }, [])

  // const gameList = data;

  // setTableData([{
  //   name: 'Cssada',
  //   price: '15.7'
  // }]); 
  const switchSearchMode = (value) => {
    console.log(value);
    setMode(value);
  }

  const removeItem = (key) => {
    setTableData((state) => state.filter((item) => item.id !== key.id));
    console.log(tableData);
  }

  const addItem = (key) => {
    console.log(key);
    if (tableData.find((item) => item.id === key.id)) {
      return;
    }
    setTableData((state) => state.concat(key));
    console.log(tableData);
  }

  const genreList = [];
  for (let i = 0; i < 10; i++) {
    genreList.push(<Option key={i} value={i}>{i}</Option>);
  }

  const onSearch = (value) => {
    console.log(value);
  }

  // const searchGameList = [<Option key="1" value="1">Not Identified</Option>,
  //   <Option key="2" value="2">Closed</Option>,
  //   <Option key="3" value="3">Communicated</Option>,
  //   <Option key="4" value="4">Identified</Option>,
  //   <Option key="5" value="5">Resolved</Option>,
  //   <Option key="6" value="6">Cancelled</Option>];

  const searchGameList = [];
  for (let i = 0; i < gameList.length; i++) {
    searchGameList.push(<Option key={i} value={i}>{gameList[i].name}</Option>);
  }
  
  return (
    <div className='App'>
      <header className='App-header'>
        <p>Begin</p>
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
            label="Mode"
            name="mode"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Select
            onChange={switchSearchMode}>
              {searchModes}
            </Select>
          </Form.Item>

          <Form.Item
            label="Genre"
            name="genre"
            // rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Select
            mode="multiple"
            allowClear
            >
              {genreList}
            </Select>
          </Form.Item>

          <Form.Item
            label={mode === '0' ? "Games Search" : mode === '1' ? "User Search" : "Self description"}
            name="gamename"
            rules={[{ required: true, message: 'Please enter the required field!' }]}
          >
            {
              mode === '0' ? 
              <Search 
              placeholder="input search text"
              allowClear
              enterButton="Search"
              onSearch={onSearch}
              />: mode === '1' ?
              <Search 
              placeholder="momoo"
              allowClear
              enterButton="Search"
              onSearch={onSearch}
              />:
              <TextArea rows={4} />
            }
          </Form.Item>

          {/* <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item> */}

          <Form.Item 
            wrapperCol={{ offset: 1, span: 23 }}
            label="Price range"
            name="price">
            <Slider range defaultValue={[20, 50]}/>
          </Form.Item>

          {/* <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item> */}
        </Form>
        <List
          className='selected-games-list'
          grid={{gutter: 16, column: 1}}
          dataSource={tableData}
          renderItem={item => (
          <List.Item>
            <Card size='small' title={item.name} extra={<Button onClick={() => {removeItem(item)}}>Delete</Button>}>{item.price}</Card>
          </List.Item>
        )}>
        </List>
      </div>



      <div className='right'>
        <div className='gameList'>
          <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 8,
          }}
          dataSource={gameList} 
          // grid={{ gutter: 16, 
          //   column: 4,
          //   xs: 1,
          //   sm: 2,
          //   md: 4,
          //   lg: 4,
          //   xl: 6,
          //   xxl: 3,}}
          footer={
            <div>
              <b>Steam Recommendation List</b>
            </div>
          }
          renderItem={ item => (
            <List.Item 
            onClick={() => {addItem(item)}}
            style={{background: 'white'}}
            extra={
              <img
                width={272}
                alt="logo"
                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
              />
            }
            >
              <List.Item.Meta
                // avatar={<Avatar src={item.avatar} />}
                title={<a href={'https://baidu.com'}>{item.name}</a>}
                description={item.price}
              />
              {item.price}
            </List.Item>
          ) }/>
        </div>
      </div>
    </div>
  );
}

export default App;
