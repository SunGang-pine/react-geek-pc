import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select
} from 'antd'
import { useState, useEffect, useRef } from 'react'
import { http } from '@/utils'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import './index.scss'

const { Option } = Select

const Publish = () => {

  // 频道列表
  const [channels, setChannels] = useState([])
  useEffect(() => {
    async function fetchChannels () {
      const res = await http.get('/channels')
      setChannels(res.data.channels)
    }
    fetchChannels()
  }, [])

  // 上传图片，图片列表
  const [fileList, setFileList] = useState([])
  // 上传成功回调
  const onUploadChange = info => {
    const fileList = info.fileList.map(file => {
      if (file.response) {
        return {
          url: file.response.data.url
        }
      }
      return file
    })
    setFileList(fileList)
    // 2、上传图片，将图片存在暂存区
    fileListRef.current = fileList
  }



  const [imgCount, setImgCount] = useState(1)
  const handleChangeType = e => {
    const nowImgType = e.target.value
    setImgCount(e.target.value)

    if (nowImgType === 1) {
      const first = fileListRef.current[0]
      setFileList(first ? [first] : [])
    } else if (nowImgType === 0) {
      setFileList([])
    } else {
      setFileList(fileListRef.current)
    }
  }


  // 1、暂存仓库，存储完整的图片列表
  const fileListRef = useRef([])


  const navigator = useNavigate()
  const onFinish = async (values) => {
    // 数据的二次处理 重点是处理cover字段
    const { channel_id, content, title, type } = values
    const data = {
      channel_id,
      content,
      title,
      type,
      cover: {
        type: type,
        images: fileList.map(item => item.url)
      }
    }
    if (articleId) {
      // 编辑
      await http.put(`/mp/articles/${data.id}?draft=false`, data)
    } else {
      // 新增
      await http.post('/mp/articles?draft=false', data)
    }
    navigator('/article')
  }


  const [params] = useSearchParams()
  const articleId = params.get('id')

  const [form] = Form.useForm()
  useEffect(() => {
    async function getArticleDetail () {
      const res = await http.get(`/mp/articles/${articleId}`)
      const { cover, ...formValue } = res.data
      form.setFieldsValue({ ...formValue, type: cover.type })

      // 格式化封面图片数据
      const imageList = cover.images.map(url => ({ url }))
      setFileList(imageList)
      setImgCount(cover.type)
      fileListRef.current = imageList
    }
    if (articleId) {
      getArticleDetail()
    }
  }, [articleId, form])

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{articleId ? '编辑文章' : '发布文章'}</Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <Form
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          // 注意：此处需要为富文本编辑表示的 content 文章内容设置默认值
          initialValues={{ type: 1, content: '' }}
          onFinish={onFinish}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: '请选择文章频道' }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {channels.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={handleChangeType}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {imgCount > 0 && <Upload
              name="image"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList
              action="http://geek.itheima.net/v1_0/upload"
              fileList={fileList}
              onChange={onUploadChange}
              maxCount={imgCount}
              multiple={imgCount > 0}
            >
              <div style={{ marginTop: 8 }}>
                <PlusOutlined />
              </div>
            </Upload>}
          </Form.Item>


          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入文章内容' }]}
          >
            <ReactQuill
              className="publish-quill"
              theme="snow"
              placeholder="请输入文章内容"
            />

          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 4,
              span: 16,
            }}
          >
            <Button size="large" type="primary" htmlType="submit">
              {articleId ? '编辑文章' : '发布文章'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Publish