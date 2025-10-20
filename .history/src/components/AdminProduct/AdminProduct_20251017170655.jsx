import { Button, Form, Upload, Select, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { WrapperHeader, WrapperUploadFile } from './style';
import TableComponent from '../TableComponent/TableComponent';
import * as ProductService from '../../services/ProductService';
import { useMutation, useQuery } from '@tanstack/react-query';
import Loading from '../LoadingComponent/Loading';
import DrawerComponent from '../DrawerCompoenent/DrawerComponent';
import { useSelector } from 'react-redux';
import InputComponent from '../InputComponent/InputComponent';
import { getBase64 } from '../../utils';
import * as message from '../Message/Message';

const { Option } = Select;

const AdminProduct = () => {
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [rowSelected, setRowSelected] = useState('');
  const [productTypes, setProductTypes] = useState([]);
  const [stateProductDetails, setStateProductDetails] = useState({
    name: '',
    type: '',
    newType: '',
    countInStock: 0,
    price: 0,
    discount: 0,
    selled: 0,
    description: '',
    rating: 0,
    image: '',
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [form] = Form.useForm();
  const user = useSelector((state) => state?.user);

  // ---------------- React Query ----------------
  const { data: products, isLoading: isLoadingProducts, refetch: refetchProducts } = useQuery({
    queryKey: ['products'],
    queryFn: ProductService.getAllProduct,
  });

  const { data: types } = useQuery({
    queryKey: ['productTypes'],
    queryFn: ProductService.getAllTypeProduct,
    onSuccess: (res) => setProductTypes(res?.data || []),
  });

  const createMutation = useMutation({
    mutationFn: (data) => ProductService.createProduct(data),
    onSuccess: () => {
      message.success('Thêm sản phẩm thành công!');
      handleCloseDrawer();
      refetchProducts();
    },
    onError: () => message.error('Thêm sản phẩm thất bại!'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, token, ...data }) => ProductService.updateProduct(id, token, data),
    onSuccess: () => {
      message.success('Cập nhật sản phẩm thành công!');
      handleCloseDrawer();
      refetchProducts();
    },
    onError: () => message.error('Cập nhật sản phẩm thất bại!'),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id, token }) => ProductService.deleteProduct(id, token),
    onSuccess: () => {
      message.success('Xóa sản phẩm thành công!');
      refetchProducts();
    },
    onError: () => message.error('Xóa sản phẩm thất bại!'),
  });

  const deleteManyMutation = useMutation({
    mutationFn: ({ ids, token }) => ProductService.deleteManyProduct(ids, token),
    onSuccess: () => {
      message.success('Xóa sản phẩm thành công!');
      setSelectedRowKeys([]);
      refetchProducts();
    },
    onError: () => message.error('Xóa sản phẩm thất bại!'),
  });

  // ---------------- Handlers ----------------
  const handleEditProduct = async (id) => {
    if (!id) return message.error('ID sản phẩm không hợp lệ!');
    setIsOpenDrawer(true);
    try {
      const res = await ProductService.getDetailsProduct(id);
      const product = res?.data;
      if (product) {
        setStateProductDetails({
          name: product.name || '',
          type: product.type || '',
          newType: '',
          countInStock: product.countInStock || 0,
          price: product.price || 0,
          discount: product.discount || 0,
          selled: product.selled || 0,
          description: product.description || '',
          rating: product.rating || 0,
          image: product.image || '',
        });
        form.setFieldsValue(product);
        setRowSelected(id);
      } else {
        message.error('Không tìm thấy sản phẩm!');
      }
    } catch (err) {
      console.error(err);
      message.error('Không thể lấy chi tiết sản phẩm');
    }
  };

  const handleAddProduct = () => {
    setRowSelected('');
    setStateProductDetails({
      name: '',
      type: '',
      newType: '',
      countInStock: 0,
      price: 0,
      discount: 0,
      selled: 0,
      description: '',
      rating: 0,
      image: '',
    });
    form.resetFields();
    setIsOpenDrawer(true);
  };

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    form.resetFields();
    setStateProductDetails({
      name: '',
      type: '',
      newType: '',
      countInStock: 0,
      price: 0,
      discount: 0,
      selled: 0,
      description: '',
      rating: 0,
      image: '',
    });
  };

  const handleOnchangeDetails = (e) =>
    setStateProductDetails({ ...stateProductDetails, [e.target.name]: e.target.value });

  const handleOnchangeImage = async ({ fileList }) => {
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setStateProductDetails({ ...stateProductDetails, image: file.preview });
    }
  };

  const onSaveProduct = () => {
    const productData = { ...stateProductDetails };
    if (productData.newType) productData.type = productData.newType;

    if (rowSelected) {
      updateMutation.mutate({ id: rowSelected, token: user?.access_token, ...productData });
    } else {
      createMutation.mutate(productData);
    }
  };

  const handleDeleteMany = () => {
    if (selectedRowKeys.length === 0) return;
    deleteManyMutation.mutate({ ids: selectedRowKeys, token: user?.access_token });
  };

  const handleDeleteSingle = (id) => {
    deleteMutation.mutate({ id, token: user?.access_token });
  };

  const renderAction = (record) => (
    <div style={{ display: 'flex', gap: 8 }}>
      <EditOutlined style={{ color: 'orange', fontSize: 20, cursor: 'pointer' }} onClick={() => handleEditProduct(record._id)} />
      <Popconfirm
        title="Bạn có chắc chắn muốn xóa?"
        onConfirm={() => handleDeleteSingle(record._id)}
        okText="Có"
        cancelText="Không"
      >
        <DeleteOutlined style={{ color: 'red', fontSize: 20, cursor: 'pointer' }} />
      </Popconfirm>
    </div>
  );

  // ---------------- Table data ----------------
  const dataTable =
    products?.data?.length > 0
      ? products.data.map((item) => ({
        key: item._id,
        _id: item._id,
        name: item.name,
        type: item.type,
        countInStock: item.countInStock,
        price: item.price,
        discount: item.discount,
        selled: item.selled,
        description: item.description,
        rating: item.rating,
        image: item.image,
      }))
      : [];

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      render: (img) => img && <img src={img} alt="product" style={{ width: 50, height: 50, objectFit: 'cover' }} />,
    },
    { title: 'Tên sản phẩm', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    {
      title: 'Loại',
      dataIndex: 'type',
      render: (type) => type || 'Chưa có',
    },
    { title: 'Số lượng', dataIndex: 'countInStock' },
    { title: 'Giá', dataIndex: 'price' },
    { title: 'Discount (%)', dataIndex: 'discount' },
    { title: 'Đã bán', dataIndex: 'selled' },
    { title: 'Mô tả', dataIndex: 'description' },
    { title: 'Rating', dataIndex: 'rating' },
    { title: 'Hành động', key: 'action', render: (_, record) => renderAction(record) },
  ];

  // ---------------- Auto select loại mặc định ----------------
  useEffect(() => {
    if (isOpenDrawer && !rowSelected && productTypes.length > 0) {
      setStateProductDetails((prev) => ({
        ...prev,
        type: productTypes[0],
      }));
    }
  }, [isOpenDrawer, productTypes]);

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

      <DrawerComponent title={rowSelected ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'} isOpen={isOpenDrawer} onClose={handleCloseDrawer} width="50%">
        <Loading isLoading={updateMutation.isLoading || createMutation.isLoading}>
          <Form name="product" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onFinish={onSaveProduct} form={form} autoComplete="off">
            <Form.Item label="Tên" name="name">
              <InputComponent value={stateProductDetails.name} onChange={handleOnchangeDetails} name="name" />
            </Form.Item>

            <Form.Item label="Loại" name="type">
              <Select
                value={stateProductDetails.type}
                onChange={(val) => setStateProductDetails({ ...stateProductDetails, type: val })}
                placeholder="Chọn loại"
              >
                {productTypes.length > 0 ? (
                  productTypes.map((type) => <Option key={type} value={type}>{type}</Option>)
                ) : (
                  <Option disabled>Không có loại nào</Option>
                )}
              </Select>
            </Form.Item>

            <Form.Item label="Thêm loại mới" name="newType">
              <InputComponent value={stateProductDetails.newType} onChange={handleOnchangeDetails} name="newType" placeholder="Nhập loại mới nếu muốn" />
            </Form.Item>

            <Form.Item label="Số lượng" name="countInStock">
              <InputComponent type="number" value={stateProductDetails.countInStock} onChange={handleOnchangeDetails} name="countInStock" />
            </Form.Item>

            <Form.Item label="Giá" name="price">
              <InputComponent type="number" value={stateProductDetails.price} onChange={handleOnchangeDetails} name="price" />
            </Form.Item>

            <Form.Item label="Discount (%)" name="discount">
              <InputComponent type="number" value={stateProductDetails.discount} onChange={handleOnchangeDetails} name="discount" />
            </Form.Item>

            <Form.Item label="Đã bán" name="selled">
              <InputComponent type="number" value={stateProductDetails.selled} onChange={handleOnchangeDetails} name="selled" />
            </Form.Item>

            <Form.Item label="Mô tả" name="description">
              <InputComponent value={stateProductDetails.description} onChange={handleOnchangeDetails} name="description" />
            </Form.Item>

            <Form.Item label="Rating" name="rating">
              <InputComponent type="number" value={stateProductDetails.rating} onChange={handleOnchangeDetails} name="rating" />
            </Form.Item>

            <Form.Item label="Hình ảnh" name="image">
              <WrapperUploadFile onChange={handleOnchangeImage} maxCount={1} showUploadList={false} beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>Chọn file</Button>
                {stateProductDetails.image && (
                  <img src={stateProductDetails.image} alt="product" style={{ height: 60, width: 60, objectFit: 'cover', marginLeft: 10 }} />
                )}
              </WrapperUploadFile>
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
