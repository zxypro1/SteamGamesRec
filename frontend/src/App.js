import { Form, Input, Button, List, Select, Slider, Card, Avatar, Image, Tag, Statistic, Carousel, Collapse, Typography } from 'antd';
import React, { useState, useEffect, useRef } from 'react'
import { HeartFilled } from '@ant-design/icons';
import qs from 'qs'
import logo from './Half-Life_lambda_logo.svg';
import axios from 'axios'
import tagList from './Taglist';
import {Helmet} from 'react-helmet';
import loading from './loading-gif.gif'
// import qs from 'qs';
// import jsonp from 'fetch-jsonp';
import './App.css';
const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;


function App() {
  // 删除单条
  const tag_colors = ["magenta", "red", "volcano", "orange", "gold", "lime", "green", "cyan", "blue", "geekblue", "purple"] // tag colors list
  const [isloading, setIsLoading] = useState(false); // 是否在加载中
  const [allgames, setAllGames] = useState([]) // 默认显示所有游戏的列表
  const [behind, setBehind] = useState([]) // 获取的游戏list
  const [itemSearch, setItemSearch] = useState() // 基于游戏推荐的游戏id
  const [userSearch, setUserSearch] = useState() // 基于用户推荐的用户id
  const [itemData, setItemData] = useState([]) // 游戏搜索下拉框的选项
  const [userData, setUserData] = useState([]) // 用户搜索下拉框的选项
  const [tableData, setTableData] = useState([]) // 已选游戏list Selected games list
  const [data, setData] = useState() // 推荐游戏list信息   Recommand games list info
  const [mode, setMode] = useState('0') // 推荐模式 Recommandation mode
  const [tag, setTag] = useState([]) // 已选择的筛选tag Filter tags
  const [price, setPrice] = useState([0,60]) // 价格范围 Price range
  const [description, setDescription] = useState("") // 个人描述 Self description
  const { Panel } = Collapse;
  const form = useRef();

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true)
      axios.get('http://steam-recommendation.top/allGameInfo')
      .then(function (response) {
        console.log(response)
        let data = response.data
        // console.log(data)
        const _list = dataProcessing(data)
        setAllGames(_list)
        setBehind(_list)
        setData(_list)
        setIsLoading(false)
      })
      .catch(function(error) {
        console.log(error);
        setIsLoading(false)
      })
    }
    getData()
    setPrice([0,60])
  }, [])

  const dataProcessing = (data) => {
    const _list = []
    for (let i = 0; i < data.length; i++) {
      let temp = JSON.parse(data[i])
      if (temp.screenshots) {
        temp.screenshots = JSON.parse(temp.screenshots.replace(/'/g, '"'))
      }
      if (temp.tags) {
        temp.tags = temp.tags.slice(1, temp.tags.length - 1).replace(/'/g, '').split(',').map((item) => item.trim())
      }
      // console.log(temp.tags)
      _list.push(JSON.parse(JSON.stringify(temp)))
    }
    // console.log(_list)
    return _list
  }

  const resetAllData = () => { // 重置所有数据
    setData(allgames);
    setItemSearch();
    setUserSearch();
    setItemData([]);
    setUserData([]);
    setTag([]);
    setPrice([0,60]);
    setBehind(allgames);
    setTableData([]);
    setDescription("");
    form.current.resetFields();
  }

  const onChangeFilterTags = (item) => { // 改变tag
    // console.log(item);
    setTag(item);
    filterGames(item, price);
  }

  const onChangePriceRange = (range) => { // 改变价格范围
    // console.log(range);
    setPrice(range);
    filterGames(tag, range);
  }

  const filterGames = (tag, price) => { // 筛选游戏
    if (tag.length === 0 && price[0] === 0 && price[1] === 60) {
      setData(behind);
      return;
    }
    const temp_list = [];
    console.log(tag, price);
    for (let i = 0; i < behind.length; i++) {
      // console.log(behind[i].tags)
      if (isSubClass(tag, behind[i].tags) && parseFloat(behind[i].price) >= price[0] && parseFloat(behind[i].price) <= price[1]) {
        temp_list.push(behind[i]);
      }
      setData(temp_list);
    }
  }

  const isSubClass = (cl1, cl2) => {
    return cl1.every(item => {
      return cl2.includes(item);
    })
  }

  const switchSearchMode = (value) => { // 切换推荐模式 switch recommandation mode
    console.log(value);
    resetAllData();
    setMode(value);
  }

  const removeItem = (key) => { // 去掉已选游戏
    setTableData((state) => state.filter((item) => item.id !== key.id));
    const temp = tableData.filter((item) => item.id !== key.id);
    console.log(temp);
    if (temp.length !== 0) {
      if (temp[temp.length-1].id !== tableData[tableData.length-1].id){
        getRecoByItem(temp[temp.length-1].id);
      }
    } else {
      setData(allgames);
    }
  }

  const addItem = (key) => { // 添加已选游戏
    console.log(key);
    if (tableData.find((item) => item.id === key.id)) {
      return;
    }
    setTableData((state) => state.concat(key));
    console.log(tableData);
    getRecoByItem(key.id);
  }

  const genreList = []
  for (let i = 0; i < tagList.length; i++) {
    genreList.push(<Option key={i} value={tagList[i]}>{tagList[i]}</Option>);
  }

  const getRecoByItem = (id) => { // 通过游戏推荐游戏
    const getData = async () => {
      setIsLoading(true)
      axios.post('http://steam-recommendation.top/getSimilarGamesByItem', qs.stringify({
        gameId: id
      }))
      .then(function (response) {
        console.log(response)
        let data = response.data
        // console.log(data)
        const _list = dataProcessing(data)
        setBehind(_list)
        setData(_list)
        setIsLoading(false)
      })
      .catch(function(error) {
        console.log(error);
        setIsLoading(false)
      })
    }
    getData()
  }

  const getRecoByUser = (id) => { // 通过用户推荐游戏
    const getData = async () => {
      setIsLoading(true)
      axios.post('http://steam-recommendation.top/getSimilarGamesByUser', qs.stringify({
        userId: id
      }))
      .then(function (response) {
        console.log(response)
        let data = response.data
        // console.log(data)
        const _list = dataProcessing(data)
        setBehind(_list)
        setData(_list)
        setIsLoading(false)
      })
      .catch(function(error) {
        console.log(error);
        setIsLoading(false)
      })
    }
    getData()
  }

  const getRecoByDesc = (desc) => { // 通过描述推荐tag
    const getData = async () => {
      setIsLoading(true)
      axios.post('http://steam-recommendation.top/getTagsFromText', qs.stringify({
        text: desc
      }))
      .then(function (response) {
        console.log(response)
        let data = response.data
        // console.log(data)
        const _list = data
        // setTag(_list)
        filterGames(_list, price)
        setIsLoading(false)
      })
      .catch(function(error) {
        console.log(error);
        setIsLoading(false)
      })
    }
    getData()
  }

  const handleItemChange = (newValue) => {
    setItemSearch(newValue);
  }

  const handleUserChange = (newValue) => {
    setUserSearch(newValue);
  }

  let currentItemValue;
  let itemTimeout;
  const _fetchItems = (newValue, callback) => {
    if (itemTimeout) {
      clearTimeout(itemTimeout);
      itemTimeout = null;
    }
    currentItemValue = newValue;
    const getData = async () => {
      console.log(newValue)
      axios.post('http://steam-recommendation.top/searchGameByName', qs.stringify({
        name: newValue
      }))
      .then(function (response) {
        if (currentItemValue === newValue) {
          console.log(response)
          let data = response.data
          // console.log(data)
          const _list = data
          callback(_list)
        }
      })
      .catch(function(error) {
        console.log(error);
      })
    }
    itemTimeout = setTimeout(getData, 300);
  }

  let currentUserValue;
  let userTimeout;
  const _fetchUsers = (newValue, callback) => {
    if (userTimeout) {
      clearTimeout(userTimeout);
      userTimeout = null;
    }
    currentUserValue = newValue;
    const getData = async () => {
      console.log(newValue)
      axios.post('http://steam-recommendation.top/searchUserByName', qs.stringify({
        name: newValue
      }))
      .then(function (response) {
        if (currentUserValue === newValue) {
          console.log(response)
          let data = response.data
          // console.log(data)
          const _list = data
          callback(_list)
        }
      })
      .catch(function(error) {
        console.log(error);
      })
    }
    userTimeout = setTimeout(getData, 300);
  }

  const handleItemSearch = (newValue) => {
    if (newValue) {
      _fetchItems(newValue, setItemData);
    } else {
      setItemSearch();
    }
  }

  const handleUserSearch = (newValue) => {
    if (newValue) {
      _fetchUsers(newValue, setUserData);
    } else {
      setUserSearch();
    }
  }

  const onSearch = (value) => { // 服务器搜索数据。两种情况：1. 搜索游戏 2. 搜索用户
    if (mode === '2') {
      value = description;
      getRecoByDesc(value);
    } else if (mode === '1') {
      value = userSearch;
      getRecoByUser(value);
      filterGames(tag, price);
    } else if (mode === '0') {
      value = itemSearch;
      getRecoByItem(value);
      filterGames(tag, price);
    }
  }

  const tags_list = (tags) => {
    const result = [];
    for (let i = 0; i < tags.length; i++) {
      result.push(<Tag color={tag_colors[Math.floor(Math.random() * 11 + 1)]}>{tags[i]}</Tag>);
    }
    return result;
  }

  const getSentimentColor = (senti) => {
    switch (senti) {
      case "Overwhelmingly Positive": return '#5c7e0f';
      case "Very Positive": return '#64bbec';
      case "Mostly Positive": return '#64bbec';
      case "Positive": return '#64bbec';
      case "Mixed": return '#a7936f';
      default: return 'red';
    }
  }

  const getItemPrice = (price) => {
    if (price) {
      if (price === "0.00" || price.toLowerCase() === "free to play" || price.toLowerCase() === "free") {
        return <Statistic value="Free" valueStyle={{ color: '#5c7e0f' }}></Statistic>
      } else if (price.toLowerCase() === "third-party") {
        return <Statistic value="N/A" valueStyle={{ color: '#5c7e0f' }}></Statistic>
      } else {
        return <Statistic value={price} precision={2} valueStyle={{ color: '#5c7e0f' }} suffix="$"></Statistic>
      }
    } else {
      return <Statistic value="N/A" valueStyle={{ color: '#5c7e0f' }}></Statistic>
    }
  }

  const getMetaScore = (meta) => {
    if (meta) {
      return <Card><Statistic title="Meta Score" value={meta} valueStyle={{ color: 'red' }}></Statistic></Card>
    }
  }

  const getPreviewImages = (images) => {
    const result = []
    if (images) {
      for (let i = 0; i < images.length; i++) {
        result.push(<Image src={images[i].path_full} alt='preview' width={272}/>);
      }
    }
    return result;
  }

  const item_options = itemData.map((d) => <Option key={d.id} value={d.id}>{d.title}</Option>);
  const user_options = userData.map((d) => <Option key={d.uid} value={d.uid}>{d.user_id}</Option>);


  return (
    <div className='App'>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Steam-Recommendation</title>
        <link rel="icon" href="./Half-Life_lambda_logo.svg" />
      </Helmet>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to <code>steam-recommendation.top</code>
        </p>
        <p>
          A steam games recommendation project base on <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">React</a>
        </p>
        <a
          className="App-link"
          href="https://github.com/zxypro1/SteamGamesRec"
          target="_blank"
          rel="noopener noreferrer"
        >
          Project Repository
        </a>
      </header>
      <div className='onLoading' style={{  display: isloading ? "" : "none" }}>
          <div className='textbox'>
            <p>Loading data, Please wait 1 to 2 min</p>
            <img className='loading_gif' src={loading} alt="loading"/>
          </div>
      </div>
      <div className='left'>
        <Form
        className='gameForm'
        name='basic'
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        autoComplete="off">
          <Form.Item
            className='input'
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
              <Select
                showSearch
                value={itemSearch}
                placeholder="Please select a game"
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={handleItemSearch}
                onChange={handleItemChange}
                notFoundContent={null}
              >
                {item_options}
              </Select>: mode === '1' ?
              <Select
                showSearch
                value={userSearch}
                placeholder="Please select a user"
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={handleUserSearch}
                onChange={handleUserChange}
                notFoundContent={null}
              >
                {user_options}
              </Select>:
              <TextArea rows={4} 
              onChange={(e) => setDescription(e.target.value)}
              />
            }
          </Form.Item>

          {/* <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item> */}
          
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" onClick={onSearch}>
              Submit
            </Button>
          </Form.Item>

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
            <Card 
            size='small' 
            title={<a href={item.url}>{item.title}</a>}
            hoverable 
            cover={<Image alt="game_image" src={item.header_image ? item.header_image : "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"} />}
            extra={<Button shape='round' onClick={() => {removeItem(item)}}>Delete</Button>}>
              <Collapse defaultActiveKey={['1']}>
                <Panel header="Description">
                  <p>{item.short_description}</p>
                </Panel>
              </Collapse>
            </Card>
          </List.Item>
        )}>
        </List>
      </div>



      <div className='right'>
        <div className='gameList'>
          <List
          loading={isloading}
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 8,
          }}
          dataSource={data} 
          footer={
            <div>
              <b style={{color: 'white'}}>Games Number: {data ? data.length : 0}</b>
            </div>
          }
          renderItem={ item => (
            <List.Item 
            style={{
              background: 'white'
            }}
            actions={
              [<Button shape="round" type="primary" icon={<HeartFilled style={{color: '#f969b4'}}/>} onClick={() => {addItem(item)}}>{" Like"}</Button>,
              getItemPrice(item.price),
              <Tag color={ getSentimentColor(item.sentiment) }><a href={item.reviews_url}>{item.sentiment}</a></Tag>,
              getMetaScore(item.metascore)]
            }
            extra={
              // <div key={item.id}>
              //   <Image
              //     preview={{
              //       visible: false
              //     }}
              //     width={272}
              //     alt="logo"
              //     onClick={() => setVisible(true)}
              //     src={item.header_image ? item.header_image : "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"}
              //   />
              //   <div
              //     style={{ display: 'none' }}
              //     >
              //       <Image.PreviewGroup
              //         preview={{
              //           visible,
              //           onVisibleChange: (vis) => setVisible(vis),
              //         }}
              //       >
              //         {getPreviewImages(item.screenshots)}
              //       </Image.PreviewGroup>
              //     </div>
              // </div>
              item.screenshots ?
              <Carousel style={{ width: 272 }} autoplay>
                <Image
                  width={272}
                  alt="logo"
                  src={item.header_image ? item.header_image : "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"}
                />
                {getPreviewImages(item.screenshots)}
              </Carousel>:
              <Image
                width={272}
                alt="logo"
                src={item.header_image ? item.header_image : "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"}
              />
            }
            >
              <List.Item.Meta
                avatar={<Avatar src={item.header_image} />}
                title={<a href={item.url}>{item.title}<Text className='developer-font'>   by {item.developer}</Text></a>}
                description={<div style={{overflow: 'hidden', whiteSpace: 'nowrap'}}>{tags_list(item.tags)}</div>}
              />
              {item.short_description}
            </List.Item>
          ) }/>
        </div>
      </div>
    </div>
  );
}

export default App;
