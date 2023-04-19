import { Link } from 'react-router-dom'
import { Card, Breadcrumb, Form, Button, Radio, DatePicker, Select, Table, Tag, Space, Popconfirm } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useState } from 'react'
// import 'moment/locale/zh-cn'
// import locale from 'antd/es/date-picker/locale/zh_CN'
import dayjs from 'dayjs'
import './index.scss'
import img404 from '@/assets/error.png'
import { useEffect } from 'react'
import { http } from '@/utils'
import { history } from '@/utils/history'
const { Option } = Select
const { RangePicker } = DatePicker

const Article = () => {
  const [channels, setChannels] = useState([])
  useEffect(() => {
    async function getChannels () {
      const res = await http.get('/channels')
      setChannels(res.data.channels)
    }
    getChannels()
  }, [])

  const [article, setArticleList] = useState({
    list: [],
    count: 0
  })

  const [params, setParams] = useState({
    page: 1,
    per_page: 10
  })

  useEffect(() => {
    async function getArticleList () {
      const res = await http.get('/mp/articles', { params })
      const { results, total_count } = res.data
      setArticleList({
        list: results,
        count: total_count
      })
    }
    getArticleList()
  }, [params])


  const onSearch = values => {
    console.log('values', values)
    const { status, channel_id, date } = values

    const _params = {}
    _params.status = status
    if (channel_id) {
      _params.channel_id = channel_id
    }

    if (date) {
      // 这里用dayjs进行转换，不知道老师怎么转换的。
      _params.begin_pubdate = dayjs(date[0].$d).format('YYYY-MM-DD')
      _params.end_pubdate = dayjs(date[1].$d).format('YYYY-MM-DD')
    }

    setParams({
      ...params,
      ..._params
    })
  }

  const [form] = Form.useForm()
  const onReset = () => {
    form.resetFields()
    setParams({
      page: 1,
      per_page: 10
    })
  }

  const pageChange = (page) => {
    // 拿到当前页参数 修改params 引起接口更新
    setParams({
      ...params,
      page
    })
  }

  const delArticle = async (data) => {
    await http.delete(`/mp/articles/${data.id}`)
    // 更新列表
    setParams({
      ...params
    })
  }

  const columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      width: 120,
      render: cover => {
        return <img src={cover.images[0] || img404} width={80} height={60} alt="" />
      }
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 220
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: data => <Tag color="green">审核通过</Tag>
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate'
    },
    {
      title: '阅读数',
      dataIndex: 'read_count'
    },
    {
      title: '评论数',
      dataIndex: 'comment_count'
    },
    {
      title: '点赞数',
      dataIndex: 'like_count'
    },
    {
      title: '操作',
      render: data => {
        return (
          <Space size="middle">
            <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => history.push(`/publish?id=${data.id}`)} />
            <Popconfirm
              title="确认删除该条文章吗?"
              onConfirm={() => delArticle(data)}
              okText="确认"
              cancelText="取消"
            >
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Space>
        )
      }
    }
  ]

  return (
    <div>
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>内容管理</Breadcrumb.Item>
          </Breadcrumb>
        }
        style={{ marginBottom: 20 }}
      >
        <Form form={form} initialValues={{ status: null }} onFinish={onSearch}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={null}>全部</Radio>
              <Radio value={0}>草稿</Radio>
              <Radio value={1}>待审核</Radio>
              <Radio value={2}>审核通过</Radio>
              <Radio value={3}>审核失败</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="频道" name="channel_id">
            <Select
              placeholder="请选择文章频道"
              style={{ width: 120 }}
            >
              {channels.map(item => <Option value={item.id}>{item.name}</Option>)}
            </Select>
          </Form.Item>

          <Form.Item label="日期" name="date">
            {/* 传入locale属性 控制中文显示*/}
            {/* <RangePicker locale={locale}></RangePicker> */}
            <RangePicker></RangePicker>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 80 }}>
              筛选
            </Button>
            <Button htmlType="button" onClick={onReset}>
              重置
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title={`根据筛选条件共查询到 ${article.count} 条结果：`}>
        <Table rowKey="id" columns={columns} dataSource={article.list} pagination={{
          position: ['bottomCenter'],
          current: params.page,
          pageSize: params.per_page,
          total: article.count,
          onChange: pageChange
        }} />
        {/* 加上total就有了，总的 */}
      </Card>
    </div>
  )
}

export default Article