import React, { useState, useRef, useEffect, useCallback } from "react";
import { Task } from "@/interface/task";
import { generateAssistantResponse, AssistantRequest } from "@/api/Assistant";
import { useToast } from "./Toast";
import "@/css/components/Assistant.css";

interface AssistantProps {
  tasks: Task[];
}

interface HistoryItem {
  id: string;
  prompt: string;
  response: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  "Những task nào đang gần deadline?",
  "Tôi nên làm gì tiếp theo?",
  "Phân tích tiến độ công việc của tôi",
  "Gợi ý cách quản lý thời gian hiệu quả",
  "Task nào quan trọng nhất?",
  "Có task nào bị trễ deadline không?",
  "Hôm nay tôi nên tập trung vào task nào?",
  "Đánh giá mức độ hoàn thành công việc",
];

const QUICK_ACTIONS = [
  { icon: "📊", label: "Phân tích", query: "Phân tích tình trạng các task hiện tại" },
  { icon: "⏰", label: "Deadline", query: "Kiểm tra các task sắp đến deadline" },
  { icon: "🎯", label: "Ưu tiên", query: "Đưa ra gợi ý task nào nên làm trước" },
  { icon: "📈", label: "Tiến độ", query: "Báo cáo tiến độ hoàn thành công việc" },
];

