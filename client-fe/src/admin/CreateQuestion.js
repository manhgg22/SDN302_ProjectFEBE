import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  List,
  Space,
  Typography,
  Divider,
  Tag,
  Row,
  Col,
  Input,
  Select,
  Radio
} from "antd";
import {
  PlusOutlined,
  BookOutlined,
  CheckCircleOutlined,
  EditOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

const CreateQuestion = () => {
  const [formData, setFormData] = useState({
    content: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
    subject: "",
    level: "easy"
  });
  
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Mock data since we can't use axios in this environment
  const mockQuestions = [
    {
      _id: "1",
      content: "React là gì?",
      options: ["Thư viện JavaScript", "Framework CSS", "Database", "Server"],
      correctAnswer: 0,
      explanation: "React là một thư viện JavaScript để xây dựng giao diện người dùng",
      subject: "React",
      level: "easy"
    },
    {
      _id: "2", 
      content: "State trong React được sử dụng để làm gì?",
      options: ["Lưu trữ dữ liệu tĩnh", "Quản lý dữ liệu động", "Tạo component", "Import thư viện"],
      correctAnswer: 1,
      explanation: "State được sử dụng để quản lý dữ liệu có thể thay đổi trong component",
      subject: "React",
      level: "medium"
    }
  ];

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setQuestions(mockQuestions);
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error("Lỗi khi tải danh sách câu hỏi");
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.content.trim()) {
      newErrors.content = "Vui lòng nhập nội dung câu hỏi!";
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = "Vui lòng nhập chủ đề!";
    }
    
    if (!formData.explanation.trim()) {
      newErrors.explanation = "Vui lòng nhập giải thích!";
    }
    
    formData.options.forEach((option, index) => {
      if (!option.trim()) {
        newErrors[`option${index}`] = `Vui lòng nhập đáp án ${index + 1}!`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    try {
      // Simulate API call
      setTimeout(() => {
        const newQuestion = {
          _id: Date.now().toString(),
          ...formData
        };
        setQuestions([...questions, newQuestion]);
        
        // Reset form
        setFormData({
          content: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
          explanation: "",
          subject: "",
          level: "easy"
        });
        setErrors({});
        
        // Show success message
        alert("✅ Tạo câu hỏi thành công!");
        setSubmitting(false);
      }, 1000);
    } catch (err) {
      alert("❌ Lỗi khi tạo câu hỏi");
      setSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
    
    // Clear error when user starts typing
    if (errors[`option${index}`]) {
      setErrors(prev => ({
        ...prev,
        [`option${index}`]: undefined
      }));
    }
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case "easy": return "green";
      case "medium": return "orange";  
      case "hard": return "red";
      default: return "blue";
    }
  };

  const getDifficultyText = (level) => {
    switch (level) {
      case "easy": return "Dễ";
      case "medium": return "Trung bình";
      case "hard": return "Khó";
      default: return level;
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <Title level={2}>
        <EditOutlined /> Tạo câu hỏi mới
      </Title>

      <Card 
        title={
          <Space>
            <PlusOutlined />
            <span>Thông tin câu hỏi</span>
          </Space>
        }
        style={{ marginBottom: "24px" }}
      >
        <div style={{ marginBottom: "16px" }}>
          <Text strong>Nội dung câu hỏi *</Text>
          <TextArea 
            rows={3} 
            placeholder="Nhập nội dung câu hỏi..."
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            style={{ 
              marginTop: "8px",
              borderColor: errors.content ? '#ff4d4f' : undefined
            }}
          />
          {errors.content && (
            <Text type="danger" style={{ fontSize: "12px" }}>
              {errors.content}
            </Text>
          )}
        </div>

        <Row gutter={16} style={{ marginBottom: "16px" }}>
          <Col span={12}>
            <Text strong>Chủ đề *</Text>
            <Input 
              placeholder="Ví dụ: React, JavaScript, CSS..."
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              style={{ 
                marginTop: "8px",
                borderColor: errors.subject ? '#ff4d4f' : undefined
              }}
            />
            {errors.subject && (
              <Text type="danger" style={{ fontSize: "12px" }}>
                {errors.subject}
              </Text>
            )}
          </Col>
          <Col span={12}>
            <Text strong>Độ khó *</Text>
            <Select 
              placeholder="Chọn độ khó"
              value={formData.level}
              onChange={(value) => handleInputChange('level', value)}
              style={{ width: "100%", marginTop: "8px" }}
            >
              <Select.Option value="easy">Dễ</Select.Option>
              <Select.Option value="medium">Trung bình</Select.Option>
              <Select.Option value="hard">Khó</Select.Option>
            </Select>
          </Col>
        </Row>

        <Title level={4}>Các đáp án</Title>
        <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
          {[0, 1, 2, 3].map((index) => (
            <Col span={12} key={index}>
              <Text strong>Đáp án {index + 1} *</Text>
              <Input 
                placeholder={`Nhập đáp án ${index + 1}...`}
                value={formData.options[index]}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                style={{ 
                  marginTop: "8px",
                  borderColor: errors[`option${index}`] ? '#ff4d4f' : undefined
                }}
              />
              {errors[`option${index}`] && (
                <Text type="danger" style={{ fontSize: "12px" }}>
                  {errors[`option${index}`]}
                </Text>
              )}
            </Col>
          ))}
        </Row>

        <div style={{ marginBottom: "16px" }}>
          <Text strong>Đáp án đúng *</Text>
          <Radio.Group 
            value={formData.correctAnswer}
            onChange={(e) => handleInputChange('correctAnswer', e.target.value)}
            style={{ marginTop: "8px" }}
          >
            <Space direction="vertical">
              {[0, 1, 2, 3].map((index) => (
                <Radio key={index} value={index}>
                  Đáp án {index + 1}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <Text strong>Giải thích *</Text>
          <TextArea 
            rows={3} 
            placeholder="Nhập lời giải thích cho đáp án đúng..."
            value={formData.explanation}
            onChange={(e) => handleInputChange('explanation', e.target.value)}
            style={{ 
              marginTop: "8px",
              borderColor: errors.explanation ? '#ff4d4f' : undefined
            }}
          />
          {errors.explanation && (
            <Text type="danger" style={{ fontSize: "12px" }}>
              {errors.explanation}
            </Text>
          )}
        </div>

        <Button 
          type="primary" 
          size="large"
          loading={submitting}
          icon={<PlusOutlined />}
          onClick={handleSubmit}
        >
          Tạo câu hỏi
        </Button>
      </Card>

      <Divider />

      <Card
        title={
          <Space>
            <BookOutlined />
            <span>Danh sách câu hỏi đã tạo ({questions.length})</span>
          </Space>
        }
      >
        <List
          loading={loading}
          dataSource={questions}
          renderItem={(question, index) => (
            <List.Item>
              <Card 
                style={{ width: "100%" }}
                size="small"
                title={
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Text strong>{index + 1}. {question.content}</Text>
                    <Space>
                      <Tag color={getDifficultyColor(question.level)}>
                        {getDifficultyText(question.level)}
                      </Tag>
                      <Tag color="blue">{question.subject}</Tag>
                    </Space>
                  </div>
                }
              >
                <div style={{ marginBottom: "12px" }}>
                  <Text strong>Các đáp án:</Text>
                  <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
                    {question.options.map((option, optIndex) => (
                      <li 
                        key={optIndex}
                        style={{
                          color: question.correctAnswer === optIndex ? "#52c41a" : "inherit",
                          fontWeight: question.correctAnswer === optIndex ? "bold" : "normal",
                          marginBottom: "4px"
                        }}
                      >
                        {question.correctAnswer === optIndex && (
                          <CheckCircleOutlined style={{ marginRight: "8px", color: "#52c41a" }} />
                        )}
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <Text strong>Giải thích: </Text>
                  <Text italic style={{ color: "#666" }}>
                    {question.explanation}
                  </Text>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default CreateQuestion;