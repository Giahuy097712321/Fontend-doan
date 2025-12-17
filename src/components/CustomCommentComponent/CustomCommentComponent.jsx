// src/components/CustomCommentComponent/CustomCommentComponent.jsx
import React, { useState, useEffect } from 'react';
import {
    Rate,
    Input,
    Button,
    Avatar,
    Tooltip,
    message,
    Empty,
    Spin,
    Pagination,
    Tag,
    Divider,
    Dropdown,
    Space,
    Modal
} from 'antd';
import {
    UserOutlined,
    LikeOutlined,
    LikeFilled,
    EditOutlined,
    DeleteOutlined,
    SendOutlined,
    StarFilled,
    MessageOutlined,
    DownOutlined,
    SortAscendingOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as CommentService from '../../services/commentService';
import {
    CommentSection,
    RatingSummary,
    RatingStats,
    StarProgress,
    CommentForm,
    CommentList,
    CommentItem,
    EmptyComments,
    LoadingContainer,
    CommentHeader,
    UserBadge,
    ActionButton,
    CommentMeta
} from './style';

const { TextArea } = Input;
const { confirm } = Modal;

const CustomCommentComponent = ({ productId }) => {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();

    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [rating, setRating] = useState(5);
    const [commentText, setCommentText] = useState('');
    const [editingComment, setEditingComment] = useState(null);
    const [ratingStats, setRatingStats] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0
    });

    const [sortBy, setSortBy] = useState('newest');
    const [filterRating, setFilterRating] = useState(null);

    // Lấy danh sách bình luận
    const fetchComments = async (page = 1, sort = sortBy, filter = filterRating) => {
        if (!productId) return;

        setLoading(true);
        try {
            const result = await CommentService.getComments(productId, {
                page,
                limit: pagination.pageSize,
                sort: sort,
                rating: filter
            });

            if (result.status === 'OK') {
                setComments(result.data.comments || []);
                setPagination(prev => ({
                    ...prev,
                    current: page,
                    total: result.data.totalComments || 0
                }));
            } else {
                message.error(result.message || 'Lỗi khi tải bình luận');
            }
        } catch (error) {
            console.error('Lỗi khi tải bình luận:', error);
            message.error('Lỗi khi tải bình luận');
        } finally {
            setLoading(false);
        }
    };

    // Lấy thống kê rating
    const fetchRatingStats = async () => {
        if (!productId) return;

        try {
            const result = await CommentService.getRatingStats(productId);
            if (result.status === 'OK') {
                setRatingStats(result.data);
            }
        } catch (error) {
            console.error('Lỗi khi tải thống kê rating:', error);
        }
    };

    // Fetch cả comments và rating stats
    const fetchAllData = async (page = 1) => {
        await Promise.all([
            fetchComments(page, sortBy, filterRating),
            fetchRatingStats()
        ]);
    };

    useEffect(() => {
        if (productId) {
            fetchAllData(1);
        }
    }, [productId]);

    const handleSortChange = (newSort) => {
        setSortBy(newSort);
        fetchComments(1, newSort, filterRating);
    };

    const handleFilterRating = (star) => {
        const newFilter = filterRating === star ? null : star;
        setFilterRating(newFilter);
        fetchComments(1, sortBy, newFilter);
    };

    const handleSubmitComment = async () => {
        if (!user?.id) {
            message.warning('Vui lòng đăng nhập để bình luận');
            navigate('/sign-in');
            return;
        }

        if (!commentText.trim()) {
            message.warning('Vui lòng nhập nội dung bình luận');
            return;
        }

        setSubmitting(true);
        try {
            const data = {
                rating,
                comment: commentText.trim()
            };

            let result;
            if (editingComment) {
                result = await CommentService.updateComment(
                    productId,
                    editingComment._id,
                    data,
                    user.access_token
                );

                if (result.status === 'OK') {
                    message.success('Cập nhật bình luận thành công');
                    resetForm();
                    // Fetch lại tất cả dữ liệu
                    await fetchAllData(pagination.current);
                } else {
                    message.error(result.message || 'Lỗi khi cập nhật bình luận');
                }
            } else {
                result = await CommentService.addComment(
                    productId,
                    data,
                    user.access_token
                );

                if (result.status === 'OK') {
                    message.success('Thêm bình luận thành công');
                    resetForm();
                    // Fetch lại từ trang 1
                    await fetchAllData(1);
                } else {
                    message.error(result.message || 'Lỗi khi thêm bình luận');
                }
            }
        } catch (error) {
            console.error('Lỗi khi gửi bình luận:', error);
            if (error.response?.data?.message) {
                message.error(error.response.data.message);
            } else {
                message.error(editingComment ? 'Lỗi khi cập nhật bình luận' : 'Lỗi khi thêm bình luận');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setCommentText('');
        setRating(5);
        setEditingComment(null);
    };

    // Xóa bình luận - ĐÃ SỬA
    const handleDeleteComment = async (commentId) => {
        confirm({
            title: 'Xác nhận xóa',
            icon: <ExclamationCircleOutlined />,
            content: 'Bạn có chắc chắn muốn xóa bình luận này?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            async onOk() {
                try {
                    const result = await CommentService.deleteComment(
                        productId,
                        commentId,
                        user.access_token
                    );

                    if (result.status === 'OK') {
                        message.success('Xóa bình luận thành công');
                        // Fetch lại tất cả dữ liệu
                        await fetchAllData(pagination.current);
                    } else {
                        message.error(result.message || 'Lỗi khi xóa bình luận');
                    }
                } catch (error) {
                    console.error('Lỗi khi xóa bình luận:', error);
                    message.error('Lỗi khi xóa bình luận');
                }
            }
        });
    };

    // Like/Unlike bình luận
    const handleLikeComment = async (commentId) => {
        if (!user?.id) {
            message.warning('Vui lòng đăng nhập để thích bình luận');
            return;
        }

        try {
            const result = await CommentService.toggleLikeComment(
                productId,
                commentId,
                user.access_token
            );

            if (result.status === 'OK') {
                // Chỉ fetch lại comments (không cần rating stats khi like)
                await fetchComments(pagination.current, sortBy, filterRating);
            } else {
                message.error(result.message || 'Lỗi khi thích bình luận');
            }
        } catch (error) {
            console.error('Lỗi khi like bình luận:', error);
            message.error('Lỗi khi thích bình luận');
        }
    };

    const handleEditComment = (comment) => {
        setEditingComment(comment);
        setRating(comment.rating);
        setCommentText(comment.comment);
    };

    const handleCancelEdit = () => {
        resetForm();
    };

    const handlePageChange = (page) => {
        fetchComments(page, sortBy, filterRating);
    };

    const calculateStarPercentage = (star) => {
        if (!ratingStats || !ratingStats.ratingCounts || ratingStats.totalRatings === 0) return 0;
        const count = ratingStats.ratingCounts[star] || 0;
        return (count / ratingStats.totalRatings) * 100;
    };

    const formatTime = (dateString) => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffInSeconds = Math.floor((now - date) / 1000);

            if (diffInSeconds < 60) return 'Vừa xong';
            if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
            if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
            if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;

            return date.toLocaleDateString('vi-VN');
        } catch (error) {
            return 'Không xác định';
        }
    };

    const isCommentOwner = (comment) => {
        return comment.user?._id === user?.id || comment.user === user?.id;
    };

    const isCommentLiked = (comment) => {
        return comment.likes?.includes(user?.id);
    };

    const sortItems = [
        {
            key: 'newest',
            label: 'Mới nhất',
            onClick: () => handleSortChange('newest')
        },
        {
            key: 'highest_rating',
            label: 'Đánh giá cao nhất',
            onClick: () => handleSortChange('highest_rating')
        },
        {
            key: 'lowest_rating',
            label: 'Đánh giá thấp nhất',
            onClick: () => handleSortChange('lowest_rating')
        }
    ];

    const getSortDisplayName = () => {
        const sortMap = {
            'newest': 'Mới nhất',
            'highest_rating': 'Đánh giá cao',
            'lowest_rating': 'Đánh giá thấp'
        };
        return sortMap[sortBy] || 'Mới nhất';
    };

    return (
        <CommentSection>
            {/* Thống kê rating */}
            {ratingStats && (
                <RatingSummary>
                    <div className="rating-overview">
                        <div className="average-rating">
                            <div className="rating-score">
                                {ratingStats.averageRating?.toFixed(1) || '0.0'}
                                <span className="rating-max">/5</span>
                            </div>
                            <div className="rating-stars">
                                <Rate
                                    value={ratingStats.averageRating || 0}
                                    disabled
                                    allowHalf
                                />
                            </div>
                            <div className="rating-count">
                                {ratingStats.totalRatings || 0} đánh giá
                            </div>
                        </div>

                        <Divider type="vertical" style={{ height: '80px', margin: '0 32px' }} />

                        <RatingStats>
                            {[5, 4, 3, 2, 1].map(star => (
                                <StarProgress key={star}>
                                    <div
                                        className="star-info clickable"
                                        onClick={() => handleFilterRating(star)}
                                        style={{
                                            cursor: 'pointer',
                                            opacity: filterRating === star ? 1 : 0.7
                                        }}
                                    >
                                        <span className="star-number">{star}</span>
                                        <StarFilled className="star-icon" />
                                    </div>
                                    <div className="progress-container">
                                        <div
                                            className="progress-bar"
                                            style={{ width: `${calculateStarPercentage(star)}%` }}
                                        />
                                    </div>
                                    <span className="star-count">
                                        {ratingStats.ratingCounts?.[star] || 0}
                                    </span>
                                </StarProgress>
                            ))}
                        </RatingStats>
                    </div>

                    {filterRating && (
                        <div style={{ marginTop: '16px', textAlign: 'center' }}>
                            <Tag
                                color="blue"
                                closable
                                onClose={() => setFilterRating(null)}
                            >
                                Đang lọc: {filterRating} sao
                            </Tag>
                        </div>
                    )}
                </RatingSummary>
            )}

            {/* Form bình luận */}
            <CommentForm>
                <div className="form-header">
                    <h3>
                        <MessageOutlined />
                        {editingComment ? 'Chỉnh sửa đánh giá' : 'Viết đánh giá của bạn'}
                    </h3>
                    {editingComment && (
                        <Tag color="orange" className="editing-tag">
                            Đang chỉnh sửa
                        </Tag>
                    )}
                </div>

                <div className="rating-input">
                    <span className="rating-label">Đánh giá của bạn:</span>
                    <Rate
                        value={rating}
                        onChange={setRating}
                        disabled={!user?.id || submitting}
                        className="rating-stars-input"
                    />
                    <span className="rating-value">{rating} sao</span>
                </div>

                <TextArea
                    rows={4}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={
                        user?.id
                            ? "Chia sẻ trải nghiệm và cảm nhận của bạn về sản phẩm..."
                            : "Vui lòng đăng nhập để viết đánh giá..."
                    }
                    disabled={!user?.id || submitting}
                    className="comment-textarea"
                    maxLength={500}
                    showCount
                />

                <div className="form-actions">
                    {editingComment && (
                        <Button
                            onClick={handleCancelEdit}
                            className="cancel-btn"
                            disabled={submitting}
                        >
                            Hủy
                        </Button>
                    )}
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={handleSubmitComment}
                        loading={submitting}
                        disabled={!user?.id || !commentText.trim()}
                        className="submit-btn"
                    >
                        {editingComment ? 'Cập nhật đánh giá' : 'Gửi đánh giá'}
                    </Button>
                </div>
            </CommentForm>

            {/* Danh sách bình luận */}
            <CommentList>
                <CommentHeader>
                    <div className="header-content">
                        <h3>
                            <MessageOutlined />
                            Tất cả đánh giá
                            <span className="comment-count">({pagination.total})</span>
                        </h3>
                        <div className="sort-options">
                            <span className="sort-label">Sắp xếp:</span>
                            <Dropdown
                                menu={{ items: sortItems }}
                                placement="bottomRight"
                            >
                                <Button type="text" size="small">
                                    <Space>
                                        <SortAscendingOutlined />
                                        {getSortDisplayName()}
                                        <DownOutlined />
                                    </Space>
                                </Button>
                            </Dropdown>
                        </div>
                    </div>
                </CommentHeader>

                {loading ? (
                    <LoadingContainer>
                        <Spin size="large" />
                        <p>Đang tải đánh giá...</p>
                    </LoadingContainer>
                ) : comments.length > 0 ? (
                    <>
                        <div className="comments-container">
                            {comments.map(comment => (
                                <CommentItem key={comment._id}>
                                    <div className="comment-avatar">
                                        <Avatar
                                            src={comment.userAvatar}
                                            icon={<UserOutlined />}
                                            size={48}
                                            className="avatar"
                                        />
                                    </div>

                                    <div className="comment-content">
                                        <CommentMeta>
                                            <div className="user-info">
                                                <span className="user-name">
                                                    {comment.userName}
                                                </span>
                                                {isCommentOwner(comment) && (
                                                    <UserBadge>
                                                        <span>Đánh giá của bạn</span>
                                                    </UserBadge>
                                                )}
                                                <div className="comment-rating">
                                                    <Rate
                                                        value={comment.rating}
                                                        disabled
                                                        size="small"
                                                    />
                                                    <span className="rating-text">{comment.rating} sao</span>
                                                </div>
                                            </div>
                                            <div className="comment-time">
                                                <Tooltip title={new Date(comment.createdAt).toLocaleString('vi-VN')}>
                                                    <span>{formatTime(comment.createdAt)}</span>
                                                </Tooltip>
                                                {comment.isEdited && (
                                                    <span className="edited-indicator">(đã chỉnh sửa)</span>
                                                )}
                                            </div>
                                        </CommentMeta>

                                        <div className="comment-text">
                                            <p>{comment.comment}</p>
                                        </div>

                                        <div className="comment-actions">
                                            <ActionButton
                                                className={isCommentLiked(comment) ? 'liked' : ''}
                                                onClick={() => handleLikeComment(comment._id)}
                                            >
                                                {isCommentLiked(comment) ? (
                                                    <LikeFilled />
                                                ) : (
                                                    <LikeOutlined />
                                                )}
                                                <span>Thích ({comment.likes?.length || 0})</span>
                                            </ActionButton>

                                            {isCommentOwner(comment) && (
                                                <>
                                                    <ActionButton
                                                        onClick={() => handleEditComment(comment)}
                                                        className="edit-btn"
                                                    >
                                                        <EditOutlined />
                                                        <span>Chỉnh sửa</span>
                                                    </ActionButton>
                                                    <ActionButton
                                                        onClick={() => handleDeleteComment(comment._id)}
                                                        className="delete-btn"
                                                    >
                                                        <DeleteOutlined />
                                                        <span>Xóa</span>
                                                    </ActionButton>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </CommentItem>
                            ))}
                        </div>

                        {/* Phân trang */}
                        {pagination.total > pagination.pageSize && (
                            <div className="pagination-section">
                                <Pagination
                                    current={pagination.current}
                                    pageSize={pagination.pageSize}
                                    total={pagination.total}
                                    onChange={handlePageChange}
                                    showSizeChanger={false}
                                    showQuickJumper
                                    showTotal={(total, range) =>
                                        `${range[0]}-${range[1]} của ${total} đánh giá`
                                    }
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <EmptyComments>
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <div>
                                    <p style={{ fontSize: '16px', marginBottom: '8px' }}>Chưa có đánh giá nào</p>
                                    <p style={{ fontSize: '14px', color: '#666' }}>
                                        {filterRating
                                            ? `Không có đánh giá ${filterRating} sao nào`
                                            : 'Hãy là người đầu tiên đánh giá sản phẩm này!'
                                        }
                                    </p>
                                </div>
                            }
                        />
                    </EmptyComments>
                )}
            </CommentList>
        </CommentSection>
    );
};

export default CustomCommentComponent;