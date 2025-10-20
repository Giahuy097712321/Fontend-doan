// AdminProduct.jsx
import { Button, Form, Select, Input } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import React, { useState, useEffect, useRef } from 'react';
import {
  WrapperHeader,
  WrapperUploadFile,
  WrapperAddButton,
  TableWrapper,
  InfoCardContainer,
  InfoCard,
  InfoNumber,
  InfoLabel,
  ChartContainer,
  ChartCard,
  ChartTitle
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
import React, { useState, useMemo } from 'react';
import ModalComponent from './../ModalComponent/ModalComponent';
import { renderOptions } from '../../utils';
import { Empty } from 'antd';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
const COLORS_TYPE = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

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

  const typeChartData = useMemo(() => {
    if (!products?.data) return [];
    const grouped = {};
    products.data.forEach(product => {
      const type = product.type || 'Khác';
      grouped[type] = (grouped[type] || 0) + 1;
    });
    return Object.keys(grouped).map(key => ({ name: key, count: grouped[key] }));
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
    <div style={{ display: 'flex', gap: '12px' }}>
      <EditOutlined
        style={{ color: 'orange', fontSize: '18px', cursor: 'pointer' }}
        onClick={() => handleEditProduct(record._id)}
      />
      <DeleteOutlined
        style={{ color: 'red', fontSize: '18px', cursor: 'pointer' }}
        onClick={() => {
          setIsModalOpenDelete(true);
          setRowSelected(record._id);
        }}
      />
    </div>
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
    { title: 'Tên sản phẩm', dataIndex: 'name', sorter: (a, b) => a.name.length - b.name.length, ...getColumnSearchProps('name') },
    { title: 'Giá', dataIndex: 'price', sorter: (a, b) => parseFloat(a.price) - parseFloat(b.price) },
    { title: 'Đánh giá', dataIndex: 'rating', sorter: (a, b) => a.rating - b.rating },
    { title: 'Loại', dataIndex: 'type' },
    { title: 'Tồn kho', dataIndex: 'countInStock', sorter: (a, b) => a.countInStock - b.countInStock },
    { title: 'Giảm giá', dataIndex: 'discount', render: (discount) => `${discount || 0}%` },
    { title: 'Hành động', render: (_, record) => renderAction(record) },
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
    <div>
      <WrapperHeader>Quản lý sản phẩm</WrapperHeader>

      {/* Info Card */}
      <InfoCardContainer>
        <InfoCard>
          <InfoLabel>Tổng sản phẩm</InfoLabel>
          <InfoNumber>{totalProducts}</InfoNumber>
        </InfoCard>
        <InfoCard>
          <InfoLabel>Tổng tồn kho</InfoLabel>
          <InfoNumber>{totalStock}</InfoNumber>
        </InfoCard>
        <InfoCard>
          <InfoLabel>Đánh giá trung bình</InfoLabel>
          <InfoNumber>{averageRating} ⭐</InfoNumber>
        </InfoCard>
        <InfoCard>
          <InfoLabel>Loại sản phẩm</InfoLabel>
          <InfoNumber>{typeChartData.length}</InfoNumber>
        </InfoCard>
      </InfoCardContainer>

      {/* Charts */}
      <ChartContainer>
        <ChartCard>
          <ChartTitle>Phân bố theo loại sản phẩm</ChartTitle>
          <PieChart width={350} height={300}>
            <Pie
              dataKey="count"
              data={typeChartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={({ name, count }) => `${name}: ${count}`}
              isAnimationActive
            >
              {typeChartData.map((entry, index) => (
                <Cell key={`cell-type-${index}`} fill={COLORS_TYPE[index % COLORS_TYPE.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ChartCard>
      </ChartContainer>

      {/* Button thêm sản phẩm */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
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
          />
        ) : (
          <Empty description="Chưa có sản phẩm nào" />
        )}
      </TableWrapper>

      {/* Modal tạo sản phẩm */}
      <ModalComponent title="Tạo Sản Phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
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
              <InputComponent value={stateProduct.description} onChange={handleOnchange} name="description" />
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
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginLeft: '10px',
                    }}
                    alt="avatar"
                  />
                )}
              </WrapperUploadFile>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Tạo
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>

      {/* Drawer cập nhật sản phẩm */}
      <DrawerComponent title="Chi tiết sản phẩm" isOpen={isOpenDrawer} onClose={handleCloseDrawer} width="90%">
        <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
          <Form
            name="update-product"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
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
              <InputComponent value={stateProductDetails.description} onChange={handleOnchangeDetails} name="description" />
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
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginLeft: '10px',
                    }}
                    alt="avatar"
                  />
                )}
              </WrapperUploadFile>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>

      {/* Modal xác nhận xóa */}
      <ModalComponent
        title="Xóa Sản Phẩm"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteProduct}
        okText="Xóa"
        cancelText="Hủy"
      >
        <Loading isLoading={isLoadingDeleted}>
          <div style={{ textAlign: 'center', fontSize: '16px', padding: '20px 0' }}>
            Bạn có chắc chắn muốn xóa sản phẩm này không?
          </div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminProduct;