// AdminProduct.jsx
import { Button, Form, Select, Input, Row, Col, Card, Statistic } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined, ShoppingOutlined, StarOutlined, StockOutlined, AppstoreOutlined } from '@ant-design/icons';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  WrapperHeader,
  WrapperUploadFile,
  TableWrapper,
  DashboardContainer,
  StatsContainer,
  ChartGrid,
  ChartCard,
  ChartTitle,
  ActionButtons
} from './style';

import TableComponent from '../TableComponent/TableComponent';
import InputComponent from './../InputComponent/InputComponent';
import { getBase64 } from '../../utils';
import * as ProductService from '../../services/ProductService';
import { useMutationHooks } from './../../hooks/useMutationHook';
import Loading from './../LoadingComponent/Loading';
import * as message from '../../components/Message/Message';
import { useQuery } from '@tanstack/react-query';
import DrawerComponent from './../DrawerCompoenent/DrawerComponent';
import { useSelector } from 'react-redux';
import ModalComponent from './../ModalComponent/ModalComponent';
import { renderOptions } from '../../utils';
import { Empty } from 'antd';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, AreaChart, Area, ComposedChart
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4ECDC4'];

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState('');
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);

  const [formCreate] = Form.useForm();
  const [formUpdate] = Form.useForm();

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [typeSelect, setTypeSelect] = useState('');
  const user = useSelector((state) => state?.user);

  const [stateProduct, setStateProduct] = useState({
    name: '', price: '', description: '', rating: '',
    image: '', type: '', countInStock: '', newType: '', discount: ''
  });

  const [stateProductDetails, setStateProductDetails] = useState({
    name: '', price: '', description: '', rating: '',
    image: '', type: '', countInStock: '', discount: ''
  });

  const mutation = useMutationHooks((data) => {
    const { name, price, description, rating, image, type, countInStock, discount } = data;
    return ProductService.createProduct({ name, price, description, rating, image, type, countInStock, discount });
  });

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    return ProductService.updateProduct(id, token, rests);
  });

  const mutationDeleted = useMutationHooks((data) => {
    const { id, token } = data;
    return ProductService.deleteProduct(id, token);
  });

  const mutationDeletedMany = useMutationHooks(({ ids, token }) => {
    return ProductService.deleteManyProduct(ids, token);
  });

  const handleDeleteManyProducts = (ids) => {
    mutationDeletedMany.mutate(
      { ids, token: user?.access_token },
      { onSettled: () => queryProduct.refetch() }
    );
  };

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    return res;
  };

  const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate;
  const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleted;
  const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeletedMany;

  const getAllProducts = async () => await ProductService.getAllProduct();

  const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProducts });
  const typeProduct = useQuery({ queryKey: ['type-products'], queryFn: fetchAllTypeProduct });
  const { isLoading: isLoadingProducts, data: products } = queryProduct;

  // Thống kê
  const totalProducts = useMemo(() => products?.data?.length || 0, [products]);
  const totalStock = useMemo(() =>
    products?.data?.reduce((sum, product) => sum + (product.countInStock || 0), 0) || 0,
    [products]
  );
  const averageRating = useMemo(() => {
    if (!products?.data?.length) return 0;
    const total = products.data.reduce((sum, product) => sum + (product.rating || 0), 0);
    return (total / products.data.length).toFixed(1);
  }, [products]);

  const totalTypes = useMemo(() => {
    if (!products?.data) return 0;
    const types = new Set(products.data.map(product => product.type).filter(Boolean));
    return types.size;
  }, [products]);

  // Biểu đồ phân bố loại sản phẩm
  const typeChartData = useMemo(() => {
    if (!products?.data) return [];
    const grouped = {};
    products.data.forEach(product => {
      const type = product.type || 'Khác';
      grouped[type] = (grouped[type] || 0) + 1;
    });
    return Object.keys(grouped).map((key, index) => ({
      name: key,
      value: grouped[key],
      fill: COLORS[index % COLORS.length]
    })).sort((a, b) => b.value - a.value);
  }, [products]);

  // Biểu đồ giá và tồn kho theo loại
  const priceStockChartData = useMemo(() => {
    if (!products?.data) return [];
    const grouped = {};
    products.data.forEach(product => {
      const type = product.type || 'Khác';
      if (!grouped[type]) {
        grouped[type] = {
          name: type,
          totalPrice: 0,
          totalStock: 0,
          count: 0
        };
      }
      grouped[type].count += 1;
      grouped[type].totalPrice += (product.price || 0);
      grouped[type].totalStock += (product.countInStock || 0);
    });

    return Object.values(grouped)
      .map(item => ({
        name: item.name,
        avgPrice: Math.round(item.totalPrice / item.count),
        totalStock: item.totalStock,
        productCount: item.count
      }))
      .sort((a, b) => b.productCount - a.productCount)
      .slice(0, 8);
  }, [products]);

  // Biểu đồ đánh giá theo loại
  const ratingChartData = useMemo(() => {
    if (!products?.data) return [];
    const grouped = {};
    products.data.forEach(product => {
      const type = product.type || 'Khác';
      if (!grouped[type]) {
        grouped[type] = {
          name: type,
          totalRating: 0,
          count: 0
        };
      }
      grouped[type].count += 1;
      grouped[type].totalRating += (product.rating || 0);
    });

    return Object.values(grouped)
      .map(item => ({
        name: item.name,
        rating: Number((item.totalRating / item.count).toFixed(1)),
        productCount: item.count
      }))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);
  }, [products]);

  // Top sản phẩm có rating cao nhất
  const topRatedProducts = useMemo(() => {
    if (!products?.data) return [];
    return products.data
      .filter(product => product.rating > 0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5)
      .map(product => ({
        name: product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name,
        rating: product.rating,
        price: product.price,
        stock: product.countInStock
      }));
  }, [products]);

  const handleEditProduct = async (id) => {
    setIsOpenDrawer(true);
    setIsLoadingUpdate(true);
    try {
      const res = await ProductService.getDetailsProduct(id);
      if (res?.data) {
        setStateProductDetails({
          name: res.data.name,
          price: res.data.price,
          description: res.data.description,
          rating: res.data.rating,
          image: res.data.image,
          type: res.data.type,
          countInStock: res.data.countInStock,
          discount: res.data.discount,
        });
        formUpdate.setFieldsValue(res.data);
        setRowSelected(id);
      }
    } catch {
      message.error("Không thể lấy chi tiết sản phẩm");
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  const renderAction = (record) => (
    <ActionButtons>
      <Button
        type="primary"
        icon={<EditOutlined />}
        size="small"
        onClick={() => handleEditProduct(record._id)}
        style={{ backgroundColor: '#faad14', borderColor: '#faad14' }}
      >
        Sửa
      </Button>
      <Button
        type="primary"
        danger
        icon={<DeleteOutlined />}
        size="small"
        onClick={() => {
          setIsModalOpenDelete(true);
          setRowSelected(record._id);
        }}
      >
        Xóa
      </Button>
    </ActionButtons>
  );

  const dataTable = products?.data?.length > 0
    ? products?.data.map((product) => ({
      ...product,
      key: product._id,
      price: `${product.price?.toLocaleString('vi-VN')} VND` || '0 VND'
    }))
    : [];

  const handleSearch = (selectedKeys, confirm, dataIndex) => confirm();
  const handleReset = (clearFilters) => clearFilters();
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 10 }}>
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: '180px', marginBottom: '8px' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button type="primary" onClick={() => handleSearch(selectedKeys, confirm, dataIndex)} size="small">
            Search
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small">
            Reset
          </Button>
        </div>
      </div>
    ),

    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
    onFilter: (value, record) => record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) setTimeout(() => searchInput.current?.select(), 100);
      },
    },
  });

  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps('name'),
      width: 200
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      sorter: (a, b) => parseFloat(a.price) - parseFloat(b.price),
      width: 120
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      sorter: (a, b) => a.rating - b.rating,
      width: 100,
      render: (rating) => (
        <span style={{ color: rating >= 4 ? '#52c41a' : rating >= 3 ? '#faad14' : '#ff4d4f' }}>
          {rating} ⭐
        </span>
      )
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      width: 120
    },
    {
      title: 'Tồn kho',
      dataIndex: 'countInStock',
      sorter: (a, b) => a.countInStock - b.countInStock,
      width: 100,
      render: (stock) => (
        <span style={{ color: stock > 10 ? '#52c41a' : stock > 0 ? '#faad14' : '#ff4d4f' }}>
          {stock}
        </span>
      )
    },
    {
      title: 'Giảm giá',
      dataIndex: 'discount',
      render: (discount) => (
        <span style={{ color: discount > 0 ? '#ff4d4f' : '#666' }}>
          {discount || 0}%
        </span>
      ),
      width: 100
    },
    {
      title: 'Hành động',
      render: (_, record) => renderAction(record),
      width: 150,
      fixed: 'right'
    },
  ];

  const { data, isLoading, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') message.success("Xóa nhiều sản phẩm thành công!");
    else if (isErrorDeletedMany) message.error("Xóa nhiều sản phẩm thất bại!");
  }, [isSuccessDeletedMany, isErrorDeletedMany, dataDeletedMany]);

  useEffect(() => {
    if (isSuccess && data?.status === 'OK') {
      message.success('Tạo sản phẩm thành công!');
      handleCancel();
      queryProduct.refetch();
    } else if (isError || data?.status === 'ERR') {
      message.error(data?.message || 'Có lỗi xảy ra!');
    }
  }, [isSuccess, isError, data]);

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === 'OK') {
      message.success('Cập nhật sản phẩm thành công!');
      if (dataUpdated?.data) {
        setStateProductDetails(dataUpdated.data);
        formUpdate.setFieldsValue(dataUpdated.data);
      }
      queryProduct.refetch();
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error('Cập nhật sản phẩm thất bại!');
    }
  }, [isSuccessUpdated, isErrorUpdated, dataUpdated]);

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === 'OK') {
      message.success('Xóa sản phẩm thành công!');
      handleCancelDelete();
      queryProduct.refetch();
    } else if (isErrorDeleted) {
      message.error('Xóa sản phẩm thất bại!');
    }
  }, [isSuccessDeleted, isErrorDeleted, dataDeleted]);

  const handleCancelDelete = () => setIsModalOpenDelete(false);
  const handleDeleteProduct = () => {
    mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, { onSettled: () => queryProduct.refetch() });
  };

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    formUpdate.resetFields();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      name: '', price: '', description: '', rating: '',
      image: '', type: '', countInStock: '', discount: '', newType: ''
    });
    formCreate.resetFields();
  };

  const onFinish = () => {
    const params = {
      name: stateProduct.name,
      price: stateProduct.price,
      description: stateProduct.description,
      rating: stateProduct.rating,
      image: stateProduct.image,
      type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
      countInStock: stateProduct.countInStock,
      discount: stateProduct.discount,
    };
    mutation.mutate(params, { onSettled: () => queryProduct.refetch() });
  };

  const onUpdateProduct = () => {
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, ...stateProductDetails },
      { onSettled: () => queryProduct.refetch() }
    );
  };

  const handleOnchange = (e) => setStateProduct({ ...stateProduct, [e.target.name]: e.target.value });
  const handleOnchangeDetails = (e) => setStateProductDetails({ ...stateProductDetails, [e.target.name]: e.target.value });
  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) file.preview = await getBase64(file.originFileObj);
    setStateProduct({ ...stateProduct, image: file.preview });
  };
  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) file.preview = await getBase64(file.originFileObj);
    setStateProductDetails({ ...stateProductDetails, image: file.preview });
  };
  const handleChangeSelect = (value) => setStateProduct({ ...stateProduct, type: value });

  return (
    <DashboardContainer>
      <WrapperHeader>📊 Quản lý Sản phẩm</WrapperHeader>

      {/* Thống kê tổng quan */}
      <StatsContainer>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng sản phẩm"
                value={totalProducts}
                prefix={<ShoppingOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng tồn kho"
                value={totalStock}
                prefix={<StockOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Đánh giá TB"
                value={averageRating}
                prefix={<StarOutlined />}
                valueStyle={{ color: '#faad14' }}
                suffix="⭐"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Loại sản phẩm"
                value={totalTypes}
                prefix={<AppstoreOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>
      </StatsContainer>

      {/* Biểu đồ */}
      <ChartGrid>
        <Row gutter={[16, 16]}>
          {/* Biểu đồ phân bố loại sản phẩm */}
          <Col xs={24} lg={12}>
            <ChartCard>
              <ChartTitle>📈 Phân bố loại sản phẩm</ChartTitle>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={typeChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {typeChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} sản phẩm`, 'Số lượng']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </Col>

          {/* Biểu đồ giá và tồn kho */}
          <Col xs={24} lg={12}>
            <ChartCard>
              <ChartTitle>💰 Giá & Tồn kho theo loại</ChartTitle>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={priceStockChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'avgPrice') return [`${value.toLocaleString('vi-VN')} VND`, 'Giá TB'];
                      if (name === 'totalStock') return [`${value} sản phẩm`, 'Tồn kho'];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="avgPrice" fill="#8884d8" name="Giá TB" />
                  <Line yAxisId="right" type="monotone" dataKey="totalStock" stroke="#ff7300" name="Tồn kho" />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartCard>
          </Col>


        </Row>
      </ChartGrid>

      {/* Header bảng sản phẩm */}
      <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#1f2937' }}>Danh sách sản phẩm</h3>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          size="large"
          style={{
            backgroundColor: '#1890ff',
            borderColor: '#1890ff',
            borderRadius: '6px',
            fontWeight: '600'
          }}
        >
          Thêm sản phẩm
        </Button>
      </div>

      {/* Bảng sản phẩm */}
      <TableWrapper>
        {dataTable.length ? (
          <TableComponent
            handleDeleteManyProducts={handleDeleteManyProducts}
            columns={columns}
            isLoading={isLoadingProducts}
            data={dataTable}
            scroll={{ x: 1000 }}
          />
        ) : (
          <Empty
            description="Chưa có sản phẩm nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ padding: '40px 0' }}
          />
        )}
      </TableWrapper>

      {/* Modal tạo sản phẩm */}
      <ModalComponent
        title="➕ Tạo Sản Phẩm Mới"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={700}
      >
        <Loading isLoading={isLoading}>
          <Form
            name="create-product"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onFinish}
            autoComplete="off"
            form={formCreate}
          >
            <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true, message: 'Nhập tên!' }]}>
              <InputComponent value={stateProduct.name} onChange={handleOnchange} name="name" />
            </Form.Item>
            <Form.Item label="Loại" name="type" rules={[{ required: true, message: 'Nhập loại!' }]}>
              <Select
                name="type"
                value={stateProduct?.type}
                onChange={handleChangeSelect}
                options={renderOptions(typeProduct?.data?.data || [])}
              />
            </Form.Item>
            {stateProduct.type === 'add_type' && (
              <Form.Item label="Loại mới" name="newType" rules={[{ required: true, message: 'Nhập loại!' }]}>
                <InputComponent value={stateProduct.newType} onChange={handleOnchange} name="newType" />
              </Form.Item>
            )}
            <Form.Item label="Số lượng" name="countInStock" rules={[{ required: true, message: 'Nhập số lượng!' }]}>
              <InputComponent value={stateProduct.countInStock} onChange={handleOnchange} name="countInStock" />
            </Form.Item>
            <Form.Item label="Giá" name="price" rules={[{ required: true, message: 'Nhập giá!' }]}>
              <InputComponent value={stateProduct.price} onChange={handleOnchange} name="price" />
            </Form.Item>
            <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Nhập mô tả!' }]}>
              <Input.TextArea
                value={stateProduct.description}
                onChange={(e) => handleOnchange({ target: { name: 'description', value: e.target.value } })}
                rows={3}
              />
            </Form.Item>
            <Form.Item label="Đánh giá" name="rating" rules={[{ required: true, message: 'Nhập rating!' }]}>
              <InputComponent value={stateProduct.rating} onChange={handleOnchange} name="rating" />
            </Form.Item>
            <Form.Item label="Giảm giá" name="discount" rules={[{ required: true, message: 'Nhập discount!' }]}>
              <InputComponent value={stateProduct.discount} onChange={handleOnchange} name="discount" />
            </Form.Item>
            <Form.Item label="Ảnh" name="image" rules={[{ required: true, message: 'Chọn ảnh!' }]}>
              <WrapperUploadFile
                onChange={handleOnchangeAvatar}
                maxCount={1}
                showUploadList={false}
                beforeUpload={() => false}
              >
                <Button>Chọn ảnh</Button>
                {stateProduct?.image && (
                  <img
                    src={stateProduct.image}
                    style={{
                      height: '60px',
                      width: '60px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      marginLeft: '10px',
                    }}
                    alt="avatar"
                  />
                )}
              </WrapperUploadFile>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <Button onClick={handleCancel}>
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                  Tạo sản phẩm
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>

      {/* Drawer cập nhật sản phẩm */}
      <DrawerComponent
        title="✏️ Cập nhật Sản phẩm"
        isOpen={isOpenDrawer}
        onClose={handleCloseDrawer}
        width="90%"
      >
        <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
          <Form
            name="update-product"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            onFinish={onUpdateProduct}
            autoComplete="off"
            form={formUpdate}
          >
            <Form.Item label="Tên" name="name" rules={[{ required: true, message: 'Nhập tên!' }]}>
              <InputComponent value={stateProductDetails.name} onChange={handleOnchangeDetails} name="name" />
            </Form.Item>
            <Form.Item label="Loại" name="type" rules={[{ required: true, message: 'Nhập loại!' }]}>
              <InputComponent value={stateProductDetails.type} onChange={handleOnchangeDetails} name="type" />
            </Form.Item>
            <Form.Item label="Số lượng" name="countInStock" rules={[{ required: true, message: 'Nhập số lượng!' }]}>
              <InputComponent value={stateProductDetails.countInStock} onChange={handleOnchangeDetails} name="countInStock" />
            </Form.Item>
            <Form.Item label="Giá" name="price" rules={[{ required: true, message: 'Nhập giá!' }]}>
              <InputComponent value={stateProductDetails.price} onChange={handleOnchangeDetails} name="price" />
            </Form.Item>
            <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Nhập mô tả!' }]}>
              <Input.TextArea
                value={stateProductDetails.description}
                onChange={(e) => handleOnchangeDetails({ target: { name: 'description', value: e.target.value } })}
                rows={3}
              />
            </Form.Item>
            <Form.Item label="Đánh giá" name="rating" rules={[{ required: true, message: 'Nhập rating!' }]}>
              <InputComponent value={stateProductDetails.rating} onChange={handleOnchangeDetails} name="rating" />
            </Form.Item>
            <Form.Item label="Giảm giá" name="discount" rules={[{ required: true, message: 'Nhập discount!' }]}>
              <InputComponent value={stateProductDetails.discount} onChange={handleOnchangeDetails} name="discount" />
            </Form.Item>
            <Form.Item label="Ảnh" name="image" rules={[{ required: true, message: 'Chọn ảnh!' }]}>
              <WrapperUploadFile
                onChange={handleOnchangeAvatarDetails}
                maxCount={1}
                showUploadList={false}
                beforeUpload={() => false}
              >
                <Button>Chọn ảnh</Button>
                {stateProductDetails?.image && (
                  <img
                    src={stateProductDetails.image}
                    style={{
                      height: '60px',
                      width: '60px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      marginLeft: '10px',
                    }}
                    alt="avatar"
                  />
                )}
              </WrapperUploadFile>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <Button onClick={handleCloseDrawer}>
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit" loading={isLoadingUpdated}>
                  Cập nhật
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>

      {/* Modal xác nhận xóa */}
      <ModalComponent
        title="🗑️ Xóa Sản Phẩm"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteProduct}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true, loading: isLoadingDeleted }}
      >
        <Loading isLoading={isLoadingDeleted}>
          <div style={{ textAlign: 'center', fontSize: '16px', padding: '20px 0' }}>
            <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
            <p style={{ color: '#ff4d4f', fontWeight: '500' }}>Hành động này không thể hoàn tác!</p>
          </div>
        </Loading>
      </ModalComponent>
    </DashboardContainer>
  );
};

export default AdminProduct;