import { Form, Input, Button, List, Select, Slider, Card } from 'antd';
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import tagList from './Taglist';
import qs from 'qs';
import jsonp from 'fetch-jsonp';
import './App.css';
const { Option } = Select;
const { Search, TextArea } = Input;

let timeout;
let currentValue;
const fetch = (value, callback) => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;
  const fake = () => {
    const str = qs.stringify({
      code: 'utf-8',
      q: value,
    });
    jsonp(`https://suggest.taobao.com/sug?${str}`)
      .then((response) => response.json())
      .then((d) => {
        if (currentValue === value) {
          const { result } = d;
          const data = result.map((item) => ({
            value: item[0],
            text: item[0],
          }));
          callback(data);
        }
      });
  };
  timeout = setTimeout(fake, 300);
};

function App() {
  // 删除单条
  const [tableData, setTableData] = useState([]); // 已选游戏list Selected games list
  const [data, setData] = useState() // 推荐游戏list信息   Recommand games list info
  const [mode, setMode] = useState('0') // 推荐模式 Recommandation mode
  const [tag, setTag] = useState([]) // 已选择的筛选tag Filter tags
  const [price, setPrice] = useState([]) // 价格范围 Price range
  const [description, setDescription] = useState("") // 个人描述 Self description
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
    const temp_list = [];
    for (let i = 0; i < data.length; i++) {
      if (isSubClass(tag, data[i].genre) && parseFloat(data[i].price) >= price[0] && parseFloat(data[i].price) <= price[1]) {
        temp_list.push(data[i]);
      }
      setData(temp_list);
    }
  }

  const isSubClass = (cl1, cl2) => {
    return cl1.every(item => {
      return cl2.includes(item);
    })
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
    getRecoByItem(tableData[-1]);
    console.log(tableData);
  }

  const addItem = (key) => { // 添加已选游戏
    console.log(key);
    if (mode === '0' || mode === '2') {
      if (tableData.find((item) => item.id === key.id)) {
        return;
      }
      setTableData((state) => state.concat(key));
      getRecoByItem(tableData[-1]);
      console.log(tableData);
    } else {
      getRecoByUser(key.name);
    }
  }

  const genreList = []
  for (let i = 0; i < tagList.length; i++) {
    genreList.push(<Option key={i} value={tagList[i]}>{tagList[i]}</Option>);
  }

  const searchByItem = (item) => { // 通过游戏名搜索游戏
    
  }

  const searchByUser = (user) => { // 通过用户名搜索用户

  }

  const getRecoByItem = (item) => { // 通过游戏推荐游戏

  }

  const getRecoByUser = (user) => { // 通过用户推荐游戏

  }

  const getRecoByDesc = (desc) => { // 通过描述推荐tag

  }

  const onSearch = (value) => { // 服务器搜索数据。两种情况：1. 搜索游戏 2. 搜索用户
    if (mode === '2') {
      value = description;
      getRecoByDesc(value);
    } else if (mode === '1') {
      searchByUser(value);
    } else if (mode === '0') {
      searchByItem(value);
    }
    console.log(value);
    const getData = async () => {
      const { data } = await axios.get('http://localhost:3001/user', {
        params: {

        }
      })
      console.log(data)
      const { user } = { ...data }
      setData(user)
      filterGames(tag, price)
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
        autoComplete="off">
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
        </Form>
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
              <TextArea rows={4} 
              onChange={(e) => setDescription(e.target.value)}
              />
            }
          </Form.Item>

          {/* <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item> */}
          {
          mode === '2' ? 
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" onClick={onSearch}>
              Submit
            </Button>
          </Form.Item>: ''
          }

          <Form.Item 
            wrapperCol={{ offset: 1, span: 23 }}
            label="Price range"
            name="price">
            <Slider 
            range 
            defaultValue={[0, 60]}
            onChange={onChangePriceRange}
            min={0}
            max={60}/>
          </Form.Item>
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
