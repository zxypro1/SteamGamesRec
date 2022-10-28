import { Form, Input, Checkbox, Button, List, Select, Slider, Card } from 'antd';
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import tagList from './Taglist';
import './App.css';
const { Option } = Select;
const { Search, TextArea } = Input;


function App() {
  // 删除单条
  const [tableData, setTableData] = useState([]); // 已选游戏list Selected games list
  const [data, setData] = useState() // 推荐游戏list信息   Recommand games list info
  const [mode, setMode] = useState('0') // 推荐模式 Recommandation mode
  const [tag, setTag] = useState([]) // 已选择的筛选tag Filter tags
  const [price, setPrice] = useState([]) // 价格范围 Price range
  const form = useRef();

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get('http://localhost:3001/user')
      console.log(data)
      const { user } = { ...data }
      setData(user)
    }
    getData()
  }, [])

  const resetAllData = () => { // 重置所有数据
    setData([]);
    setTag([]);
    setPrice([]);
    setTableData([]);
    form.current.resetFields();
  }

  const onChangeFilterTags = (item) => { // 改变tag
    console.log(item);
    setTag(item);
    filterGames(tag, price);
  }

  const onChangePriceRange = (range) => { // 改变价格范围
    console.log(range);
    setPrice(range);
    filterGames(tag, price);
  }

  const filterGames = (tag, price) => { // 筛选游戏
  }

  const getAllGames = async () => { // 获取所有游戏
    const { data } = await axios.get('http://localhost:3001/user')
    console.log(data)
    const { user } = { ...data }
    setData(user)
  }

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

  const switchSearchMode = (value) => { // 切换推荐模式 switch recommandation mode
    console.log(value);
    resetAllData();
    getAllGames();
    setMode(value);
  }

  const removeItem = (key) => { // 去掉已选游戏
    setTableData((state) => state.filter((item) => item.id !== key.id));
    console.log(tableData);
  }

  const addItem = (key) => { // 添加已选游戏
    console.log(key);
    if (tableData.find((item) => item.id === key.id)) {
      return;
    }
    setTableData((state) => state.concat(key));
    console.log(tableData);
  }

  const genreList = []
  for (let i = 0; i < tagList.length; i++) {
    genreList.push(<Option key={i} value={i}>{tagList[i]}</Option>);
  }

  const onSearch = (value) => { // 服务器搜索
    console.log(value);
    const getData = async () => {
      const { data } = await axios.get('http://localhost:3001/user', {
        params: {

        }
      })
      console.log(data)
      const { user } = { ...data }
      setData(user)
    }
    getData();
  }

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
        ref={form}
        >
          <Form.Item
            label="Mode"
            name="mode"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Select
            onChange={switchSearchMode}
            defaultValue="0">
              <Option key="0" value="0">Game-to-Game Recommendation</Option>
              <Option key="1" value="1">User-to-Game Recommendation</Option>
              <Option key="2" value="2">New-to-Game Recommendation</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Genre"
            name="genre"
          >
            <Select
            mode="multiple"
            onChange={onChangeFilterTags}
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
            <Slider 
            range 
            defaultValue={[20, 50]}
            onChange={onChangePriceRange}/>
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
