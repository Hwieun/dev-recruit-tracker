import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { positionAPI } from '../services/api';
import './PositionList.css';

function PositionList() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    position_title: '',
    recruiting_link: '',
    location: '',
    salary_range: '',
    current_status: 'applied',
    job_description: '',
  });

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      setLoading(true);
      const response = await positionAPI.getAll();
      setPositions(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching positions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await positionAPI.create(formData);
      setFormData({
        company_name: '',
        position_title: '',
        recruiting_link: '',
        location: '',
        salary_range: '',
        current_status: 'applied',
        job_description: '',
      });
      setShowForm(false);
      fetchPositions();
    } catch (error) {
      console.error('Error creating position:', error);
      alert('Failed to create position');
    }
  };

  const handleFetchJD = async (form) => {
    if (!form.recruiting_link) return alert("URL을 입력해주세요!");

    try {
      const res = await positionAPI.fetchJD({
        url: form.recruiting_link,
      });
      setForm({ ...form, jdText: res.data.jd_text });
    } catch (err) {
      console.error("JD fetch error:", err);
      alert("JD를 불러오는 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this position?')) {
      try {
        await positionAPI.delete(id);
        fetchPositions();
      } catch (error) {
        console.error('Error deleting position:', error);
        alert('Failed to delete position');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Calculate statistics
  const stats = {
    total: positions.length,
    inProgress: positions.filter(p =>
      ['screening', 'coding_test', 'technical_interview', 'cultural_fit', 'final_interview'].includes(p.current_status)
    ).length,
    accepted: positions.filter(p => p.current_status === 'accepted' || p.current_status === 'offer').length,
    rejected: positions.filter(p => p.current_status === 'rejected').length,
  };

  return (
    <div className="position-list-page">
      {/* Summary Header - Matching Figma */}
      <div className="summary-header">
        <h2>지원 현황 요약: 총 {stats.total}건 / 진행 {stats.inProgress} / 합격 {stats.accepted} / 탈락 {stats.rejected}</h2>
      </div>

      {/* Position List - Horizontal Cards */}
      <div className="position-list-container">
        {positions.map((position) => (
          <div key={position.id} className="position-card-horizontal">
            <Link to={`/positions/${position.id}`} className="position-card-content">
              <div className="position-info">
                <div className="position-title-row">
                  <span className="position-company">[{position.company_name}]</span>
                  <span className="position-title-text">{position.position_title}</span>
                  {position.recruiting_link && (
                    <a
                      href={position.recruiting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="recruiting-link-badge"
                      onClick={(e) => e.stopPropagation()}
                    >
                      라이브코딩
                    </a>
                  )}
                </div>
              </div>
            </Link>
            <button className="btn-detail">상세보기</button>
          </div>
        ))}
      </div>

      {/* Add Position Button - Fixed at bottom right */}
      <button
        className="btn-add-position"
        onClick={() => setShowForm(!showForm)}
      >
        + 새 지원 추가
      </button>

      {/* Add Position Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">지원 추가</h2>
            <form onSubmit={handleSubmit} className="position-form-figma">
              <div className="form-row">
                <label>지원 링크(URL):</label>
                <div className="input-with-button">
                  <input
                    type="url"
                    value={formData.recruiting_link}
                    onChange={(e) => setFormData({ ...formData, recruiting_link: e.target.value })}
                    placeholder="https://..."
                  />
                  <button type="button" className="btn-primary btn-sm"
                    onClick={() => handleFetchJD(formData)}>
                    가져오기</button>
                </div>
              </div>

              <div className="form-row">
                <label>회사명:</label>
                <input
                  type="text"
                  required
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <label>포지션명:</label>
                <input
                  type="text"
                  required
                  value={formData.position_title}
                  onChange={(e) => setFormData({ ...formData, position_title: e.target.value })}
                />
              </div>

              <div className="form-row">
                <label>JD 요약/본문:</label>
                <textarea
                  value={formData.job_description || ''}
                  onChange={(e) => setFormData({ ...formData, job_description: e.target.value })}
                  rows={8}
                />
              </div>

              <div className="form-row">
                <label>현재 단계:</label>
                <select
                  value={formData.current_status}
                  onChange={(e) => setFormData({ ...formData, current_status: e.target.value })}
                >
                  <option value="applied">서류</option>
                  <option value="screening">서류 심사</option>
                  <option value="coding_test">코딩 테스트</option>
                  <option value="technical_interview">기술 면접</option>
                  <option value="cultural_fit">컬처핏 면접</option>
                  <option value="final_interview">최종 면접</option>
                  <option value="offer">합격</option>
                  <option value="rejected">탈락</option>
                </select>
              </div>

              <div className="form-row">
                <label>면접 일정:</label>
                <div className="date-time-inputs">
                  <select>
                    <option>날짜 선택</option>
                  </select>
                  <select>
                    <option>시간 선택</option>
                  </select>
                </div>
              </div>

              <div className="form-actions-figma">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                  취소
                </button>
                <button type="submit" className="btn-primary">
                  저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {positions.length === 0 && !showForm && (
        <div className="empty-state">
          <p>등록된 지원이 없습니다. "+ 새 지원 추가" 버튼을 클릭하세요!</p>
        </div>
      )}
    </div>
  );
}

export default PositionList;
