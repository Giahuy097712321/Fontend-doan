// AdminProduct.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, Space, Select } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import TableComponent from '../TableComponent/TableComponent';
import InputComponent from './../InputComponent/InputComponent';
import DrawerComponent from './../DrawerCompoenent/DrawerComponent';
import ModalComponent from './../ModalComponent/ModalComponent';
import Loading from './../LoadingComponent/Loading';
import { getBase64, renderOptions } from '../../utils';
import * as ProductService from '../../services/ProductService';
import { useMutationHooks } from './../../hooks/useMutationHook';
import * as message from '../../components/Message/Message';
import { WrapperHeader, WrapperUploadFile } from './style';

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [rowSelected, setRowSelected] = useState('');
  const [stateProduct, setStateProduct] = useState({});
  const [stateProductDetails, setStateProductDetails] = useState({});
  const [formCreate] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const user = useSelector(state => state.user);
  const searchInput = useRef(null);

  // Lấy danh sách sản phẩm
  const getAllProducts = async () => await ProductService.getAllProduct();
  const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProducts });
  const { data: products, isLoading: isLoadingProducts } = queryProduct;

  // Lấy loại sản phẩm
  const getAllTypeProduct = async () => await ProductService.getAllTypeProduct();
  const typeProduct = useQuery({ queryKey: ['type-products'], queryFn: getAllTypeProduct });

  // mutation tạo/update/xóa
  const mutationCreate = useMutationHooks(data => ProductService.createProduct(data));
  const mutationUpdate = useMutationHooks(data => ProductService.updateProduct(data.id, data.token, data));
  const mutationDelete = useMutationHooks(data => ProductService.deleteProduct(data.id, data.token));
  const mutationDeleteMany = useMutationHooks(data => ProductService.deleteManyProduct(data.ids, data.token));

  // Xử lý upload ảnh
  const handleChangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) file.preview = await getBase64(file.originFileObj);
    setStateProduct({ ...stateProduct, image: file.preview });
  };
  const handleChangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) file.preview = await getBase64(file.originFileObj);
    setStateProductDetails({ ...stateProductDetails, image: file.preview });
  };

  // Mở drawer chỉnh sửa
  const handleEditProduct = async (id) => {
    setIsOpenDrawer(true);
    try {
      const res = await ProductService.getDetailsProduct(id);
      if (res?.data) {
        setStateProductDetails(res.data);
        formUpdate.setFieldsValue(res.data);
        setRowSelected(id);
      }
    } catch {
      message.error("Không thể lấy chi tiết sản phẩm");
    }
  };

  // Xóa sản phẩm
  const handleDeleteProduct = () => {
    mutationDelete.mutate({ id: rowSelected, token: user?.access_token }, { onSettled: () => queryProduct.refetch() });
    setIsModalDelete(false);
  };

  // Xóa nhiều sản phẩm
  const handleDeleteManyProducts = (ids) => {
    mutationDeleteMany.mutate({ ids, token: user?.access_token }, { onSettled: () => queryProduct.refetch() });
  };

  // Form tạo sản phẩm
  const onFinishCreate = () => {
    const params = {
      ...stateProduct,
      type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type
    };
    mutationCreate.mutate(params, { onSettled: () => queryProduct.refetch() });
    setIsModalOpen(false);
    formCreate.resetFields();
    setStateProduct({});
  };

  // Form update sản phẩm
  const onFinishUpdate = () => {
    mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateProductDetails }, { onSettled: () => queryProduct.refetch() });
    setIsOpenDrawer(false);
  };

  // Table data
  const dataTable = products?.data?.map(p => ({ ...p, key: p._id })) || [];

  // Column table
  const columns = [
    { title: 'Tên sản phẩm', dataIndex: 'name' },
    { title: 'Giá', dataIndex: 'price' },
    { title: 'Đánh giá', dataIndex: 'rating' },
    { title: 'Loại', dataIndex: 'type' },
    {
      title: 'Hành động',
      render: (_, record) => (
        <Space>
          <EditOutlined style={{ color: 'orange', fontSize: '20px', cursor: 'pointer' }} onClick={() => handleEditProduct(record._id)} />
          <DeleteOutlined style={{ color: 'red', fontSize: '20px', cursor: 'pointer' }} onClick={() => { setRowSelected(record._id); setIsModalDelete(true); }} />
        </Space>
      )
    }
  ];

  return (
    <div>
      <WrapperHeader>Quản lý sản phẩm</WrapperHeader>

      {/* Nút tạo sản phẩm */}
      <Button
        type="dashed"
        style={{ width: 150, height: 150, borderRadius: 10, fontSize: 60 }}
        onClick={() => setIsModalOpen(true)}
      >
        <PlusOutlined />
      </Button>

      {/* Bảng sản phẩm */}
      <div style={{ marginTop: 20 }}>
        <TableComponent
          columns={columns}
          data={dataTable}
          isLoading={isLoadingProducts}
          handleDeleteManyProducts={handleDeleteManyProducts}
        />
      </div>

      {/* Modal tạo sản phẩm */}
      <ModalComponent title="Tạo sản phẩm" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Loading isLoading={mutationCreate.isLoading}>
          <Form form={formCreate} layout="vertical" onFinish={onFinishCreate}>
            <Form.Item label="Tên" name="name" rules={[{ required: true, message: 'Nhập tên sản phẩm' }]}>
              <InputComponent value={stateProduct.name} name="name" onChange={e => setStateProduct({ ...stateProduct, name: e.target.value })} />
            </Form.Item>
            <Form.Item label="Loại" name="type" rules={[{ required: true, message: 'Chọn loại' }]}>
              <Select value={stateProduct.type} onChange={value => setStateProduct({ ...stateProduct, type: value })} options={renderOptions(typeProduct?.data?.data || [])} />
            </Form.Item>
            {stateProduct.type === 'add_type' && (
              <Form.Item label="Loại mới" name="newType" rules={[{ required: true, message: 'Nhập loại mới' }]}>
                <InputComponent value={stateProduct.newType} name="newType" onChange={e => setStateProduct({ ...stateProduct, newType: e.target.value })} />
              </Form.Item>
            )}
            <Form.Item label="Số lượng" name="countInStock" rules={[{ required: true, message: 'Nhập số lượng' }]}>
              <InputComponent value={stateProduct.countInStock} name="countInStock" onChange={e => setStateProduct({ ...stateProduct, countInStock: e.target.value })} />
            </Form.Item>
            <Form.Item label="Giá" name="price" rules={[{ required: true, message: 'Nhập giá' }]}>
              <InputComponent value={stateProduct.price} name="price" onChange={e => setStateProduct({ ...stateProduct, price: e.target.value })} />
            </Form.Item>
            <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Nhập mô tả' }]}>
              <InputComponent value={stateProduct.description} name="description" onChange={e => setStateProduct({ ...stateProduct, description: e.target.value })} />
            </Form.Item>
            <Form.Item label="Rating" name="rating" rules={[{ required: true, message: 'Nhập rating' }]}>
              <InputComponent value={stateProduct.rating} name="rating" onChange={e => setStateProduct({ ...stateProduct, rating: e.target.value })} />
            </Form.Item>
            <Form.Item label="Giảm giá (%)" name="discount">
              <InputComponent value={stateProduct.discount} name="discount" onChange={e => setStateProduct({ ...stateProduct, discount: e.target.value })} />
            </Form.Item>
            <Form.Item label="Ảnh" name="image" rules={[{ required: true, message: 'Chọn ảnh' }]}>
              <WrapperUploadFile onChange={handleChangeAvatar} maxCount={1} showUploadList={false} beforeUpload={() => false}>
                <Button>Chọn ảnh</Button>
                {stateProduct.image && <img src={stateProduct.image} alt="avatar" style={{ width: 60, height: 60, borderRadius: '50%', marginLeft: 10 }} />}
              </WrapperUploadFile>
            </Form.Item>
            <Button type="primary" htmlType="submit">Tạo sản phẩm</Button>
          </Form>
        </Loading>
      </ModalComponent>

      {/* Drawer chỉnh sửa */}
      <DrawerComponent title="Chi tiết sản phẩm" isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="80%">
        <Loading isLoading={mutationUpdate.isLoading}>
          <Form form={formUpdate} layout="vertical" onFinish={onFinishUpdate}>
            <Form.Item label="Tên" name="name" rules={[{ required: true, message: 'Nhập tên sản phẩm' }]}>
              <InputComponent value={stateProductDetails.name} name="name" onChange={e => setStateProductDetails({ ...stateProductDetails, name: e.target.value })} />
            </Form.Item>
            <Form.Item label="Loại" name="type" rules={[{ required: true, message: 'Nhập loại' }]}>
              <InputComponent value={stateProductDetails.type} name="type" onChange={e => setStateProductDetails({ ...stateProductDetails, type: e.target.value })} />
            </Form.Item>
            <Form.Item label="Số lượng" name="countInStock">
              <InputComponent value={stateProductDetails.countInStock} name="countInStock" onChange={e => setStateProductDetails({ ...stateProductDetails, countInStock: e.target.value })} />
            </Form.Item>
            <Form.Item label="Giá" name="price">
              <InputComponent value={stateProductDetails.price} name="price" onChange={e => setStateProductDetails({ ...stateProductDetails, price: e.target.value })} />
            </Form.Item>
            <Form.Item label="Mô tả" name="description">
              <InputComponent value={stateProductDetails.description} name="description" onChange={e => setStateProductDetails({ ...stateProductDetails, description: e.target.value })} />
            </Form.Item>
            <Form.Item label="Rating" name="rating">
              <InputComponent value={stateProductDetails.rating} name="rating" onChange={e => setStateProductDetails({ ...stateProductDetails, rating: e.target.value })} />
            </Form.Item>
            <Form.Item label="Giảm giá (%)" name="discount">
              <InputComponent value={stateProductDetails.discount} name="discount" onChange={e => setStateProductDetails({ ...stateProductDetails, discount: e.target.value })} />
            </Form.Item>
            <Form.Item label="Ảnh" name="image">
              <WrapperUploadFile onChange={handleChangeAvatarDetails} maxCount={1} showUploadList={false} beforeUpload={() => false}>
                <Button>Chọn ảnh</Button>
                {stateProductDetails.image && <img src={stateProductDetails.image} alt="avatar" style={{ width: 60, height: 60, borderRadius: '50%', marginLeft: 10 }} />}
              </WrapperUploadFile>
            </Form.Item>
            <Button type="primary" htmlType="submit">Cập nhật</Button>
          </Form>
        </Loading>
      </DrawerComponent>

      {/* Modal xóa */}
      <ModalComponent
        title="Xác nhận xóa"
        open={isModalDelete}
        onCancel={() => setIsModalDelete(false)}
        onOk={handleDeleteProduct}
        okText="Xóa"
        cancelText="Hủy"
      >
        <Loading isLoading={mutationDelete.isLoading}>
          <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminProduct;