export const Assistant: React.FC<AssistantProps> = ({ tasks }) => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchHistory, setSearchHistory] = useState("");
  const [showHistory, setShowHistory] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const responseRef = useRef<HTMLDivElement>(null);
  const { addToast, ToastContainer } = useToast();

  // Voice recognition setup
  const recognition = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'vi-VN';

      recognition.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(prev => prev + transcript);
        setIsListening(false);
      };

      recognition.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("assistant-history");
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
        setHistory(parsed);
      } catch (error) {
        console.error("Failed to load history:", error);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("assistant-history", JSON.stringify(history));
    }
  }, [history]);

  // Auto-focus textarea
  useEffect(() => {
    if (!loading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [loading]);

  // Scroll to response when it appears
  useEffect(() => {
    if (response && responseRef.current) {
      responseRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "start" 
      });
    }
  }, [response]);

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const handleSend = async () => {
    const trimmed = prompt.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setIsTyping(true);
    setError(null);
    setResponse(null);

    try {
      const request: AssistantRequest = { prompt: trimmed, tasks };
      const result = await generateAssistantResponse(request);

      // Simulate typing effect
      setTimeout(() => {
        setIsTyping(false);
        setResponse(result.text);
        
        const newHistoryItem: HistoryItem = {
          id: generateId(),
          prompt: trimmed,
          response: result.text,
          timestamp: new Date(),
        };
        
        setHistory([newHistoryItem, ...history]);
        setPrompt("");
      }, 800);
    } catch (err: any) {
      setIsTyping(false);
      setError(err.message || "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedQuestion = useCallback((question: string) => {
    setPrompt(question);
    textareaRef.current?.focus();
  }, []);

  const handleCopyResponse = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      addToast("Đã copy thành công!", "success");
    } catch (err) {
      console.error("Failed to copy:", err);
      addToast("Không thể copy. Hãy thử lại.", "error");
    }
  }, [addToast]);

  const handleClearHistory = useCallback(() => {
    if (confirm("Bạn có chắc muốn xóa toàn bộ lịch sử trò chuyện?")) {
      setHistory([]);
      localStorage.removeItem("assistant-history");
      addToast("Đã xóa lịch sử trò chuyện", "success");
    }
  }, [addToast]);

  const handleExportHistory = useCallback(() => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `assistant-history-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    addToast("Đã xuất lịch sử thành công!", "success");
  }, [history, addToast]);

  const handleVoiceInput = useCallback(() => {
    if (!recognition.current) {
      alert("Trình duyệt không hỗ trợ nhận diện giọng nói.");
      return;
    }

    if (isListening) {
      recognition.current.stop();
      setIsListening(false);
    } else {
      recognition.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  const handleQuickAction = useCallback((action: typeof QUICK_ACTIONS[0]) => {
    setPrompt(action.query);
    textareaRef.current?.focus();
  }, []);

  const handleSmartSuggestion = useCallback(() => {
    const urgentTasks = tasks.filter(task => !task.completed && task.deadline && new Date(task.deadline) <= new Date(Date.now() + 24 * 60 * 60 * 1000));
    const overdueTasks = tasks.filter(task => !task.completed && task.deadline && new Date(task.deadline) < new Date());
    
    if (overdueTasks.length > 0) {
      return "Có task bị trễ deadline! Tôi nên làm gì?";
    } else if (urgentTasks.length > 0) {
      return "Có task sắp đến deadline trong 24h tới, tôi nên ưu tiên như thế nào?";
    } else {
      return "Phân tích tiến độ công việc và đề xuất kế hoạch cho ngày mai";
    }
  }, [tasks]);

  const filteredHistory = searchHistory
    ? history.filter(
        item =>
          item.prompt.toLowerCase().includes(searchHistory.toLowerCase()) ||
          item.response.toLowerCase().includes(searchHistory.toLowerCase())
      )
    : history;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  };

  const stats = getTaskStats();

  return (
    <>
      <div className="assistant-container">
        <div className="assistant-header">
          <h2 className="assistant-title">🤖 AI Assistant</h2>
          <p className="assistant-subtitle">Trợ lý thông minh quản lý công việc và deadline</p>
          
          <div className="assistant-stats">
            <div className="stat-item">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Tổng tasks</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.completed}</div>
              <div className="stat-label">Hoàn thành</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.pending}</div>
              <div className="stat-label">Đang làm</div>
            </div>
          </div>
        </div>

      <div className="input-section slide-in-down">
        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            className="input-textarea"
            placeholder="Hỏi tôi bất cứ điều gì về công việc và deadline của bạn..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
            <button
              onClick={handleSend}
              disabled={loading || !prompt.trim()}
              className="send-button"
            >
              {loading ? (
                <>⏳ Đang xử lý...</>
              ) : (
                <>🚀 Gửi</>
              )}
            </button>
            <button
              onClick={handleVoiceInput}
              disabled={loading}
              className="send-button"
              style={{ 
                background: isListening ? 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                fontSize: '0.875rem',
                padding: '0.75rem'
              }}
              title="Nhấn để nói"
            >
              {isListening ? '🔴 Đang nghe...' : '🎤 Nói'}
            </button>
          </div>
        </div>

        {showQuickActions && (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            {QUICK_ACTIONS.map((action, index) => (
              <button
                key={index}
                className="suggested-question"
                onClick={() => handleQuickAction(action)}
                disabled={loading}
                style={{ 
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>{action.icon}</span>
                <span>{action.label}</span>
              </button>
            ))}
            <button
              className="suggested-question"
              onClick={() => handleSuggestedQuestion(handleSmartSuggestion())}
              disabled={loading}
              style={{ 
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontWeight: '600'
              }}
            >
              ✨ Gợi ý thông minh
            </button>
          </div>
        )}

        <div className="suggested-questions">
          {SUGGESTED_QUESTIONS.slice(0, 4).map((question, index) => (
            <button
              key={index}
              className="suggested-question"
              onClick={() => handleSuggestedQuestion(question)}
              disabled={loading}
            >
              {question}
            </button>
          ))}
          <button
            className="suggested-question"
            onClick={() => setShowQuickActions(!showQuickActions)}
            style={{ 
              background: 'linear-gradient(135deg, rgba(148, 163, 184, 0.1) 0%, rgba(100, 116, 139, 0.1) 100%)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
            }}
          >
            {showQuickActions ? '📁 Ẩn thao tác nhanh' : '⚡ Hiện thao tác nhanh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message slide-in-down">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {isTyping && (
        <div className="current-response slide-in-up">
          <div className="typing-indicator">
            <span>AI đang suy nghĩ</span>
            <div className="typing-dots">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        </div>
      )}

      {response && !isTyping && (
        <div ref={responseRef} className="current-response slide-in-up">
          <div className="response-header">
            <div className="response-title">
              🤖 Phản hồi từ AI
            </div>
            <div className="response-actions">
              <button
                className="action-button"
                onClick={() => handleCopyResponse(response)}
                title="Copy phản hồi"
              >
                📋 Copy
              </button>
              <button
                className="action-button"
                onClick={() => setResponse(null)}
                title="Đóng phản hồi"
              >
                ✕ Đóng
              </button>
            </div>
          </div>
          <div className="response-content">{response}</div>
        </div>
      )}

      {showHistory && (
        <div className="history-section">
          <div className="history-header">
            <h4 className="history-title">
              💬 Lịch sử trò chuyện
              <span style={{ fontSize: '0.8em', opacity: 0.7 }}>
                ({history.length} cuộc hội thoại)
              </span>
            </h4>
            <div className="history-actions">
              <input
                type="text"
                className="history-search"
                placeholder="Tìm kiếm trong lịch sử..."
                value={searchHistory}
                onChange={(e) => setSearchHistory(e.target.value)}
              />
              <button
                className="action-button"
                onClick={handleExportHistory}
                disabled={history.length === 0}
                title="Xuất lịch sử"
              >
                📥 Xuất
              </button>
              <button
                className="action-button"
                onClick={handleClearHistory}
                disabled={history.length === 0}
                title="Xóa lịch sử"
              >
                🗑️ Xóa
              </button>
              <button
                className="action-button"
                onClick={() => setShowHistory(!showHistory)}
                title="Ẩn/Hiện lịch sử"
              >
                👁️ {showHistory ? 'Ẩn' : 'Hiện'}
              </button>
            </div>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="empty-history">
              <div className="empty-history-icon">💭</div>
              <div className="empty-history-text">
                {searchHistory ? 'Không tìm thấy kết quả nào' : 'Chưa có lịch sử trò chuyện'}
              </div>
              <div className="empty-history-subtext">
                {searchHistory ? 'Thử từ khóa khác' : 'Hãy bắt đầu cuộc trò chuyện đầu tiên!'}
              </div>
            </div>
          ) : (
            <div className="history-list">
              {filteredHistory.map((item) => (
                <div key={item.id} className="history-item slide-in-up">
                  <div className="history-item-actions">
                    <button
                      className="history-action-btn"
                      onClick={() => handleCopyResponse(`Q: ${item.prompt}\n\nA: ${item.response}`)}
                      title="Copy cuộc hội thoại"
                    >
                      📋
                    </button>
                    <button
                      className="history-action-btn"
                      onClick={() => handleSuggestedQuestion(item.prompt)}
                      title="Hỏi lại câu hỏi này"
                    >
                      🔄
                    </button>
                    <button
                      className="history-action-btn"
                      onClick={() => setHistory(history.filter(h => h.id !== item.id))}
                      title="Xóa mục này"
                    >
                      🗑️
                    </button>
                  </div>

                  <div className="history-prompt">
                    <div className="history-prompt-label">
                      👤 Bạn hỏi: 
                      <span style={{ fontSize: '0.8em', opacity: 0.7, marginLeft: '0.5rem' }}>
                        {formatDate(item.timestamp)}
                      </span>
                    </div>
                    <div className="history-prompt-text">{item.prompt}</div>
                  </div>

                  <div>
                    <div className="history-response-label">🤖 AI trả lời:</div>
                    <div className="history-response-text">{item.response}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      </div>

      <ToastContainer />
    </>
  );
};
