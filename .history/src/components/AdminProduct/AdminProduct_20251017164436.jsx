import { Button, Form, Upload } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { WrapperHeader } from './style';
import TableComponent from '../TableComponent/TableComponent';
import * as ProductService from '../../services/ProductService';
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../LoadingComponent/Loading';
import * as message from '../Message/Message';
import { useQuery } from '@tanstack/react-query';
import DrawerComponent from '../DrawerCompoenent/DrawerComponent';
import { useSelector } from 'react-redux';
import InputComponent from '../InputComponent/InputComponent';

const AdminProduct = () => {
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [rowSelected, setRowSelected] = useState('');
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [form] = Form.useForm();
  const user = useSelector((state) => state?.user);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [stateProductDetails, setStateProductDetails] = useState({
    name: '',
    type: '',
    countInStock: 0,
    price: 0,
    description: '',
    rating: 0,
    image: '', // Thêm trường image
  });

  // Mutation thêm sản phẩm
  const mutationCreate = useMutationHooks((data) => ProductService.createProduct(data));

  // Mutation update product
  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    return ProductService.updateProduct(id, token, rests);
  });

  // Mutation xóa nhiều sản phẩm
  const mutationDeleteMany = useMutationHooks((data) => ProductService.deleteManyProduct(data.ids, data.token));

  // Fetch all products
  const getAllProducts = async () => await ProductService.getAllProduct();
  const queryProduct = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts,
  });
  const { isLoading: isLoadingProducts, data: products } = queryProduct;

  // Khi click Edit
  const handleEditProduct = async (id) => {
    if (!id) return message.error('ID sản phẩm không hợp lệ!');
    setIsOpenDrawer(true);
    setIsLoadingUpdate(true);

    try {
      const res = await ProductService.getDetailsProduct(id);
      const product = res?.data;
      if (product) {
        setStateProductDetails({
          name: product.name || '',
          type: product.type || '',
          countInStock: product.countInStock || 0,
          price: product.price || 0,
          description: product.description || '',
          rating: product.rating || 0,
          image: product.image || '', // Lấy image từ API
        });
        form.setFieldsValue(product);
        setRowSelected(id);
      } else {
        message.error('Không tìm thấy sản phẩm!');
      }
    } catch (error) {
      console.error('❌ Lỗi khi lấy chi tiết sản phẩm:', error);
      message.error('Không thể lấy chi tiết sản phẩm');
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  // Mở drawer để thêm sản phẩm
  const handleAddProduct = () => {
    setRowSelected('');
    setStateProductDetails({
      name: '',
      type: '',
      countInStock: 0,
      price: 0,
      description: '',
      rating: 0,
      image: '',
    });
    form.resetFields();
    setIsOpenDrawer(true);
  };

  // Đóng Drawer
  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    form.resetFields();
    setStateProductDetails({
      name: '',
      type: '',
      countInStock: 0,
      price: 0,
      description: '',
      rating: 0,
      image: '',
    });
  };

  useEffect(() => {
    form.setFieldsValue(stateProductDetails);
  }, [stateProductDetails, form]);

  const handleOnchangeDetails = (e) =>
    setStateProductDetails({ ...stateProductDetails, [e.target.name]: e.target.value });

  const onSaveProduct = () => {
    if (rowSelected) {
      mutationUpdate.mutate(
        { id: rowSelected, token: user?.access_token, ...stateProductDetails },
        {
          onSuccess: () => {
            message.success('Cập nhật sản phẩm thành công!');
            handleCloseDrawer();
            queryProduct.refetch();
          },
          onError: () => message.error('Cập nhật sản phẩm thất bại!'),
        }
      );
    } else {
      mutationCreate.mutate(stateProductDetails, {
        onSuccess: () => {
          message.success('Thêm sản phẩm thành công!');
          handleCloseDrawer();
          queryProduct.refetch();
        },
        onError: () => message.error('Thêm sản phẩm thất bại!'),
      });
    }
  };

  const handleDeleteMany = () => {
    if (selectedRowKeys.length === 0) return;
    mutationDeleteMany.mutate(
      { ids: selectedRowKeys, token: user?.access_token },
      {
        onSuccess: () => {
          message.success('Xóa sản phẩm thành công!');
          setSelectedRowKeys([]);
          queryProduct.refetch();
        },
        onError: () => message.error('Xóa sản phẩm thất bại!'),
      }
    );
  };

  const renderAction = (record) => (
    <EditOutlined
      style={{ color: 'orange', fontSize: '20px', cursor: 'pointer' }}
      onClick={() => handleEditProduct(record._id)}
    />
  );

  const dataTable =
    products?.data?.length > 0
      ? products.data.map((item) => ({
        key: item._id,
        _id: item._id,
        name: item.name,
        type: item.type,
        countInStock: item.countInStock,
        price: item.price,
        description: item.description,
        rating: item.rating,
        image: item.image, // thêm image
      }))
      : [];

  const columns = [
    { title: 'Hình ảnh', dataIndex: 'image', render: (img) => img && <img src={img} alt="product" style={{ width: 50, height: 50, objectFit: 'cover' }} /> },
    { title: 'Tên sản phẩm', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'Loại', dataIndex: 'type' },
    { title: 'Số lượng', dataIndex: 'countInStock' },
    { title: 'Giá', dataIndex: 'price' },
    { title: 'Mô tả', dataIndex: 'description' },
    { title: 'Rating', dataIndex: 'rating' },
    { title: 'Hành động', key: 'action', render: (_, record) => renderAction(record) },
  ];

  return (
    <div>
      <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProduct} style={{ marginRight: 8 }}>
          Thêm sản phẩm
        </Button>
        <Button type="danger" icon={<DeleteOutlined />} onClick={handleDeleteMany}>
          Xóa nhiều
        </Button>
      </div>

      <TableComponent
        columns={columns}
        isLoading={isLoadingProducts}
        data={dataTable}
        selectionType="checkbox"
        rowSelectedKeys={selectedRowKeys}
        setRowSelectedKeys={setSelectedRowKeys}
        handleDeleteManyProducts={handleDeleteMany}
      />

      {/* Drawer */}
      <DrawerComponent title={rowSelected ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'} isOpen={isOpenDrawer} onClose={handleCloseDrawer} width="50%">
        <Loading isLoading={isLoadingUpdate}>
          <Form name="product" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onFinish={onSaveProduct} form={form} autoComplete="off">
            <Form.Item label="Tên" name="name">
              <InputComponent value={stateProductDetails.name} onChange={handleOnchangeDetails} name="name" />
            </Form.Item>
            <Form.Item label="Loại" name="type">
              <InputComponent value={stateProductDetails.type} onChange={handleOnchangeDetails} name="type" />
            </Form.Item>
            <Form.Item label="Số lượng" name="countInStock">
              <InputComponent type="number" value={stateProductDetails.countInStock} onChange={handleOnchangeDetails} name="countInStock" />
            </Form.Item>
            <Form.Item label="Giá" name="price">
              <InputComponent type="number" value={stateProductDetails.price} onChange={handleOnchangeDetails} name="price" />
            </Form.Item>
            <Form.Item label="Mô tả" name="description">
              <InputComponent value={stateProductDetails.description} onChange={handleOnchangeDetails} name="description" />
            </Form.Item>
            <Form.Item label="Rating" name="rating">
              <InputComponent type="number" value={stateProductDetails.rating} onChange={handleOnchangeDetails} name="rating" />
            </Form.Item>
            <Form.Item label="Hình ảnh" name="image">
              <InputComponent value={stateProductDetails.image} onChange={handleOnchangeDetails} name="image" placeholder="URL hình ảnh" />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">{rowSelected ? 'Cập nhật' : 'Thêm'}</Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>
    </div>
  );
};

export default AdminProduct;
