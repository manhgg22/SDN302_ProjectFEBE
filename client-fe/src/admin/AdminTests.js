import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card, Input, Button, InputNumber, Space, Typography, Divider,
  Tag, Row, Col, notification, Tabs
} from 'antd';
import {
  PlusOutlined, ReloadOutlined, BulbOutlined,
  FileTextOutlined, CheckCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

const AdminTests = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [duration, setDuration] = useState(30);
  const [questionIds, setQuestionIds] = useState([]);
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [randomLoading, setRandomLoading] = useState(false);
  const [exams, setExams] = useState([]);

  const generateExamCode = () => {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const generatedCode = `EXAM-${random}`;
    setCode(generatedCode);
    notification.success({
      message: "🎯 Mã đề thi đã được tạo",
      description: generatedCode,
      placement: "topRight"
    });
  };

  const handleRandomQuestions = async () => {
    setRandomLoading(true);
    try {
      const res = await axios.get(`http://localhost:9999/admin/questions/random?count=${count}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });
      const ids = res.data.map(q => q._id);
      setQuestionIds(ids);
      notification.success({
        message: '🎲 Câu hỏi ngẫu nhiên',
        description: `Đã chọn ${ids.length} câu hỏi`,
        placement: 'topRight'
      });
    } catch (err) {
      notification.error({
        message: '❌ Lỗi khi chọn câu hỏi',
        description: 'Không thể lấy dữ liệu từ server',
        placement: 'topRight'
      });
    } finally {
      setRandomLoading(false);
    }
  };

  const handleCreateTest = async () => {
    if (!title || !description || !code || questionIds.length === 0) {
      notification.warning({
        message: "⚠️ Thiếu thông tin",
        description: "Vui lòng điền đầy đủ thông tin và chọn câu hỏi.",
        placement: "topRight"
      });
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:9999/admin/tests", {
        title,
        description,
        code,
        duration,
        questionIds
      }, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });

      notification.success({
        message: "✅ Tạo đề thi thành công",
        description: `Đề "${title}" đã được lưu.`,
        placement: "topRight"
      });

      // Reset form
      setTitle("");
      setDescription("");
      setCode("");
      setDuration(30);
      setQuestionIds([]);
      setCount(5);
      fetchExams();
    } catch (err) {
      if (err.response?.data?.message === "Mã đề thi đã tồn tại") {
        notification.error({
          message: "❌ Mã đề đã tồn tại",
          description: "Vui lòng tạo mã khác.",
          placement: "topRight"
        });
      } else {
        notification.error({
          message: "❌ Lỗi khi tạo đề thi",
          description: "Không thể lưu vào hệ thống.",
          placement: "topRight"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchExams = async () => {
    try {
      const res = await axios.get("http://localhost:9999/admin/tests", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });
      setExams(res.data);
    } catch (err) {
      console.error("Lỗi tải danh sách đề:", err);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <style jsx>{`
        .custom-tabs .ant-tabs-tab {
          background: rgba(255, 255, 255, 0.9) !important;
          border: 2px solid rgba(255, 255, 255, 0.3) !important;
          border-radius: 12px 12px 0 0 !important;
          margin-right: 8px !important;
          padding: 12px 24px !important;
          font-weight: 600 !important;
          font-size: 16px !important;
          color: #4a5568 !important;
          transition: all 0.3s ease !important;
        }
        
        .custom-tabs .ant-tabs-tab:hover {
          background: rgba(255, 255, 255, 1) !important;
          border-color: #667eea !important;
          color: #667eea !important;
          transform: translateY(-2px) !important;
        }
        
        .custom-tabs .ant-tabs-tab-active {
          background: #ffffff !important;
          border-color: #667eea !important;
          color: #667eea !important;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
        }
        
        .custom-tabs .ant-tabs-content-holder {
          background: #ffffff !important;
          border-radius: 0 12px 12px 12px !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
        }
        
        .custom-tabs .ant-tabs-tabpane {
          padding: 0 !important;
        }
        
        .custom-tabs .ant-tabs-nav {
          margin-bottom: 0 !important;
        }
        
        .custom-tabs .ant-tabs-nav::before {
          display: none !important;
        }
      `}</style>
      
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Tabs 
          defaultActiveKey="1" 
          onChange={(key) => key === "2" && fetchExams()} 
          className="custom-tabs"
          size="large"
        >
          <TabPane tab="➕ Tạo đề thi" key="1">
            <Card bodyStyle={{ padding: '40px' }} bordered={false}>
              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <Text strong>Tiêu đề đề thi</Text>
                  <Input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Nhập tiêu đề đề thi"
                    size="large"
                    style={{ marginTop: 8 }}
                  />
                </Col>
                <Col xs={24} md={12}>
                  <Text strong>Thời gian làm bài</Text>
                  <InputNumber
                    value={duration}
                    onChange={value => setDuration(value)}
                    placeholder="Phút"
                    size="large"
                    min={1}
                    max={300}
                    style={{ width: '100%', marginTop: 8 }}
                    addonAfter="phút"
                  />
                </Col>
              </Row>

              <div style={{ marginTop: 24 }}>
                <Text strong>Mô tả đề thi</Text>
                <TextArea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Mô tả nội dung đề thi"
                  rows={4}
                  size="large"
                  style={{ marginTop: 8 }}
                />
              </div>

              <div style={{ marginTop: 24 }}>
                <Text strong>Mã đề thi</Text>
                <Input.Group compact style={{ marginTop: 8 }}>
                  <Input
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder="Mã đề"
                    size="large"
                    style={{ width: 'calc(100% - 150px)' }}
                  />
                  <Button
                    type="primary"
                    icon={<BulbOutlined />}
                    onClick={generateExamCode}
                    size="large"
                    style={{
                      width: '150px',
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      border: 'none'
                    }}
                  >
                    Tạo mã đề
                  </Button>
                </Input.Group>
              </div>

              <Divider orientation="left">
                <Text strong style={{ color: '#667eea' }}>Chọn câu hỏi</Text>
              </Divider>

              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                  <Text strong>Số lượng câu hỏi</Text>
                  <InputNumber
                    value={count}
                    onChange={value => setCount(value)}
                    min={1}
                    max={100}
                    size="large"
                    style={{ width: '100%', marginTop: 8 }}
                  />
                </Col>
                <Col xs={24} sm={16}>
                  <Button
                    type="primary"
                    onClick={handleRandomQuestions}
                    loading={randomLoading}
                    size="large"
                    icon={<ReloadOutlined />}
                    style={{
                      width: '100%',
                      marginTop: '32px',
                      background: 'linear-gradient(45deg, #4facfe, #00f2fe)',
                      border: 'none'
                    }}
                  >
                    {randomLoading ? 'Đang chọn câu hỏi...' : 'Chọn câu hỏi ngẫu nhiên'}
                  </Button>
                </Col>
              </Row>

              {questionIds.length > 0 && (
                <div style={{
                  marginTop: '20px',
                  padding: '16px',
                  background: '#f6ffed',
                  border: '1px solid #b7eb8f',
                  borderRadius: '8px'
                }}>
                  <Space align="center">
                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '18px' }} />
                    <Text strong style={{ color: '#389e0d' }}>
                      Đã chọn {questionIds.length} câu hỏi
                    </Text>
                    <Tag color="success">{questionIds.length} câu hỏi</Tag>
                  </Space>
                </div>
              )}

              <div style={{ marginTop: '32px', textAlign: 'center' }}>
                <Button
                  type="primary"
                  onClick={handleCreateTest}
                  loading={loading}
                  size="large"
                  icon={<PlusOutlined />}
                  style={{
                    width: '280px',
                    height: '56px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    border: 'none',
                    borderRadius: '28px'
                  }}
                >
                  {loading ? 'Đang tạo đề thi...' : 'Tạo đề thi'}
                </Button>
              </div>
            </Card>
          </TabPane>

          <TabPane tab="📚 Danh sách đề thi đã tạo" key="2">
            {exams.length === 0 ? (
              <Card><Text type="secondary">⏳ Chưa có đề thi nào</Text></Card>
            ) : (
              exams.map((exam, index) => (
                <Card
                  key={exam._id}
                  title={`${index + 1}. ${exam.title}`}
                  style={{
                    marginBottom: 24,
                    background: "#ffffff",
                    borderRadius: "12px",
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.06)"
                  }}
                  bodyStyle={{ padding: "24px" }}
                >
                  <p><Text strong>Mã đề:</Text> {exam.code}</p>
                  <p><Text strong>Thời gian:</Text> {exam.duration} phút</p>
                  <p><Text strong>Số câu hỏi:</Text> {exam.questionIds.length}</p>
                  <p><Text italic>Mô tả:</Text> {exam.description}</p>
                </Card>
              ))
            )}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminTests;