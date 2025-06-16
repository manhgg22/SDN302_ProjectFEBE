import React, { useState } from "react";

import { 
  Card, 
  Input, 
  Button, 
  InputNumber, 
  Space, 
  Typography, 
  Divider, 
  Tag, 
  Row,
  Col,
   notification
} from 'antd';
import { 
  PlusOutlined, 
  ReloadOutlined, 
  BulbOutlined, 
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

const AdminTests = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [duration, setDuration] = useState(30);
  const [questionIds, setQuestionIds] = useState([]);
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [randomLoading, setRandomLoading] = useState(false);

  // Sinh mã đề tự động
  const generateExamCode = () => {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const generatedCode = `EXAM-${random}`;
    setCode(generatedCode);
    alert(`✅ Đã tạo mã đề: ${generatedCode}`);
  };

  // Gọi API random câu hỏi
  const handleRandomQuestions = async () => {
    setRandomLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response
      const mockQuestions = Array.from({ length: count }, (_, i) => ({ _id: `question_${i + 1}` }));
      const ids = mockQuestions.map(q => q._id);
      setQuestionIds(ids);
      
      notification.success({
        message: 'Chọn câu hỏi thành công',
        description: `Đã chọn ngẫu nhiên ${ids.length} câu hỏi`,
        placement: 'topRight',
      });
    } catch (err) {
      console.error("Lỗi khi random câu hỏi:", err);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể chọn câu hỏi ngẫu nhiên',
        placement: 'topRight',
      });
    } finally {
      setRandomLoading(false);
    }
  };

  // Gửi API tạo đề thi
  const handleCreateTest = async () => {
    if (!title || !description || !code || questionIds.length === 0) {
      alert('⚠️ Vui lòng điền đầy đủ thông tin và chọn câu hỏi');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('✅ Đề thi đã được tạo thành công');
      
      // Reset form
      setTitle("");
      setDescription("");
      setCode("");
      setDuration(30);
      setQuestionIds([]);
      setCount(5);
    } catch (err) {
      console.error("Lỗi tạo đề thi:", err);
      alert('❌ Có lỗi xảy ra khi tạo đề thi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card
          style={{
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: 'none'
          }}
          bodyStyle={{ padding: '40px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <FileTextOutlined style={{ fontSize: '48px', color: '#667eea', marginBottom: '16px' }} />
            <Title level={2} style={{ margin: 0, color: '#1a1a1a' }}>
              Tạo đề thi mới
            </Title>
            <Text type="secondary" style={{ fontSize: '16px' }}>
              Tạo và quản lý đề thi một cách dễ dàng
            </Text>
          </div>

          <div>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <div style={{ marginBottom: '16px' }}>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>Tiêu đề đề thi</Text>
                  <Input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Nhập tiêu đề đề thi"
                    size="large"
                    prefix={<FileTextOutlined style={{ color: '#667eea' }} />}
                  />
                </div>
              </Col>
              
              <Col xs={24} md={12}>
                <div style={{ marginBottom: '16px' }}>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>Thời gian làm bài</Text>
                  <InputNumber
                    value={duration}
                    onChange={value => setDuration(value)}
                    placeholder="Phút"
                    size="large"
                    min={1}
                    max={300}
                    style={{ width: '100%' }}
                    addonAfter="phút"
                  />
                </div>
              </Col>
            </Row>

            <div style={{ marginBottom: '16px' }}>
              <Text strong style={{ display: 'block', marginBottom: '8px' }}>Mô tả đề thi</Text>
              <TextArea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Nhập mô tả chi tiết về đề thi"
                rows={4}
                size="large"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Text strong style={{ display: 'block', marginBottom: '8px' }}>Mã đề thi</Text>
              <Input.Group compact>
                <Input
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="Mã đề thi (tự động sinh)"
                  size="large"
                  style={{ width: 'calc(100% - 140px)' }}
                />
                <Button
                  type="primary"
                  onClick={generateExamCode}
                  size="large"
                  icon={<BulbOutlined />}
                  style={{ 
                    width: '140px',
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    border: 'none'
                  }}
                >
                  Tạo mã
                </Button>
              </Input.Group>
            </div>

            <Divider orientation="left">
              <Text strong style={{ color: '#667eea' }}>Cấu hình câu hỏi</Text>
            </Divider>

            <Row gutter={[24, 16]} align="middle">
              <Col xs={24} sm={8}>
                <div>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>Số lượng câu hỏi</Text>
                  <InputNumber
                    value={count}
                    onChange={value => setCount(value)}
                    min={1}
                    max={100}
                    size="large"
                    style={{ width: '100%' }}
                  />
                </div>
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
                    background: 'linear-gradient(45deg, #4facfe, #00f2fe)',
                    border: 'none',
                    height: '48px',
                    marginTop: '32px'
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
                    Đã chọn {questionIds.length} câu hỏi cho đề thi
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
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminTests;