import { Divider, Radio, Table, Button } from 'antd';
import React, { useState } from 'react';
import Loading from './../LoadingComponent/Loading';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


const TableComponent = (props) => {
  const { selectionType = 'checkbox', data = [], columns = [], isLoading = false, handleDeleteManyProducts } = props;
  const [rowSelectedKeys, setRowSelectedKeys] = useState([]);

  const handleDeleteAll = () => {
    if (typeof handleDeleteManyProducts === 'function') {
      handleDeleteManyProducts(rowSelectedKeys);
    }
  };

  const rowSelection = {
    type: selectionType,
    selectedRowKeys: rowSelectedKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelectedKeys(selectedRowKeys);
      console.log(`selectedRowKeys: ${selectedRowKeys}`);
    },
    // getCheckboxProps: (record) => ({
    //   disabled: record.name === 'Disabled User',
    //   name: record.name,
    // }),
  };

  return (
    <Loading isLoading={isLoading}>
      {rowSelectedKeys.length > 0 && (
        <div
          style={{
            background: '#1d1ddd',
            color: '#fff',
            fontWeight: 'bold',
            padding: '10px',
            cursor: 'pointer',
            marginBottom: 8
          }}
          onClick={handleDeleteAll}
        >
          Xóa tất cả
        </div>
      )}
      <Button
        type="primary"
        style={{ marginBottom: 8, marginLeft: 8 }}
        onClick={() => {
          let exportData;
          if (data.length && data[0].hasOwnProperty('email')) {
            // Export user
            exportData = data.map(row => {
              let adminValue = 'User';
              if (typeof row.admin === 'boolean') {
                adminValue = row.admin ? 'Admin' : 'User';
              } else if (typeof row.isAdmin === 'boolean') {
                adminValue = row.isAdmin ? 'Admin' : 'User';
              } else if (row.admin !== undefined && row.admin !== null && row.admin !== '') {
                adminValue = String(row.admin);
              } else if (row.isAdmin !== undefined && row.isAdmin !== null && row.isAdmin !== '') {
                adminValue = String(row.isAdmin);
              }
              return {
                name: row.name,
                email: row.email,
                address: row.address,
                phone: row.phone,
                admin: adminValue
              };
            });
          } else {
            // Export product
            exportData = data.map(row => {
              return {
                name: row.name,
                type: row.type,
                countInStock: row.countInStock,
                price: row.price,
                description: row.description,
                rating: row.rating
              };
            });
          }
          const ws = XLSX.utils.json_to_sheet(exportData);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          // Tạo file excel
          const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
          let fileName = window.prompt('Nhập tên file muốn lưu:', 'table.xlsx');
          if (!fileName) fileName = 'table.xlsx';
          if (!fileName.endsWith('.xlsx')) fileName += '.xlsx';
          saveAs(blob, fileName);
        }}
      >
        Export Excel
      </Button>
      <Table
        id="table-xls"
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        {...props}
      />
    </Loading>
  );
};

export default TableComponent;
