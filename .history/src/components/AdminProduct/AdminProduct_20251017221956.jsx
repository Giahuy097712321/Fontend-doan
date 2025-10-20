import { Button, Form, Space, Select } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import React, { useState, useEffect, useRef } from 'react';
import {
  WrapperHeader,
  WrapperUploadFile,
  WrapperAddButton,
  WrapperTable,
  WrapperDrawerContent,
  WrapperModalDelete,
  WrapperActionButtons
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

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState('');
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);

  // ✅ Tách form riêng
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

  // mutation tạo sản phẩm
  const mutation = useMutationHooks((data) => {
    const { name, price, description, rating, image, type, countInStock, discount } = data;
    return ProductService.createProduct({ name, price, description, rating, image, type, countInStock, discount });
  });

  // mutation update sản phẩm
  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    return ProductService.updateProduct(id, token, rests);
  });

  // mutation xóa sản phẩm
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

  // ✅ mở Drawer và load chi tiết sản phẩm
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
        formUpdate.setFieldsValue(res.data); // ✅ dùng formUpdate
        setRowSelected(id);
      }
    } catch {
      message.error("Không thể lấy chi tiết sản phẩm");
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  const renderAction = (record) => (
    <div>
      <DeleteOutlined
        style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }}
        onClick={() => {
          setIsModalOpenDelete(true);
          setRowSelected(record._id);
        }}
      />
      <EditOutlined
        style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }}
        onClick={() => handleEditProduct(record._id)}
      />
    </div>
  );

  const dataTable = products?.data?.length > 0
    ? products?.data.map((product) => ({ ...product, key: product._id }))
    : [];

  // 🔎 Cấu hình tìm kiếm cột (giữ nguyên)
  const handleSearch = (selectedKeys, confirm, dataIndex) => confirm();
  const handleReset = (clearFilters) => clearFilters();
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button type="primary" onClick={() => handleSearch(selectedKeys, confirm, dataIndex)} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
            Search
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button type="link" size="small" onClick={close}>
            close
          </Button>
        </Space>
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
    { title: 'Name', dataIndex: 'name', sorter: (a, b) => a.name.length - b.name.length, ...getColumnSearchProps('name') },
    { title: 'Price', dataIndex: 'price', sorter: (a, b) => a.price - b.price },
    { title: 'Rating', dataIndex: 'rating', sorter: (a, b) => a.rating - b.rating },
    { title: 'Type', dataIndex: 'type' },
    { title: 'Action', render: (_, record) => renderAction(record) },
  ];

  const { data, isLoading, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') message.success("Xóa nhiều sản phẩm thành công!");
    else if (isErrorDeletedMany) message.error("Xóa nhiều sản phẩm thất bại!");
  }, [isSuccessDeletedMany, isErrorDeletedMany, dataDeletedMany]);

  // ✅ Check trạng thái tạo sản phẩm
  useEffect(() => {
    if (isSuccess && data?.status === 'OK') {
      message.success('Tạo sản phẩm thành công!');
      handleCancel();
      queryProduct.refetch();
    } else if (isError || data?.status === 'ERR') {
      message.error(data?.message || 'Có lỗi xảy ra!');
    }
  }, [isSuccess, isError, data]);

  // ✅ Check trạng thái cập nhật
  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === 'OK') {
      message.success('Cập nhật sản phẩm thành công!');
      if (dataUpdated?.data) {
        setStateProductDetails(dataUpdated.data);
        formUpdate.setFieldsValue(dataUpdated.data); // ✅ dùng formUpdate
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

  // ✅ reset từng form riêng
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

      {/* Button tạo sản phẩm */}
      <WrapperAddButton>
        <button onClick={() => setIsModalOpen(true)}>
          <PlusOutlined />
        </button>
      </WrapperAddButton>



      {/* Bảng sản phẩm */}
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
        <Loading isLoading={isLoading}>
          <Form
            name="create-product"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onFinish}
            autoComplete="off"
            form={formCreate} // ✅ form riêng
          >
            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Nhập tên!' }]}>
              <InputComponent value={stateProduct.name} onChange={handleOnchange} name="name" />
            </Form.Item>
            <Form.Item label="Type" name="type" rules={[{ required: true, message: 'Nhập loại!' }]}>
              <Select
                name="type"
                value={stateProduct?.type}
                onChange={handleChangeSelect}
                options={renderOptions(typeProduct?.data?.data || [])}
              />
            </Form.Item>
            {stateProduct.type === 'add_type' && (
              <Form.Item label="New Type" name="newType" rules={[{ required: true, message: 'Nhập loại!' }]}>
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
                Submit
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
            form={formUpdate} // ✅ form riêng
          >
            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Nhập tên!' }]}>
              <InputComponent value={stateProductDetails.name} onChange={handleOnchangeDetails} name="name" />
            </Form.Item>
            <Form.Item label="Type" name="type" rules={[{ required: true, message: 'Nhập loại!' }]}>
              <InputComponent value={stateProductDetails.type} onChange={handleOnchangeDetails} name="type" />
            </Form.Item>
            <Form.Item label="Count InStock" name="countInStock" rules={[{ required: true, message: 'Nhập số lượng!' }]}>
              <InputComponent value={stateProductDetails.countInStock} onChange={handleOnchangeDetails} name="countInStock" />
            </Form.Item>
            <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Nhập giá!' }]}>
              <InputComponent value={stateProductDetails.price} onChange={handleOnchangeDetails} name="price" />
            </Form.Item>
            <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Nhập mô tả!' }]}>
              <InputComponent value={stateProductDetails.description} onChange={handleOnchangeDetails} name="description" />
            </Form.Item>
            <Form.Item label="Rating" name="rating" rules={[{ required: true, message: 'Nhập rating!' }]}>
              <InputComponent value={stateProductDetails.rating} onChange={handleOnchangeDetails} name="rating" />
            </Form.Item>
            <Form.Item label="Discount" name="discount" rules={[{ required: true, message: 'Nhập discount!' }]}>
              <InputComponent value={stateProductDetails.discount} onChange={handleOnchangeDetails} name="discount" />
            </Form.Item>
            <Form.Item label="Image" name="image" rules={[{ required: true, message: 'Chọn ảnh!' }]}>
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
                Apply
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
          <div>Bạn có muốn chắc xóa sản phẩm này không?</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminProduct; // style.js
