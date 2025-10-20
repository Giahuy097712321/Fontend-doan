import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Space, Select } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';

import TableComponent from '../TableComponent/TableComponent';
import InputComponent from './../InputComponent/InputComponent';
import DrawerComponent from './../DrawerCompoenent/DrawerComponent';
import ModalComponent from './../ModalComponent/ModalComponent';
import Loading from './../LoadingComponent/Loading';
import * as ProductService from '../../services/ProductService';
import { useMutationHooks } from './../../hooks/useMutationHook';
import * as message from '../../components/Message/Message';
import { getBase64, renderOptions } from '../../utils';

import {
  WrapperHeader,
  WrapperUploadFile,
  WrapperAddButton,
  WrapperTable,
  WrapperDrawerContent,
  WrapperModalDelete,
  WrapperActionButtons
} from './style';

const AdminProduct = () => {
  const user = useSelector((state) => state?.user);

  // States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState('');
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);

  const [formCreate] = Form.useForm();
  const [formUpdate] = Form.useForm();

  const [stateProduct, setStateProduct] = useState({
    name: '', price: '', description: '', rating: '',
    image: '', type: '', countInStock: '', newType: '', discount: ''
  });

  const [stateProductDetails, setStateProductDetails] = useState({
    name: '', price: '', description: '', rating: '',
    image: '', type: '', countInStock: '', discount: ''
  });

  const searchInput = useRef(null);

  // Mutations
  const mutationCreate = useMutationHooks((data) => ProductService.createProduct(data));
  const mutationUpdate = useMutationHooks((data) => ProductService.updateProduct(data.id, data.token, data));
  const mutationDeleted = useMutationHooks((data) => ProductService.deleteProduct(data.id, data.token));
  const mutationDeletedMany = useMutationHooks(({ ids, token }) => ProductService.deleteManyProduct(ids, token));

  // Fetch products & types
  const fetchAllTypeProduct = async () => await ProductService.getAllTypeProduct();
  const getAllProducts = async () => await ProductService.getAllProduct();

  const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProducts });
  const typeProduct = useQuery({ queryKey: ['type-products'], queryFn: fetchAllTypeProduct });
  const { isLoading: isLoadingProducts, data: products } = queryProduct;

  // Actions
  const handleDeleteManyProducts = (ids) => {
    mutationDeletedMany.mutate({ ids, token: user?.access_token }, { onSettled: () => queryProduct.refetch() });
  };

  const handleDeleteProduct = () => {
    mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, { onSettled: () => queryProduct.refetch() });
  };

  const handleEditProduct = async (id) => {
    setIsOpenDrawer(true);
    setIsLoadingUpdate(true);
    try {
      const res = await ProductService.getDetailsProduct(id);
      if (res?.data) {
        setStateProductDetails(res.data);
        formUpdate.setFieldsValue(res.data);
        setRowSelected(id);
      }
    } catch {
      message.error("Không thể lấy chi tiết sản phẩm");
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  // Handle form changes
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

  // Submit
  const onFinish = () => {
    const params = {
      ...stateProduct,
      type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type
    };
    mutationCreate.mutate(params, { onSettled: () => queryProduct.refetch() });
  };

  const onUpdateProduct = () => {
    mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateProductDetails }, { onSettled: () => queryProduct.refetch() });
  };

  // Columns
  const renderAction = (record) => (
    <WrapperActionButtons>
      <DeleteOutlined className="delete-icon" onClick={() => { setIsModalOpenDelete(true); setRowSelected(record._id); }} />
      <EditOutlined className="edit-icon" onClick={() => handleEditProduct(record._id)} />
    </WrapperActionButtons>
  );

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Price', dataIndex: 'price' },
    { title: 'Rating', dataIndex: 'rating' },
    { title: 'Type', dataIndex: 'type' },
    { title: 'Action', render: (_, record) => renderAction(record) },
  ];

  const dataTable = products?.data?.map((item) => ({ ...item, key: item._id })) || [];

  // Modal / Drawer handlers
  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      name: '', price: '', description: '', rating: '',
      image: '', type: '', countInStock: '', discount: '', newType: ''
    });
    formCreate.resetFields();
  };

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    formUpdate.resetFields();
  };

  const handleCancelDelete = () => setIsModalOpenDelete(false);

  return (
    <div>
      <WrapperHeader>Quản lý sản phẩm</WrapperHeader>

      <WrapperAddButton>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusOutlined />
        </Button>
      </WrapperAddButton>

      <WrapperTable>
        <TableComponent
          handleDeleteManyProducts={handleDeleteManyProducts}
          columns={columns}
          isLoading={isLoadingProducts}
          data={dataTable}
        />
      </WrapperTable>

      {/* Modal tạo sản phẩm */}
      <ModalComponent title="Tạo Sản Phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Loading isLoading={mutationCreate.isLoading}>
          <Form form={formCreate} onFinish={onFinish} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} autoComplete="off">
            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Nhập tên!' }]}>
              <InputComponent value={stateProduct.name} onChange={handleOnchange} name="name" />
            </Form.Item>

            <Form.Item label="Type" name="type" rules={[{ required: true, message: 'Chọn loại!' }]}>
              <Select value={stateProduct.type} onChange={handleChangeSelect} options={renderOptions(typeProduct?.data?.data || [])} />
            </Form.Item>

            {stateProduct.type === 'add_type' && (
              <Form.Item label="New Type" name="newType" rules={[{ required: true, message: 'Nhập loại mới!' }]}>
                <InputComponent value={stateProduct.newType} onChange={handleOnchange} name="newType" />
              </Form.Item>
            )}

            <Form.Item label="Count InStock" name="countInStock" rules={[{ required: true, message: 'Nhập số lượng!' }]}>
              <InputComponent value={stateProduct.countInStock} onChange={handleOnchange} name="countInStock" />
            </Form.Item>

            <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Nhập giá!' }]}>
              <InputComponent value={stateProduct.price} onChange={handleOnchange} name="price" />
            </Form.Item>

            <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Nhập mô tả!' }]}>
              <InputComponent value={stateProduct.description} onChange={handleOnchange} name="description" />
            </Form.Item>

            <Form.Item label="Rating" name="rating" rules={[{ required: true, message: 'Nhập rating!' }]}>
              <InputComponent value={stateProduct.rating} onChange={handleOnchange} name="rating" />
            </Form.Item>

            <Form.Item label="Discount" name="discount" rules={[{ required: true, message: 'Nhập discount!' }]}>
              <InputComponent value={stateProduct.discount} onChange={handleOnchange} name="discount" />
            </Form.Item>

            <Form.Item label="Image" name="image" rules={[{ required: true, message: 'Chọn ảnh!' }]}>
              <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1} showUploadList={false} beforeUpload={() => false}>
                <Button>Chọn ảnh</Button>
                {stateProduct.image && <img src={stateProduct.image} alt="avatar" height={60} width={60} />}
              </WrapperUploadFile>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">Submit</Button>
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>

      {/* Drawer cập nhật sản phẩm */}
      <DrawerComponent title="Chi tiết sản phẩm" isOpen={isOpenDrawer} onClose={handleCloseDrawer} width="90%">
        <WrapperDrawerContent>
          <Loading isLoading={isLoadingUpdate || mutationUpdate.isLoading}>
            <Form form={formUpdate} onFinish={onUpdateProduct} labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} autoComplete="off">
              {Object.keys(stateProductDetails).map((key) => (
                key !== 'image' && (
                  <Form.Item key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} name={key} rules={[{ required: true, message: `Nhập ${key}!` }]}>
                    <InputComponent value={stateProductDetails[key]} onChange={handleOnchangeDetails} name={key} />
                  </Form.Item>
                )
              ))}
              <Form.Item label="Image" name="image" rules={[{ required: true, message: 'Chọn ảnh!' }]}>
                <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1} showUploadList={false} beforeUpload={() => false}>
                  <Button>Chọn ảnh</Button>
                  {stateProductDetails.image && <img src={stateProductDetails.image} alt="avatar" height={60} width={60} />}
                </WrapperUploadFile>
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                <Button type="primary" htmlType="submit">Apply</Button>
              </Form.Item>
            </Form>
          </Loading>
        </WrapperDrawerContent>
      </DrawerComponent>

      {/* Modal xác nhận xóa */}
      <ModalComponent title="Xóa Sản Phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct} okText="Xóa" cancelText="Hủy">
        <WrapperModalDelete>
          <Loading isLoading={mutationDeleted.isLoading}>Bạn có chắc chắn muốn xóa sản phẩm này không?</Loading>
        </WrapperModalDelete>
      </ModalComponent>
    </div>
  );
};

export default AdminProduct;
